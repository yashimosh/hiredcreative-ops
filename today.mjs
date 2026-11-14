#!/usr/bin/env node
/**
 * today.mjs — one action list across all tracks. Zero tokens, reads plain files.
 *
 * WHY: the system produced research (reports, prospect files, scans) faster
 * than anyone acted on it. This prints what to DO, in the order that converts:
 * money owed, people already talking to you, live applications, events.
 * New leads come last, on purpose.
 *
 * Usage:
 *   node today.mjs            readable list
 *   node today.mjs --json     same data as JSON
 *   node today.mjs --live 45  count an application as live for N days (default 45)
 *
 * Reads (all optional, a missing file is skipped):
 *   data/applications.md  data/follow-ups.md  data/retainers.md
 *   data/prospects/*.md   data/events.md      data/pipeline*.md
 *   config/profile.yml (location.home_city, optional: sorts home-city events first)
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const ROOT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const liveIdx = args.indexOf('--live');
const LIVE_DAYS = liveIdx >= 0 ? Number(args[liveIdx + 1]) || 45 : 45;
const FOLLOWUP_AFTER = 7;   // days after applying before the first follow-up is due
const EVENT_WINDOW = 45;    // days ahead to show events
const FRESH_EVAL_DAYS = 21; // an unapplied evaluation older than this is probably closed

const today = new Date(new Date().toISOString().slice(0, 10));
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : '');
const days = (iso) => Math.round((today - new Date(iso)) / 86400000);
const cells = (line) => line.split('|').slice(1, -1).map((c) => c.trim());
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

// ── Applications ────────────────────────────────────────────────────────────
const appsText = read('data/applications.md').split(/^## /m)[0]; // main table only
const followupsLogged = new Map(); // app # → count of logged follow-ups
for (const line of read('data/follow-ups.md').split('\n')) {
  const c = cells(line);
  if (c.length >= 5 && /^\d+$/.test(c[1]) && /sent/i.test(c[4])) {
    followupsLogged.set(Number(c[1]), (followupsLogged.get(Number(c[1])) || 0) + 1);
  }
}

const live = [];
const stale = [];
const unapplied = [];
for (const line of appsText.split('\n')) {
  const c = cells(line);
  if (c.length < 9 || !/^\d+$/.test(c[0])) continue;
  const [num, date, company, role, score, status, , , notes] = c;
  const st = status.toLowerCase();
  if (st === 'applied' || st === 'responded' || st === 'interview') {
    // The date column is the evaluation date; the real send date is usually in notes.
    const m = notes.match(/Applied (\d{4}-\d{2}-\d{2})/i);
    const sent = m ? m[1] : date;
    const age = days(sent);
    const row = { num: Number(num), company, role, score, status, sent, age, followups: followupsLogged.get(Number(num)) || 0 };
    if (/no follow-?up/i.test(notes) && st === 'applied') continue; // decided: wait, don't chase
    if (st !== 'applied' || age <= LIVE_DAYS) live.push(row);
    else stale.push(row);
  } else if (st === 'evaluated') {
    const s = parseFloat(score);
    if (s >= 4.0 && days(date) <= FRESH_EVAL_DAYS) unapplied.push({ num: Number(num), company, role, score, date, age: days(date) });
  }
}
live.sort((a, b) => b.age - a.age);
const dueFollowups = live.filter((r) => r.status.toLowerCase() !== 'applied' || (r.age >= FOLLOWUP_AFTER && r.followups === 0) || (r.age >= 21 && r.followups === 1));

// ── Retainers / money ───────────────────────────────────────────────────────
const retText = read('data/retainers.md');
const mrr = (retText.match(/^\*\*MRR:.*$/m) || [''])[0].replace(/\*\*/g, '');
const unpaid = [];
for (const line of retText.split('\n')) {
  const c = cells(line);
  if (c.length < 5 || !/^#?\d+$|^[A-Z]+-\d{4}-\d{2}$/.test(c[0])) continue; // retainer rows (#3) and project rows (CLIENT-2026-11)
  const st = c[4].replace(/\*/g, '').trim();
  if (/^(✅\s*)?(paid|received)\b/i.test(st)) continue; // only a status that STARTS with paid counts ("paid 16 days late" in a note does not)
  const due = (c[2].match(/\d{4}-\d{2}-\d{2}/) || [])[0];
  const late = due ? Math.floor((Date.now() - Date.parse(due)) / 864e5) : null;
  unpaid.push({ invoice: c[0], covers: c[1], due: due || c[2], amount: c[3], status: clip(st, 80), late });
}

// Last logged invoice period already ended → the next invoice is missing from the table.
let lastEnd = null;
for (const line of retText.split('\n')) {
  const c = cells(line);
  if (c.length >= 5 && /^#?\d+$/.test(c[0])) { const e = (c[1].match(/→\s*(\d{4}-\d{2}-\d{2})/) || [])[1]; if (e && (!lastEnd || e > lastEnd)) lastEnd = e; }
}
const missingInvoice = lastEnd && Date.parse(lastEnd) < Date.now() ? lastEnd : null;

// ── Prospects in motion ─────────────────────────────────────────────────────
// Won = a client: its money is tracked in data/retainers.md, not here.
const MOVING = /^(outreached|conversation|proposal|negotiating|warm|verified)/i;
const prospects = [];
const pdir = join(ROOT, 'data/prospects');
if (existsSync(pdir)) {
  for (const f of readdirSync(pdir).filter((f) => f.endsWith('.md'))) {
    const text = readFileSync(join(pdir, f), 'utf8');
    const m = text.match(/^[-* ]*\**Stage:?\**:?\s*(.+)$/im);
    if (!m) continue;
    const stage = m[1].replace(/[*`]/g, '').trim();
    if (!MOVING.test(stage)) continue;
    let last = '';
    try {
      last = execFileSync('git', ['log', '-1', '--format=%cs', '--', `data/prospects/${f}`], { cwd: ROOT, encoding: 'utf8' }).trim();
    } catch { /* not a git checkout: leave blank */ }
    prospects.push({ slug: f.replace(/\.md$/, ''), stage: clip(stage, 70), lastEdit: last, quiet: last ? days(last) : null });
  }
}
prospects.sort((a, b) => (b.quiet ?? 0) - (a.quiet ?? 0));

// ── Events ──────────────────────────────────────────────────────────────────
const events = [];
for (const line of read('data/events.md').split('\n')) {
  const c = cells(line);
  if (c.length < 5) continue;
  const m = (c[4] || '').match(/\d{4}-\d{2}-\d{2}/);
  if (!m) continue;
  const inDays = -days(m[0]);
  if (inDays >= 0 && inDays <= EVENT_WINDOW) {
    events.push({ slug: c[0].replace(/\*/g, ''), event: clip(c[1].replace(/\*/g, ''), 60), city: clip(c[2].replace(/\*/g, ''), 30), date: m[0], inDays });
  }
}
// Home city first on the same date. config/profile.yml → location.home_city: "City, Other spelling"
const homeNames = ((read('config/profile.yml').match(/^\s*home_city:\s*"?([^"\n#]+)/m) || [])[1] || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
const homeFirst = (e) => (homeNames.some((n) => e.city.toLowerCase().includes(n)) ? 0 : 1);
events.sort((a, b) => a.inDays - b.inDays || homeFirst(a) - homeFirst(b));

// ── Backlog (shown as a number, not as a task) ──────────────────────────────
const backlog = {};
for (const f of ['pipeline.md', 'pipeline-remote.md', 'pipeline-relocation.md', 'pipeline-us.md', 'pipeline-inbound.md']) {
  const n = (read(`data/${f}`).match(/^- \[ \]/gm) || []).length;
  if (n) backlog[f] = n;
}

const out = { date: today.toISOString().slice(0, 10), mrr, unpaid, prospects, dueFollowups, live, unapplied, events, staleApplied: stale.length, backlog };

if (JSON_OUT) {
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

const h = (t) => console.log(`\n${t}\n${'─'.repeat(t.length)}`);
console.log(`TODAY — ${out.date}`);

h('1. Money');
console.log(mrr || '(no MRR line in data/retainers.md)');
if (missingInvoice) console.log(`  next invoice NOT LOGGED: last period ended ${missingInvoice} (send it, then add the row to data/retainers.md)`);
if (unpaid.length) for (const u of unpaid) console.log(`  invoice ${u.invoice} · ${u.amount} · due ${u.due}${u.late > 0 ? ` · ${u.late}d OVERDUE, unconfirmed` : ''} · ${u.status}`);

h(`2. People already in motion (${prospects.length})`);
if (!prospects.length) console.log('  none');
for (const p of prospects) console.log(`  ${p.slug.padEnd(28)} ${p.quiet === null ? '   ?' : String(p.quiet).padStart(4)}d quiet · ${p.stage}`);
console.log('  → file untouched for 14+ days = follow up or mark Dormant. Message or call, not email.');

h(`3. Live applications needing a follow-up (${dueFollowups.length} of ${live.length} live)`);
if (!dueFollowups.length) console.log('  none due');
for (const r of dueFollowups) console.log(`  #${r.num} ${clip(r.company, 24).padEnd(24)} ${clip(r.role, 34).padEnd(34)} sent ${r.sent} (${r.age}d) · follow-ups: ${r.followups}`);
console.log(`  → find a named person first (recruiter, hiring manager, someone you know there).`);

h(`4. Events in the next ${EVENT_WINDOW} days (${events.length})`);
if (!events.length) console.log('  none on file — check data/events.md is current');
for (const e of events) console.log(`  ${e.date} (in ${e.inDays}d) ${e.event} — ${e.city}`);

h(`5. Scored 4.0+ and not applied, last ${FRESH_EVAL_DAYS} days (${unapplied.length})`);
if (!unapplied.length) console.log('  none');
for (const u of unapplied) console.log(`  #${u.num} ${clip(u.company, 24).padEnd(24)} ${clip(u.role, 40).padEnd(40)} ${u.score} · ${u.age}d old`);

h('6. Parked');
console.log(`  ${stale.length} applications silent for more than ${LIVE_DAYS} days (close them: node close-stale.mjs)`);
const b = Object.entries(backlog).map(([f, n]) => `${n} in ${f}`).join(', ');
console.log(`  unprocessed leads: ${b || 'none'}`);
console.log('  → do not work the backlog while sections 1–4 have open items.');
