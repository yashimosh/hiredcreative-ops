#!/usr/bin/env node
/**
 * precheck-duplicate.mjs — "have I already dealt with this company?", asked BEFORE any CV is written.
 * Idea from upstream career-ops (precheck-duplicate.mjs, MIT); small rewrite for our tracker.
 *
 * Read-only. Prints every tracker row whose company matches, newest first, and
 * a one-line verdict. Exit code is always 0 on a completed lookup.
 *
 * Usage:
 *   node precheck-duplicate.mjs "Design Bridge"
 *   node precheck-duplicate.mjs acme --json
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const query = args.filter((a) => !a.startsWith('--')).join(' ').trim();
if (!query) {
  console.error('usage: node precheck-duplicate.mjs "<company>" [--json]');
  process.exit(1);
}

const norm = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/\b(inc|ltd|llc|gmbh|group|co|company|the|and partners)\b/g, '').replace(/[^a-z0-9]+/g, '');
const q = norm(query);
const file = join(ROOT, 'data/applications.md');
const rows = [];
if (existsSync(file)) {
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const c = line.split('|').slice(1, -1).map((x) => x.trim());
    if (c.length < 6 || !/^\d+$/.test(c[0])) continue;
    const n = norm(c[2]);
    if (!n || !(n.includes(q) || q.includes(n))) continue;
    rows.push({ num: Number(c[0]), date: c[1], company: c[2], role: c[3], score: c[4], status: c[5] });
  }
}
rows.sort((a, b) => (a.date < b.date ? 1 : -1));

const today = new Date(new Date().toISOString().slice(0, 10));
const recentApplied = rows.find((r) => /^(applied|responded|interview|offer)$/i.test(r.status) && (today - new Date(r.date)) / 86400000 <= 30);
const rejected = rows.find((r) => /^rejected$/i.test(r.status));
const verdict = recentApplied
  ? `STOP — active application within 30 days (#${recentApplied.num}, ${recentApplied.date}). Do not send a second one.`
  : rows.length
    ? `SEEN — ${rows.length} earlier row(s)${rejected ? `, including a rejection (#${rejected.num})` : ''}. Read them before writing anything.`
    : 'CLEAR — no earlier rows for this company.';

if (JSON_OUT) {
  console.log(JSON.stringify({ query, verdict, rows }, null, 2));
} else {
  for (const r of rows) console.log(`#${r.num}\t${r.date}\t${r.status}\t${r.score}\t${r.company} — ${r.role}`);
  console.log(`\n${verdict}`);
}
