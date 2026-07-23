# auto-submit — ATS Form Submission via Browser

## Purpose

Submit a prepared application autonomously using the Chrome browser extension. Called by `auto-loop` after CV generation and response drafting. Can also be called standalone for a single application.

---

## Input

Expects a submission package object (from auto-loop or manual call):

```
{
  url: string,           # Job posting URL (Ashby, Greenhouse, Lever, etc.)
  report_path: string,   # Path to evaluation report (for drafted responses)
  cv_path: string,       # Absolute path to tailored PDF
  track: string,         # remote | relocation_eu | relocation_us
  company: string,
  role: string,
  score: number
}
```

---

## Candidate Identity (from config/profile.yml)

Always read `config/profile.yml` before submitting — never hardcode identity fields in
this file. Pull:

| Field | Source in `config/profile.yml` |
|-------|-------|
| First / last / full name | `candidate.full_name` |
| Email | `candidate.email` |
| Phone | `candidate.phone` (per-track override if the user has set one) |
| LinkedIn | `candidate.linkedin` |
| Portfolio | `candidate.portfolio_url` |
| GitHub | `candidate.github` |
| Location | `location.city` / `location.country` (per-track override in `modes/_profile.md` if the user has set one, e.g. a different framing for remote vs. relocation applications) |

**Visa:** Read `location.visa_status`. On relocation tracks, only declare "requires
sponsorship" if that's actually true for the role's country — never claim a right to
work without verification.

---

## Submission Approach

**Use Playwright for all ATS form submissions.** Chrome MCP `file_upload` is session-restricted and cannot upload CV files. Playwright `setInputFiles()` has no such restriction and handles React-controlled inputs correctly via `fill()`.

Write a temporary Node.js script to `/tmp/submit-{company-slug}.mjs`, run it from the project directory (where `playwright` is installed), then delete the script.

**Template:**
```javascript
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: false, slowMo: 150 });
const page = await browser.newPage();
await page.goto(APPLICATION_URL, { waitUntil: 'networkidle' });
// ... fill fields using page.fill(), page.locator(), setInputFiles()
// Then: keep browser open if reCAPTCHA present (user completes it)
// Or: click Submit and wait for confirmation URL
```

Run command: `node /tmp/submit-{slug}.mjs` (from the repo root)

---

## Submission Procedure

### Step 1: Navigate

```
browser_navigate(url)
browser_snapshot()
```

Read the page. If it's a job description page (not yet a form), find the Apply button:
- Look for: "Apply", "Apply Now", "Apply for this job", "Submit Application"
- Click it
- Wait for form to load
- Snapshot again

### Step 2: Detect ATS

Identify from URL pattern:

| URL pattern | ATS |
|-------------|-----|
| `jobs.ashbyhq.com` | Ashby |
| `app.ashbyhq.com` | Ashby |
| `job-boards.greenhouse.io` | Greenhouse |
| `boards.greenhouse.io` | Greenhouse |
| `jobs.lever.co` | Lever |
| `*.teamtailor.com` | TeamTailor |
| `apply.workable.com` | Workable |
| `*.recruitee.com` | Recruitee |
| `*.personio.de` | Personio |
| Email-based | Email (see `modes/apply.md` § Sending method) |

If unknown: read page structure and adapt.

### Step 3: Fill Standard Fields

Use `browser_snapshot()` to read the form, then fill each field. Use `javascript_tool` for React-controlled inputs that don't respond to standard fill.

**Standard field mapping** (values from `config/profile.yml`, per the Candidate Identity section above):

| Label variant | Source field |
|---------------|-------|
| First name / Vorname | `candidate.full_name` (first token) |
| Last name / Surname / Nachname | `candidate.full_name` (remaining tokens) |
| Full name | `candidate.full_name` |
| Email / E-mail | `candidate.email` |
| Phone / Telefon | `candidate.phone` |
| LinkedIn / LinkedIn URL | `candidate.linkedin` |
| Portfolio / Website / Personal URL | `candidate.portfolio_url` |
| GitHub | `candidate.github` |
| City | `location.city` |
| Country | `location.country` |
| Location / Current location | `location.city` + `location.country` |
| Pronouns | (skip if optional) |

**For React-controlled inputs (common in Ashby/Greenhouse):**
```javascript
// If regular form_input fails, use this pattern:
const input = document.querySelector('input[name="..."]');
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
nativeInputValueSetter.call(input, 'VALUE');
input.dispatchEvent(new Event('input', { bubbles: true }));
input.dispatchEvent(new Event('change', { bubbles: true }));
```

### Step 4: Upload CV

Use Playwright's `setInputFiles()` — this bypasses all session restrictions:

```javascript
// Resume is usually the SECOND file input (first is often a hidden form field)
await page.locator('input[type="file"]').nth(1).setInputFiles(cv_path);
await page.waitForTimeout(800); // let upload XHR complete
```

If the field accepts specific formats, confirm the PDF is accepted (it always is).

### Step 5: Handle Custom Questions

Read the report at `report_path`. Look for drafted answers in sections E or F. If the form has questions matching those drafted answers, use them.

**Common custom questions and default answers:**

| Question type | Answer |
|---------------|--------|
| How did you hear about us? | "LinkedIn" or "Company website" |
| Are you authorized to work in [country]? | "No, I require visa sponsorship" (relocation) / "Yes" (remote, if applicable) |
| Do you require visa sponsorship? | "Yes" (relocation) / "No" (remote) |
| Salary expectation | Use comp range from profile.yml for the track |
| Earliest start date | "September 2026" (relocation) / "Immediately" (remote) |
| Years of experience | "5" |
| Are you open to relocation? | "Yes" (relocation tracks) / "N/A" (remote) |
| Cover letter / motivation | Use cover letter from report if drafted, else generate one inline |
| Notice period | "2 weeks" (independent practice — immediate for remote) |
| Willing to work from office? | Yes if hybrid/relocation role |

**GDPR / consent checkboxes:** Always check them.

**Equal opportunity / diversity forms:** Complete honestly:
- Gender: Male
- Race/ethnicity: Middle Eastern / Other (use whatever option is most accurate and available)
- Veteran status: Not a veteran
- Disability: No disability

### Step 6: Review Before Submitting

Do a final `browser_snapshot()` and scan for:
- Any required fields still empty (red borders, asterisks)
- Any error messages
- File upload confirmed (filename visible)

Fix anything missing, then proceed.

### Step 7: Submit

Find and click the submit button:
- "Submit", "Submit Application", "Apply", "Send Application", "Absenden"

Wait for the confirmation page (2-5 seconds). Take a final snapshot.

### Step 8: Verify and Log

**Confirmation signals:**
- URL changed to `/confirmation`, `/thank-you`, `/applied`
- Text: "Thank you", "Application received", "We'll be in touch", "successfully submitted"

**If submission confirmed:**
```
SUBMITTED: {company} — {role} at {timestamp}
Confirmation page: {url or screenshot description}
```

**If submission failed:**
- Note the error
- Try once more
- If still failing: log as FAILED and move to next application

---

## ATS-Specific Notes

### Ashby
- React-heavy — Playwright `fill()` handles React state correctly (Chrome MCP `form_input` does not)
- File upload: `input[type="file"]` nth(1) via `setInputFiles()` — works perfectly
- Location field: type into `[placeholder="Start typing..."]`, then click the `[role="option"]` result
- Privacy checkbox: hidden input, use `page.evaluate(() => { const cb = document.querySelector('input[type="checkbox"]'); cb.checked=true; cb.dispatchEvent(new Event('change',{bubbles:true})); })`
- **reCAPTCHA (v2)**: server-side enforced — automation fills everything, then keeps browser open for user to click the CAPTCHA widget (1 second) and Submit. Do NOT attempt to submit without reCAPTCHA completed.
- Confirmation: URL changes to `/confirmation`

### Greenhouse
- Standard HTML forms, simpler to fill
- Often asks EEOC questions at end — complete them
- Resume upload: `input#resume` or similar
- Confirmation: "Application submitted successfully"

### Lever
- Clean single-page form
- Cover letter field is optional — fill if present using report cover letter
- File upload is a button labeled "Upload"
- Confirmation: "Your application has been submitted"

### TeamTailor
- May have custom stages
- Connect/LinkedIn import buttons — ignore, fill manually
- Confirmation: "Thank you for your application"

### Workable
- Simple form
- May ask for availability to start
- Confirmation: redirect to "Application submitted"

---

## Failure Modes

| Situation | Action |
|-----------|--------|
| reCAPTCHA present (Ashby forms) | Fill everything via Playwright, keep browser open, notify user to complete 1-click CAPTCHA + Submit |
| Other CAPTCHA (image selection, puzzle) | Log as MANUAL_REQUIRED, skip, continue loop |
| Login required | Log as MANUAL_REQUIRED, skip |
| Form structure unrecognized | Adapt using snapshot + javascript_tool, attempt once |
| Network error | Retry once after 5 seconds |
| Confirmation not detected | Wait 10 seconds, snapshot again — if still unclear, log as UNCONFIRMED |
| Duplicate application detected | Log as DUPLICATE, skip |

---

## Return Value

Return a status object:

```
{
  status: "submitted" | "failed" | "manual_required" | "duplicate" | "unconfirmed",
  company: string,
  role: string,
  url: string,
  cv_used: string,
  timestamp: string,
  note: string
}
```
