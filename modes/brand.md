# Mode: brand — Content and thought leadership that brings work to you

<!-- ============================================================
     SYSTEM LAYER. Auto-updatable. Do not put personal data here.
     Your positioning, audience, pillars and voice rules live in
     modes/_profile.md. Content data lives in data/content-pipeline.md.
     ============================================================ -->

The content track. It produces inbound for both the jobs track and the clients track. A published piece keeps working after you stop: recruiters check it before an interview, prospects see it between your messages, and contacts get a reason to mention you.

**Method layer:** `library/marketing.md` (the before, during and after canvas, and message construction), `library/positioning.md` (what to say, to whom), `library/lead-generation.md` (content as one of the four lead channels), `library/persuasion.md` (authority and social proof), `library/communication.md` (register per platform and audience). `library/custom/*` overrides these where it disagrees.

**Data file:** `data/content-pipeline.md`
**Identity and voice:** `modes/_profile.md`

---

## Sub-commands

| Input | What it does |
|-------|--------------|
| `brand` or `brand status` | Dashboard: calendar, recent output, balance, attribution |
| `brand plan` | Plan the next two weeks from your pillars and what is live in your pipelines |
| `brand write {topic}` | Draft one piece |
| `brand review` | Audit the last 30 days for balance and drift |
| `brand publish {piece}` | Log a piece the user has published |
| `brand attribute {lead}` | Record which content brought in a lead |
| `brand audit` | Quarterly positioning check |

---

## Data: `data/content-pipeline.md`

```markdown
# Content pipeline

## Pillars
| Pillar | What it proves | Target share |
|--------|----------------|--------------|

## Content calendar
| Date | Title | Pillar | Phase | Platform | Audience | Hook | Status |
|------|-------|--------|-------|----------|----------|------|--------|

## Publishing log
| Date | Title | Pillar | Phase | Platform | Link | Result after 7 days |
|------|-------|--------|-------|----------|------|---------------------|

## Inbound attribution
| Date | Lead | Type | Came from | Piece | Went to |
|------|------|------|-----------|-------|---------|
```

Status values: `idea`, `draft`, `ready`, `published`. Nothing else.

**Pillars** are the three to five subjects you want to be hired for. Define them once in `modes/_profile.md` and mirror them here. Generic examples: case studies, process breakdowns, portfolio pieces, point of view on your field, behind the scenes.

---

## Three jobs a piece can do

Every piece does one of three jobs. Most people publish only the first kind, collect views and wonder why nothing converts.

| Phase | Job | Example formats | Signal that it worked |
|-------|-----|-----------------|-----------------------|
| **Before** (awareness) | Get seen by people who do not know you | A clear opinion on your field, a strong portfolio piece | Reach, profile visits |
| **During** (nurture) | Move people who know you towards hiring you | Case studies, "how I solved this", process breakdowns | Direct messages, saves, "can you do this for us?" |
| **After** (referral) | Give clients and contacts a reason to recommend you | Results, testimonials, finished work going live | Shares, tags, referred leads |

---

## `brand status` : dashboard

```
Brand and content: {YYYY-MM-DD}

This week:          {N} published (target {N})
Last published:     {date}, "{title}" on {platform}
Pillar balance 30d: {pillar} {N} · {pillar} {N} · ...
Phase balance 30d:  before {N} · during {N} · after {N}
Next 7 days:        {N} planned, {N} ready
Inbound attributed: {N} leads traced to content
Drift:              {does what you publish match what you want to be hired for?}
```

---

## `brand plan` : two-week calendar

**Read first:**

1. `data/content-pipeline.md`: calendar, log, pillar targets
2. `modes/_profile.md`: positioning, audience, services, voice
3. `data/prospects.md`: sectors and gap types active in the clients track
4. `data/applications.md` and `data/pipeline-inbound.md`: roles being pursued and what is arriving unprompted

**Procedure:**

1. Check pillar and phase balance for the last 30 days. Find what is under-served.
2. Read the live context:
   - Active client conversations: a case study or process piece those prospects would recognise their problem in
   - Target roles: pieces that show the skill those roles ask for
   - Recent wins: result stories, with the client's permission
3. Produce six to eight ideas for the next two weeks. Each has a topic, pillar, phase, platform, audience and a draft first line. Include at least one piece from each active pillar and each phase.
4. Write them to `## Content calendar` with status `idea`.

**Rules:**

- Every piece connects to a target role, an active prospect sector or a relationship worth maintaining. If it connects to none, cut it.
- Choose platforms by where your buyers and hiring managers actually are, not by habit. Set the order in `modes/_profile.md`.
- Never write about a client or prospect by name without their agreement.

---

## `brand write {topic}` : draft one piece

1. Classify it: pillar, phase, platform.
2. Set the register for the platform and audience (`library/communication.md`). A professional network wants an insight stated plainly. A visual platform wants the image to carry it and a short caption. A short-form text platform wants one compressed opinion.
3. Draft:
   - **First line:** a specific claim, a concrete result or an honest contrarian view. It has to earn the click on its own. Never a generic opener.
   - **Body:** one idea, one story, one insight. A specific example beats an abstract claim. Lead with the problem the reader has, not with what you made.
   - **Ask, if any:** soft and specific. An invitation to message you about that exact problem works better than a request for engagement.
4. Run the voice check against the rules in `modes/_profile.md`. Remove anything that reads as machine-written filler: stock openers, empty enthusiasm, lists of three for rhythm.
5. Check every fact, number and name against `cv.md`, `article-digest.md` or the user. Never invent a result.

**Output:**

```markdown
## Draft: {title}

**Platform:** {platform}
**Pillar:** {pillar}
**Phase:** {before | during | after}
**Suggested date:** {YYYY-MM-DD}

---

{draft}

---

**First line:** {does it earn the click? one honest sentence}
**Voice check:** {pass | flagged: what and where}
**Facts to confirm:** {list, or none}
```

Add the piece to the calendar with status `draft`. It becomes `ready` only when the user approves it.

---

## `brand review` : monthly audit

Run monthly, or whenever the output feels off.

1. Read the last 30 days of the publishing log.
2. Check:
   - **Pillar balance:** any pillar at zero, or one pillar taking everything?
   - **Phase balance:** all "before" and no "during" means views without enquiries.
   - **Alignment:** does the subject matter match what you want to be hired for? Publishing about one thing while selling another is the most common drift.
   - **Platform spread:** everything on one platform is a single point of failure.
   - **Trend:** results improving, flat or falling?
3. Output a short scorecard and three specific recommendations. Feed them into the next `brand plan`.

---

## `brand publish {piece}` : log what went out

This mode does not post anything. The user publishes, then reports it.

1. Confirm the piece was actually published and get the link.
2. Move it from the calendar to `## Publishing log` with status `published`.
3. Set a reminder to fill "Result after 7 days".
4. Suggest two or three people in `data/network/` for whom this piece is a natural reason for a touch (`network touch`), and any prospect in Conversation or Proposal who should see it.

Never log a draft as published.

---

## `brand attribute {lead}` : inbound attribution

When a lead arrives without you asking for it (a recruiter message, a client enquiry, a referral), trace it.

1. Find out how they found you. Ask them, or read it from the message. If unknown, write "unknown". Do not guess.
2. Add a row to `## Inbound attribution`: the lead, its type, where it came from and the piece, if one can be named.
3. Route it: a job lead goes to `data/pipeline-inbound.md`, a client lead goes to `data/prospects.md` under `## New` with `discovered_via: inbound`.

This is how you learn which content brings work and which only collects likes.

---

## `brand audit` : quarterly positioning check

Uses the positioning questions from `library/positioning.md`:

1. **Alternatives:** what would your audience do if you did not exist? Has that changed?
2. **Unique attributes:** what can you do that those alternatives cannot? Any new proof since the last audit?
3. **Value:** what does that enable for the buyer?
4. **Who cares most:** which segment values it most, and are you reaching them?
5. **Category:** what frame do people put you in, and is it the right one?

Compare the answers with three things: what you published, what inbound arrived, and what roles or clients you actually landed. Each mismatch is drift. Write the findings and any changed positioning to `modes/_profile.md`, never to this file.

---

## How this track feeds the others

| Track | What content does for it |
|-------|--------------------------|
| Jobs | Shows the skill before the interview. Case studies and portfolio pieces are what hiring managers check. Brings inbound roles. |
| Clients | "During" pieces warm prospects between your messages. "After" pieces generate referrals. A visible body of work makes a first message less cold. |
| Network | Every piece is a reason for a touch, and it reaches people you could not message directly. |

---

## Rules

- **No filler.** Every piece passes the voice check. If it reads as machine-written, it does not ship.
- **Specific beats frequent.** One sharply specific piece a week beats daily generic posts.
- **Plan from pillars and pipeline, not from mood.**
- **Mostly give.** Roughly four pieces that teach, show or prove for every one that asks.
- **Track attribution.** Without it this is a hobby, not a system.
- **The user publishes.** This mode drafts, plans and logs. It never posts.
