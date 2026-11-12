# Borrowing from upstream career-ops

Upstream: `https://github.com/career-ops-hq/career-ops` (was `santifer/career-ops`). MIT.
Checked 2026-11-12: upstream **v1.40.0** (2026-11-10). This system branched at about **v1.3.0**.

Upstream has grown from ~50 root scripts to ~180, plus a web UI, a plugin system and ~70 ATS providers.
Its scripts now share a common core (`tracker-parse.mjs`, `tracker-utils.mjs`, `path-resolver.mjs`,
`lib/*`), so one script cannot be copied alone: `followup-seed.mjs` pulls in eight other modules.
The tracker table format is still the same as ours (`# | Date | Company | Role | Score | Status | PDF | Report | Notes`).

**Rule: never run a blind update from upstream.** `update-system.mjs` here points at
`yashimosh/hiredcreative-ops`. Borrow one idea at a time, as a small rewrite or a copied markdown mode,
and record it below.

## Taken (2026-11-12)

| Upstream | Here | How |
|---|---|---|
| `modes/triage.md`, `modes/_brief.template.md` | same paths | mode adapted (eligibility first, warm-path cell, sorts and never discards); template copied |
| `close-stale.mjs` (idea) | `close-stale.mjs` | ~60-line rewrite against our tracker, dry run by default |
| `precheck-duplicate.mjs` (idea) | `precheck-duplicate.mjs` | ~60-line rewrite, read-only |
| `followup-seed.mjs` (idea: a follow-up row is created the day you apply) | `today.mjs` section 3; rule in `library/what-converts.md` | rule + view, no script |

## Worth taking next, in this order

| Upstream | What it does | Why it matters here | Cost |
|---|---|---|---|
| `reply-watch.mjs` + `modes/reply-watch.md` | reads employer replies from the inbox, matches them to tracker rows, proposes status changes | replies tracked by hand get missed | needs `reply-matcher.mjs`, `lib/reply-proposals.mjs` + tracker core |
| `outcome.mjs`, `calibrate.mjs`, `modes/retro.md` | records what happened to each application and checks whether scores predict outcomes | scores are worth nothing until checked against results | tracker core + `lib/outcome-*` |
| `reserve-report-num.mjs` | one atomic allocator for report numbers | parallel workers can collide on report numbers | tracker core |
| `closing-soon.mjs` | lists tracker rows whose posting closes soon | deadlines live in free-text notes | tracker core + `jd-capture.mjs` |
| `scan.mjs` providers (`providers/`), `content_filter`, transient-error retry, `partial` board status | far wider board coverage and fewer silent empty scans | fewer empty or stale scans | large: the provider layer is its own subsystem |
| `backup.mjs` | copies the user layer to a backup folder | a user-layer file that is gitignored has no backup unless you make one | needs `update-system.mjs` USER_PATHS |
| `path-resolver.mjs` (data root) | code checkout and personal data in separate folders | lets a private data folder sit apart from the public code | touches every script |

The clean way to get most of this is one deliberate rebase of `hiredcreative-ops` onto upstream 1.40,
re-applying the creative-industry templates and the clients, events and network modes on top. That is a project of its own, not a patch.

## Not wanted

`sponsor-check.mjs` (UK sponsor register only), star and manifesto prompts,
hired wall, the Go dashboard changes, the 15 extra language packs.
