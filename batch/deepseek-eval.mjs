#!/usr/bin/env node
/**
 * deepseek-eval.mjs — DeepSeek V4 Flash (via OpenRouter) batch evaluator
 *
 * Cost-avoidance alternative to Claude-agent batch evaluation. Processes
 * pending (unchecked) URLs in data/pipeline.md through DeepSeek instead of
 * Claude, so the 500+ item backlog doesn't burn Claude usage. Uses the same
 * report / tracker-additions conventions as the Claude pipeline so
 * merge-tracker.mjs works unchanged.
 *
 * Skips linkedin.com URLs — they require an authenticated session to fetch
 * JD text and are not safe to hit at scale with a plain script. Those stay
 * pending for interactive Playwright-based evaluation.
 *
 * Usage:
 *   node batch/deepseek-eval.mjs --limit 20        # test batch
 *   node batch/deepseek-eval.mjs --all              # full pending backlog
 *   node batch/deepseek-eval.mjs --all --concurrency 8
 *
 * Requires: OpenRouter API key, read from (in order):
 *   1. OPENROUTER_API_KEY env var / .env
 *   2. ~/.config/opencode/opencode.jsonc → provider.openrouter.options.apiKey
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import * as cheerio from 'cheerio';

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
const CONCURRENCY = Number(flag('concurrency', 6));
const DRY_RUN = argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// API key resolution
// ---------------------------------------------------------------------------
function resolveApiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  const p = join(homedir(), '.config', 'opencode', 'opencode.jsonc');
  if (existsSync(p)) {
    const raw = readFileSync(p, 'utf-8');
    // Try plain JSON first (most opencode.jsonc files have no real comments,
    // and URLs containing "//" break a naive comment-stripping regex).
    for (const candidate of [raw, raw.replace(/^\s*\/\/.*$/gm, '')]) {
      try {
        const cfg = JSON.parse(candidate);
        const key = cfg?.provider?.openrouter?.options?.apiKey;
        if (key) return key;
      } catch { /* try next candidate */ }
    }
    console.error('⚠️  Could not parse opencode.jsonc as JSON.');
  }
  return null;
}

const API_KEY = resolveApiKey();
if (!API_KEY) {
  console.error('❌ No OpenRouter API key found (OPENROUTER_API_KEY env, or ~/.config/opencode/opencode.jsonc).');
  process.exit(1);
}

const MODEL = 'deepseek/deepseek-v4-flash';

// ---------------------------------------------------------------------------
// Load context
// ---------------------------------------------------------------------------
const cvContent = readFileSync(PATHS.cv, 'utf-8');
const profileContent = readFileSync(PATHS.profile, 'utf-8');

const SYSTEM_PROMPT = `You are hiredcreative-ops' job-offer evaluator. Evaluate ONE job posting against the
candidate's CV and profile rules below, then respond with STRICT JSON ONLY — no markdown fences, no
prose outside the JSON object.

═══ CANDIDATE CV ═══
${cvContent}

═══ PROFILE RULES (archetypes, track assignment, scoring, hard-skip list, comp floors) ═══
${profileContent}

═══ OUTPUT CONTRACT ═══
Respond with ONLY a JSON object (no code fence, no commentary) matching exactly this shape:
{
  "company": "string — real company name, or best guess from JD/domain",
  "role": "string — job title",
  "archetype": "string — one of the archetypes from the profile rules, or closest hybrid",
  "track": "remote | relocation_eu | relocation_us | local_kri | skip",
  "score": 0.0,
  "legitimacy": "High Confidence | Proceed with Caution | Suspicious",
  "hard_skip": false,
  "hard_skip_reason": null,
  "comp_assessment": "string — 1-3 sentences, cite floor/target/stretch from profile rules if relevant",
  "key_strengths": ["string", "..."],
  "key_gaps": ["string", "..."],
  "recommendation": "string — 2-4 sentence verdict, direct and actionable",
  "summary_note": "string — one line for the tracker (under 200 chars)"
}

Rules:
- Score is 0-5, one decimal. NEVER let title alone (IC vs leadership) move the score — see the
  IC-Level Roles anti-bias rule in the profile.
- There is no score-based suppression — you evaluate and score everything the same way; hard_skip is
  reserved ONLY for the Hard SKIP list in the profile (nationality block, missing required fluency,
  comp far below floor, wrong function entirely). A low-scoring role is still fully evaluated.
- If the fetched page text looks like a login wall / bot-block / mostly nav-and-footer with no real JD
  content, set legitimacy to "Suspicious" and note it in recommendation, but still attempt your best
  read of company/role from the URL or fragment available.
- Output valid JSON. Do not wrap in triple backticks.`;

// ---------------------------------------------------------------------------
// Pipeline.md parsing
// ---------------------------------------------------------------------------
const pipelineRaw = readFileSync(PATHS.pipeline, 'utf-8');
const lines = pipelineRaw.split('\n');

const pending = [];
lines.forEach((line, idx) => {
  const m = line.match(/^- \[ \] (\S+)(?:\s*\|\s*([^|]*))?(?:\s*\|\s*([^|]*))?/);
  if (!m) return;
  const url = m[1];
  if (/linkedin\.com/i.test(url)) return; // skip auth-gated
  pending.push({
    lineIdx: idx,
    url,
    companyHint: (m[2] || '').trim() || 'Unknown',
    roleHint: (m[3] || '').trim() || 'Unknown',
  });
});

const targets = pending.slice(0, LIMIT === Infinity ? pending.length : LIMIT);

console.log(`📋 Pending non-LinkedIn URLs: ${pending.length}`);
console.log(`🎯 Processing this run: ${targets.length}${DRY_RUN ? ' (DRY RUN)' : ''}`);
console.log(`🤖 Model: ${MODEL} via OpenRouter\n`);

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
// JD fetch (plain HTTP — no auth, no Playwright; batch-mode fallback per policy)
// ---------------------------------------------------------------------------
async function fetchWithTimeout(url, opts = {}, ms = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36';

function htmlToText(html, limit = 7000) {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg').remove();
  return $('body').text().replace(/\s+/g, ' ').trim().slice(0, limit);
}

// Ashby board-listing responses are cached per-org within a single run since
// many pending URLs share the same company.
const ashbyBoardCache = new Map();

async function fetchJdText(url) {
  try {
    const gh = url.match(/(?:job-boards(?:\.eu)?|boards)\.greenhouse\.io\/([^/?#]+)\/jobs\/(\d+)/);
    if (gh) {
      const [, board, jobId] = gh;
      const res = await fetchWithTimeout(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${jobId}?content=true`);
      if (res.ok) {
        const j = await res.json();
        const text = htmlToText(j.content || '', 7000);
        return { ok: !!text, status: res.status, text: `${j.title || ''} — ${j.location?.name || ''}\n${text}` };
      }
      return { ok: false, status: res.status, text: '' };
    }

    const lever = url.match(/jobs\.lever\.co\/([^/?#]+)\/([^/?#]+)/);
    if (lever) {
      const [, org, postingId] = lever;
      const res = await fetchWithTimeout(`https://api.lever.co/v0/postings/${org}/${postingId}?mode=json`);
      if (res.ok) {
        const j = await res.json();
        const text = (j.descriptionPlain || '') + '\n' + (j.additionalPlain || '') + '\n' + (j.openingPlain || '');
        return { ok: !!text.trim(), status: res.status, text: `${j.text || ''}\n${text}`.trim().slice(0, 7000) };
      }
      return { ok: false, status: res.status, text: '' };
    }

    const ashby = url.match(/jobs\.ashbyhq\.com\/([^/?#]+)\/([a-f0-9-]+)/i);
    if (ashby) {
      const [, org, jobId] = ashby;
      let board = ashbyBoardCache.get(org);
      if (!board) {
        const res = await fetchWithTimeout(`https://api.ashbyhq.com/posting-api/job-board/${org}?includeCompensation=true`);
        board = res.ok ? await res.json() : { jobs: [] };
        ashbyBoardCache.set(org, board);
      }
      const job = (board.jobs || []).find(j => j.id === jobId || j.jobUrl?.includes(jobId));
      if (job) {
        const text = job.descriptionPlain || htmlToText(job.descriptionHtml || '', 7000);
        return { ok: !!text, status: 200, text: `${job.title} — ${job.location} (${job.workplaceType})\n${text}`.slice(0, 7000) };
      }
      return { ok: false, status: 404, text: '' };
    }

    // Generic fallback: plain fetch + strip HTML.
    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
      redirect: 'follow',
    });
    if (!res.ok) return { ok: false, status: res.status, text: '' };
    const html = await res.text();
    const text = htmlToText(html, 7000);
    return { ok: !!text, status: res.status, text };
  } catch (err) {
    return { ok: false, status: 0, text: '', error: err.message };
  }
}

// ---------------------------------------------------------------------------
// OpenRouter call
// ---------------------------------------------------------------------------
async function callDeepSeek(userContent, retries = 1) {
  const body = {
    model: MODEL,
    temperature: 0.3,
    max_tokens: 2600,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
  };
  for (let attempt = 0; attempt <= retries; attempt++) {
    let res;
    try {
      res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://opencode.ai',
          'X-Title': 'hiredcreative-ops batch eval',
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
      throw new Error(`OpenRouter ${res.status}: ${errText.slice(0, 300)}`);
    }
    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  }
  throw new Error('OpenRouter: exhausted retries (rate limited)');
}

function parseJsonLoose(text) {
  let t = text.trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in response');
  return JSON.parse(t.slice(start, end + 1));
}

// ---------------------------------------------------------------------------
// Report + tracker writers
// ---------------------------------------------------------------------------
function slugify(s) {
  return (s || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
}

function writeReport(num, date, url, ev, fetchMeta) {
  const slug = slugify(ev.company);
  const filename = `${num}-${slug}-${date}.md`;
  const path = join(PATHS.reports, filename);
  const content = `# Evaluation: ${ev.company} — ${ev.role}

**Date:** ${date}
**Archetype:** ${ev.archetype}
**Score:** ${ev.score}/5
**Legitimacy:** ${ev.legitimacy}${fetchMeta.ok ? '' : ' (JD fetch failed — evaluated from URL/hint only, unconfirmed)'}
**URL:** ${url}
**Track:** ${ev.track}
**Tool:** DeepSeek V4 Flash (OpenRouter) — batch triage pass, unconfirmed posting freshness

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
*Lightweight triage pass — full A-G report available on request if this role is shortlisted.*
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
// Concurrency pool
// ---------------------------------------------------------------------------
async function pool(items, worker, concurrency) {
  const results = new Array(items.length);
  let idx = 0;
  async function runner() {
    while (idx < items.length) {
      const i = idx++;
      try {
        results[i] = await worker(items[i], i);
      } catch (err) {
        results[i] = { error: err.message, item: items[i] };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runner));
  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const today = new Date().toISOString().split('T')[0];
let done = 0;
let markedCount = 0;

// Mutable in-memory copy of pipeline.md lines. Marked and flushed to disk
// synchronously (no `await` between mutation and write) right after each
// item succeeds, so a kill/crash mid-run never loses already-completed work.
const liveLines = [...lines];
function markLineDone(lineIdx) {
  if (liveLines[lineIdx]?.startsWith('- [ ]')) {
    liveLines[lineIdx] = liveLines[lineIdx].replace('- [ ]', '- [x]');
    writeFileSync(PATHS.pipeline, liveLines.join('\n'), 'utf-8');
    markedCount++;
  }
}

const results = await pool(targets, async (item) => {
  const fetchMeta = await fetchJdText(item.url);
  const userContent = `URL: ${item.url}
Company hint (from pipeline queue, may be "Unknown"): ${item.companyHint}
Role hint (from pipeline queue): ${item.roleHint}

Fetched page text (may include nav/footer noise, may be truncated, may be empty if fetch failed):
${fetchMeta.ok ? fetchMeta.text : `[FETCH FAILED — status ${fetchMeta.status}${fetchMeta.error ? `, ${fetchMeta.error}` : ''}]`}`;

  let ev;
  try {
    const raw = await callDeepSeek(userContent);
    ev = parseJsonLoose(raw);
  } catch (firstErr) {
    // One repair retry: model may have added prose or truncated JSON.
    const raw2 = await callDeepSeek(userContent + '\n\nREMINDER: respond with ONLY the JSON object, no prose, no code fence, no truncation.');
    ev = parseJsonLoose(raw2);
  }

  const num = nextNum++;
  if (!DRY_RUN) {
    const reportFilename = writeReport(num, today, item.url, ev, fetchMeta);
    writeTsv(num, today, ev, reportFilename);
    markLineDone(item.lineIdx);
  }
  done++;
  process.stdout.write(`\r✅ ${done}/${targets.length}  [#${num}] ${ev.company} — ${ev.role} (${ev.score}/5, ${ev.track})          `);
  return { num, company: ev.company, role: ev.role, score: ev.score, track: ev.track };
}, CONCURRENCY);

console.log('\n');

const failed = results.filter(r => r?.error);
const succeeded = results.filter(r => !r?.error);

console.log(`\n📊 Summary: ${succeeded.length}/${targets.length} succeeded, ${failed.length} failed`);
if (failed.length) {
  console.log('\n❌ Failures:');
  failed.forEach(f => console.log(`   ${f.item?.url} — ${f.error}`));
}

if (!DRY_RUN) {
  console.log(`\n✏️  Marked ${markedCount} pipeline.md lines as [x] (written incrementally, crash-safe)`);
  console.log(`\n👉 Next: run \`node merge-tracker.mjs\` to consolidate tracker entries.`);
}
