# Mode: companies — Remote-Jobs Company CRM

## Purpose

The remote-jobs equivalent of the KRI leads CRM. Instead of reacting to individual postings, **cultivate a portfolio of monitored companies.** Every company ever encountered becomes a permanent intel asset — its ATS, the archetypes it hires, roles seen over time, your application history, fit. The discovery loop feeds it automatically; the auto-monitor checks each one's ATS daily.

## Step 1 — Refresh the CRM

```bash
node build-company-crm.mjs    # rebuild per-company files + dashboard from all roles seen
```

This reads `data/applications.md` + `data/pipeline.md` and writes:
- `data/companies.md` — dashboard table
- `data/companies/{slug}.md` — per-company intel files
- `data/discovered-companies.tsv` — the ATS companies the auto-monitor checks daily

## Step 2 — Show the dashboard

Read `data/companies.md` and present it. Sort/highlight by:
- **★ engaged** — companies you've applied to (with outcomes)
- **○ prospect** — companies that hire your archetypes, not yet applied
- **Roles count** — how active they are in your space

For a specific company: read `data/companies/{slug}.md` for the full intel (ATS, archetypes, roles-seen timeline, application history).

## Step 3 — Enrich (optional)

A company file has an auto-built section + a preserved `## Notes (manual)` block. Add by hand (or research on request):
- Comp range, remote policy specifics, international-contractor friendliness
- OFAC/citizenship considerations
- Contacts (recruiters, design leads), referral paths
- Hiring cadence ("posts brand roles ~quarterly")

Anything under `## Notes (manual)` survives rebuilds.

## How it grows itself (the discovery loop)

1. `source-sweep` / scans find roles → `build-company-crm` folds new companies in
2. ATS companies → `data/discovered-companies.tsv`
3. `scan-discovered.mjs` hits each one's ATS API **every day** (zero LLM cost) → catches new openings at monitored companies before they're posted elsewhere
4. New roles → pipeline → evaluated → surfaced

So the monitored set **compounds**: every company you encounter is watched forever.

## Sub-commands

- `companies` — show the dashboard (default)
- `companies {slug}` — show one company's intel file
- `companies refresh` — rebuild the CRM (`build-company-crm.mjs`)
- `companies monitor` — run the daily ATS sweep now (`scan-discovered.mjs`)

## Notes

- Read-only view by default; `refresh`/`monitor` run the scripts.
- The CRM data (`data/companies/`, `discovered-companies.tsv`) is machine-local (gitignored).
- This is the **strategic layer** above the tactical apply pipeline — it answers "which companies are worth my attention?" not just "what's open today?"
