# Hired Creative Ops -- AI Job Search Pipeline

## Origin

Hired Creative Ops is a fork of [career-ops](https://github.com/santifer/career-ops), originally built by [santifer](https://santifer.io) to evaluate 740+ job offers, generate 100+ tailored CVs, and land a Head of Applied AI role. This fork keeps the same engine (evaluation scoring, batch processing, portal scanning, application tracking) and retargets the default archetypes, proof-point framing, and job sources at creative professionals -- Creative/Art Directors, brand and product designers, copywriters, motion and content roles -- instead of AI/automation careers. It also ships with a first-class integration for [Hired Creative](https://hiredcreative.com), a free aggregator of remote creative jobs.

**It will work out of the box, but it's designed to be made yours.** If the archetypes don't match your career, the modes are in the wrong language, or the scoring doesn't fit your priorities -- just ask. You (AI Agent) can edit the user's files. The user says "change the archetypes to motion design roles" and you do it. That's the whole point.

## Data Contract (CRITICAL)

There are two layers. Read `DATA_CONTRACT.md` for the full list.

**User Layer (NEVER auto-updated, personalization goes HERE):**
- `cv.md`, `config/profile.yml`, `modes/_profile.md`, `article-digest.md`, `portals.yml`
- `data/*`, `reports/*`, `output/*`, `interview-prep/*`

**System Layer (auto-updatable, DON'T put user data here):**
- `modes/_shared.md`, `modes/oferta.md`, all other modes
- `CLAUDE.md`, `*.mjs` scripts, `dashboard/*`, `templates/*`, `batch/*`

**THE RULE: When the user asks to customize anything (archetypes, narrative, negotiation scripts, proof points, location policy, comp targets), ALWAYS write to `modes/_profile.md` or `config/profile.yml`. NEVER edit `modes/_shared.md` for user-specific content.** This ensures system updates don't overwrite their customizations.

## Update Check

On the first message of each session, run the update checker silently:

```bash
node update-system.mjs check
```

Parse the JSON output:
- `{"status": "update-available", "local": "1.0.0", "remote": "1.1.0", "changelog": "..."}` → tell the user:
  > "hiredcreative-ops update available (v{local} → v{remote}). Your data (CV, profile, tracker, reports) will NOT be touched. Want me to update?"
  If yes → run `node update-system.mjs apply`. If no → run `node update-system.mjs dismiss`.
- `{"status": "up-to-date"}` → say nothing
- `{"status": "dismissed"}` → say nothing
- `{"status": "offline"}` → say nothing
- `{"status": "no-remote-version"}` → say nothing (checker reached GitHub but neither VERSION nor the latest release tag parsed as semver — treat as a silent non-failure, same as offline)

The user can also say "check for updates" or "update hiredcreative-ops" at any time to force a check.
To rollback: `node update-system.mjs rollback`

## What is hiredcreative-ops

AI-powered job search automation built on Claude Code: pipeline tracking, offer evaluation, CV generation, portal scanning, batch processing.

### Main Files

| File | Function |
|------|----------|
| `WORKFLOWS.md` | **Master map of the workflow** — every mode, its data, and its library references. Read when unsure where something belongs. |
| `library/` | Methodology layer — distilled, attributed playbooks (positioning, lead-gen, outreach, sales conversations, negotiation, networking, persuasion, communication, marketing). Index: `library/INDEX.md`. Modes cite which files to read before acting. Your own book notes → `library/custom/` (user layer). |
| `data/applications.md` | Application tracker |
| `data/pipeline.md` | Inbox of pending URLs (all sources write here) |
| `data/pipeline-remote.md` | Remote track — remote-worldwide roles (triaged from pipeline.md; identity in `modes/_profile.md`) |
| `data/pipeline-relocation.md` | Relocation track — visa-path roles (triaged from pipeline.md; identity in `modes/_profile.md`) |
| `data/pipeline-us.md` | Holding-bucket track — rename/duplicate per market; evaluate only when a rare condition is met (e.g. a confirmed visa sponsor) |
| `data/pipeline-inbound.md` | Inbound — recruiter approaches, referral-sourced roles, content-driven applications |
| `data/scan-history.tsv` | Scanner dedup history |
| `data/scan-rotation.yml` | Weekly full-sweep manifest — tiles + waves; ALL tiles run in every weekly scan (see `modes/scan.md` → Weekly Full Sweep) |
| `portals.yml` | Query and company config — includes the [Hired Creative](https://hiredcreative.com) aggregator as a pre-wired source |
| `templates/cv-template.html` | HTML template for CVs |
| `templates/cv-template.tex` | LaTeX/Overleaf template for CVs |
| `generate-pdf.mjs` | Playwright: HTML to PDF |
| `generate-latex.mjs` | LaTeX CV validator + pdflatex compiler |
| `article-digest.md` | Compact proof points from portfolio (optional) |
| `interview-prep/story-bank.md` | Accumulated STAR+R stories across evaluations |
| `interview-prep/{company}-{role}.md` | Company-specific interview intel reports |
| `analyze-patterns.mjs` | Pattern analysis script (JSON output) |
| `followup-cadence.mjs` | Follow-up cadence calculator (JSON output) |
| `data/follow-ups.md` | Follow-up history tracker |
| `data/companies.md`, `data/companies/` | Per-company CRM (ATS, archetypes hired, application history) — rebuildable via `scripts/build-company-crm.mjs` |
| `scan.mjs` | Zero-token portal scanner — hits Greenhouse/Ashby/Lever APIs (and Hired Creative) directly, zero LLM cost |
| `check-liveness.mjs` | Job posting liveness checker |
| `liveness-core.mjs` | Shared liveness logic (expired signals win over generic Apply text) |
| `reports/` | Evaluation reports (format: `{###}-{company-slug}-{YYYY-MM-DD}.md`). Blocks A-F + G (Posting Legitimacy). Header includes `**Legitimacy:** {tier}`. |

### OpenCode Commands

When using [OpenCode](https://opencode.ai), the following slash commands are available (defined in `.opencode/commands/`):

| Command | Claude Code Equivalent | Description |
|---------|------------------------|-------------|
| `/hiredcreative-ops` | `/hiredcreative-ops` | Show menu or evaluate JD with args |
| `/hiredcreative-ops-pipeline` | `/hiredcreative-ops pipeline` | Process pending URLs from inbox |
| `/hiredcreative-ops-evaluate` | `/hiredcreative-ops oferta` | Evaluate job offer (A-F scoring) |
| `/hiredcreative-ops-compare` | `/hiredcreative-ops ofertas` | Compare and rank multiple offers |
| `/hiredcreative-ops-contact` | `/hiredcreative-ops contacto` | LinkedIn outreach (find contacts + draft) |
| `/hiredcreative-ops-deep` | `/hiredcreative-ops deep` | Deep company research |
| `/hiredcreative-ops-pdf` | `/hiredcreative-ops pdf` | Generate ATS-optimized CV |
| `/hiredcreative-ops-latex` | `/hiredcreative-ops latex` | Export CV as LaTeX/Overleaf .tex |
| `/hiredcreative-ops-training` | `/hiredcreative-ops training` | Evaluate course/cert against goals |
| `/hiredcreative-ops-project` | `/hiredcreative-ops project` | Evaluate portfolio project idea |
| `/hiredcreative-ops-tracker` | `/hiredcreative-ops tracker` | Application status overview |
| `/hiredcreative-ops-apply` | `/hiredcreative-ops apply` | Live application assistant |
| `/hiredcreative-ops-scan` | `/hiredcreative-ops scan` | Scan portals for new offers |
| `/hiredcreative-ops-batch` | `/hiredcreative-ops batch` | Batch processing with parallel workers |
| `/hiredcreative-ops-patterns` | `/hiredcreative-ops patterns` | Analyze rejection patterns and improve targeting |
| `/hiredcreative-ops-followup` | `/hiredcreative-ops followup` | Follow-up cadence tracker |

**Note:** OpenCode commands invoke the same `.claude/skills/hiredcreative-ops/SKILL.md` skill used by Claude Code. The `modes/*` files are shared between both platforms.

### Gemini CLI Commands

When using the [Gemini CLI](https://github.com/google-gemini/gemini-cli), the following slash commands are available (defined in `.gemini/commands/`):

| Command | Claude Code Equivalent | Description |
|---------|------------------------|-------------|
| `/hiredcreative-ops` | `/hiredcreative-ops` | Show menu or evaluate JD with args |
| `/hiredcreative-ops-pipeline` | `/hiredcreative-ops pipeline` | Process pending URLs from inbox |
| `/hiredcreative-ops-evaluate` | `/hiredcreative-ops oferta` | Evaluate job offer (A-G scoring) |
| `/hiredcreative-ops-compare` | `/hiredcreative-ops ofertas` | Compare and rank multiple offers |
| `/hiredcreative-ops-contact` | `/hiredcreative-ops contacto` | LinkedIn outreach (find contacts + draft) |
| `/hiredcreative-ops-deep` | `/hiredcreative-ops deep` | Deep company research |
| `/hiredcreative-ops-pdf` | `/hiredcreative-ops pdf` | Generate ATS-optimized CV |
| `/hiredcreative-ops-training` | `/hiredcreative-ops training` | Evaluate course/cert against goals |
| `/hiredcreative-ops-project` | `/hiredcreative-ops project` | Evaluate portfolio project idea |
| `/hiredcreative-ops-tracker` | `/hiredcreative-ops tracker` | Application status overview |
| `/hiredcreative-ops-apply` | `/hiredcreative-ops apply` | Live application assistant |
| `/hiredcreative-ops-scan` | `/hiredcreative-ops scan` | Scan portals for new offers |
| `/hiredcreative-ops-batch` | `/hiredcreative-ops batch` | Batch processing with parallel workers |
| `/hiredcreative-ops-patterns` | `/hiredcreative-ops patterns` | Analyze rejection patterns and improve targeting |
| `/hiredcreative-ops-followup` | `/hiredcreative-ops followup` | Follow-up cadence tracker |

**Note:** Gemini CLI commands are defined in `.gemini/commands/*.toml`. The project context is auto-loaded from `GEMINI.md`. All `modes/*` files are shared across Claude Code, OpenCode, and Gemini CLI.

### First Run — Onboarding (IMPORTANT)

**Before doing ANYTHING else, check if the system is set up.** Run these checks silently every time a session starts:

1. Does `cv.md` exist?
2. Does `config/profile.yml` exist (not just profile.example.yml)?
3. Does `modes/_profile.md` exist (not just _profile.template.md)?
4. Does `portals.yml` exist (not just templates/portals.example.yml)?

If `modes/_profile.md` is missing, copy from `modes/_profile.template.md` silently. This is the user's customization file — it will never be overwritten by updates.

**If ANY of these is missing, enter onboarding mode.** Do NOT proceed with evaluations, scans, or any other mode until the basics are in place. Guide the user step by step:

#### Step 1: CV (required)
If `cv.md` is missing, ask:
> "I don't have your CV yet. You can either:
> 1. Paste your CV here and I'll convert it to markdown
> 2. Paste your LinkedIn URL and I'll extract the key info
> 3. Tell me about your experience and I'll draft a CV for you
>
> Which do you prefer?"

Create `cv.md` from whatever they provide. Make it clean markdown with standard sections (Summary, Experience, Projects, Education, Skills).

#### Step 2: Profile (required)
If `config/profile.yml` is missing, copy from `config/profile.example.yml` and then ask:
> "I need a few details to personalize the system:
> - Your full name and email
> - Your location and timezone
> - What roles are you targeting? (e.g., 'Senior Backend Engineer', 'AI Product Manager')
> - Your salary target range
>
> I'll set everything up for you."

Fill in `config/profile.yml` with their answers. For archetypes and targeting narrative, store the user-specific mapping in `modes/_profile.md` or `config/profile.yml` rather than editing `modes/_shared.md`.

#### Step 3: Portals (recommended)
If `portals.yml` is missing:
> "I'll set up the job scanner with 45+ pre-configured companies. Want me to customize the search keywords for your target roles?"

Copy `templates/portals.example.yml` → `portals.yml`. If they gave target roles in Step 2, update `title_filter.positive` to match.

#### Step 4: Tracker
If `data/applications.md` doesn't exist, create it:
```markdown
# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
```

#### Step 5: Get to know the user (important for quality)

After the basics are set up, proactively ask for more context. The more you know, the better your evaluations will be:

> "The basics are ready. But the system works much better when it knows you well. Can you tell me more about:
> - What makes you unique? What's your 'superpower' that other candidates don't have?
> - What kind of work excites you? What drains you?
> - Any deal-breakers? (e.g., no on-site, no startups under 20 people, no Java shops)
> - Your best professional achievement — the one you'd lead with in an interview
> - Any projects, articles, or case studies you've published?
>
> The more context you give me, the better I filter. Think of it as onboarding a recruiter — the first week I need to learn about you, then I become invaluable."

Store any insights the user shares in `config/profile.yml` (under narrative), `modes/_profile.md`, or in `article-digest.md` if they share proof points. Do not put user-specific archetypes or framing into `modes/_shared.md`.

**After every evaluation, learn.** If the user says "this score is too high, I wouldn't apply here" or "you missed that I have experience in X", update your understanding in `modes/_profile.md`, `config/profile.yml`, or `article-digest.md`. The system should get smarter with every interaction without putting personalization into system-layer files.

#### Step 6: Ready
Once all files exist, confirm:
> "You're all set! You can now:
> - Paste a job URL to evaluate it
> - Run `/hiredcreative-ops scan` (or `/hiredcreative-ops-scan` if using OpenCode) to search portals
> - Run `/hiredcreative-ops` to see all commands
>
> Everything is customizable — just ask me to change anything.
>
> Tip: Having a live portfolio (Behance, a personal site, even a PDF case-study deck) dramatically improves your job search — evaluations and cover letters can reference it directly."

Then suggest automation:
> "Want me to scan for new offers automatically? I can set up a recurring scan every few days so you don't miss anything. Just say 'scan every 3 days' and I'll configure it."

If the user accepts, use the `/loop` or `/schedule` skill (if available) to set up a recurring `/hiredcreative-ops scan` (or `/hiredcreative-ops-scan` if using OpenCode). If those aren't available, suggest adding a cron job or remind them to run `/hiredcreative-ops scan` (or `/hiredcreative-ops-scan` if using OpenCode) periodically.

### Personalization

This system is designed to be customized by YOU (AI Agent). When the user asks you to change archetypes, translate modes, adjust scoring, add companies, or modify negotiation scripts -- do it directly. You read the same files you use, so you know exactly what to edit.

**Common customization requests:**
- "Change the archetypes to [backend/frontend/data/devops] roles" → edit `modes/_profile.md` or `config/profile.yml`
- "Translate the modes to English" → edit all files in `modes/`
- "Add these companies to my portals" → edit `portals.yml`
- "Update my profile" → edit `config/profile.yml`
- "Change the CV template design" → edit `templates/cv-template.html`
- "Adjust the scoring weights" → edit `modes/_profile.md` for user-specific weighting, or edit `modes/_shared.md` and `batch/batch-prompt.md` only when changing the shared system defaults for everyone

### Language Modes

Default modes are in `modes/` (English). Additional language-specific modes are available:

- **German (DACH market):** `modes/de/` — native German translations with DACH-specific vocabulary (13. Monatsgehalt, Probezeit, Kündigungsfrist, AGG, Tarifvertrag, etc.). Includes `_shared.md`, `angebot.md` (evaluation), `bewerben.md` (apply), `pipeline.md`.
- **French (Francophone market):** `modes/fr/` — native French translations with France/Belgium/Switzerland/Luxembourg-specific vocabulary (CDI/CDD, convention collective SYNTEC, RTT, mutuelle, prévoyance, 13e mois, intéressement/participation, titres-restaurant, CSE, portage salarial, etc.). Includes `_shared.md`, `offre.md` (evaluation), `postuler.md` (apply), `pipeline.md`.
- **Japanese (Japan market):** `modes/ja/` — native Japanese translations with Japan-specific vocabulary (正社員, 業務委託, 賞与, 退職金, みなし残業, 年俸制, 36協定, 通勤手当, 住宅手当, etc.). Includes `_shared.md`, `kyujin.md` (evaluation), `oubo.md` (apply), `pipeline.md`.

**When to use German modes:** If the user is targeting German-language job postings, lives in DACH, or asks for German output. Either:
1. User says "use German modes" → read from `modes/de/` instead of `modes/`
2. User sets `language.modes_dir: modes/de` in `config/profile.yml` → always use German modes
3. You detect a German JD → suggest switching to German modes

**When to use French modes:** If the user is targeting French-language job postings, lives in France/Belgium/Switzerland/Luxembourg/Quebec, or asks for French output. Either:
1. User says "use French modes" → read from `modes/fr/` instead of `modes/`
2. User sets `language.modes_dir: modes/fr` in `config/profile.yml` → always use French modes
3. You detect a French JD → suggest switching to French modes

**When to use Japanese modes:** If the user is targeting Japanese-language job postings, lives in Japan, or asks for Japanese output. Either:
1. User says "use Japanese modes" → read from `modes/ja/` instead of `modes/`
2. User sets `language.modes_dir: modes/ja` in `config/profile.yml` → always use Japanese modes
3. You detect a Japanese JD → suggest switching to Japanese modes

**When NOT to:** If the user applies to English-language roles, even at French, German, or Japanese companies, use the default English modes.

### Skill Modes

| If the user... | Mode |
|----------------|------|
| Pastes JD or URL | auto-pipeline (evaluate + report + PDF + tracker) |
| Asks to evaluate offer | `oferta` |
| Asks to compare offers | `ofertas` |
| Wants LinkedIn outreach | `contacto` |
| Asks for company research | `deep` |
| Preps for interview at specific company | `interview-prep` |
| Wants to generate CV/PDF | `pdf` |
| Evaluates a course/cert | `training` |
| Evaluates portfolio project | `project` |
| Asks about application status | `tracker` |
| Fills out application form | `apply` |
| Searches for new offers | `scan` |
| Processes pending URLs | `pipeline` |
| Batch processes offers | `batch` |
| Asks about rejection patterns or wants to improve targeting | `patterns` |
| Asks about follow-ups or application cadence | `followup` |
| Wants an authenticated LinkedIn feed/notifications scan | `linkedin` |
| Wants a per-company CRM view (ATS, archetypes hired, history) | `companies` |
| Wants to evaluate everything in the pipeline right now | `blast` |
| Negotiating a comp offer, asks to counter, or wants a reply drafted under pressure | `negotiation` (see `modes/negotiation.md`) |
| Recruiter approached me, someone referred a role, inbound job lead | Triage to `data/pipeline-inbound.md` (then evaluate with `oferta` as normal) |
| Asks what the automated pipeline has done recently | `review` |
| Asks for full-funnel numbers (scan volume through outcomes) | `analytics` |

### CV Source of Truth

- `cv.md` in project root is the canonical CV
- `article-digest.md` has detailed proof points (optional)
- **NEVER hardcode metrics** -- read them from these files at evaluation time

---

## Ethical Use

**This system is designed for quality, not quantity.** The goal is to help the user find and apply to roles where there is a genuine match -- not to spam companies with mass applications.

- **Submit applications autonomously.** Fill forms, draft answers, generate PDFs, and submit. No need to stop for user confirmation per application -- quality gate is a score threshold, not manual review of every submit. **Default threshold: 4.0/5 -- but ALWAYS check `modes/_profile.md`'s "Application Quality Gate" section first, since the user may have overridden this default (it's a common personalization request).**
- **Strongly discourage low-fit applications below the active threshold.** Only proceed below it if the user explicitly overrides.
- **Quality over speed.** A well-targeted application to 5 companies beats a generic blast to 50.
- **Respect recruiters' time.** Only send what's worth reading.

---

## Offer Verification -- MANDATORY

**NEVER trust WebSearch/WebFetch to verify if an offer is still active.** ALWAYS use Playwright:
1. `browser_navigate` to the URL
2. `browser_snapshot` to read content
3. Only footer/navbar without JD = closed. Title + description + Apply = active.

**Exception for batch workers (`claude -p`):** Playwright is not available in headless pipe mode. Use WebFetch as fallback and mark the report header with `**Verification:** unconfirmed (batch mode)`. The user can verify manually later.

---

## CI/CD and Quality

- **GitHub Actions** run on every PR: `test-all.mjs` (63+ checks), auto-labeler (risk-based: 🔴 core-architecture, ⚠️ agent-behavior, 📄 docs), welcome bot for first-time contributors
- **Branch protection** on `main`: status checks must pass before merge. No direct pushes to main (except admin bypass).
- **Dependabot** monitors npm, Go modules, and GitHub Actions for security updates
- **Contributing process**: issue first → discussion → PR with linked issue → CI passes → maintainer review → merge

## Community and Governance

- **Code of Conduct**: Contributor Covenant 2.1 with enforcement actions (see `CODE_OF_CONDUCT.md`)
- **Governance**: BDFL model with contributor ladder — Participant → Contributor → Triager → Reviewer → Maintainer (see `GOVERNANCE.md`)
- **Security**: private vulnerability reporting via GitHub Security Advisories (see `SECURITY.md`)
- **Support**: help questions go to GitHub Discussions, not issues (see `SUPPORT.md`)

## Stack and Conventions

- Node.js (mjs modules), Playwright (PDF + scraping), YAML (config), HTML/CSS (template), Markdown (data), Canva MCP (optional visual CV)
- Scripts in `.mjs`, configuration in YAML
- Output in `output/` (gitignored), Reports in `reports/`
- JDs in `jds/` (referenced as `local:jds/{file}` in pipeline.md)
- Batch in `batch/` (gitignored except scripts and prompt)
- Report numbering: sequential 3-digit zero-padded, max existing + 1
- **RULE: After each batch of evaluations, run `node merge-tracker.mjs`** to merge tracker additions and avoid duplications.
- **RULE: NEVER create new entries in applications.md if company+role already exists.** Update the existing entry.

### TSV Format for Tracker Additions

Write one TSV file per evaluation to `batch/tracker-additions/{num}-{company-slug}.tsv`. Single line, 9 tab-separated columns:

```
{num}\t{date}\t{company}\t{role}\t{status}\t{score}/5\t{pdf_emoji}\t[{num}](reports/{num}-{slug}-{date}.md)\t{note}
```

**Column order (IMPORTANT -- status BEFORE score):**
1. `num` -- sequential number (integer)
2. `date` -- YYYY-MM-DD
3. `company` -- short company name
4. `role` -- job title
5. `status` -- canonical status (e.g., `Evaluated`)
6. `score` -- format `X.X/5` (e.g., `4.2/5`)
7. `pdf` -- `✅` or `❌`
8. `report` -- markdown link `[num](reports/...)`
9. `notes` -- one-line summary

**Note:** In applications.md, score comes BEFORE status. The merge script handles this column swap automatically.

### Pipeline Integrity

1. **NEVER edit applications.md to ADD new entries** -- Write TSV in `batch/tracker-additions/` and `merge-tracker.mjs` handles the merge.
2. **YES you can edit applications.md to UPDATE status/notes of existing entries.**
3. All reports MUST include `**URL:**` in the header (between Score and PDF). Include `**Legitimacy:** {tier}` (see Block G in `modes/oferta.md`).
4. All statuses MUST be canonical (see `templates/states.yml`).
5. Health check: `node verify-pipeline.mjs`
6. Normalize statuses: `node normalize-statuses.mjs`
7. Dedup: `node dedup-tracker.mjs`

### Canonical States (applications.md)

**Source of truth:** `templates/states.yml`

| State | When to use |
|-------|-------------|
| `Evaluated` | Report completed, pending decision |
| `Applied` | Application sent |
| `Responded` | Company responded |
| `Interview` | In interview process |
| `Offer` | Offer received |
| `Rejected` | Rejected by company |
| `Discarded` | Discarded by candidate or offer closed |
| `SKIP` | Doesn't fit, don't apply |

**RULES:**
- No markdown bold (`**`) in status field
- No dates in status field (use the date column)
- No extra text (use the notes column)
