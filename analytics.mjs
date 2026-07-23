#!/usr/bin/env node
/**
 * analytics.mjs — Complete hiredcreative-ops funnel analytics.
 *
 * Unlike analyze-patterns.mjs (which starts at "evaluated"), this includes the
 * SCAN layer — the ~1,300 postings the scanner churned before anything reached
 * the tracker. Full funnel: scanned → filtered → evaluated → applied → outcome.
 *
 * Reads:  data/scan-history.tsv  +  data/applications.md
 * Usage:  node analytics.mjs          # formatted dashboard
 *         node analytics.mjs --json   # raw JSON
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const asJson = process.argv.includes('--json');
const R = (p) => resolve(ROOT, p);
const read = (p) => (existsSync(R(p)) ? readFileSync(R(p), 'utf8') : '');

// ── SCAN LAYER (scan-history.tsv) ─────────────────────────────
const scanLines = read('data/scan-history.tsv').split('\n').filter(Boolean);
const scanStatus = {};
for (let i = 1; i < scanLines.length; i++) {
  const st = scanLines[i].split('\t').pop().trim();
  if (st) scanStatus[st] = (scanStatus[st] || 0) + 1;
}
const scanTotal = scanLines.length - 1;
const dedup = scanStatus.skipped_dup || 0;
const titleFiltered = scanStatus.skipped_title || 0;
const locFiltered = scanStatus.skipped_location || 0;
const added = scanStatus.added || 0;
const otherFiltered =
  (scanStatus.skipped_specialty || 0) + (scanStatus.skipped_seniority || 0) +
  (scanStatus.skipped_expired || 0) + (scanStatus.skipped_closed || 0) +
  (scanStatus.skipped_aggregator || 0);
const errors = scanStatus.error || 0;
const uniqueScanned = scanTotal - dedup;

// ── TRACKER LAYER (applications.md) ───────────────────────────
const rows = read('data/applications.md').split('\n')
  .filter((l) => l.startsWith('|') && !l.startsWith('| #') && !l.startsWith('|--'))
  .map((l) => l.split('|').map((x) => x.trim()))
  .filter((c) => c[1] && /^\d+$/.test(c[1]))
  .map((c) => ({ num: c[1], date: c[2], company: c[3], role: c[4], score: c[5], status: c[6], notes: c[9] || '' }));

const scoreNum = (s) => { const m = (s || '').match(/([\d.]+)/); return m ? parseFloat(m[1]) : null; };
const count = (pred) => rows.filter(pred).length;

const status = {};
for (const r of rows) status[r.status] = (status[r.status] || 0) + 1;
const applied = status.Applied || 0, rejected = status.Rejected || 0;
const submitted = applied + rejected;
const interviews = count((r) => /interview/i.test(r.status));
const offers = count((r) => /offer/i.test(r.status));

// Scores
const scores = rows.map((r) => scoreNum(r.score)).filter((s) => s != null);
const avgScore = scores.length ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 0;
const scoreBuckets = {};
for (const s of scores) { const b = `${Math.floor(s)}.x`; scoreBuckets[b] = (scoreBuckets[b] || 0) + 1; }

// Archetype families (clustered on role title — reliable, fixes the "Unknown" bug)
function archetype(role) {
  const t = (role || '').toLowerCase();
  if (/creative director|head of creative/.test(t)) return 'Creative Director';
  if (/head of brand|brand director|brand lead|head of brand & creative/.test(t)) return 'Head of Brand';
  if (/design director|head of design|director of design/.test(t)) return 'Design Director';
  if (/design manager|creative manager/.test(t)) return 'Design Manager';
  if (/art director/.test(t)) return 'Art Director';
  if (/motion/.test(t)) return 'Motion Designer';
  if (/brand designer|brand identity|brand & /.test(t)) return 'Brand Designer';
  if (/graphic designer/.test(t)) return 'Graphic Designer';
  if (/visual designer|visual & brand/.test(t)) return 'Visual Designer';
  if (/creative technologist|design engineer|ai trainer|ai artist/.test(t)) return 'Creative Technologist';
  if (/product designer/.test(t)) return 'Product Designer';
  return 'Other';
}
const arch = {};
for (const r of rows) {
  const a = archetype(r.role);
  arch[a] = arch[a] || { total: 0, applied: 0, rejected: 0, skip: 0 };
  arch[a].total++;
  if (r.status === 'Applied') arch[a].applied++;
  if (r.status === 'Rejected') arch[a].rejected++;
  if (r.status === 'SKIP') arch[a].skip++;
}

// Channels (of submitted)
const chanMap = [
  ['Ashby', /ashby/i], ['Greenhouse', /greenhouse/i], ['Lever', /lever/i], ['Workday', /workday/i],
  ['Phenom', /phenom/i], ['Rippling', /rippling/i], ['Keka', /keka/i], ['ClearCompany', /clearcompany/i],
  ['Workable', /workable/i], ['Wellfound', /wellfound/i], ['Amazon ATS', /amazon/i],
  ['LinkedIn', /linkedin|easy apply/i], ['Email/direct', /email|via email/i], ['Custom form', /tally|custom form/i],
];
const channels = {};
for (const r of rows) {
  if (r.status !== 'Applied' && r.status !== 'Rejected') continue;
  const hit = chanMap.find(([, re]) => re.test(r.notes));
  const k = hit ? hit[0] : 'Other/unspecified';
  channels[k] = (channels[k] || 0) + 1;
}

// Rejection reasons
const rejReasons = {};
for (const r of rows.filter((x) => x.status === 'Rejected')) {
  let why = 'generic / silent screen';
  if (/right-to-work|work auth/i.test(r.notes)) why = 'right-to-work (citizenship)';
  else if (/position filled|filled/i.test(r.notes)) why = 'position filled';
  else if (/other candidates|skills.*align/i.test(r.notes)) why = 'other candidates';
  else if (/not moving|not move|interview stage/i.test(r.notes)) why = 'not advancing';
  rejReasons[why] = (rejReasons[why] || 0) + 1;
}

// Volume by ISO week
const week = {};
for (const r of rows) {
  const m = (r.date || '').match(/2026-(\d\d)-(\d\d)/);
  if (!m) continue;
  const d = new Date(Date.UTC(2026, +m[1] - 1, +m[2]));
  const oneJan = new Date(Date.UTC(2026, 0, 1));
  const wk = Math.ceil(((d - oneJan) / 86400000 + oneJan.getUTCDay() + 1) / 7);
  week[wk] = (week[wk] || 0) + 1;
}

const dates = rows.map((r) => r.date).filter((d) => /^2026/.test(d)).sort();

const data = {
  window: { from: dates[0], to: dates[dates.length - 1], days: 31, totalEvaluated: rows.length },
  scanFunnel: { scanEvents: scanTotal, dedupRemoved: dedup, uniqueScanned, titleFiltered, locFiltered, otherFiltered, errors, passedFilters: added },
  trackerFunnel: status,
  outcomes: { submitted, rejected, rejectionRate: submitted ? Math.round(100 * rejected / submitted) : 0, interviews, offers, awaiting: applied },
  scores: { avg: avgScore, buckets: scoreBuckets, gte40: scores.filter((s) => s >= 4.0).length, gte45: scores.filter((s) => s >= 4.5).length },
  archetypes: arch,
  channels,
  rejReasons,
  weeklyVolume: week,
};

if (asJson) { console.log(JSON.stringify(data, null, 2)); process.exit(0); }

// ── Formatted dashboard ───────────────────────────────────────
const bar = (n, ch = '█', div = 1) => ch.repeat(Math.max(0, Math.round(n / div)));
const pct = (a, b) => (b ? Math.round(100 * a / b) : 0);
const L = [];
L.push('═'.repeat(60));
L.push('  CAREER-OPS ANALYTICS — complete funnel');
L.push(`  ${data.window.from} → ${data.window.to}  (${rows.length} evaluated)`);
L.push('═'.repeat(60));
L.push('');
L.push('── FULL FUNNEL (scan → outcome) ──');
L.push(`  ${String(scanTotal).padStart(5)}  scan events processed`);
L.push(`  ${String(uniqueScanned).padStart(5)}  unique postings assessed  (-${dedup} dedup)`);
L.push(`  ${String(uniqueScanned - titleFiltered).padStart(5)}  survived title filter     (-${titleFiltered} wrong title)`);
L.push(`  ${String(added).padStart(5)}  passed all auto-filters   (-${locFiltered} geo, -${otherFiltered} other, -${errors} err)`);
L.push(`  ${String(rows.length).padStart(5)}  EVALUATED (+ non-API sources)`);
L.push(`  ${String(submitted).padStart(5)}  APPLIED`);
L.push(`  ${String(interviews).padStart(5)}  interviews · ${offers} offers`);
L.push('');
L.push('── STATUS ──');
for (const [k, v] of Object.entries(status).sort((a, b) => b[1] - a[1])) L.push(`  ${k.padEnd(11)} ${String(v).padStart(3)}  ${bar(v, '▪', 1)}`);
L.push('');
L.push('── OUTCOMES (of submitted) ──');
L.push(`  Submitted ${submitted} · Rejected ${rejected} (${data.outcomes.rejectionRate}%) · Interview ${interviews} · Offer ${offers} · Awaiting ${applied}`);
L.push('');
L.push(`── SCORES (avg ${avgScore}) ──`);
for (const b of Object.keys(scoreBuckets).sort()) L.push(`  ${b}: ${String(scoreBuckets[b]).padStart(3)}  ${bar(scoreBuckets[b], '▪')}`);
L.push(`  ≥4.0: ${data.scores.gte40}  ·  ≥4.5: ${data.scores.gte45}`);
L.push('');
L.push('── ARCHETYPE (clustered on role title) ──');
for (const [a, v] of Object.entries(arch).sort((x, y) => y[1].total - x[1].total)) {
  const submittedA = v.applied + v.rejected;
  L.push(`  ${a.padEnd(22)} eval ${String(v.total).padStart(3)} · applied ${String(submittedA).padStart(2)} · apply-rate ${pct(submittedA, v.total)}%`);
}
L.push('');
L.push('── CHANNEL (of submitted) ──');
for (const [k, v] of Object.entries(channels).sort((a, b) => b[1] - a[1])) L.push(`  ${k.padEnd(18)} ${String(v).padStart(2)}  ${bar(v, '▪')}`);
L.push('');
L.push('── REJECTIONS — why ──');
for (const [k, v] of Object.entries(rejReasons).sort((a, b) => b[1] - a[1])) L.push(`  ${k.padEnd(28)} ${v}`);
L.push('');
L.push('── VOLUME BY WEEK ──');
for (const w of Object.keys(week).sort((a, b) => a - b)) L.push(`  W${w}: ${String(week[w]).padStart(3)}  ${bar(week[w], '●')}`);
L.push('');
L.push('── BOTTLENECK ──');
L.push(`  ${uniqueScanned} scanned → ${rows.length} evaluated → ${submitted} applied → ${interviews} interviews.`);
L.push(`  Top filter: ${titleFiltered} wrong-title (${pct(titleFiltered, uniqueScanned)}% of unique).`);
L.push(`  The gap is applied→interview (${pct(interviews, submitted)}%). Quality > volume from here.`);

console.log(L.join('\n'));
