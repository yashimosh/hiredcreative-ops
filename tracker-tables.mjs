#!/usr/bin/env node
/**
 * tracker-tables.mjs — Schema-aware parser for data/applications.md
 *
 * applications.md holds MULTIPLE markdown tables in one file. They do NOT
 * share a schema and they do NOT share an ID space:
 *
 *   "evaluated" | # | Date | Company | Role | Score | Status | PDF | Report | Notes |
 *               The A–F evaluation tracker. IDs are the evaluated numbering.
 *
 *   "email"     | # | Company | Role | Applied | CV | Cover Letter | Status | Notes |
 *               (## Email-confirmed submissions) — inbox-scan submission record.
 *               IDs 374+ are this scan's OWN numbering, separate from evaluated.
 *               Status vocabulary is also different (Submitted/Active/Filled/…).
 *
 *   "outcome"   | Company | Role | Outcome |
 *               (## Geo-blocked …) — 3-col, no ID, freeform "Outcome" text.
 *
 * Tools that parse every `|`-row as the evaluated schema corrupt the other
 * tables. The 2026-06-17 incident: merge-tracker matched a new evaluated
 * entry's ID against an email-confirmed row with the same number and
 * overwrote a real submission record with the evaluated schema.
 *
 * This module classifies each line by the table it belongs to so callers can
 * operate on exactly one table. Cell indexing keeps the leading empty element
 * (from the leading `|`) so `cells[1]` is the first column — matching the
 * `line.split('|')` convention already used across the codebase.
 */

/**
 * Identify a table from its header row's content cells (lowercased).
 * Returns 'evaluated' | 'email' | 'outcome' | null.
 */
function detectHeader(cells) {
  const c = cells.map(s => s.toLowerCase());
  const has = (...names) => names.every(n => c.includes(n));
  if (has('#', 'date', 'score', 'report')) return 'evaluated';
  if (has('#', 'company', 'applied') && (c.includes('cover letter') || c.includes('cv'))) return 'email';
  if (has('company', 'outcome') && !c.includes('#')) return 'outcome';
  return null;
}

function isSeparatorRow(line) {
  const t = line.trim();
  return t.startsWith('|') && /-/.test(t) && /^\|[\s:|-]+\|?$/.test(t);
}

/**
 * Parse applications.md content into per-table structures.
 *
 * @param {string} content
 * @returns {{
 *   lines: string[],
 *   rows: Array<{lineIndex:number, table:string|null, kind:'header'|'separator'|'data', cells:string[], raw:string}>,
 *   evaluated: Array<object>, email: Array<object>, outcome: Array<object>,
 *   headerCells: {evaluated:number|null, email:number|null, outcome:number|null},
 *   separatorIndex: {evaluated:number|null, email:number|null, outcome:number|null},
 *   allIds: number[], maxId: number,
 *   tableOf: (string|null)[]
 * }}
 */
export function parseApplicationsTables(content) {
  const lines = content.split('\n');
  const rows = [];
  const tableOf = new Array(lines.length).fill(null);
  const evaluated = [], email = [], outcome = [];
  const headerCells = { evaluated: null, email: null, outcome: null };
  const separatorIndex = { evaluated: null, email: null, outcome: null };
  const allIds = [];

  let current = null; // table type of the block we are currently inside

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.startsWith('|')) {
      // Blank line, heading, or prose — ends the current table block.
      current = null;
      continue;
    }

    const cells = line.split('|').map(s => s.trim());

    if (isSeparatorRow(line)) {
      if (current) {
        separatorIndex[current] = i;
        tableOf[i] = current;
        rows.push({ lineIndex: i, table: current, kind: 'separator', cells, raw: line });
      }
      continue;
    }

    const headerType = detectHeader(cells);
    if (headerType) {
      current = headerType;
      headerCells[headerType] = cells.length;
      tableOf[i] = headerType;
      rows.push({ lineIndex: i, table: headerType, kind: 'header', cells, raw: line });
      continue;
    }

    // Data row of whatever table we are currently inside.
    tableOf[i] = current;
    const row = { lineIndex: i, table: current, kind: 'data', cells, raw: line };
    rows.push(row);

    if (current === 'evaluated') {
      const num = parseInt(cells[1]);
      const entry = {
        lineIndex: i, raw: line, num: isNaN(num) ? null : num,
        date: cells[2], company: cells[3], role: cells[4],
        score: cells[5], status: cells[6], pdf: cells[7],
        report: cells[8], notes: cells[9] || '',
      };
      evaluated.push(entry);
      if (entry.num != null) allIds.push(entry.num);
    } else if (current === 'email') {
      const num = parseInt(cells[1]);
      const entry = {
        lineIndex: i, raw: line, num: isNaN(num) ? null : num,
        company: cells[2], role: cells[3], applied: cells[4],
        cv: cells[5], coverLetter: cells[6], status: cells[7], notes: cells[8] || '',
      };
      email.push(entry);
      if (entry.num != null) allIds.push(entry.num);
    } else if (current === 'outcome') {
      outcome.push({
        lineIndex: i, raw: line,
        company: cells[1], role: cells[2], outcome: cells[3] || '',
      });
    }
  }

  const maxId = allIds.length ? Math.max(...allIds) : 0;
  return { lines, rows, evaluated, email, outcome, headerCells, separatorIndex, allIds, maxId, tableOf };
}

// Canonical status vocabularies. The two tracker tables use DIFFERENT sets.
export const EVALUATED_STATUSES = ['evaluated', 'applied', 'responded', 'interview', 'offer', 'rejected', 'discarded', 'skip'];
export const EMAIL_STATUSES = ['submitted', 'active', 'rejected', 'filled', 'expired', 'issue', 'blocked'];
