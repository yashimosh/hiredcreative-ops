# Generate Tailored CV (HTML)

Produce a complete, ATS-clean, role-tailored CV as a single self-contained HTML file. It will be rendered to PDF and attached to a real application, so it must be **factually exact** and **visually clean**.

## Source-of-truth rule (non-negotiable)

Every line of the CV must come from `cv.md` (canonical experience) and `article-digest.md` (metrics/proof points). **Never invent, inflate, or reorder facts dishonestly.** You may:
- Re-emphasize which real experiences lead, based on the role
- Tighten phrasing
- Select which real proof points to surface
You may NOT add a title, employer, date, skill, or metric that isn't in the source.

## Inputs

- `cv.md` — canonical CV (read fully)
- `article-digest.md` — metrics/proof points (read; takes precedence for numbers)
- `templates/cv-template.html` — the visual template (read; reuse its `<style>` block exactly, including @font-face)
- `{{REPORT_FILE}}` — the A-G evaluation (Block B archetype, Block F application strategy — use for framing/emphasis)
- `{{BRIEF_FILE}}` — company brief (for which competencies to surface)
- Role: `{{ROLE}}` at `{{COMPANY}}` · Archetype: read from the report

## Tailoring

- **Professional Summary**: 2-3 lines framed for this archetype + company. Grounded in real experience.
- **Experience order**: lead with the most relevant real roles for THIS position.
- **Core competencies**: select the real skills that match the JD.
- Keep it to 1-2 pages of content.

## Output — STRICT

Output ONLY the complete HTML document, nothing else (no markdown fences, no commentary). It must:
1. Reuse the `<style>` block from `templates/cv-template.html` verbatim, EXCEPT change every font `url('./fonts/...')` to `url('../../fonts/...')` (the CV renders from output/resumes/, fonts live at repo-root /fonts/).
2. Fill the template's structure with the tailored, grounded content.
3. Use the candidate's real name, email, links from `config/profile.yml`.
4. Be valid standalone HTML (doctype, head with style, body).

Start your output with `<!DOCTYPE html>` and end with `</html>`. No other text.
