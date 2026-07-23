# Mode: linkedin — LinkedIn Authenticated Lead Scan

Scrapes LinkedIn's personalized job surfaces using an active browser session:
notifications (job alerts) + Jobs page (4 recommendation sections).
Adds qualifying URLs to `data/pipeline.md` for evaluation.

Run this **on-demand** whenever LinkedIn is open. Does NOT run during daily/weekly automated scans.

> **Requires:** Chrome MCP with an active LinkedIn session (`mcp__Claude_in_Chrome__*`).
> If LinkedIn is not open or no session is detected → abort with message, do not proceed.

---

## Pre-flight check

1. Use `mcp__Claude_in_Chrome__list_connected_browsers` or `mcp__Claude_in_Chrome__navigate` to confirm a browser is available
2. Navigate to `https://www.linkedin.com/feed` and confirm the user is logged in (presence of nav bar with "Me", no login prompt)
3. If not logged in → stop: `"LinkedIn session not found. Open LinkedIn in Chrome and run /hiredcreative-ops linkedin again."`

---

## Part A — Notifications (Job Alerts)

**URL:** `https://www.linkedin.com/notifications/?filter=all`

1. Navigate to the notifications page
2. Read page content to find job alert notifications. These look like:
   - `"{keyword}: new opportunity in {location}"` + "View job" button
   - `"{keyword}: new opportunities in {location}"` + "View jobs" button
   - Any card with a job-related icon and a "View job(s)" CTA
3. For each job alert notification found (max 6, newest first):
   a. Click "View job" / "View jobs"
   b. Wait for the job list page to load (`linkedin.com/jobs/search/?alertAction=viewjobs&...`)
   c. Read all visible job cards: extract title, company, location, job URL
   d. If there are more results, scroll down once to load more
   e. Collect all URLs from this list
   f. Navigate back to notifications page
4. Record total: how many notifications found, how many job URLs collected

---

## Part B — Jobs Page (4 Recommendation Sections)

**URL:** `https://www.linkedin.com/jobs/`

Navigate and read content from all 4 sections in priority order:

### 1. "Top job picks for you"
- Highest relevance signal — LinkedIn matched these to your profile
- Extract all visible job cards: title, company, location, URL
- If "Show all →" is present, click and read the expanded list (max 20)

### 2. "Jobs where you're more likely to hear back" (LinkedIn Premium)
- High apply-success signal
- Extract all visible cards
- If "Show all →" click and expand (max 20)

### 3. "Explore with job collections"
- Look for sub-tabs: "Remote", "Easy Apply"
- Click "Remote" tab → extract all cards
- Click "Easy Apply" tab → extract all cards
- Skip other tabs (Part-time, etc.) unless they show CD/Brand/Design titles

### 4. "More jobs for you"
- High volume, lower signal — still worth scanning
- Extract first 20 visible cards only (don't paginate heavily)

---

## Filtering (apply before dedup)

For every collected URL / job card, discard immediately if:

| Condition | Rule |
|-----------|------|
| Location shows "United States" or any US state/city without "Remote" | SKIP — citizenship hard block |
| Location shows "Remote" but company is in US only | SKIP — confirm in JD if unsure |
| Job card or company name is in **Turkish language** | SKIP — Turkish-language workplace hard block |
| Title contains any word from `portals.yml → title_filter.negative` | SKIP |
| Title contains NONE of `portals.yml → title_filter.positive` | SKIP |
| URL already in `data/scan-history.tsv` | SKIP (dup) |
| URL already in `data/pipeline.md` | SKIP (dup) |
| URL already in `data/applications.md` | SKIP (already evaluated) |

---

## Dedup + Output

1. Load `data/scan-history.tsv`, `data/pipeline.md`, `data/applications.md`
2. Remove any URL already present in these sources
3. For each **new, qualifying** URL:
   - Append to `data/pipeline.md` under today's date section:
     ```
     - [ ] {url} | {company} | {title} | {location}
     ```
   - Append to `data/scan-history.tsv`:
     ```
     {url}	{YYYY-MM-DD}	LinkedIn-{source}	{title}	{company}	added
     ```
     (source = `Notifications` or `Jobs-TopPicks` or `Jobs-HearBack` or `Jobs-Collections` or `Jobs-More`)

---

## Output Summary

```
LinkedIn Lead Scan — {YYYY-MM-DD}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Notifications scanned: N job alerts
Jobs page sections: Top picks · Hear back · Collections · More

Raw collected: N URLs
  Filtered (US location): N
  Filtered (title mismatch): N
  Filtered (Turkish language): N
  Duplicates: N

New added to pipeline.md: N
  + {company} | {title} | {location}
  ...

→ Run /hiredcreative-ops pipeline to evaluate new roles.
```

---

## Notes

- This mode is **on-demand only** — run it when you have LinkedIn open and want to harvest its recommendations
- LinkedIn refreshes recommendations every few hours; running 1–2x per day is enough
- Does NOT replace `/hiredcreative-ops scan` (portal scan) — they cover different signal sources
- If a section is missing (e.g. "Jobs where you're more likely to hear back" not visible) → skip silently and continue
