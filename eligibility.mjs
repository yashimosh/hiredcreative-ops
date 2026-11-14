#!/usr/bin/env node
/**
 * eligibility.mjs — which pending roles can actually hire this person? Zero tokens.
 *
 * WHY: cold applications to employers who cannot hire you return nothing. This runs
 * BEFORE any evaluation, CV or form. It reads the posting through the ATS's public
 * API and sorts each pending URL into one of:
 *
 *   eligible      the posting says so in words (sponsorship / relocation offered, or
 *                 remote open to your region) and nothing in it rules you out
 *   unknown       the posting is silent → next action is a question to a human, not a CV
 *   not_eligible  the posting rules you out in words (quoted)
 *   stale         older than --max-age days
 *   duplicate     company + role already in the tracker, or an active application
 *                 at that company in the last 30 days
 *   off_target    title is outside the design archetypes, or a hard exclusion (marketing)
 *   gone          the posting no longer exists
 *   unsupported   not on Greenhouse / Lever / Ashby / Workable / SmartRecruiters (cannot be read unattended)
 *
 * Only `eligible` rows are handed to the unattended submission loop.
 *
 * Usage:
 *   node eligibility.mjs                 read data/pipeline*.md, print a summary, write the queue
 *   node eligibility.mjs --max-age 7     freshness window in days (default 7; 0 = ignore age)
 *   node eligibility.mjs --json          print the full result as JSON
 *   node eligibility.mjs --no-write      do not write data/eligible-queue.json / .md
 *
 * Rules live in config/eligibility.yml if present (user layer), else the defaults below.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const MAX_AGE = Number(opt('--max-age', 7));
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : '');
const today = new Date(new Date().toISOString().slice(0, 10));
const ageDays = (iso) => (iso ? Math.round((today - new Date(String(iso).slice(0, 10))) / 86400000) : null);

// ── Rules ───────────────────────────────────────────────────────────────────
// Defaults are generic. Put your own in config/eligibility.yml:
//   positive: ["regex", ...]   negative: [...]   title_in: [...]   title_out: [...]
const DEFAULTS = {
  negative: [
    'no (visa |work )?sponsorship', 'unable to (offer |provide )?(visa )?sponsor', 'not (able|in a position) to (offer|provide) (visa |work permit )?sponsor',
    'can(not|\\W?t) (offer|provide) (visa )?sponsor', 'do(es)? not (offer|provide) (visa )?sponsor', 'without (the need for |requiring )?(visa )?sponsorship',
    'must (already )?(be|have)[^.]{0,60}(authori[sz]ed|eligible|right) to work', 'legally authori[sz]ed to work in', 'existing right to work',
    '(us|u\\.s\\.|uk|eu) (citizens?|residents?|persons?) only', 'must (reside|be located|be based|live) in', 'security clearance',
  ],
  positive: [
    'visa (sponsorship|support)[^.]{0,40}(available|offered|provided|possible)', 'we (do |can |will |are able to |are happy to )?(offer |provide )?sponsor', 'sponsor(ship)? (is )?(available|offered|provided)',
    '(visa|immigration) (and|&|,) relocation', 'relocation (support|assistance|package|bonus|help)', 'help (you )?(with )?relocat',
    'remote[^.]{0,25}(worldwide|anywhere in the world|from anywhere)', 'work(ing)? from anywhere', 'anywhere in the world', 'fully remote[^.]{0,30}(emea|europe)', 'remote[^.]{0,20}\\bemea\\b', 'location[- ]agnostic',
  ],
  title_in: ['design', 'designer', 'art director', 'creative director', 'brand', 'visual', 'editorial', 'publication', 'typograph', 'creative operations', 'design ops', 'illustrat'],
  title_out: ['marketing manager', 'brand manager', 'media buyer', 'growth', 'performance marketing', 'public relations', '\\bpr\\b', 'communications (officer|specialist|manager)', 'engineer', 'developer', 'sales', 'account (executive|manager)', 'recruit', 'intern\\b'],
};
function loadRules() {
  const y = read('config/eligibility.yml');
  if (!y) return DEFAULTS;
  const out = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    const m = y.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s+.*\\n?)+)`, 'm'));
    if (m) out[key] = m[1].split('\n').map((l) => l.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, '').trim()).filter(Boolean);
  }
  return out;
}
const RULES = loadRules();
const rx = (list) => list.map((p) => new RegExp(p, 'i'));
const NEG = rx(RULES.negative), POS = rx(RULES.positive), TIN = rx(RULES.title_in), TOUT = rx(RULES.title_out);
const firstHit = (text, list) => {
  for (const r of list) {
    const m = r.exec(text);
    if (m) return text.slice(Math.max(0, m.index - 90), m.index + m[0].length + 90).replace(/\s+/g, ' ').trim();
  }
  return null;
};

// ── Tracker (for duplicates) ────────────────────────────────────────────────
const norm = (s) => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/\b(inc|ltd|llc|gmbh|group|co|company|the)\b/g, '').replace(/[^a-z0-9]+/g, '');
const tracker = new Map();
for (const line of read('data/applications.md').split('\n')) {
  const c = line.split('|').slice(1, -1).map((x) => x.trim());
  if (c.length < 6 || !/^\d+$/.test(c[0])) continue;
  const k = norm(c[2]);
  if (!tracker.has(k)) tracker.set(k, []);
  tracker.get(k).push({ num: c[0], date: c[1], role: norm(c[3]), status: c[5].toLowerCase() });
}
function duplicateOf(company, role) {
  const rows = tracker.get(norm(company)) || [];
  const same = rows.find((r) => r.role === norm(role));
  if (same) return `same role already in tracker (#${same.num}, ${same.status})`;
  const active = rows.find((r) => /^(applied|responded|interview|offer)$/.test(r.status) && ageDays(r.date) <= 30);
  if (active) return `active application at this company within 30 days (#${active.num})`;
  return null;
}

// ── Posting fetchers (public ATS APIs, no login) ────────────────────────────
const strip = (html) => String(html || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'job-eligibility-check' }, signal: AbortSignal.timeout(20000) });
  if (res.status === 404 || res.status === 410) return { gone: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
async function fetchPosting(url) {
  let m;
  if ((m = url.match(/greenhouse\.io\/(?:embed\/job_app\?for=)?([^/?&]+)\/jobs\/(\d+)/))) {
    const d = await getJson(`https://boards-api.greenhouse.io/v1/boards/${m[1]}/jobs/${m[2]}`);
    if (d.gone) return d;
    return { ats: 'greenhouse', title: d.title, location: d.location?.name || '', posted: d.first_published || d.updated_at, text: strip(d.content) };
  }
  if ((m = url.match(/jobs\.lever\.co\/([^/]+)\/([0-9a-f-]{36})/))) {
    const d = await getJson(`https://api.lever.co/v0/postings/${m[1]}/${m[2]}`);
    if (d.gone) return d;
    const lists = (d.lists || []).map((l) => `${l.text} ${strip(l.content)}`).join(' ');
    return { ats: 'lever', title: d.text, location: d.categories?.location || '', posted: d.createdAt ? new Date(d.createdAt).toISOString() : null, text: `${d.descriptionPlain || ''} ${lists} ${d.additionalPlain || ''}`.replace(/\s+/g, ' ') };
  }
  if ((m = url.match(/jobs\.ashbyhq\.com\/([^/]+)\/([0-9a-f-]{36})/))) {
    const d = await getJson(`https://api.ashbyhq.com/posting-api/job-board/${m[1]}`);
    if (d.gone) return d;
    const j = (d.jobs || []).find((x) => x.id === m[2]);
    if (!j) return { gone: true };
    return { ats: 'ashby', title: j.title, location: [j.location, ...(j.secondaryLocations || []).map((s) => s.location)].filter(Boolean).join('; '), posted: j.publishedAt, text: j.descriptionPlain || strip(j.descriptionHtml) };
  }
  if ((m = url.match(/jobs\.smartrecruiters\.com\/([^/?#]+)\/(\d+)/i))) {
    const d = await getJson(`https://api.smartrecruiters.com/v1/companies/${m[1]}/postings/${m[2]}`);
    if (d.gone) return d;
    const l = d.location || {};
    const loc = [l.city, l.region, (l.country || '').toUpperCase(), l.remote ? 'Remote' : ''].filter(Boolean).join(', ');
    const secs = Object.values(d.jobAd?.sections || {}).map((s) => strip(s?.text)).join(' ');
    return { ats: 'smartrecruiters', title: d.name, location: loc, posted: d.releasedDate, text: secs };
  }
  if ((m = url.match(/apply\.workable\.com\/([^/?#]+)\/j\/([0-9A-F]{6,})/i))) {
    const d = await getJson(`https://apply.workable.com/api/v1/widget/accounts/${m[1]}?details=true`);
    if (d.gone) return d;
    const j = (d.jobs || []).find((x) => String(x.shortcode).toUpperCase() === m[2].toUpperCase());
    if (!j) return { gone: true };
    const locs = (j.locations || []).map((x) => [x.city, x.country].filter(Boolean).join(', '));
    const loc = [...new Set([[j.city, j.country].filter(Boolean).join(', '), ...locs])].filter(Boolean).join('; ') + (String(j.telecommuting) === 'true' ? '; Remote' : '');
    return { ats: 'workable', title: j.title, location: loc, posted: j.published_on || j.created_at, text: strip(j.description) };
  }
  return { unsupported: true };
}
// Aggregator pages (job boards that link out) often carry the real ATS link in their HTML.
const ATS_LINK = /https?:\/\/(?:job-boards\.greenhouse\.io|boards\.greenhouse\.io)\/[\w-]+\/jobs\/\d+|https?:\/\/jobs\.lever\.co\/[\w-]+\/[0-9a-f-]{36}|https?:\/\/jobs\.ashbyhq\.com\/[\w.-]+\/[0-9a-f-]{36}|https?:\/\/apply\.workable\.com\/[\w-]+\/j\/[0-9A-F]{6,}|https?:\/\/jobs\.smartrecruiters\.com\/[\w-]+\/\d+/i;
const NO_RESOLVE = /linkedin\.com|t\.me|facebook\.com|instagram\.com/i;
async function resolveAts(url) {
  if (NO_RESOLVE.test(url)) return null;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (job-eligibility-check)' }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (ATS_LINK.test(res.url)) return res.url.match(ATS_LINK)[0];
    if (!res.ok) return null;
    const m = (await res.text()).match(ATS_LINK);
    return m ? m[0] : null;
  } catch { return null; }
}

// ── Classify ────────────────────────────────────────────────────────────────
async function classify(entry) {
  const base = { ...entry };
  let p;
  try { p = await fetchPosting(entry.url); } catch (e) { return { ...base, verdict: 'unknown', reason: `could not read posting (${e.message})` }; }
  if (p.unsupported) {
    const real = await resolveAts(entry.url);
    if (!real) return { ...base, verdict: 'unsupported', reason: 'not Greenhouse / Lever / Ashby / Workable / SmartRecruiters' };
    base.listedAt = entry.url;
    base.url = real;
    try { p = await fetchPosting(real); } catch (e) { return { ...base, verdict: 'unknown', reason: `could not read posting (${e.message})` }; }
  }
  if (p.gone) return { ...base, verdict: 'gone', reason: 'posting no longer exists' };
  const title = p.title || entry.role;
  const out = { ...base, role: title, ats: p.ats, location: p.location, posted: p.posted ? String(p.posted).slice(0, 10) : null, age: ageDays(p.posted) };
  const dup = duplicateOf(entry.company, title);
  if (dup) return { ...out, verdict: 'duplicate', reason: dup };
  if (TOUT.some((r) => r.test(title)) || !TIN.some((r) => r.test(title))) return { ...out, verdict: 'off_target', reason: `title outside target archetypes: "${title}"` };
  const hay = `${p.location}. ${p.text}`;
  const neg = firstHit(hay, NEG);
  if (neg) return { ...out, verdict: 'not_eligible', reason: neg };
  if (MAX_AGE > 0 && out.age !== null && out.age > MAX_AGE) return { ...out, verdict: 'stale', reason: `posted ${out.posted} (${out.age} days ago)` };
  const pos = firstHit(hay, POS);
  if (pos) return { ...out, verdict: 'eligible', reason: pos };
  return { ...out, verdict: 'unknown', reason: 'posting is silent on sponsorship, relocation and remote region' };
}

// ── Main ────────────────────────────────────────────────────────────────────
const entries = [];
for (const f of ['pipeline.md', 'pipeline-remote.md', 'pipeline-relocation.md', 'pipeline-inbound.md']) {
  for (const line of read(`data/${f}`).split('\n')) {
    if (!line.startsWith('- [ ]')) continue;
    const [url, company = '', role = ''] = line.slice(5).split('|').map((x) => x.trim());
    if (/^https?:\/\//.test(url)) entries.push({ url, company, role, source: f });
  }
}

const results = [];
const POOL = 6;
for (let i = 0; i < entries.length; i += POOL) results.push(...(await Promise.all(entries.slice(i, i + POOL).map(classify))));

const counts = {};
for (const r of results) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
const eligible = results.filter((r) => r.verdict === 'eligible');
const unknown = results.filter((r) => r.verdict === 'unknown');

if (!flag('--no-write')) {
  const stamp = new Date().toISOString();
  writeFileSync(join(ROOT, 'data/eligible-queue.json'), JSON.stringify({ generated: stamp, maxAgeDays: MAX_AGE, counts, eligible, unknown }, null, 2));
  const row = (r) => `| ${r.company} | ${r.role} | ${r.ats} | ${r.location || ''} | ${r.posted || '?'} | ${r.url} | ${r.reason.replace(/\|/g, '/')} |`;
  writeFileSync(join(ROOT, 'data/eligible-queue.md'), [
    '# Eligible queue', '', `Generated ${stamp} by \`node eligibility.mjs\` (freshness window: ${MAX_AGE} days). Do not edit by hand.`, '',
    `Counts: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '',
    '## Eligible — the unattended loop may apply to these', '', '| Company | Role | ATS | Location | Posted | URL | Evidence from the posting |', '|---|---|---|---|---|---|---|', ...eligible.map(row), '',
    '## Unknown — ask a human before any CV is written', '', '| Company | Role | ATS | Location | Posted | URL | Why |', '|---|---|---|---|---|---|---|', ...unknown.map(row), '',
  ].join('\n'));
}

if (flag('--json')) console.log(JSON.stringify({ counts, results }, null, 2));
else {
  console.log(`${entries.length} pending URLs → ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  for (const r of eligible) console.log(`  ELIGIBLE  ${r.company} — ${r.role} [${r.ats}, ${r.location}, posted ${r.posted}]\n            "${r.reason}"`);
  for (const r of unknown) console.log(`  UNKNOWN   ${r.company} — ${r.role} [${r.ats}, posted ${r.posted}]`);
}
