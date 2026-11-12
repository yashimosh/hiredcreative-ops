# What converts — order of work for a creative job and client search

**Source:** one creative professional's own search, audited after six months (2026-11). Not a study.
One market position (designer outside the hiring country, needing sponsorship or contractor terms),
so treat the numbers as one data point and re-run the audit on your own tracker.

## The numbers

| Channel | Volume | Result |
|---|---|---|
| Cold applications through ATS forms | ~160 | 0 interviews |
| Cold email to prospects | ~15 | 0 replies |
| Messaging app to prospects (named person) | part of 32 prospects contacted in total | 71% reply rate |
| People and events (introductions, fairs, in-person) | a handful | every paid result |

Research ran far ahead of action: about 1,950 evaluation reports and 500 prospect files, against 70
applications with almost no follow-ups logged.

## What it means

1. **Discovery is not the bottleneck.** More scans and more evaluations add to a pile nobody acts on.
2. **Eligibility decides before fit does.** If the employer cannot hire you where you are, a 4.5/5 match is
   worth nothing. Answer that first, with a question to a human if the posting is silent.
3. **A named person beats a form.** Introductions, events and direct messages converted. Forms did not.
4. **An application without a follow-up path is not live.** Log who you will follow up with on the day you apply.
5. **A warm relationship decays; a cold lead does not.** Order the day by decay, not by score.

## The order of work

1. Money owed and renewals.
2. People already talking to you (prospects past first contact, open promises).
3. Live applications that are due a follow-up.
4. Events in the next weeks: who will be there, what you bring.
5. Inbound and warm new leads.
6. Cold new leads, last, and only after an eligibility check.

`node today.mjs` prints this list from the plain files.

## Running the audit on your own data

- `node today.mjs` — the action list.
- `node analyze-patterns.mjs` — outcomes by archetype, score band and remote policy.
- `node followup-cadence.mjs` — which applications are overdue.
- Count, per channel: sent, replied, met, paid. If a channel has 50+ sends and nothing past "sent", stop
  feeding it and move the hours to the channel that has produced a meeting.
