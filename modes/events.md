# Mode: events — Find local events, prepare for them, and turn contacts into pipeline

<!-- ============================================================
     SYSTEM LAYER. Auto-updatable. Do not put personal data here.
     Your cities and target sectors live in modes/_profile.md.
     Event data lives in data/events.md and data/events/.
     ============================================================ -->

Tracks conferences, trade fairs, expos, meetups, open calls and festivals in the cities you work in. Before each event it cross-references your prospect list and your network and produces a short brief: who is likely to be there, who to find, what to bring. After each event it logs who you met and queues follow-ups.

**Why this exists:** one real conversation at the right event beats a month of cold messages. Events are the fastest route to a warm first touch with people who are hard to reach online.

**Method layer:** `library/networking.md` (events section: the work is before and after, three real conversations beat thirty cards, follow up within 24 to 48 hours). Contacts worth keeping are promoted to `data/network/` through `modes/networking.md`.

---

## Two rules first

1. **Home city first, then other cities.** Every scan covers your home city completely before it looks anywhere else. The order of cities is set in `modes/_profile.md`.
2. **Keep a standing source list and re-check it weekly.** The list of organisers and venues lives in `data/events.md` under `## Sources to monitor`. Work through all of it on every scan. Events were missed when the list covered only one venue.

---

## Sub-commands

| Input | What it does |
|-------|--------------|
| `events` | Dashboard of upcoming and recent events |
| `events scan` | Find upcoming events from the source list and search |
| `events add {name}` | Register an event you heard about |
| `events prep {slug}` | Pre-event brief |
| `events log {slug}` | Post-event contact log and follow-ups |

An unrecognised sub-command falls back to the dashboard.

---

## Data files

| File | Purpose |
|------|---------|
| `data/events.md` | Tracker: source list, upcoming, recurring, past |
| `data/events/{slug}.md` | One file per event: details, prep brief, contact log |

This mode reads `data/prospects.md`, `data/prospects/*.md` and `data/network/INDEX.md` for cross-referencing. It writes prospect and network files only through `events log`, following the logging rules in `modes/clients.md`.

### `data/events.md` layout

```markdown
# Events

## Sources to monitor
| Source | City | Kind | Where to check | Last checked |
|--------|------|------|----------------|--------------|

## Upcoming
| Slug | Event | City | Type | Dates | Links | CRM Matches | Prep | Notes |
|------|-------|------|------|-------|-------|-------------|------|-------|

## Recurring
| Event | City | Usual month | Organiser | Last edition |
|-------|------|-------------|-----------|--------------|

## Past
| Slug | Event | Dates | Contacts logged | Follow-ups pending |
|------|-------|-------|-----------------|--------------------|
```

**The `Upcoming` table format is fixed.** The columns are exactly `| Slug | Event | City | Type | Dates | Links | CRM Matches | Prep | Notes |`, in that order. Do not add, remove or reorder columns.

**The Dates cell starts with an ISO date, `YYYY-MM-DD`.** Tooling reads the first ISO date in the fifth column. Examples:

- `2027-03-14` for a one-day event
- `2027-03-14 to 2027-03-16` for a range
- `2027-03-01 (unconfirmed, month only)` when only the month is known

Keep rows in date order. The Prep cell is `no` or `yes YYYY-MM-DD`.

---

## Event types worth tracking

| Type | Why it matters |
|------|----------------|
| Conferences and business forums | Owners, executives and funders in one room |
| Trade fairs and expos | Every exhibitor has shown they spend on marketing |
| Sector festivals (food, design, film, books, music) | Brand owners and sponsors present in person |
| Startup and tech events, demo days, hackathons | Founders with new budgets. Some can be entered. |
| Meetups, open studios, portfolio nights | Peers: referrals, collaborations, market intelligence |
| Open calls, competitions, juried shows | Proof points you can earn, and organisers worth knowing |
| Fundraisers and galas | Established business owners in a relaxed setting |
| University and school events | Education leads and an engaged parent community |

Skip gatherings with no commercial or professional audience for what you sell.

---

## `events` : dashboard

```
Events: {YYYY-MM-DD}

Upcoming
  {date}  {event} | {city} | {type} | {N} CRM matches | prep: {yes/no}

Needs prep (within 14 days, no brief): {event}, {date}

Past 90 days
  {event} | {date} | contacts logged: {N} | follow-ups pending: {N}

Source list last fully checked: {date}
```

If the source list was last checked more than seven days ago, say so and offer to run `events scan`.

---

## `events scan` : discovery

**Horizon:** the next six months. Many local events announce only two to four weeks ahead, which is why the scan is weekly.

**Procedure:**

1. Open `## Sources to monitor` in `data/events.md`. If it is empty, build it first (see below).
2. Check every source, home city first, then the other cities in profile order. Update `Last checked` for each one as you go.
3. Run open searches per city for anything the list does not cover: `{city} conference {year}`, `{city} expo`, `{city} trade fair`, `{city} design festival`, `{city} meetup {your field}`, `{city} open call`, `{city} hackathon`. Search in every language your market uses.
4. Any organiser or venue found this way that is not on the source list gets added to it.
5. For each event capture: slug, name, city, venue, type, dates, organiser, source link, confidence, expected audience.
6. Deduplicate against every row in `data/events.md`, including Recurring and Past.
7. Add new rows to `## Upcoming` in date order.
8. Add confirmed events to your calendar. Mark unconfirmed dates as tentative.
9. Cross-reference: fill the CRM Matches cell with prospects and network contacts likely to attend.
10. For anything within 14 days, run `events prep {slug}` straight away.
11. Report what could not be verified and which sources could not be read.

**Building the source list.** For each city, list: event organisers, exhibition and conference venues, the chamber of commerce and business associations, universities and cultural institutes, co-working spaces and incubators, professional associations in your field, ticketing and listing sites, and local business media. Record where each one actually announces: its website, a social page, a newsletter. A list with one venue on it is not a list.

**Accuracy rules:**

- Never invent an event, a date or an organiser. No source, no row.
- A date carried over from a previous edition is written as unconfirmed, with the previous edition's dates in Notes.
- Verified means the organiser's own page or a named news report. A listing site alone is unverified. Put the confidence in Notes.
- If a page could not be read, say "not read". Do not guess its contents.

Between scans, any event mentioned in conversation, on a poster or in a group chat is a lead. Add it with `events add`.

---

## `events add {name}` : manual add

For events heard about before they have a public page.

1. Ask for or infer the date and city. If the date is unknown, use the first day of the expected month and mark it unconfirmed.
2. Add a row to `## Upcoming` with slug `{name}-{yyyy}-{mm}` in lowercase with hyphens. Put `word of mouth` in Notes.
3. Create `data/events/{slug}.md` from the template below.
4. If the organiser or venue is new, add it to `## Sources to monitor`.
5. If the event is within 14 days, run `events prep {slug}` with what is known.

---

## `events prep {slug}` : pre-event brief

**Purpose:** walk in knowing who to find, what to say and what to bring.

1. Read `data/events/{slug}.md`.
2. From `data/prospects.md`, pull prospects in that city whose sector fits the event. Exhibitors and sponsors named on the event page are near-certain. Others are ranked by how plausible their attendance is.
3. From `data/network/INDEX.md`, pull contacts likely to attend, and anyone who could introduce you to a target in the room.
4. Rank the top five to eight people to find by prospect score and likelihood of presence. Prospects already in Conversation or later go first.
5. Add one or two discovery wildcards: kinds of people likely to be there who are not yet in your files.
6. Write the brief into `data/events/{slug}.md` under `## Prep brief`.
7. Set the Prep cell in `data/events.md` to `yes {date}`.

```markdown
## Prep brief ({YYYY-MM-DD})

### Snapshot
- **What it is:** {one line}
- **Who goes:** {exhibitors, sponsors, visitors, speakers}
- **Why attend:** {one sentence}
- **Entry:** {free | ticket | invite, and whether it is sorted}

### Who to find
| Priority | Name | Company | Source | Stage or tier | Why here | Opening line |
|----------|------|---------|--------|---------------|----------|--------------|
| 1 | | | {prospect / network} | | | |

### Who can introduce you
- {network contact} knows {target}. Ask before the event, not at it.

### Wildcards
- Look for: {kind of person or company, and how to spot them}

### What to bring
- {phone with portfolio ready offline, a few cards, one printed piece if the audience expects it, or nothing}

### One rule for this event
{a single behavioural instruction suited to the setting}

### Lines
- **At a stand:** {a question about their business, not a pitch}
- **In passing:** {a light opener}
- **"What do you do?":** {one sentence about the problem you solve, not a job title}
```

---

## `events log {slug}` : post-event

Run it the same day or the next morning, while memory is fresh. **Every follow-up goes out within 48 hours.** After that the event stops working as an opener.

1. The user lists who they met, in any form.
2. For each person:
   - **Already a prospect:** record the in-person touch in their prospect file and the outreach log (channel: in person). Move the stage if a real conversation happened.
   - **New and a potential client:** add to `data/prospects.md` under `## New` with `discovered_via: {slug}`.
   - **New and worth knowing regardless:** `network add`.
3. Set a follow-up for each:
   - Real conversation: within 24 hours, with one specific reference to what was said and the thing you offered to send.
   - Card or brief exchange: within 48 hours, with something small and useful.
   - Seen but not spoken to: add as New, low priority.
4. Write the contact log to `data/events/{slug}.md` and offer to draft the follow-ups now.
5. Add every sponsor and exhibitor you noticed to the discovery queue in `data/prospects.md`. They have shown they spend.
6. Move the event row from `## Upcoming` to `## Past` with counts.

```markdown
## Contact log ({YYYY-MM-DD})

| # | Name | Company | Role | How we met | Conversation | Follow-up | Due |
|---|------|---------|------|------------|--------------|-----------|-----|
```

---

## Per-event file: `data/events/{slug}.md`

```markdown
# {Event name}

- **Slug:** {slug}
- **City:** {city}
- **Venue:** {venue}
- **Type:** {conference | fair | expo | meetup | open call | festival | other}
- **Dates:** {YYYY-MM-DD} to {YYYY-MM-DD}
- **Organiser:** {name}
- **Source:** {link or word of mouth}
- **Confidence:** {verified | unverified}
- **Entry:** {free | price | invite only}
- **Expected audience:** {short description}

## Prep brief
## Contact log
## Notes
```

---

## Standing reminders

- **Go to listen and collect, not to pitch.** The pitch comes the next day, when you have their full attention.
- **"We met at {event}" is the warmest opener you have.** Use it in every follow-up.
- **Sponsor and exhibitor lists are budget signals.** Mine them even for events you do not attend.
- **The crew filming or photographing an event** usually belongs to a local studio or agency. It is an easy way to meet them.
- **Read the brief once and leave it at home.** It exists so you walk in with names and openers, not a rehearsed speech.
- **Hosting beats attending.** If the same people keep showing up, consider running a small gathering of your own (`library/networking.md`).
