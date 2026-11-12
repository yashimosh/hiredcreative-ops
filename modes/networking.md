# Mode: networking — Personal network graph and warm-path engine

<!-- ============================================================
     SYSTEM LAYER. Auto-updatable. Do not put personal data here.
     Person data lives in data/network/ (user layer).
     Method: library/networking.md.
     ============================================================ -->

Runs your personal network as a set of plain files: one per person in `data/network/{slug}.md`, plus an index at `data/network/INDEX.md`. The network is the asset that compounds. It feeds warm paths into the jobs track and the clients track.

**Read before acting:** `library/networking.md`, then `library/custom/*` if present.

## The mandatory rule

**The warm-path check comes before any cold outreach and any cold application.** Before `clients outreach`, `contacto` or `apply` drafts anything cold, run `network path {company}`. If a path exists, use it: run `network intro` instead of the cold draft. If none exists, record "none found" with the date in the prospect file or report, then proceed.

## Sub-commands

| Input | What it does |
|-------|--------------|
| `network` or `network status` | Dashboard: tier counts, overdue touches, pending intros, suggested actions |
| `network add {name}` | Create a person file and an index row |
| `network enrich {slug}` | Research pass on one person, from public sources |
| `network touch {slug}` | Draft a give-first touch and log it |
| `network intro {target}` | Find the best connector, draft the permission ask and a forwardable blurb |
| `network path {company or person}` | Answer "who can get me to X?" |
| `network sweep` | Weekly cadence run: who is past their touch window |

## Data

### Person file: `data/network/{slug}.md`

```markdown
# {Name}

- **Slug:** {firstname-lastname}
- **Role:** {current role}, {organisation}
- **City:** {city}
- **Links:** {public profile, site}
- **Preferred channel:** {the app or medium they answer on}
- **Found via:** {person or event}
- **Connection path:** {you → connector → them, or "direct"}
- **Tier:** {T1 | T2 | T3}
- **Relevance:** {direct_target | warm_intro | referral_node | peer | background}
- **Research status:** {done | partial | queued}

## Organisations
- {organisation}, {role}, {years}

## Known connections
- {name} ({slug if they have a file}): {how they are linked}

## Notes
{what they care about, what they are working on, what you could give them}

## Touches
| Date | Channel | Give | Their reply | Next |
|------|---------|------|-------------|------|

## Intros
| Date | Direction | With | Status | Outcome |
|------|-----------|------|--------|---------|
```

### Index: `data/network/INDEX.md`

One row per person, so paths can be found without opening every file:

```markdown
| Slug | Name | Organisation | City | Tier | Relevance | Known connections | Last touch | Status |
|------|------|--------------|------|------|-----------|-------------------|------------|--------|
```

Update the index row whenever a person file changes.

### Tiers and touch windows

| Tier | Who | Touch at least |
|------|-----|----------------|
| T1 | Active allies, champions, strong connectors | Monthly |
| T2 | Warm, relevant, known to reply | Every 3 months |
| T3 | Known but dormant | Every 6 months |

## `network status`

Read the index and the person files. Show:

1. Counts by tier and by research status
2. **Overdue touches:** T1 past one month, T2 past three, T3 past six
3. Pending intros: asked, no outcome logged
4. Three suggested actions for this week, each one give-first

## `network add {name}`

1. Check the index for an existing entry. Never create a duplicate.
2. Create the person file from the schema with what is known. Set tier, relevance and connection path.
3. Add the index row. Set research status to `queued` unless the file is already complete.

Add people the same day you meet them: at interviews, client calls, events. A contact that is not written down does not exist.

## `network enrich {slug}`

Public sources only: their own site or company bio, public profile summaries, event and speaker listings, news mentions, the team page of their employer. Record role, organisations, events and known connections. Every named connection that looks relevant goes into the index as `queued`. Do not guess: an unverified detail is written as unverified or left out.

## `network touch {slug}`

1. Read the person file: last touch, notes, current work.
2. Find a give: a relevant link or opportunity, an introduction, a specific congratulation, a question only they can answer. If the file offers nothing, look at their recent public activity. "Checking in" is not a touch and is never drafted.
3. Draft in the channel they prefer, in your voice (`modes/_profile.md`). For T1 contacts the draft is a starting point for the user to finish by hand, never to send as written.
4. After the user confirms it was sent, log it in the Touches table and update the index.

## `network intro {target}`

1. Find paths: search the index and every `Known connections` section for people linked to the target. Rank connectors by how recently you were in touch and how well they know the target.
2. Draft the **permission ask** to the connector. Ask whether they know the target well enough to introduce you, and say specifically what you want to show the target. Do not ask for the favour outright.
3. Draft the **forwardable blurb**: three sentences. Who you are in one clause, the specific reason for this introduction, an easy next step. The connector should be able to forward it in ten seconds.
4. Keep it double opt-in: the connector checks with the target first.
5. Log the ask in both person files. When there is an outcome, log it and draft a thank-you that tells the connector what happened. This step is not optional. Connectors who hear the outcome introduce again.

## `network path {company or person}`

Search the index and person files for the shortest warm route:

1. Direct: someone in your network works there or is the person.
2. One step: someone in your network lists the target or a colleague under Known connections.
3. Shared context: same former employer, school, event or community.

Output the best one to three paths with the connector's tier and last touch date, or "none found" with today's date. Never present a guessed link as a path.

## `network sweep`

For everyone past their window, propose one give-first touch. Cap the batch at five a week so each one stays specific. Output a checklist. On approval, draft each one. Log only what the user confirms was sent.

## Integration

- `clients outreach`, `contacto` and cold applications run `network path` first (the mandatory rule above).
- Event contacts worth keeping are promoted from `events log` with `network add`.
- Won clients are added as T1 or T2 by `clients won`.
- Published content is a ready reason for a touch (`modes/brand.md`).
- Nothing is sent automatically. The mode drafts, the user sends.
