---
name: hiredcreative-ops
description: AI job search command center -- evaluate offers, generate CVs, scan portals, track applications
user_invocable: true
args: mode
argument-hint: "[scan | deep | pdf | oferta | ofertas | apply | batch | tracker | pipeline | contacto | training | project | interview-prep | update]"
---

# hiredcreative-ops -- Router

## Mode Routing

Determine the mode from `{{mode}}`:

| Input | Mode |
|-------|------|
| (empty / no args) | `discovery` -- Show command menu |
| JD text or URL (no sub-command) | **`auto-pipeline`** |
| `oferta` | `oferta` |
| `ofertas` | `ofertas` |
| `contacto` | `contacto` |
| `deep` | `deep` |
| `pdf` | `pdf` |
| `training` | `training` |
| `project` | `project` |
| `tracker` | `tracker` |
| `pipeline` | `pipeline` (inbox — all new URLs land here) |
| `pipeline remote` | `pipeline` with track filter = remote |
| `pipeline relocation` | `pipeline` with track filter = relocation |
| `apply` | `apply` |
| `scan` | `scan` (full weekly sweep, all tiles) |
| `scan remote` | `scan` with track filter = remote (tiles tagged `track: remote`, `track: both`, or untagged) |
| `scan relocation` | `scan` with track filter = relocation (tiles tagged `track: relocation` or `track: both`) |
| `batch` | `batch` |
| `patterns` | `patterns` |
| `analytics` | `analytics` (complete scan→outcome funnel) |
| `followup` | `followup` |
| `review` | `review` (what did the automation do?) |
| `blast` | `blast` (evaluate all pending pipeline URLs now) |
| `companies` (bare, or `companies {slug}` / `companies refresh` / `companies monitor`) | `companies` (remote-jobs company CRM) |
| `linkedin` | `linkedin` |
| `rotation` (any sub-command: `rotation`, `rotation status`, `rotation run {tile-id}`, `rotation list`) | `rotation` |
| `auto-loop` | `auto-loop` (autonomous scan → evaluate → submit → learn loop) |
| `auto-submit` | `auto-submit` (submit a single prepared application via browser) |

**Auto-pipeline detection:** If `{{mode}}` is not a known sub-command AND contains JD text (keywords: "responsibilities", "requirements", "qualifications", "about the role", "we're looking for", company name + role) or a URL to a JD, execute `auto-pipeline`.

If `{{mode}}` is not a sub-command AND doesn't look like a JD, show discovery.

---

## Discovery Mode (no arguments)

Show this menu:

```
hiredcreative-ops -- Command Center

Available commands:
  /hiredcreative-ops {JD}      → AUTO-PIPELINE: evaluate + report + PDF + tracker (paste text or URL)
  /hiredcreative-ops pipeline            → Process pending URLs from inbox (data/pipeline.md)
  /hiredcreative-ops pipeline remote     → Show remote-track pipeline
  /hiredcreative-ops pipeline relocation → Show relocation-track pipeline
  /hiredcreative-ops oferta    → Evaluation only A-F (no auto PDF)
  /hiredcreative-ops ofertas   → Compare and rank multiple offers
  /hiredcreative-ops contacto  → LinkedIn power move: find contacts + draft message
  /hiredcreative-ops deep      → Deep research prompt about company
  /hiredcreative-ops pdf       → PDF only, ATS-optimized CV
  /hiredcreative-ops training  → Evaluate course/cert against North Star
  /hiredcreative-ops project   → Evaluate portfolio project idea
  /hiredcreative-ops tracker   → Application status overview
  /hiredcreative-ops apply     → Live application assistant (reads form + generates answers)
  /hiredcreative-ops scan      → Scan portals and discover new offers
  /hiredcreative-ops batch     → Batch processing with parallel workers
  /hiredcreative-ops patterns  → Analyze rejection patterns and improve targeting
  /hiredcreative-ops analytics → Complete funnel: scan → evaluate → apply → outcome (+ archetype/channel/score)
  /hiredcreative-ops followup  → Follow-up cadence tracker: flag overdue, generate drafts
  /hiredcreative-ops review    → What did the automation do? (auto-runs, applies, rejections, apply-list, health)
  /hiredcreative-ops blast     → Evaluate all pending pipeline URLs now (don't wait for nightly cron)
  /hiredcreative-ops linkedin  → Harvest LinkedIn notifications + Jobs page (on-demand, needs browser open)
  /hiredcreative-ops rotation            → Run the next overdue scan tile (default scheduled scan)
  /hiredcreative-ops rotation status     → Show rotation coverage table — which tiles are overdue
  /hiredcreative-ops rotation run {tile} → Force-run a specific scan tile
  /hiredcreative-ops rotation list       → List all 20 scan tiles + their cadences

Inbox: add URLs to data/pipeline.md → /hiredcreative-ops pipeline
Or paste a JD directly to run the full pipeline.
```

---

## Context Loading by Mode

After determining the mode, load the necessary files before executing:

### Modes that require `_shared.md` + their mode file:
Read `modes/_shared.md` + `modes/{mode}.md`

Applies to: `auto-pipeline`, `oferta`, `ofertas`, `pdf`, `contacto`, `apply`, `pipeline`, `scan`, `batch`, `blast`, `linkedin`

### Standalone modes (only their mode file):
Read `modes/{mode}.md`

Applies to: `tracker`, `deep`, `training`, `project`, `patterns`, `analytics`, `followup`, `review`, `companies`

### Autonomous modes (read _shared.md + _profile.md + their mode file):
Read `modes/_shared.md` + `modes/_profile.md` + `config/profile.yml` + `modes/{mode}.md`

Applies to: `auto-loop`, `auto-submit`

For `auto-loop`: also read `data/auto-loop-state.json` (if exists) to resume correctly.

### Modes delegated to subagent:
For `scan`, `apply` (with Playwright), and `pipeline` (3+ URLs): launch as Agent with the content of `_shared.md` + `modes/{mode}.md` injected into the subagent prompt.

```
Agent(
  subagent_type="general-purpose",
  prompt="[content of modes/_shared.md]\n\n[content of modes/{mode}.md]\n\n[invocation-specific data]",
  description="hiredcreative-ops {mode}"
)
```

Execute the instructions from the loaded mode file.
