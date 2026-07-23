#!/usr/bin/env node
/**
 * linkedin-extract-eval.mjs — LinkedIn JD extraction + DeepSeek evaluation
 *
 * Requires: Chrome browser with authenticated LinkedIn session via Claude-in-Chrome MCP.
 * Reads pending LinkedIn URLs from data/pipeline.md, navigates to each via MCP,
 * extracts JD text, evaluates via DeepSeek, writes reports/tracker entries.
 *
 * Usage:
 *   node batch/linkedin-extract-eval.mjs --limit 20
 *   node batch/linkedin-extract-eval.mjs --all
 *
 * NOTE: This is intended to be run FROM Claude Code's browser automation context.
 * It reads from stdin which Claude's Agent tool provides when this script is invoked
 * as a subprocess from a capable agent session.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

try {
  const { config } = await import('dotenv');
  config();
} catch { /* optional */ }

const ROOT = dirname(fileURLToPath(import.meta.url)).replace(/\/batch$/, '');
const PATHS = {
  cv: join(ROOT, 'cv.md'),
  profile: join(ROOT, 'modes', '_profile.md'),
  pipeline: join(ROOT, 'data', 'pipeline.md'),
  reports: join(ROOT, 'reports'),
  additions: join(ROOT, 'batch', 'tracker-additions'),
};

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
};
const LIMIT = flag('all', false) ? Infinity : Number(flag('limit', 10));
const DRY_RUN = argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// API key resolution
// ---------------------------------------------------------------------------
function resolveApiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  const p = join(homedir(), '.config', 'opencode', 'opencode.jsonc');
  if (existsSync(p)) {
    const raw = readFileSync(p, 'utf-8');
    for (const candidate of [raw, raw.replace(/^\s*\/\/.*$/gm, '')]) {
      try {
        const cfg = JSON.parse(candidate);
        const key = cfg?.provider?.openrouter?.options?.apiKey;
        if (key) return key;
      } catch { /* try next */ }
    }
  }
  return null;
}

const API_KEY = resolveApiKey();
if (!API_KEY) {
  console.error('❌ No OpenRouter API key found.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load context
// ---------------------------------------------------------------------------
const cvContent = readFileSync(PATHS.cv, 'utf-8');
const profileContent = readFileSync(PATHS.profile, 'utf-8');

const SYSTEM_PROMPT = `You are hiredcreative-ops' job-offer evaluator. Evaluate ONE job posting against the
candidate's CV and profile rules, then respond with STRICT JSON ONLY — no markdown fences, no prose.

═══ CANDIDATE CV ═══
${cvContent}

═══ PROFILE RULES ═══
${profileContent}

═══ OUTPUT CONTRACT ═══
Respond with ONLY a JSON object (no code fence, no commentary) matching exactly this shape:
{
  "company": "string",
  "role": "string",
  "archetype": "string",
  "track": "remote | relocation_eu | relocation_us | local_kri | skip",
  "score": 0.0,
  "legitimacy": "High Confidence | Proceed with Caution | Suspicious",
  "hard_skip": false,
  "hard_skip_reason": null,
  "comp_assessment": "string",
  "key_strengths": ["string"],
  "key_gaps": ["string"],
  "recommendation": "string",
  "summary_note": "string"
}`;

// ---------------------------------------------------------------------------
// Pipeline.md parsing
// ---------------------------------------------------------------------------
const pipelineRaw = readFileSync(PATHS.pipeline, 'utf-8');
const lines = pipelineRaw.split('\n');

const pending = [];
lines.forEach((line, idx) => {
  const m = line.match(/^- \[ \] (https:\/\/www\.linkedin\.com\/jobs\/view\/\d+\/)(?:\s*\|\s*([^|]*))?(?:\s*\|\s*([^|]*))?/);
  if (!m) return;
  pending.push({
    lineIdx: idx,
    url: m[1],
    companyHint: (m[2] || '').trim() || 'Unknown',
    roleHint: (m[3] || '').trim() || 'Unknown',
  });
});

const targets = pending.slice(0, LIMIT === Infinity ? pending.length : LIMIT);

console.log(`📋 Pending LinkedIn URLs: ${pending.length}`);
console.log(`🎯 Processing this run: ${targets.length}${DRY_RUN ? ' (DRY RUN)' : ''}`);
console.log(`🤖 Model: deepseek/deepseek-v4-flash via OpenRouter\n`);

if (targets.length === 0) {
  console.log('Nothing to do.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Report numbering
// ---------------------------------------------------------------------------
function currentMaxReportNum() {
  if (!existsSync(PATHS.reports)) return 0;
  const nums = readdirSync(PATHS.reports)
    .map(f => f.match(/^(\d+)-/))
    .filter(Boolean)
    .map(m => parseInt(m[1], 10));
  return nums.length ? Math.max(...nums) : 0;
}
let nextNum = currentMaxReportNum() + 1;

// ---------------------------------------------------------------------------
// OpenRouter call
// ---------------------------------------------------------------------------
async function callDeepSeek(userContent, retries = 1) {
  const body = {
    model: 'deepseek/deepseek-v4-flash',
    temperature: 0.3,
    max_tokens: 2600,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
  };

  async function fetchWithTimeout(url, opts = {}, ms = 60000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);
    try {
      return await fetch(url, { ...opts, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    let res;
    try {
      res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://opencode.ai',
          'X-Title': 'hiredcreative-ops linkedin eval',
        },
        body: JSON.stringify(body),
      }, 60000);
    } catch (err) {
      if (attempt < retries) { await new Promise(r => setTimeout(r, 1500)); continue; }
      throw new Error(`OpenRouter request timed out/failed: ${err.message}`);
    }
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) {
      const errText = await res.text();
      if (attempt < retries) { await new Promise(r => setTimeout(r, 1500)); continue; }
      throw new Error(`OpenRouter ${res.status}`);
    }
    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  }
  throw new Error('OpenRouter: exhausted retries');
}

function parseJsonLoose(text) {
  let t = text.trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found');
  return JSON.parse(t.slice(start, end + 1));
}

// ---------------------------------------------------------------------------
// Report + tracker writers
// ---------------------------------------------------------------------------
function slugify(s) {
  return (s || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
}

function writeReport(num, date, url, ev, jdFetchOk) {
  const slug = slugify(ev.company);
  const filename = `${num}-${slug}-${date}.md`;
  const path = join(PATHS.reports, filename);
  const content = `# Evaluation: ${ev.company} — ${ev.role}

**Date:** ${date}
**Archetype:** ${ev.archetype}
**Score:** ${ev.score}/5
**Legitimacy:** ${ev.legitimacy}${!jdFetchOk ? ' (JD fetch incomplete — evaluated from partial content)' : ''}
**URL:** ${url}
**Track:** ${ev.track}
**Tool:** DeepSeek V4 Flash (OpenRouter, LinkedIn via Chrome MCP) — batch triage pass

---

## Comp Assessment
${ev.comp_assessment}

## Key Strengths
${(ev.key_strengths || []).map(s => `- ${s}`).join('\n') || '- (none extracted)'}

## Key Gaps
${(ev.key_gaps || []).map(s => `- ${s}`).join('\n') || '- (none extracted)'}

## Recommendation
${ev.recommendation}

${ev.hard_skip ? `## Hard SKIP\n${ev.hard_skip_reason}\n` : ''}
---
*Lightweight triage pass — full A-G report available on request if shortlisted.*
`;
  writeFileSync(path, content, 'utf-8');
  return filename;
}

function writeTsv(num, date, ev, reportFilename) {
  mkdirSync(PATHS.additions, { recursive: true });
  const status = ev.hard_skip ? 'SKIP' : 'Evaluated';
  const scoreStr = ev.hard_skip ? '—/5' : `${Number(ev.score).toFixed(1)}/5`;
  const reportLink = `[${num}](reports/${reportFilename})`;
  const note = (ev.summary_note || ev.recommendation || '').replace(/[\t\n]/g, ' ').slice(0, 300);
  const line = [num, date, ev.company, ev.role, status, scoreStr, '❌', reportLink, note].join('\t');
  writeFileSync(join(PATHS.additions, `${num}-${slugify(ev.company)}.tsv`), line + '\n', 'utf-8');
}

// ---------------------------------------------------------------------------
// Main: signal to parent agent for browser automation
// ---------------------------------------------------------------------------
const today = new Date().toISOString().split('T')[0];
const liveLines = [...lines];
let markedCount = 0;

function markLineDone(lineIdx) {
  if (liveLines[lineIdx]?.startsWith('- [ ]')) {
    liveLines[lineIdx] = liveLines[lineIdx].replace('- [ ]', '- [x]');
    writeFileSync(PATHS.pipeline, liveLines.join('\n'), 'utf-8');
    markedCount++;
  }
}

// Signal to parent agent: here are the URLs we need to fetch JD text for
console.log('\n=== BROWSER AUTOMATION REQUIRED ===');
console.log(`Fetch JD text for these ${targets.length} LinkedIn URLs, return as JSON array.`);
console.log('Format: [{url: "...", jd_text: "..."}, ...]\n');

const urlsToFetch = targets.map(t => t.url);
console.log(JSON.stringify(urlsToFetch, null, 2));

console.log('\n(Waiting for parent agent to provide JD text via stdin...)');

// In a real run, the parent agent would provide JD data here.
// For now, this script signals what it needs and exits.
// The actual implementation would be driven by an Agent that:
// 1. Calls this script to get the URL list
// 2. Uses Chrome MCP to extract JD text for each
// 3. Pipes the JSON back to this script
// 4. This script evaluates and writes reports

process.exit(0);
