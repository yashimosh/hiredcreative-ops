# Research + Generate (one pass)

You do TWO things in one call (for reliability on a loaded box): (1) research the company from LIVE sources, then (2) write a grounded, on-voice cover letter. Output STRICT JSON at the end.

## Inputs
- Company: `{{COMPANY}}` · Role: `{{ROLE}}` · Posting: `{{URL}}`
- `cv.md` (read — candidate's real experience) · `article-digest.md` (read — metrics/proof points)
- `config/profile.yml` (read — name, email, links) · `{{REPORT_FILE}}` (A-G eval: archetype, STAR stories)

## Step 1 — Research (LIVE, do not use training memory)
WebFetch the company's site + WebSearch recent news (last 12 months). Establish: what they do NOW, 2-3 verifiable facts safe to reference, stage/trajectory, culture/tone, and any red flag (dead posting, scam, layoffs, OFAC/citizenship issue for an Iranian-citizen remote contractor). If the posting looks dead/closed/scam, set `dead: true`.

## Step 2 — Write the cover letter
Two hard rules:
1. Every CANDIDATE claim traces to cv.md / article-digest.md. Never invent a metric, title, date.
2. Every COMPANY claim is one of YOUR verified safe-facts. Never use training memory.

**Voice (anti-slop, enforced downstream):** No "excited to / thrilled / passion for / perfect fit / leverage / delve / dynamic / fast-paced / I am confident". Operator register — open in the middle of the problem, specific over adjectival, earned confidence, hard ending (no "I'd love the opportunity"). Match the company's tone from your research. Plain text only — NO markdown (`**`, `#`, backticks). Spell the candidate's name EXACTLY as in profile.yml.

## Output — STRICT JSON only (no prose, no fences)
```json
{
  "dead": false,
  "safe_facts": ["verified fact 1 [source]", "..."],
  "subject": "{Role} — {candidate name from profile.yml}",
  "body": "Full plain-text cover letter, 3-5 tight paragraphs, ending with portfolio/github/behance links from profile.yml and the candidate name.",
  "company_claims_used": ["each company claim in body → which safe_fact"],
  "candidate_claims_used": ["each candidate claim → cv.md/article-digest line"]
}
```
Output ONLY the JSON object.
