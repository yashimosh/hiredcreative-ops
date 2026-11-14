/**
 * fill-visible.mjs — fill one or more Ashby application forms in a VISIBLE browser and stop.
 * The candidate reviews each tab and clicks Submit (and any captcha) themselves. Never submits.
 * Field ids come from each form (inspect the
 * page or Ashby's posting API). Yes/No questions are matched by question text; check the
 * screenshots in output/submissions/ before handing over.
 *
 * answers.json: { "<key>": { url, cv (repo-relative), text: {fieldNameOrId: value},
 *   yesno: [[questionSubstring, "Yes"|"No"]], radio: [label], combo: [[question, typed]] } }
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = process.argv[2];
if (!dataPath) { console.log('usage: node scripts/fill-visible.mjs <answers.json>  (see docs in file header)'); process.exit(1); }
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const OUT = resolve(ROOT, 'output/submissions'); (await import('fs')).mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: false, ...(process.env.FORM_BROWSER_PATH || process.platform === 'darwin' ? { executablePath: process.env.FORM_BROWSER_PATH || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser' } : {}) });
const ctx = await browser.newContext({ viewport: null });
const report = {};
for (const [key, f] of Object.entries(data)) {
  const r = report[key] = { filled: [], missed: [] };
  const page = await ctx.newPage();
  console.log('open', key); await page.goto(f.url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForSelector('input[name="_systemfield_name"]', { timeout: 60000 }); console.log('loaded', key);
  await page.waitForTimeout(2500);
  try { await page.setInputFiles('input[name="_systemfield_resume"], input#_systemfield_resume', ROOT + '/' + f.cv); r.filled.push('resume'); } catch (e) { r.missed.push('resume: ' + e.message.slice(0, 80)); }
  await page.waitForTimeout(6000); // Ashby parses the CV and may prefill fields; fill after
  for (const [id, val] of Object.entries(f.text)) {
    const loc = page.locator(`[name="${id}"], [id="${id}"]`).first();
    try { await loc.fill(val); r.filled.push(id.slice(0, 18)); } catch (e) { r.missed.push(id + ': ' + e.message.slice(0, 60)); }
  }
  for (const [q, ans] of f.yesno) {
    try {
      const box = page.getByText(q, { exact: false }).first().locator('xpath=ancestor::div[.//button[normalize-space()="Yes"] and .//button[normalize-space()="No"]][1]');
      const btns = box.getByRole('button', { name: ans, exact: true });
      if ((await btns.count()) !== 1) throw new Error('found ' + (await btns.count()) + ' buttons');
      await btns.click();
      await page.waitForTimeout(400);
      r.filled.push('yesno ' + q + '=' + ans);
    } catch (e) { r.missed.push('yesno ' + q + ': ' + e.message.slice(0, 80)); }
  }
  for (const label of f.radio) {
    try { await page.getByLabel(label, { exact: true }).check(); r.filled.push('radio ' + label); } catch (e) { r.missed.push('radio ' + label); }
  }
  for (const [q, typed] of f.combo) {
    try {
      const input = page.locator('input[role="combobox"], input[placeholder*="Start typing" i]').first();
      await input.click(); await input.fill(typed); await page.waitForTimeout(1500);
      const opt = page.locator('[role="option"]').filter({ hasText: /T(u|ü)rk/ }).first();
      const txt = await opt.innerText(); await opt.click(); r.filled.push('combo ' + q + ' = ' + txt);
    } catch (e) { r.missed.push('combo ' + q + ': ' + e.message.slice(0, 80)); }
  }
  console.log('done', key);
  await page.screenshot({ path: `${OUT}/${key}.png`, fullPage: true });
  r.captcha = await page.locator('iframe[src*="recaptcha"], textarea[name="g-recaptcha-response"]').count() > 0;
}
writeFileSync(`${OUT}/fill-report.json`, JSON.stringify(report, null, 1));
console.log('FILLED', JSON.stringify(report));
await new Promise((res) => browser.on('disconnected', res)); // stay open until the window is closed
