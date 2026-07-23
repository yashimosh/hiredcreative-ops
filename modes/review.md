# Mode: review — Automation Activity Review

## Purpose

Answer the question: **"What has the automation done?"** Summarizes what the scheduled automation accomplished since the last check — new evaluations, status changes, rejections caught, apply-list, and pipeline health. This is the human's audit window into the headless pipeline.

## Inputs

- `git log` — auto-sync commits (the automation commits with `auto:` / `track:` prefixes)
- `data/applications.md` — current tracker state
- `reports/` — new evaluation reports
- `output/ready-to-apply/` — pending apply packages
- `logs/cron.log` — phase execution + errors (on your headless server, if any; may be absent locally)

## Step 1 — Run the analysis script

```bash
node review-automation.mjs --days=N
```

Default window is 3 days. The user can say "review last week" → `--days=7`, or "review since May 28" → `--since=2026-05-28`.

Parse the JSON output. Key sections:

| Section | Contents |
|---------|----------|
| `git.commit_timeline` | Chronological list of commits (auto + manual) in the window |
| `activity` | New reports count, pending pipeline, tracker/pipeline touched flags |
| `changes.recent_applied` | Applications submitted in the window |
| `changes.recent_rejections` | Rejections detected in the window |
| `changes.active_interviews` | Any roles in Interview/Responded/Offer status |
| `apply_list` | Evaluated roles ≥3.5 score waiting to be applied to |
| `ready_packages` | Pre-staged apply packages in output/ready-to-apply/ |
| `tracker_totals` | Status breakdown across the whole tracker |
| `health.recent_errors` | Last cron errors (if any) — surface these prominently |

## Step 2 — Present the review

Format as a clean, scannable dashboard. Lead with what's actionable (apply-list + new activity), end with health.

```
hiredcreative-ops Automation Review — {date range}

📋 WHAT HAPPENED ({N} auto-runs)
  {date} — {what the commit did}
  ...

✅ APPLIED ({N})
  #{num} {company} — {role} ({score})

❌ REJECTIONS ({N})
  #{num} {company} — {role}

🎯 APPLY LIST — ready for you ({N})
  {score} #{num} {company} — {role}

🆕 PIPELINE
  {N} new evaluations · {N} pending URLs awaiting eval

📊 TRACKER
  Applied {N} · Evaluated {N} · Rejected {N} · SKIP {N}

{if errors:}
⚠️ HEALTH — {N} errors in cron log
  {error lines}
{else:}
✅ HEALTH — no errors
```

## Step 3 — Offer next actions

After the review, suggest the obvious next step:
- If apply-list has items → "Want to apply to {top role}? It's a {score} match."
- If rejections came in → already tracked, no action needed.
- If health errors → surface the error and offer to investigate the cron log.
- If pending pipeline is large → "There are {N} URLs waiting. Tonight's cron will evaluate them, or I can blast through them now with `/hiredcreative-ops blast`."

## Notes

- This mode is **read-only** — it reports, it does not change state.
- Works both on your local machine (against the synced repo) and on a headless server (against live data), if you run one.
- The git log is the source of truth for "what the automation did" — every overnight run commits with a timestamp, so nothing happens silently.
- If `logs/cron.log` is absent (running locally, not on a headless server), the health section is skipped — that's expected.
