/**
 * Watches Proton Mail for Greenhouse security codes
 * Writes each code to /tmp/greenhouse-code-{company}.txt for the submit script to pick up
 * Run: node watch-codes.mjs
 */
import { chromium } from 'playwright'

// Companies we're waiting codes for
const WAITING = {
  'Semafor': '/tmp/greenhouse-code-semafor.txt',
  'Chime Financial': '/tmp/greenhouse-code-chime.txt',
}

import fs from 'fs'

async function getLatestCodes(page) {
  try {
    const iframes = await page.frames()
    // Also check visible iframe content via evaluate
    const code = await page.evaluate(() => {
      const iframes = document.querySelectorAll('iframe')
      for (const iframe of iframes) {
        try {
          const text = iframe.contentDocument?.body?.innerText || ''
          if (text.includes('Copy and paste this code')) {
            const match = text.match(/\b([A-Za-z0-9]{8})\b/)
            return match ? match[1] : null
          }
        } catch {}
      }
      return null
    })
    return code
  } catch { return null }
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Login to Proton Mail is needed — use existing session via storage
  // We'll navigate to proton mail and hope there's an existing session
  await page.goto('https://mail.proton.me/u/3/inbox', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  const found = new Set()
  console.log('Watching Proton Mail for security codes...')

  for (let i = 0; i < 60; i++) { // 5 minutes max
    try {
      // Reload inbox to get fresh emails
      await page.goto('https://mail.proton.me/u/3/inbox', { waitUntil: 'networkidle' })
      await page.waitForTimeout(2000)

      const content = await page.evaluate(() => document.body.innerText)

      for (const [company, codePath] of Object.entries(WAITING)) {
        if (found.has(company)) continue

        if (content.includes(`Security code for your application to ${company}`)) {
          // Find and click that email
          const emails = [...document.querySelectorAll('*')]
          // Navigate to it
          const emailEl = await page.evaluate((co) => {
            const els = [...document.querySelectorAll('*')]
            const el = els.find(e => e.children.length === 0 && e.textContent?.includes(`Security code for your application to ${co}`))
            if (el) {
              el.closest('[data-element-id], li, article')?.click()
              return true
            }
            return false
          }, company)

          if (emailEl) {
            await page.waitForTimeout(2000)
            const code = await page.evaluate(() => {
              const iframes = document.querySelectorAll('iframe')
              for (const iframe of iframes) {
                try {
                  const text = iframe.contentDocument?.body?.innerText || ''
                  if (text.includes('Copy and paste this code')) {
                    const match = text.match(/\b([A-Za-z0-9]{8})\b/)
                    return match ? match[1] : null
                  }
                } catch {}
              }
              return null
            })

            if (code) {
              console.log(`[${company}] Code: ${code} → ${codePath}`)
              fs.writeFileSync(codePath, code)
              found.add(company)
            }
          }
        }
      }
    } catch (e) {
      console.error('Error:', e.message)
    }

    if (found.size === Object.keys(WAITING).length) {
      console.log('All codes found!')
      break
    }

    await page.waitForTimeout(5000) // Check every 5s
  }

  await browser.close()
  console.log('Watcher done. Found:', [...found])
}

main().catch(console.error)
