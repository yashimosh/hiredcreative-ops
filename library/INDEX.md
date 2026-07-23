# Library — Methodology Layer for hiredcreative-ops

Distilled operational playbooks from canonical books on positioning, lead generation,
outreach, sales conversations, negotiation, and networking — applied here to a job
search. Frameworks are attributed to their authors; text is original distillation, not
book excerpts. This is the layer the modes "train" on.

**How modes use this:** each mode cites which library files to read before acting — before
drafting outreach, prepping for an interview, or replying to a comp counter.

**How to extend:** your own notes from books you own go in `library/custom/` (user layer,
never touched by updates) — including full book distillations in `library/custom/books/`,
following the same attribution/provenance rule below. Modes read `library/custom/*` after
the core files; custom notes override core guidance on conflict.

## Core files

| File | Domain | Feeds |
|------|--------|-------------|
| `positioning.md` | What you offer, to whom, as what | `deep`, evaluations, portfolio copy |
| `lead-generation.md` | Filling the application pipeline | `scan`, `pipeline` |
| `outreach.md` | First touches that get replies | `contacto` |
| `sales-conversations.md` | Discovery calls, diagnosis, trust | interview prep |
| `negotiation.md` | Pushback, counters, closing terms | `negotiation` mode (comp) |
| `networking.md` | Relationships, warm intros, events | `contacto` |
| `persuasion.md` | The psychology underneath every tactic (why, not just what) | underlies `outreach.md`, `sales-conversations.md`, `negotiation.md` |
| `communication.md` | Register, listening, cross-cultural delivery | underlies all outbound copy + interviews |
| `marketing.md` | The system behind the pipeline (message → media → funnel) | one level above `lead-generation.md`; feeds `positioning.md` into a repeatable process |

## Precedence

1. `modes/_profile.md` + `config/profile.yml` (who you are — always wins)
2. `library/custom/*` (your own book notes, including any book distillations you add)
3. `library/*.md` (this core)

## Provenance rule

Nothing in `library/` may be copied text from a copyrighted work. Distill, attribute,
compress. When adding a new source: author + title in the Sources line, frameworks as
bullets, judgment calls marked *(judgment)*. Any book distillations in
`library/custom/books/` must be distilled from copies you actually own — never from
piracy sources.
