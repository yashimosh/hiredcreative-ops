#!/usr/bin/env node
/**
 * close-stale.mjs — close long-silent `Applied` rows so the tracker shows what is really live.
 * Idea from upstream career-ops (close-stale.mjs, MIT); this is a small rewrite for our tracker.
 *
 * A row left as `Applied` for months still reads as "in flight" and buries the
 * few applications that can still be followed up.
 *
 * Usage:
 *   node close-stale.mjs              dry run: list what would close (default 60 days)
 *   node close-stale.mjs --days 45    change the threshold
 *   node close-stale.mjs --apply      write: status → Discarded, note appended
 *
 * Only touches the main table (above the first `## ` heading). Rows whose notes
 * contain "keep-open" are skipped.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const FILE = join(dirname(fileURLToPath(import.meta.url)), 'data/applications.md');
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const di = args.indexOf('--days');
const DAYS = di >= 0 ? Number(args[di + 1]) : 60;
if (!Number.isInteger(DAYS) || DAYS < 14) {
  console.error('--days must be a whole number, 14 or more');
  process.exit(1);
}

const todayIso = new Date().toISOString().slice(0, 10);
const age = (iso) => Math.round((new Date(todayIso) - new Date(iso)) / 86400000);

if (!existsSync(FILE)) {
  console.log('No data/applications.md yet: nothing to close.');
  process.exit(0);
}
const lines = readFileSync(FILE, 'utf8').split('\n');
const firstSection = lines.findIndex((l, i) => i > 0 && l.startsWith('## '));
const end = firstSection === -1 ? lines.length : firstSection;

const closed = [];
for (let i = 0; i < end; i++) {
  const parts = lines[i].split('|');
  if (parts.length < 11 || !/^\s*\d+\s*$/.test(parts[1])) continue;
  if (parts[6].trim().toLowerCase() !== 'applied') continue;
  const notes = parts.slice(9, -1).join('|');
  if (/keep-open/i.test(notes)) continue;
  const m = notes.match(/Applied (\d{4}-\d{2}-\d{2})/i);
  const sent = m ? m[1] : parts[2].trim();
  const d = age(sent);
  if (!(d > DAYS)) continue;
  closed.push({ num: parts[1].trim(), company: parts[3].trim(), role: parts[4].trim(), sent, days: d });
  if (APPLY) {
    parts[6] = ' Discarded ';
    parts[parts.length - 2] = `${parts[parts.length - 2].trimEnd()} Closed as silent ${todayIso} (${d}d, no reply). `;
    lines[i] = parts.join('|');
  }
}

for (const c of closed) console.log(`#${c.num}\t${c.sent}\t${c.days}d\t${c.company} — ${c.role}`);
if (APPLY && closed.length) writeFileSync(FILE, lines.join('\n'));
console.log(`\n${closed.length} row(s) silent for more than ${DAYS} days ${APPLY ? 'closed (status → Discarded).' : 'would close. Re-run with --apply to write.'}`);
