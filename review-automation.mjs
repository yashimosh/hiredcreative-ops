#!/usr/bin/env node

/**
 * review-automation.mjs — What did the automation do?
 *
 * Summarizes hiredcreative-ops automation activity by analyzing:
 *   - git log (auto-sync commits from the scheduled automation)
 *   - data/applications.md (status changes, new evaluations)
 *   - reports/ (new evaluation reports)
 *   - output/ready-to-apply/ (pending apply packages)
 *   - logs/cron.log (phase execution + errors)
 *
 * Usage:
 *   node review-automation.mjs [--since=YYYY-MM-DD] [--days=N]
 *
 * Defaults to the last 3 days if no range given.
 * Outputs JSON for the review mode to format.
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;

// ── Parse args ────────────────────────────────────────────────
const args = process.argv.slice(2);
let sinceDate = null;
let days = 3;
for (const a of args) {
  if (a.startsWith('--since=')) sinceDate = a.slice(8);
  else if (a.startsWith('--days=')) days = parseInt(a.slice(7), 10) || 3;
}

// Compute the --since date for git (git accepts both ISO dates and relative)
const gitSince = sinceDate || `${days} days ago`;

// ── Helpers ───────────────────────────────────────────────────
function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function safeRead(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

// ── 1. Git commit timeline ────────────────────────────────────
// Find auto-sync commits + any commits in the window
const logRaw = git(`log --since="${gitSince}" --pretty=format:"%H|%ai|%s" --no-merges`);
const commits = logRaw
  ? logRaw.split('\n').map((line) => {
      const [hash, date, ...subjParts] = line.split('|');
      const subject = subjParts.join('|');
      return {
        hash: hash?.slice(0, 8),
        date: date?.split(' ')[0],
        time: date?.split(' ')[1]?.slice(0, 5),
        subject,
        isAuto: /^(auto|track):/i.test(subject || ''),
      };
    })
  : [];

const autoCommits = commits.filter((c) => c.isAuto);

// ── 2. Files changed in the window ────────────────────────────
const filesChanged = git(`log --since="${gitSince}" --name-only --pretty=format: --no-merges`)
  .split('\n')
  .map((f) => f.trim())
  .filter(Boolean);

const newReports = [...new Set(filesChanged.filter((f) => f.startsWith('reports/') && f.endsWith('.md')))];
const trackerTouched = filesChanged.includes('data/applications.md');
const pipelineTouched = filesChanged.includes('data/pipeline.md');

// ── 3. Parse applications.md for current state ────────────────
const appsRaw = safeRead(resolve(ROOT, 'data/applications.md'));
const appRows = appsRaw
  .split('\n')
  .filter((l) => l.startsWith('|') && !l.startsWith('| #') && !l.startsWith('|---'))
  .map((l) => {
    const cols = l.split('|').map((c) => c.trim());
    // | # | Date | Company | Role | Score | Status | PDF | Report | Notes |
    return {
      num: cols[1],
      date: cols[2],
      company: cols[3],
      role: cols[4],
      score: cols[5],
      status: cols[6],
      notes: cols[9] || '',
    };
  })
  .filter((r) => r.num);

// Status counts
const statusCounts = {};
for (const r of appRows) statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;

// ── 4. Recent status changes (from notes containing recent dates) ──
// Look at applications whose notes mention a date in the window
const windowStart = sinceDate
  ? new Date(sinceDate)
  : new Date(Date.now() - days * 86400000);

function noteDate(notes) {
  // Find a YYYY-MM-DD in the notes
  const m = notes.match(/(\d{4}-\d{2}-\d{2})/);
  return m ? new Date(m[1]) : null;
}

const recentRejections = appRows.filter(
  (r) => r.status === 'Rejected' && noteDate(r.notes) && noteDate(r.notes) >= windowStart
);
const recentApplied = appRows.filter(
  (r) => r.status === 'Applied' && noteDate(r.notes) && noteDate(r.notes) >= windowStart
);
const recentInterviews = appRows.filter(
  (r) => (r.status === 'Interview' || r.status === 'Responded' || r.status === 'Offer')
);

// ── 5. Apply-list (Evaluated, not yet applied — no score floor per _profile.md
//      § Application Quality Gate; score is informational sort key only) ──
function scoreNum(s) {
  const m = (s || '').match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}
const applyList = appRows
  .filter((r) => r.status === 'Evaluated')
  .sort((a, b) => scoreNum(b.score) - scoreNum(a.score));

// ── 6. Pending pipeline count ─────────────────────────────────
const pipelineRaw = safeRead(resolve(ROOT, 'data/pipeline.md'));
const pendingPipeline = (pipelineRaw.match(/^- \[ \]/gm) || []).length;

// ── 7. Ready-to-apply packages ────────────────────────────────
const readyDir = resolve(ROOT, 'output/ready-to-apply');
let readyPackages = [];
if (existsSync(readyDir)) {
  readyPackages = readdirSync(readyDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ file: f, mtime: statSync(resolve(readyDir, f)).mtime.toISOString().slice(0, 10) }))
    .sort((a, b) => b.mtime.localeCompare(a.mtime))
    .slice(0, 5);
}

// ── 8. Cron log — last errors ─────────────────────────────────
const cronLog = safeRead(resolve(ROOT, 'logs/cron.log'));
const cronLines = cronLog.split('\n').filter(Boolean);
const recentErrors = cronLines.filter((l) => /\[ERROR\]/i.test(l)).slice(-5);
const lastPhases = cronLines.filter((l) => /=== Phase:/i.test(l)).slice(-10);

// ── Output ────────────────────────────────────────────────────
const summary = {
  window: { since: gitSince, computed_start: windowStart.toISOString().slice(0, 10) },
  git: {
    total_commits: commits.length,
    auto_commits: autoCommits.length,
    commit_timeline: commits.slice(0, 20).map((c) => ({
      date: c.date,
      time: c.time,
      subject: c.subject,
      auto: c.isAuto,
    })),
  },
  activity: {
    new_reports: newReports.length,
    new_report_files: newReports.slice(0, 30),
    tracker_touched: trackerTouched,
    pipeline_touched: pipelineTouched,
    pending_pipeline: pendingPipeline,
  },
  changes: {
    recent_applied: recentApplied.map((r) => `#${r.num} ${r.company} — ${r.role} (${r.score})`),
    recent_rejections: recentRejections.map((r) => `#${r.num} ${r.company} — ${r.role}`),
    active_interviews: recentInterviews.map((r) => `#${r.num} ${r.company} — ${r.role} [${r.status}]`),
  },
  apply_list: applyList.slice(0, 15).map((r) => ({
    num: r.num,
    company: r.company,
    role: r.role,
    score: r.score,
  })),
  ready_packages: readyPackages,
  tracker_totals: statusCounts,
  health: {
    recent_errors: recentErrors,
    last_phases: lastPhases,
  },
};

console.log(JSON.stringify(summary, null, 2));
