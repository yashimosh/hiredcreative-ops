# Mode: analytics — Complete Funnel Analytics

## Purpose

Show the **complete hiredcreative-ops funnel** — from raw scan volume all the way to outcomes. Unlike the tracker (which starts at "evaluated"), this includes the scan layer: the ~1,300 postings the scanner churned and auto-filtered before anything reached the tracker. Answers "how is the whole machine performing?"

## Step 1 — Run the analytics script

```bash
node analytics.mjs          # formatted dashboard
node analytics.mjs --json   # raw JSON for further analysis
```

It reads `data/scan-history.tsv` (scan layer) + `data/applications.md` (tracker layer) and computes:

| Section | Contents |
|---------|----------|
| **Full funnel** | scan events → unique assessed → survived title filter → passed auto-filters → evaluated → applied → interviews → offers |
| **Status** | breakdown across SKIP / Applied / Evaluated / Discarded / Rejected |
| **Outcomes** | submitted, rejection rate, interviews, offers, awaiting |
| **Scores** | distribution + avg + counts ≥4.0 / ≥4.5 |
| **Archetype** | clustered on role title (Brand Designer, Creative Director, Art Director, …) with apply-rate per family |
| **Channel** | which ATS/method each submitted application used |
| **Rejections** | grouped by reason (right-to-work, position filled, other candidates, generic) |
| **Volume by week** | applications over time |
| **Bottleneck** | the one-line diagnosis of where the funnel is leaking |

## Step 2 — Present the dashboard

Show the formatted output. Then add a short, honest read of the data:
- Where is the funnel healthy vs leaking?
- Which archetype/channel/remote-policy converts best? (cross-reference `analyze-patterns.mjs` for remote-policy + company-size conversion)
- What's the single biggest lever?

## Step 3 — Actionable takeaways

End with 2-3 concrete recommendations grounded in the numbers, e.g.:
- "Art Director roles apply at 45% vs Design Director at 8% — lean into AD framing."
- "Geo-restricted = 0% conversion; the filter is correctly killing those."
- "0 interviews from 43 applications — the bottleneck is response quality, which the intelligence layer (research + tailored CV + QA) now targets."

## Notes

- **Archetype clustering** is by role-title keyword (reliable) — this fixes the old `analyze-patterns.mjs` bug where 106/159 classified as "Unknown."
- Pair with `analyze-patterns.mjs` for the conversion-by-remote-policy and conversion-by-company-size cuts (those live there, not in analytics.mjs).
- Read-only. Reports the numbers; changes nothing.
- Scan-layer numbers depend on `data/scan-history.tsv` being present (it's gitignored — lives on whichever machine ran the scans).
