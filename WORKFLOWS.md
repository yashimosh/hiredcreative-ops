# WORKFLOWS — Master Map of hiredcreative-ops

One page: every workflow, which mode runs it, where its data lives, which library files it reads. If a session doesn't know where something belongs, it belongs here first.

```
scan → pipeline → oferta → apply → tracker → followup → interview-prep → negotiation (comp)
        └──────────────────────── library/ (methodology) ────────────────────────────────┘
```

## Jobs — find, evaluate, apply, track

**Sub-tracks** (identity + framing per sub-track in `modes/_profile.md`):
- **Remote** — remote-worldwide roles → `data/pipeline-remote.md`
- **Relocation** — visa-path roles in a new country → `data/pipeline-relocation.md`
- **Holding bucket** — roles you'll only pursue if a rare condition is met (e.g. a confirmed visa sponsor) → `data/pipeline-us.md` (rename/duplicate per market as needed)
- **Inbound** — recruiter approaches, referral-sourced roles, content-driven applications → `data/pipeline-inbound.md`

| Step | Mode | Data | Library |
|------|------|------|---------|
| Find | `scan` (weekly full sweep, includes the [Hired Creative](https://hiredcreative.com) integration), `linkedin` (on-demand authed scan) | `portals.yml`, `data/scan-rotation.yml`, `data/scan-history.tsv` | `lead-generation.md` |
| Triage | `pipeline`, `blast` (burst), `batch` | `data/pipeline.md` → `-remote` / `-relocation` / etc. | — |
| Track companies | `companies` (per-company CRM, ATS + archetypes + history) | `data/companies.md`, `data/companies/` | — |
| Evaluate | `oferta` (A-G blocks), `ofertas` (compare), `deep` (company research) | `reports/`, tracker TSVs | `positioning.md` (fit lens) |
| Apply | `apply`, `pdf` / `latex` (CV), `contacto` (LinkedIn contacts) | `output/{num}-{slug}/`, `data/applications.md` | `outreach.md` |
| Follow | `tracker`, `followup`, `patterns` (rejection analysis) | `data/follow-ups.md`, `analyze-patterns.mjs` | `outreach.md` §cadence |
| Interview | `interview-prep` | `interview-prep/` | `sales-conversations.md` |
| Close | `negotiation` (comp) | `modes/_profile.md` floors | `negotiation.md` |
| Review automation | `review` (what has the automated pipeline done since last check) | `data/applications.md`, `reports/`, `output/` | — |
| Full-funnel view | `analytics` (scan volume → evaluated → applied → outcomes) | `analytics.mjs` | — |

## Shared infrastructure

- **`library/`** — methodology layer (see `library/INDEX.md`; your own notes → `library/custom/`)
- **`modes/negotiation.md`** — comp/offer negotiation engine (BATNA reading, concede-scope-not-price)
- **`modes/_profile.md` + `config/profile.yml`** — identity, archetypes, floors (user layer, always wins)
- **Templates** — `templates/` (CV) · **Outputs** — `output/{num}-{slug}/`
- **Integrity scripts** — `merge-tracker.mjs`, `verify-pipeline.mjs`, `dedup-tracker.mjs`, `normalize-statuses.mjs`
- **Autonomous mode** — `auto-loop` (scan → evaluate → submit → learn, unattended) + `auto-submit` (ATS form submission)
