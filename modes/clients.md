# Mode: clients — Freelance client pipeline: find, qualify, contact, close, retain

<!-- ============================================================
     SYSTEM LAYER. Auto-updatable. Do not put personal data here.
     Your services, rates, floors, proof points, cities and red
     flags live in modes/_profile.md. Prospect data lives in data/.
     ============================================================ -->

A lead system for creative freelancers who sell to businesses in their own market. The goal is a short list of prospects with a real gap, a real budget and a reachable decision-maker, worked with discipline until each one is Won, Lost or Dormant. Finding names is the cheap part. The work is qualification, a first message a real person answers, and follow-up that does not lapse. This mode optimises for conversion, not volume.

**Method layer (read the relevant file before acting):** `clients scan` reads `library/lead-generation.md`. `clients outreach` reads `library/outreach.md`, after a warm-path check through `modes/networking.md`. `clients prep` reads `library/sales-conversations.md`. `clients proposal` reads `library/positioning.md`. Price or scope pushback goes to `modes/negotiation.md`. `library/custom/*` overrides these where it disagrees.

## Four rules that outrank everything below

These come from a six-month audit of a real freelance search. Follow them even when a sub-command seems to suggest otherwise.

1. **A named person and a direct message beat cold email.** In the audit, cold email got 0 replies from about 15 sends. Direct messages to named people got a 71% reply rate (32 prospects were contacted in total across channels). Never send to a generic inbox when a named person can be found. If no named person can be found, the prospect is not ready for outreach.
2. **Check for a warm path before any cold outreach.** Run `network path {company}` against `data/network/` first. If a path exists, stop the cold draft and run `network intro` instead.
3. **Research must not run ahead of action.** Do not research new prospects while prospects past first contact are waiting on a reply or a promised follow-up. `clients scan` and `clients enrich` check this first and refuse until the waiting items are handled.
4. **Lead with the prospect's business gap, not with your deliverables.** Open with what the gap costs them: lost sales, weak recognition, a launch that will look improvised. Never headline a list of things you make.

## Data files

| File | Purpose |
|------|---------|
| `data/prospects.md` | Dashboard: TODAY view, active pipeline, stage lists, win and loss pattern logs |
| `data/prospects/{slug}.md` | One file per prospect. **Source of truth.** |
| `data/outreach-log.md` | Append-only log of every touch |
| `data/retainers.md` | Active recurring clients, renewals, churn |

All four are user-layer files. This mode does not write to `data/applications.md`, `data/pipeline.md` or `reports/`. Client leads and job applications are separate funnels that share only the profile and the voice.

## The CRM contract

**Canonical stages, no synonyms:** `New → Researched → Outreached → Conversation → Proposal → Negotiating → Won / Lost / Dormant`

Researched means scored, with the gap named and a decision-maker found. Outreached means a first message was sent. Conversation starts when they reply. Dormant means no reply after the full cadence, to be reopened on a trigger event. Do not write "Contacted", "In talks", "Quoted" or any other label. Use the nearest canonical stage and put the detail in the notes.

**The prospect file is the source of truth. The dashboard is a view.** When `data/prospects.md` and a prospect file disagree, the prospect file wins and the dashboard is corrected in the same session.

**Every touch is logged in the same session.** A sub-command that results in a sent message, a follow-up, an in-person contact or a proposal does not return until all four steps are done:

1. Append a row to `data/outreach-log.md`: `| Date | Slug | Company | Channel | Result | Next due | Note |`
2. Append a row to the outreach history table in `data/prospects/{slug}.md`.
3. Update stage, next action and due date in the prospect file, then mirror them in `data/prospects.md`.
4. If something was produced for the prospect (audit page, proposal, deck), add it to the assets ledger with its path and whether it was sent.

Only log what the user confirms was sent. A draft is not a touch. Nothing in this mode sends on the user's behalf: it drafts, the user sends.

## Sub-commands

| Input | What it does |
|-------|--------------|
| `clients` | Dashboard, opening with the TODAY view. Also the fallback for unrecognised input. |
| `clients scan` | Discovery sweep into the `New` stage |
| `clients enrich {slug}` | Research and score one prospect |
| `clients outreach {slug}` | Draft the first message, in the right channel |
| `clients proposal {slug}` | One-page diagnostic plus priced options |
| `clients followup` | Surface overdue follow-ups and draft them |
| `clients won {slug}` | Log a win and harvest it |
| `clients lost {slug}` | Log a loss with a canonical reason |
| `clients prep {slug}` | One-page brief before a call or meeting |
| `clients pipeline` | Weighted forecast by stage |
| `clients retainer` | Recurring clients: health, renewals, churn (`add`, `renew`, `churn`) |

## Scoring: win probability, 0.0 to 5.0

Score every researched prospect on six weighted factors. The composite decides whether the prospect earns an outreach cycle. These are defaults. Override them in `modes/_profile.md`, for example with one rubric per service you sell.

| Factor | Weight | 5 looks like | 1 looks like |
|--------|--------|--------------|--------------|
| Visible gap | 25% | A specific, observable problem you can point at | Already well served |
| Budget signal | 25% | Paid staff, paid ads, premium location, recent funding | Side business, lowest-bidder habits |
| Decision-maker reachable | 20% | Named owner or lead, small organisation, direct channel | Gatekept, committee, head office elsewhere |
| Trigger event | 15% | Launching, rebranding, opening, hiring for marketing | No reason to act now |
| No incumbent | 10% | Nobody senior owns the function you would fill | In-house lead or agency of record |
| Appreciation of craft | 5% | Has invested in good work before | Treats it as a commodity |

`score = sum of (factor score × weight)`. **4.5 and up is HOT:** outreach within 48 hours, with a one-page audit ready. **3.5 to 4.4 is WARM:** outreach this week. **2.5 to 3.4 is COOL:** hold, revisit in a month or on a trigger event. **Below 2.5 is SKIP.** Most prospects score below 3.5. That is the filter working.

**Pre-filters, checked before scoring.** A branch of a chain or franchise whose brand is set at head office is a SKIP, but check whether a locally controlled parent group exists, because that parent is a new prospect. A business with no visible need for what you sell is a SKIP at discovery. Anything on the red-flag list in `modes/_profile.md` is `Lost / bad_fit` immediately.

**Calibration.** Every 10 closed prospects, read the win and loss pattern logs in `data/prospects.md`. If the same factor was wrong twice, change its weight or evidence bar in `modes/_profile.md` and note the date and reason. The pipeline is the ground truth, not the rubric.

## Gap taxonomy

Every researched prospect gets exactly one **gap type**: the single diagnosis that drives the pitch. It picks the opening line, the proof you lead with and the shape of the offer. Then pick the **lead proof**: the one piece of your work that mirrors that gap. The wrong proof wastes the first touch. Define your own labels in `modes/_profile.md`. Generic examples:

| Gap label | What you observe | What it costs them |
|-----------|------------------|--------------------|
| `no-identity` | No coherent look or voice at all | Forgettable, competes on price only |
| `drift` | A brand exists but every channel looks different | Recognition leaks with every post |
| `launch-trigger` | New product, location or entity coming | The launch looks improvised |
| `naming-chaos` | Several names or logos for one organisation | Customers do not know it is one company |
| `volume-strain` | Output demand exceeds the team | Quality drops, deadlines slip |

## `clients` : dashboard and TODAY view

**Step 0, drift check.** Before showing anything, compare the stage lines in active prospect files, the dashboard rows and the outreach log. Fix every mismatch from the prospect file outward and report what was fixed.

**TODAY is ordered by decay rate, not by score.** The item that loses the most value per day of delay goes first. A 4.8 prospect nobody has contacted can wait a day. A reply from a 3.6 prospect cannot.

1. Replies you have not answered (decays in hours)
2. Things you promised and have not delivered: an audit, a quote, a call time
3. Proposal and Negotiating threads that have gone quiet
4. Follow-ups due today or overdue
5. Drafted messages not yet sent
6. HOT prospects with no first touch
7. Research on new prospects, only when 1 to 5 are empty

```
Client pipeline: {YYYY-MM-DD}
TODAY
  1. {action} ({slug}, waiting {N}d)
  (nothing due: "Nothing due. Oldest waiting thread: {slug}, {N}d.")
Revenue:  retainers {N}, {total}/month · weighted pipeline {total}
By stage: Negotiating {N} · Proposal {N} · Conversation {N} · Outreached {N}
Ready:    HOT {N} · WARM {N} · Dormant {N} · active conversations {N} of {cap}
Last 30 days: touches {N} · replies {N} ({rate}%) · proposals {N} · won {N} · lost {N}
Best channel: {channel} ({rate}%)
Drift check: {clean | N fixes applied}
```

**Conversation cap.** Set a cap on simultaneous active conversations in `modes/_profile.md` (five is a sane default for one person). At the cap, no new outreach.

## `clients scan` : discovery

**Gate (rule 3).** Read `data/prospects.md` first. If any prospect in Outreached or later has an unanswered reply or a promised follow-up outstanding, stop and show the TODAY view instead.

1. Pick two sectors from the target list in `modes/_profile.md`. Depth beats breadth.
2. Search where businesses in your market show themselves: the social platform they post on, map listings for anything with premises, professional networks for larger organisations, sponsor and exhibitor lists from local events (`modes/events.md`), and job posts for marketing or design roles, which signal new budget and an unfilled gap.
3. Finding the person is worth more than finding the company. Capture a named owner or lead whenever one is visible.
4. For each candidate record: `slug`, `name`, `city`, `sector`, links, `discovered_via`, `date_added`.
5. Deduplicate against `data/prospects.md` and `data/prospects/*.md`. Apply the pre-filters. Append survivors under `## New`.
6. Do not score during a scan. Stop at 15 to 25 new candidates. After that the bottleneck is enrichment and contact, not discovery.

## `clients enrich {slug}` : research and score

Same gate as `clients scan`. Budget 20 to 30 minutes per prospect. If it takes an hour, there is not enough signal and the prospect is probably below the floor.

1. Create `data/prospects/{slug}.md` from the schema below.
2. Audit what they publish: their last dozen posts and their website, seen with your own eyes. Never pitch a gap you have not seen. With no visual audit, write `confidence: partial`.
3. Find the decision-maker by name and the channel they answer on. Look at two or three direct competitors: a visibly stronger one is leverage.
4. Score the six factors with one line of evidence each.
5. Write the diagnostic: three to five specific observations. "Their branding is weak" is not an observation. "The storefront, the menu and the delivery bags carry three different logos" is.
6. Assign the gap type and the lead proof.
7. Run `network path {company}` and record the result now, with the date, even if it is "none found".
8. Set stage `Researched`, tier, next action and due date. HOT: outreach in 2 days. WARM: 7 days. COOL: revisit in 30. SKIP: close.

### Prospect file schema: `data/prospects/{slug}.md`

```markdown
# {Prospect}

- **Slug:** {slug} · **City:** {city} · **Sector:** {sector}
- **Service:** {which of your services fits, primary first}
- **Gap type:** {one label from your taxonomy}
- **Lead proof:** {the one piece of your work that mirrors this gap}
- **Fit:** {project | retainer | part-time}, deal value estimate {your rate}
- **Discovered:** {YYYY-MM-DD via channel} · **Links:** {website, social, map listing}

## Score
| Factor | Score (0-5) | Evidence |
|--------|-------------|----------|
| {one row per factor, with its weight} | | |
| **Composite** | **x.x / 5.0** | Tier: {HOT / WARM / COOL / SKIP} |

## Diagnostic
Visual audit: feed {YYYY-MM-DD | not yet} · website {YYYY-MM-DD | none exists | not yet}
1. {specific observation and what it costs them}

## Decision-makers
| Role | Name | Channel | Reachability |

## Best channel and warm path
Channel: {direct message | warm intro via {name} | email to a named person}
Warm path: {name and route | none found YYYY-MM-DD}

## Assets ledger
| Date | Asset | Path | Sent? |

## Outreach history
| Date | Channel | Direction | Notes |

## Status
- Stage: {canonical stage only}
- Temperature: {cold | contacted | warm | hot}
- Next action: {what and when. Never blank from Outreached onward.}
- Post-mortem: {at Won or Lost only: what worked, what did not, which factor was mis-scored}
```

Tables above show the header row only. Past Outreached, add `## Meeting notes` and `## Meeting prep` as needed.

## `clients outreach {slug}` : first message

**Pre-send gate, every message:**

1. **Warm path checked** (rule 2). Path found: draft the intro request instead.
2. **Named recipient** (rule 1). No name, no send.
3. **Gap first** (rule 4). If the first sentence is about you or names a service, rewrite it.
4. **Timing.** If they just opened, launched, posted or hired, reference it. A message tied to a live moment outperforms one tied to your calendar.
5. **Register.** Write in the language and tone the recipient uses, then apply your voice rules from `modes/_profile.md`.

**Channel order:** warm introduction, then a direct message to the named person on the messaging app or platform they visibly use, then email to a named person. A contact form or generic inbox is a last resort and rarely worth the send.

**Shape of the message (adapt it, never send a template as written):**

```
{Name}, I was looking at {specific surface: the new location, the spring
campaign, the product pages} and noticed {one observation from the diagnostic},
which likely means {the business consequence}.

It is fixable. If useful, I can send a one-page read of what I see. No pitch
attached.

{Your first name}
```

**Hard rules for the copy:** one observation per message, not three. One credential at most, because the diagnostic does the selling. Do not expose what the recipient does not know: no jargon, no tool talk, outcomes only. A concrete ask ("worth 20 minutes this week?") beats a vague one. Offer the one-page audit on first touch. Sign with your name only.

After the user confirms the send, run the logging steps. Stage becomes `Outreached`, next action is the first follow-up.

## `clients followup` : cadence

Surface every prospect whose due date is today or earlier and draft the next touch. Run it at least weekly, on a fixed day.

**After first touch:**
- **Day 4:** a new observation or a short example. Never "bumping this".
- **Day 14:** value drop. Something useful with no ask attached.
- **Day 30:** closing note. You will stop here, and the door stays open.
- **After day 30:** stage becomes `Dormant`. Reopen on a trigger event.

**After a proposal:**
- **Day 3:** confirm it arrived and offer to walk through it.
- **Day 7:** ask what is unclear. Offer to change the shape, not the price.
- **Day 14:** name the stall plainly and ask whether timing is the real issue.

A live signal overrides the calendar: if they reply, post or announce something, respond to that now. Every touch adds something new (`library/outreach.md`). Switching channel once in a sequence is fine.

## `clients proposal {slug}` : diagnostic plus priced options

Only for prospects in `Conversation` or later. Never write a proposal on speculation. Two pages, about 600 words.

**Page 1, the diagnostic.** What is working (two real positives), what it is costing them (three gaps, each tied to a business consequence), and what you would do first (one action they could take this month). This page is a gift. It is worth sending even if they never sign.

**Page 2, three options.** Always three, always priced, taken from your rate card in `modes/_profile.md`:

| Option | Scope | Investment | Best for |
|--------|-------|------------|----------|
| Smaller entry | {bounded first step} | {your rate} | Testing the relationship |
| Core | {the full fix for the named gap} | {your rate} | The recommended path |
| Ongoing | {retainer or part-time shape, with a minimum term} | {your rate} per month | Keeping it from drifting |

Anchor on a project or monthly figure, not an hourly one. If they push on price, the scope gets smaller. The same deliverable is never discounted twice (`modes/negotiation.md`). Log the send. Stage becomes `Proposal`.

## `clients prep {slug}` : pre-meeting brief

One page, written into the prospect file under `## Meeting prep`. Check your email for any earlier thread with them and your calendar for the meeting details.

- **Snapshot and people:** two or three lines on the company, then each person in the room with role and one hook.
- **Their likely pain, ranked,** tied to the diagnostic.
- **Question plan:** three to five questions written for this prospect, moving from situation to problem to implication to payoff (`library/sales-conversations.md`). Spend the most effort on the implication questions.
- **Money plan:** how you will state a range and ask whether it matches what they planned for. Do not leave without a reaction to price.
- **Objections and opening line:** the three most likely objections with a reframe each, and one opening sentence about their business, not flattery.
- **The advance:** the specific commitment and date you will ask for. "Let's stay in touch" is a stall.

## `clients won {slug}` and `clients lost {slug}`

**Won.** Set stage `Won`. Record deal shape, value, start date and days from first touch to agreement. Add one sentence to `## Wins - pattern log` in `data/prospects.md`: which signal mattered and what closed it. If the work recurs, run `clients retainer add {slug}`. Then schedule the harvest for delivery day, not signing day:

- [ ] Testimonial, asked at the moment they are happiest
- [ ] Case study with before, after and a number, with rights agreed
- [ ] Referral ask naming a specific kind of person, plus a blurb they can forward
- [ ] Offer of an ongoing shape at final delivery, and `network add` for your champion

**Lost.** Use when they pass explicitly or have been Dormant for 60 days. Set stage `Lost` with one reason: `no_budget`, `wrong_timing`, `chose_competitor`, `internal_hire`, `silent`, `bad_fit`. Add one sentence to `## Losses - pattern log` on which signal was misread. A loss from a prospect scored 4.0 or higher gets a note on which factor was over-weighted.

## `clients pipeline` : weighted forecast

Stage weights: New 0%, Researched 10%, Outreached 20%, Conversation 40%, Proposal 60%, Negotiating 80%, Won 100%, Lost and Dormant 0%.

Weighted value is the sum of each deal value times its stage weight. Show totals by stage, expected closes this month, and every deal with no activity for 14 days, which needs a nudge or a decision to close it. A deal with no estimate counts at the minimum for its shape from your rate card. If the weighted pipeline is under twice your monthly target, say so.

## `clients retainer` : recurring clients

Recurring clients are tracked apart from one-off deals in `data/retainers.md`. Losing one costs more than missing a new project.

- `clients retainer` shows the monthly recurring total, each client's last touch, and renewals due in 30 days.
- `clients retainer add {slug}` requires stage `Won`. Record service, monthly amount, start, term and renewal date.
- `clients retainer renew {slug}` moves the renewal date and notes any rate change.
- `clients retainer churn {slug}` records end date and reason, asks what the first sign was and what would have prevented it, and sets a 90-day reminder if a way back looks plausible.

**Health:** touched within 30 days is healthy. 31 to 45 days needs a check-in this week. 46 days or more is churn risk: send something useful, not "is everything okay". With 30 days to renewal, prepare a summary of results and a plan for the next term.

## Standing rules

- Follow-up discipline beats scan volume. One or two scans a month is enough for most local markets.
- The diagnostic is a reputation asset. In a small market people talk.
- Never invent a contact, a number or a fact about a prospect. Unknown stays unknown.
