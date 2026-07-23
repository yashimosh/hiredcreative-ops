#!/usr/bin/env node

/**
 * scan.mjs — Zero-token portal scanner
 *
 * Fetches Greenhouse, Ashby, and Lever APIs directly, applies title
 * filters from portals.yml, deduplicates against existing history,
 * and appends new offers to pipeline.md + scan-history.tsv.
 *
 * Zero Claude API tokens — pure HTTP + JSON.
 *
 * Usage:
 *   node scan.mjs                  # scan all enabled companies
 *   node scan.mjs --dry-run        # preview without writing files
 *   node scan.mjs --company Cohere # scan a single company
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import yaml from 'js-yaml';
const parseYaml = yaml.load;

// ── Config ──────────────────────────────────────────────────────────

const PORTALS_PATH = 'portals.yml';
const SCAN_HISTORY_PATH = 'data/scan-history.tsv';
const PIPELINE_PATH = 'data/pipeline.md';
const APPLICATIONS_PATH = 'data/applications.md';

// Ensure required directories exist (fresh setup)
mkdirSync('data', { recursive: true });

const CONCURRENCY = 10;
const FETCH_TIMEOUT_MS = 10_000;

// ── API detection ───────────────────────────────────────────────────

function detectApi(company) {
  // Greenhouse: explicit api field
  if (company.api && company.api.includes('greenhouse')) {
    return { type: 'greenhouse', url: company.api };
  }

  const url = company.careers_url || '';

  // Ashby
  const ashbyMatch = url.match(/jobs\.ashbyhq\.com\/([^/?#]+)/);
  if (ashbyMatch) {
    return {
      type: 'ashby',
      url: `https://api.ashbyhq.com/posting-api/job-board/${ashbyMatch[1]}?includeCompensation=true`,
    };
  }

  // Lever
  const leverMatch = url.match(/jobs\.lever\.co\/([^/?#]+)/);
  if (leverMatch) {
    return {
      type: 'lever',
      url: `https://api.lever.co/v0/postings/${leverMatch[1]}`,
    };
  }

  // Greenhouse EU boards
  const ghEuMatch = url.match(/job-boards(?:\.eu)?\.greenhouse\.io\/([^/?#]+)/);
  if (ghEuMatch && !company.api) {
    return {
      type: 'greenhouse',
      url: `https://boards-api.greenhouse.io/v1/boards/${ghEuMatch[1]}/jobs`,
    };
  }

  // Workable — extract slug from careers_url or ats_slug/slug field
  const workableMatch = url.match(/apply\.workable\.com\/([^/?#]+)/);
  if (workableMatch) {
    return { type: 'workable', url: `https://apply.workable.com/api/v1/widget/accounts/${workableMatch[1]}` };
  }
  if (company.ats === 'workable') {
    const wSlug = company.ats_slug || company.slug;
    if (wSlug) return { type: 'workable', url: `https://apply.workable.com/api/v1/widget/accounts/${wSlug}` };
  }

  // TeamTailor — extract slug from *.teamtailor.com subdomain, or ats_slug/slug field
  const ttMatch = url.match(/([^./]+)\.teamtailor\.com/);
  if (ttMatch) {
    return { type: 'teamtailor', format: 'text', url: `https://${ttMatch[1]}.teamtailor.com/jobs.rss` };
  }
  if (company.ats === 'teamtailor') {
    const ttSlug = company.ats_slug || company.slug;
    if (ttSlug) return { type: 'teamtailor', format: 'text', url: `https://${ttSlug}.teamtailor.com/jobs.rss` };
  }

  // Personio — extract slug from *.jobs.personio.de or *.personio.de, or ats_slug/slug field
  const personioMatch = url.match(/([^./]+)\.(?:jobs\.)?personio\.(?:de|com)/);
  if (personioMatch) {
    const pSlug = personioMatch[1];
    return { type: 'personio', format: 'text', slug: pSlug, url: `https://${pSlug}.jobs.personio.de/xml?language=en` };
  }
  if (company.ats === 'personio') {
    const pSlug = company.ats_slug || company.slug;
    if (pSlug) return { type: 'personio', format: 'text', slug: pSlug, url: `https://${pSlug}.jobs.personio.de/xml?language=en` };
  }

  // Recruitee — extract slug from *.recruitee.com or ats_slug/slug field
  const recruiteeMatch = url.match(/([^./]+)\.recruitee\.com/);
  if (recruiteeMatch) {
    return { type: 'recruitee', url: `https://${recruiteeMatch[1]}.recruitee.com/api/offers/` };
  }
  if (company.ats === 'recruitee') {
    const rSlug = company.ats_slug || company.slug;
    if (rSlug) return { type: 'recruitee', url: `https://${rSlug}.recruitee.com/api/offers/` };
  }

  return null;
}

// ── API parsers ─────────────────────────────────────────────────────

function parseGreenhouse(json, companyName) {
  const jobs = json.jobs || [];
  return jobs.map(j => ({
    title: j.title || '',
    url: j.absolute_url || '',
    company: companyName,
    location: j.location?.name || '',
  }));
}

function parseAshby(json, companyName) {
  const jobs = json.jobs || [];
  return jobs.map(j => ({
    title: j.title || '',
    url: j.jobUrl || '',
    company: companyName,
    location: j.location || '',
  }));
}

function parseLever(json, companyName) {
  if (!Array.isArray(json)) return [];
  return json.map(j => ({
    title: j.text || '',
    url: j.hostedUrl || '',
    company: companyName,
    location: j.categories?.location || '',
  }));
}

function parseWorkable(json, companyName) {
  const jobs = json.jobs || json.results || [];
  return jobs.map(j => ({
    title: j.title || '',
    url: j.url || j.shortlink || '',
    company: companyName,
    location: [j.location?.city, j.location?.country_code].filter(Boolean).join(', '),
  }));
}

function parseTeamtailor(xml, companyName) {
  const jobs = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const titleM = block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
    const linkM = block.match(/<link>(.*?)<\/link>/);
    if (titleM && linkM) {
      jobs.push({
        title: titleM[1].trim(),
        url: linkM[1].trim(),
        company: companyName,
        location: '',
      });
    }
  }
  return jobs;
}

function parsePersonio(xml, companyName, personioSlug) {
  const jobs = [];
  const posRe = /<position>([\s\S]*?)<\/position>/g;
  let m;
  while ((m = posRe.exec(xml)) !== null) {
    const block = m[1];
    const nameM = block.match(/<name>(.*?)<\/name>/);
    const idM = block.match(/<id>(\d+)<\/id>/);
    const applyM = block.match(/<applyURL>(.*?)<\/applyURL>/);
    if (nameM && idM) {
      const url = applyM
        ? applyM[1].trim()
        : `https://${personioSlug}.jobs.personio.de/job/${idM[1]}`;
      jobs.push({
        title: nameM[1].trim(),
        url,
        company: companyName,
        location: block.match(/<office>(.*?)<\/office>/)?.[1]?.trim() || '',
      });
    }
  }
  return jobs;
}

function parseRecruitee(json, companyName) {
  const offers = json.offers || [];
  return offers.map(o => ({
    title: o.title || '',
    url: o.careers_url || o.url || '',
    company: companyName,
    location: o.city || o.country || '',
  }));
}

const PARSERS = {
  greenhouse: parseGreenhouse,
  ashby: parseAshby,
  lever: parseLever,
  workable: parseWorkable,
  teamtailor: parseTeamtailor,
  personio: parsePersonio,
  recruitee: parseRecruitee,
};

// ── Hired Creative source ───────────────────────────────────────────
// Queries hiredcreative.com — our own remote creative jobs aggregator.
// 22+ ATS + board sources, ~700 remote creative jobs, refreshed every 6h.
// Applies the same title_filter + dedup as the ATS scan.
// API returns max 100 per page → we paginate up to 10 pages (1000 jobs).

async function fetchHiredCreative(hcUrl, titleFilter, seenUrls, seenCompanyRoles) {
  const offers = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 10) {
    let data;
    try {
      data = await fetchJson(`${hcUrl}?sort=newest&limit=100&page=${page}`);
    } catch (err) {
      if (page === 1) throw err; // surface first-page errors
      break; // subsequent page failures just stop pagination
    }

    const jobs = data.jobs || [];
    totalPages = data.pages || 1;
    if (jobs.length === 0) break;

    for (const job of jobs) {
      if (!job.url || !job.title || !job.company) continue;
      if (!titleFilter(job.title)) continue;
      if (seenUrls.has(job.url)) continue;
      const key = `${job.company.toLowerCase()}::${job.title.toLowerCase()}`;
      if (seenCompanyRoles.has(key)) continue;
      seenUrls.add(job.url);
      seenCompanyRoles.add(key);
      offers.push({
        title: job.title,
        url: job.url,
        company: job.company,
        location: job.location_raw || job.region || 'Remote',
        source: 'hiredcreative',
      });
    }
    page++;
  }

  return offers;
}

// ── Fetch with timeout ──────────────────────────────────────────────

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// ── Title filter ────────────────────────────────────────────────────

function buildTitleFilter(titleFilter) {
  const positive = (titleFilter?.positive || []).map(k => k.toLowerCase());
  const negative = (titleFilter?.negative || []).map(k => k.toLowerCase());

  return (title) => {
    const lower = title.toLowerCase();
    const hasPositive = positive.length === 0 || positive.some(k => lower.includes(k));
    const hasNegative = negative.some(k => lower.includes(k));
    return hasPositive && !hasNegative;
  };
}

// ── Dedup ───────────────────────────────────────────────────────────

function loadSeenUrls() {
  const seen = new Set();

  // scan-history.tsv
  if (existsSync(SCAN_HISTORY_PATH)) {
    const lines = readFileSync(SCAN_HISTORY_PATH, 'utf-8').split('\n');
    for (const line of lines.slice(1)) { // skip header
      const url = line.split('\t')[0];
      if (url) seen.add(url);
    }
  }

  // pipeline.md — extract URLs from checkbox lines
  if (existsSync(PIPELINE_PATH)) {
    const text = readFileSync(PIPELINE_PATH, 'utf-8');
    for (const match of text.matchAll(/- \[[ x]\] (https?:\/\/\S+)/g)) {
      seen.add(match[1]);
    }
  }

  // applications.md — extract URLs from report links and any inline URLs
  if (existsSync(APPLICATIONS_PATH)) {
    const text = readFileSync(APPLICATIONS_PATH, 'utf-8');
    for (const match of text.matchAll(/https?:\/\/[^\s|)]+/g)) {
      seen.add(match[0]);
    }
  }

  return seen;
}

function loadSeenCompanyRoles() {
  const seen = new Set();
  if (existsSync(APPLICATIONS_PATH)) {
    const text = readFileSync(APPLICATIONS_PATH, 'utf-8');
    // Parse markdown table rows: | # | Date | Company | Role | ...
    for (const match of text.matchAll(/\|[^|]+\|[^|]+\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g)) {
      const company = match[1].trim().toLowerCase();
      const role = match[2].trim().toLowerCase();
      if (company && role && company !== 'company') {
        seen.add(`${company}::${role}`);
      }
    }
  }
  return seen;
}

// ── Pipeline writer ─────────────────────────────────────────────────

function appendToPipeline(offers) {
  if (offers.length === 0) return;

  let text = readFileSync(PIPELINE_PATH, 'utf-8');

  // Find "## Pendientes" section and append after it
  const marker = '## Pendientes';
  const idx = text.indexOf(marker);
  if (idx === -1) {
    // No Pendientes section — append at end before Procesadas
    const procIdx = text.indexOf('## Procesadas');
    const insertAt = procIdx === -1 ? text.length : procIdx;
    const block = `\n${marker}\n\n` + offers.map(o =>
      `- [ ] ${o.url} | ${o.company} | ${o.title}`
    ).join('\n') + '\n\n';
    text = text.slice(0, insertAt) + block + text.slice(insertAt);
  } else {
    // Find the end of existing Pendientes content (next ## or end)
    const afterMarker = idx + marker.length;
    const nextSection = text.indexOf('\n## ', afterMarker);
    const insertAt = nextSection === -1 ? text.length : nextSection;

    const block = '\n' + offers.map(o =>
      `- [ ] ${o.url} | ${o.company} | ${o.title}`
    ).join('\n') + '\n';
    text = text.slice(0, insertAt) + block + text.slice(insertAt);
  }

  writeFileSync(PIPELINE_PATH, text, 'utf-8');
}

function appendToScanHistory(offers, date) {
  // Ensure file + header exist
  if (!existsSync(SCAN_HISTORY_PATH)) {
    writeFileSync(SCAN_HISTORY_PATH, 'url\tfirst_seen\tportal\ttitle\tcompany\tstatus\n', 'utf-8');
  }

  const lines = offers.map(o =>
    `${o.url}\t${date}\t${o.source}\t${o.title}\t${o.company}\tadded`
  ).join('\n') + '\n';

  appendFileSync(SCAN_HISTORY_PATH, lines, 'utf-8');
}

// ── Parallel fetch with concurrency limit ───────────────────────────

async function parallelFetch(tasks, limit) {
  const results = [];
  let i = 0;

  async function next() {
    while (i < tasks.length) {
      const task = tasks[i++];
      results.push(await task());
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => next());
  await Promise.all(workers);
  return results;
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const companyFlag = args.indexOf('--company');
  const filterCompany = companyFlag !== -1 ? args[companyFlag + 1]?.toLowerCase() : null;

  // 1. Read portals.yml
  if (!existsSync(PORTALS_PATH)) {
    console.error('Error: portals.yml not found. Run onboarding first.');
    process.exit(1);
  }

  const config = parseYaml(readFileSync(PORTALS_PATH, 'utf-8'));
  const companies = config.tracked_companies || [];
  const titleFilter = buildTitleFilter(config.title_filter);

  // 2. Filter to enabled companies with detectable APIs
  const targets = companies
    .filter(c => c.enabled !== false)
    .filter(c => !filterCompany || (c.name || '').toLowerCase().includes(filterCompany))
    .map(c => ({ ...c, _api: detectApi(c) }))
    .filter(c => c._api !== null);

  const skippedCount = companies.filter(c => c.enabled !== false).length - targets.length;

  console.log(`Scanning ${targets.length} companies via API (${skippedCount} skipped — no API detected)`);
  if (dryRun) console.log('(dry run — no files will be written)\n');

  // 3. Load dedup sets
  const seenUrls = loadSeenUrls();
  const seenCompanyRoles = loadSeenCompanyRoles();

  // 4. Fetch all APIs
  const date = new Date().toISOString().slice(0, 10);
  let totalFound = 0;
  let totalFiltered = 0;
  let totalDupes = 0;
  const newOffers = [];
  const errors = [];

  const tasks = targets.map(company => async () => {
    const { type, url, format, slug: apiSlug } = company._api;
    try {
      const data = format === 'text' ? await fetchText(url) : await fetchJson(url);
      const jobs = PARSERS[type](data, company.name, apiSlug);
      totalFound += jobs.length;

      for (const job of jobs) {
        if (!titleFilter(job.title)) {
          totalFiltered++;
          continue;
        }
        if (seenUrls.has(job.url)) {
          totalDupes++;
          continue;
        }
        const key = `${job.company.toLowerCase()}::${job.title.toLowerCase()}`;
        if (seenCompanyRoles.has(key)) {
          totalDupes++;
          continue;
        }
        // Mark as seen to avoid intra-scan dupes
        seenUrls.add(job.url);
        seenCompanyRoles.add(key);
        newOffers.push({ ...job, source: `${type}-api` });
      }
    } catch (err) {
      errors.push({ company: company.name, error: err.message });
    }
  });

  await parallelFetch(tasks, CONCURRENCY);

  // 4b. Hired Creative sweep — query our own remote creative jobs aggregator.
  let hcCount = 0;
  const hcConfig = config.hiredcreative;
  if (!filterCompany && hcConfig && hcConfig.enabled !== false) {
    const hcUrl = hcConfig.url || 'https://hiredcreative.com/api/jobs';
    console.log(`\nQuerying Hired Creative (${hcUrl})...`);
    try {
      const hcOffers = await fetchHiredCreative(hcUrl, titleFilter, seenUrls, seenCompanyRoles);
      hcCount = hcOffers.length;
      newOffers.push(...hcOffers);
    } catch (err) {
      errors.push({ company: 'Hired Creative', error: err.message });
    }
  }

  // 5. Write results
  if (!dryRun && newOffers.length > 0) {
    appendToPipeline(newOffers);
    appendToScanHistory(newOffers, date);
  }

  // 6. Print summary
  console.log(`\n${'━'.repeat(45)}`);
  console.log(`Portal Scan — ${date}`);
  console.log(`${'━'.repeat(45)}`);
  console.log(`Companies scanned:     ${targets.length}`);
  console.log(`Total jobs found:      ${totalFound}`);
  console.log(`Filtered by title:     ${totalFiltered} removed`);
  console.log(`Duplicates:            ${totalDupes} skipped`);
  if (hcCount > 0 || (hcConfig && hcConfig.enabled !== false)) {
    console.log(`Hired Creative sweep:  ${hcCount} new from aggregator`);
  }
  console.log(`New offers added:      ${newOffers.length}`);

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    for (const e of errors) {
      console.log(`  ✗ ${e.company}: ${e.error}`);
    }
  }

  if (newOffers.length > 0) {
    console.log('\nNew offers:');
    for (const o of newOffers) {
      console.log(`  + ${o.company} | ${o.title} | ${o.location || 'N/A'}`);
    }
    if (dryRun) {
      console.log('\n(dry run — run without --dry-run to save results)');
    } else {
      console.log(`\nResults saved to ${PIPELINE_PATH} and ${SCAN_HISTORY_PATH}`);
    }
  }

  console.log(`\n→ Run /hiredcreative-ops pipeline to evaluate new offers.`);
  console.log('→ Share results and get help: https://discord.gg/8pRpHETxa4');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
