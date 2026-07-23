# auto-loop — Autonomous Scan → Evaluate → Submit → Learn

## What this mode does

Runs continuously. Each iteration:
1. Scans portals for new job listings
2. Evaluates every new listing — no score gate (report + PDF + TSV for all, per `modes/_profile.md` § Application Quality Gate)
3. Generates tailored CVs and drafts application responses for every non-Hard-SKIP listing
4. Submits via browser automation (auto-submit mode) — **gated**, see below
5. Logs results to tracker
6. Runs pattern analysis and updates _profile.md with learnings
7. Sleeps until next scan window, then repeats

**Score gate:** There is no gate on evaluation, report, PDF, or draft generation — every listing that
isn't Hard SKIP gets the full treatment (this changed 2026-07-17; do not reintroduce a threshold here).
The **only** numeric gate left anywhere in the system is on Phase 5 (Auto-Submit), because this is the
one mode that fires an application with no one in the loop to give a go-ahead first. That number is
**not hardcoded in this file** — read it fresh from `modes/_profile.md` § "Application Quality Gate" →
"auto-loop is the one exception" every time this mode runs, and use whatever value is written there
(currently score > 2.0/5). If this file and `_profile.md` ever disagree, `_profile.md` wins — fix this
file, don't argue with it.

---

## Required reads before starting each iteration

Always read these before doing anything:

1. `config/profile.yml` — candidate identity, tracks, comp targets
2. `modes/_profile.md` — archetypes, scoring adjustments, learnings
3. `modes/_shared.md` — scoring system, block definitions
4. `data/scan-history.tsv` — what's already been scanned (dedup reference)
5. `data/applications.md` — what's already applied (skip duplicates)
6. `data/pipeline.md` — URLs already queued but not yet processed

---

## Iteration Flow

### Phase 1: Process Existing Pipeline

Before scanning for new listings, check `data/pipeline.md` for URLs that haven't been processed yet.

For each unprocessed URL:
- Fetch the job posting (use Playwright: navigate → snapshot → read content)
- Run full evaluation (Blocks A-G)
- Write report to `reports/{###}-{slug}-{date}.md`
- Write TSV to `batch/tracker-additions/{###}-{slug}.tsv`
- Always generate CV + draft responses (Phase 4), regardless of score — the score gate (read from
  `modes/_profile.md`) applies only to Phase 5 auto-submit, not to generation
- Mark URL as processed in pipeline.md (add "// evaluated" comment inline)

### Phase 2: Scan Portals

Run the portal scanner:

```bash
node scan.mjs
```

This:
- Hits Greenhouse/Ashby/Lever/TeamTailor/Workable APIs for all companies in portals.yml
- Compares against scan-history.tsv (dedup)
- Writes new URLs to data/pipeline.md
- Updates scan-history.tsv

If scan.mjs is unavailable or errors, use WebFetch to hit the APIs directly:
- Greenhouse: `https://boards-api.greenhouse.io/v1/boards/{company}/jobs`
- Ashby: `https://jobs.ashbyhq.com/{company}/api/jobPostings`
- Lever: `https://api.lever.co/v0/postings/{company}?mode=json`

Filter results against `portals.yml` (title_filter.positive / title_filter.negative) and scan-history.tsv.

### Phase 3: Evaluate New Listings

For each new URL found in Phase 2:

1. **Quick screen** (10 seconds): Is this obviously a different function entirely (e.g., "Junior iOS Developer", "Backend Engineer")? Skip only that kind of clear category mismatch. **Do NOT skip on seniority/title alone** — a plain "Graphic Designer" or "Senior Designer" posting is on-archetype (see `modes/_profile.md` § "IC-Level Roles — Explicit Anti-Bias Rule"), not a reason to quick-skip.

2. **Full evaluation**: Fetch the JD, run Blocks A-G scoring per modes/_shared.md and modes/_profile.md.

3. **Write report**: `reports/{###}-{slug}-{YYYY-MM-DD}.md`
   - Report number = max existing report number + 1
   - Legitimacy check REQUIRED (Block G)

4. **Write TSV**: `batch/tracker-additions/{###}-{slug}.tsv`
   - Status = "Evaluated" initially

5. **No gate here** — always continue to Phase 4 for CV + draft generation, regardless of score. The
   only score gate in this mode is on Phase 5 auto-submit (see the top of this file / `_profile.md`).

### Phase 4: Generate CV + Draft Application

For every listing that isn't Hard SKIP (no score gate — see `_profile.md`):

**CV generation:**
1. Determine track from Phase 3 evaluation
2. Load `cv.md` + `article-digest.md` (if exists)
3. Determine CV angle from report Section E (Customization Plan)
4. Generate tailored HTML CV based on the template pattern used for previous CVs:
   - A4 format (210mm) for EU/relocation roles
   - Letter format (8.5in) for US roles
   - Location/contact framing from `config/profile.yml` (per-track override in `modes/_profile.md` if set)
   - Summary and competencies tuned to the role
   - Zero em-dashes (—) or en-dashes (–) — ATS normalization will catch them but fix proactively
5. Save to `/tmp/cv-{slug}.html`
6. Run `node generate-pdf.mjs /tmp/cv-{slug}.html output/cv-{slug}-{date}.pdf --format={a4|letter}`
7. Confirm the PDF landed in `output/` at repo root (generate-pdf.mjs already writes there)
8. If ATS normalization reports > 0 replacements: fix the HTML and regenerate until clean

**Application drafting:**
- Cover letter / motivation text (corpus voice: Clarkson confessional grammar, Louie radical honesty, anti-polish register)
- Anti-slop check: zero em-dashes, zero en-dashes, no triadic constructions, no aphorism closers, no "Not X. Not Y. Just Z.", no spiritual abstractions
- Anchors over abstractions: numbers, tools, dates, specific outcomes
- Answers to any custom questions visible in the JD
- Start date: "Immediately" (remote) / "September 2026 or upon visa confirmation" (relocation)
- Salary: use comp range from profile.yml for the track

### Phase 5: Auto-Submit

**Gate check (the one remaining numeric gate in this system):** read `modes/_profile.md` §
"Application Quality Gate" → "auto-loop is the one exception" for the current threshold (currently
score > 2.0/5). Only packages clearing that number proceed to auto-submit; everything else stays at
"Evaluated" with the CV/drafts already generated and waiting, so the user can submit manually anytime.

For each application package that cleared the gate:

1. Read `modes/auto-submit.md` for the full submission procedure
2. Execute the submission via Chrome MCP browser tools
3. Log submission result (submitted / failed / manual_required)
4. Update the TSV with final status:
   - submitted → status = "Applied", pdf = ✅
   - failed/manual_required → status = "Evaluated", add note
5. Update report PDF field: `**PDF:** output/cv-{slug}-{date}.pdf`

### Phase 6: Merge + Learn

After each batch:

```bash
node merge-tracker.mjs
```

Then run pattern analysis:

```bash
node analyze-patterns.mjs 2>/dev/null || true
```

**Self-learning update to _profile.md:**

Read `data/applications.md` and identify:
- Roles that got interviews (status = "Interview") since last iteration
- Roles that got rejected (status = "Rejected") since last iteration
- Response rate by archetype and company type

If patterns emerge (e.g., "CD roles at AI-native companies getting 3x response rate"), add a note under `## Application Learnings (active)` in `modes/_profile.md`:

```markdown
- **{date}:** {pattern observed}. {Scoring adjustment if any.}
```

Keep the learnings section under 10 bullets — remove the oldest when adding new ones.

Also update `data/follow-ups.md`: any Applied roles that are 7+ days old with no response should be flagged for follow-up.

### Phase 7: Sleep

After the iteration completes, calculate when to run next:

- If 5+ new listings were evaluated this iteration → scan again in 2 days
- If 0-4 new listings → scan again in 3 days
- If errors or scan failed → retry in 24 hours

Use ScheduleWakeup to self-pace. Pass the same `/hiredcreative-ops auto-loop` prompt back.

---

## Loop State Tracking

Write current loop state to `data/auto-loop-state.json` after each phase:

```json
{
  "last_scan": "2026-06-22T14:30:00Z",
  "last_iteration_complete": "2026-06-22T15:45:00Z",
  "next_scan_due": "2026-06-25T14:30:00Z",
  "iterations_complete": 1,
  "total_evaluated": 47,
  "total_submitted": 12,
  "total_failed": 2,
  "total_manual_required": 1,
  "last_learnings_update": "2026-06-22T15:45:00Z"
}
```

Read this at the start of each iteration to resume correctly after a wake.

---

## Error Handling

| Error | Action |
|-------|--------|
| scan.mjs fails | Log error, fall back to WebFetch API calls, continue |
| generate-pdf.mjs fails | Skip CV for this listing, log MANUAL_REQUIRED |
| Browser not available | Skip submission for this listing, log MANUAL_REQUIRED |
| CAPTCHA on form | Log MANUAL_REQUIRED, continue to next |
| Duplicate detected (already in tracker) | Skip silently |
| All portals return 0 new listings | Normal — sleep until next scan window |
| More than 10 new listings in one scan | Cap at 10 per iteration to avoid overloading; process remainder next iteration |

---

## Loop Start Procedure

On first run (no `data/auto-loop-state.json`):
1. Read existing `data/applications.md` to understand current state
2. Check `data/pipeline.md` for any backlog
3. Run a full scan immediately (don't wait)
4. Set iteration count = 0
5. Write initial state file
6. Proceed with Phase 1

On resume (state file exists):
1. Read state file
2. Check if `next_scan_due` has passed
3. If yes: run full iteration
4. If no: log "Next scan due at {time}" and schedule wake accordingly

---

## Output Summary (end of each iteration)

Print a brief summary:

```
auto-loop iteration #{n} complete — {date}
  Scanned: {n} portals
  New listings: {n}
  Evaluated: {n} (cleared auto-submit gate: {n})
  Submitted: {n} | Failed: {n} | Manual required: {n}
  Learnings updated: {yes/no}
  Next scan: {date}
```
