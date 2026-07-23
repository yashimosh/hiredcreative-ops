#!/usr/bin/env node
/**
 * build-company-crm.mjs — Remote-jobs Company CRM (mirrors the KRI leads CRM).
 *
 * Turns the job search from "react to postings" into "cultivate a portfolio of
 * monitored companies." Reads every role ever seen (applications.md + pipeline.md
 * + reports) and builds:
 *   - data/companies/{slug}.md   per-company intel file (ATS, archetypes, roles
 *                                seen over time, application history, fit, comp)
 *   - data/companies.md          dashboard table
 *   - data/discovered-companies.tsv   ATS companies to auto-monitor daily
 *
 * The discovery loop: every company encountered becomes a permanent monitored
 * asset. scan-discovered.mjs then hits each one's ATS API every day.
 *
 * Usage: node scripts/build-company-crm.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPANIES_DIR = resolve(ROOT, 'data/companies');
mkdirSync(COMPANIES_DIR, { recursive: true });
const read = (p) => (existsSync(resolve(ROOT, p)) ? readFileSync(resolve(ROOT, p), 'utf8') : '');

const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
function atsOf(url) {
  if (/jobs\.ashbyhq\.com/i.test(url)) return ['ashby', (url.match(/ashbyhq\.com\/([^/]+)/i) || [])[1]];
  if (/(job-boards|boards)\.greenhouse\.io/i.test(url)) return ['greenhouse', (url.match(/greenhouse\.io\/([^/]+)/i) || [])[1]];
  if (/jobs\.lever\.co/i.test(url)) return ['lever', (url.match(/lever\.co\/([^/]+)/i) || [])[1]];
  if (/\.workable\.com/i.test(url)) return ['workable', (url.match(/\/\/([^.]+)\.workable/i) || [])[1]];
  if (/\.teamtailor\.com/i.test(url)) return ['teamtailor', (url.match(/\/\/([^.]+)\.teamtailor/i) || [])[1]];
  return ['custom', null];
}
function archetype(role) {
  const t = (role || '').toLowerCase();
  if (/creative director|head of creative/.test(t)) return 'Creative Director';
  if (/head of brand|brand director/.test(t)) return 'Head of Brand';
  if (/design director|head of design|director of design/.test(t)) return 'Design Director';
  if (/design manager/.test(t)) return 'Design Manager';
  if (/art director/.test(t)) return 'Art Director';
  if (/motion/.test(t)) return 'Motion';
  if (/brand designer|brand identity/.test(t)) return 'Brand Designer';
  if (/graphic designer/.test(t)) return 'Graphic Designer';
  if (/visual designer/.test(t)) return 'Visual Designer';
  return 'Other';
}

// ── Gather roles from tracker + pipeline ──────────────────────
const companies = {}; // slug -> {name, ats, atsSlug, careers, roles:[], applied:[], statuses:Set}
function add(name, role, url, score, status, date) {
  if (!name || name === '?' ) return;
  const slug = slugify(name);
  if (!slug) return;
  const c = companies[slug] || (companies[slug] = { name, slug, ats: 'custom', atsSlug: null, careers: '', roles: [], statuses: new Set(), firstSeen: date, lastSeen: date });
  const [ats, atsSlug] = atsOf(url || '');
  if (ats !== 'custom') { c.ats = ats; c.atsSlug = atsSlug; }
  if (url && (url.includes('/careers') || url.includes('ashbyhq') || url.includes('greenhouse') || url.includes('lever')) && !c.careers) c.careers = url;
  c.roles.push({ role, url, score, status, date });
  if (status) c.statuses.add(status);
  if (date) { if (!c.firstSeen || date < c.firstSeen) c.firstSeen = date; if (!c.lastSeen || date > c.lastSeen) c.lastSeen = date; }
}

// applications.md (rich — has status, score, dates, notes)
for (const line of read('data/applications.md').split('\n')) {
  if (!line.startsWith('|')) continue;
  const c = line.split('|').map((x) => x.trim());
  if (!/^\d+$/.test(c[1] || '')) continue;
  const url = (c[9] || '').match(/https?:\/\/[^ |)\n]+/)?.[0] || '';
  add(c[3], c[4], url, c[5], (c[6] || '').replace(/\*\*/g, ''), c[2]);
}
// pipeline.md (urls + company + role)
for (const line of read('data/pipeline.md').split('\n')) {
  const m = line.match(/^- \[[ x!]\]\s*(https?:\/\/\S+)\s*\|\s*([^|]+)\|\s*(.+)$/);
  if (m) add(m[2].trim(), m[3].trim(), m[1].replace(/[)\s|]+$/, ''), '', 'Pipeline', '');
}

// ── Write per-company files ───────────────────────────────────
const list = Object.values(companies).sort((a, b) => b.roles.length - a.roles.length);
for (const c of list) {
  const archetypes = [...new Set(c.roles.map((r) => archetype(r.role)))].filter((a) => a !== 'Other');
  const applied = c.roles.filter((r) => /Applied|Interview|Offer|Rejected/i.test(r.status));
  const fit = applied.length ? '★ engaged' : (archetypes.length ? 'prospect' : 'low');
  let md = `# ${c.name}\n\n`;
  md += `- **Slug:** ${c.slug}\n- **ATS:** ${c.ats}${c.atsSlug ? ` (\`${c.atsSlug}\`)` : ''}\n`;
  md += `- **Careers:** ${c.careers || '—'}\n`;
  md += `- **Archetypes hired:** ${archetypes.join(', ') || '—'}\n`;
  md += `- **Roles seen:** ${c.roles.length}  ·  **Fit:** ${fit}\n`;
  md += `- **First seen:** ${c.firstSeen || '—'}  ·  **Last seen:** ${c.lastSeen || '—'}\n\n`;
  md += `## Roles seen\n| Date | Role | Score | Status |\n|------|------|-------|--------|\n`;
  for (const r of c.roles.slice(0, 40)) md += `| ${r.date || '—'} | ${r.role} | ${r.score || '—'} | ${r.status || '—'} |\n`;
  md += `\n## Notes\n_Auto-built. Add comp range, intl-contractor policy, OFAC notes, contacts here — preserved across rebuilds if under a "## Notes (manual)" heading._\n`;
  // preserve a manual notes block if it exists
  const existing = read(`data/companies/${c.slug}.md`);
  const manual = existing.match(/## Notes \(manual\)[\s\S]*/);
  if (manual) md += '\n' + manual[0];
  writeFileSync(resolve(COMPANIES_DIR, `${c.slug}.md`), md);
}

// ── Dashboard ─────────────────────────────────────────────────
let dash = `# Remote-Jobs Company CRM\n\n${list.length} companies tracked · auto-built from every role seen.\n\n`;
dash += `| Company | ATS | Archetypes | Roles | Applied | Fit |\n|---------|-----|-----------|-------|---------|-----|\n`;
for (const c of list) {
  const archetypes = [...new Set(c.roles.map((r) => archetype(r.role)))].filter((a) => a !== 'Other');
  const applied = c.roles.filter((r) => /Applied|Interview|Offer|Rejected/i.test(r.status)).length;
  dash += `| [${c.name}](companies/${c.slug}.md) | ${c.ats} | ${archetypes.slice(0, 3).join(', ') || '—'} | ${c.roles.length} | ${applied || '—'} | ${applied ? '★' : (archetypes.length ? '○' : '·')} |\n`;
}
writeFileSync(resolve(ROOT, 'data/companies.md'), dash);

// ── Discovered ATS companies → auto-monitor list ──────────────
const ats = list.filter((c) => c.ats !== 'custom' && c.atsSlug);
const tsv = ats.map((c) => `${c.name}\t${c.ats}\t${c.atsSlug}\t${c.careers}`).join('\n');
writeFileSync(resolve(ROOT, 'data/discovered-companies.tsv'), tsv + '\n');

console.log(JSON.stringify({ companies: list.length, ats_monitored: ats.length, dashboard: 'data/companies.md' }));
