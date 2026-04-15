import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { chromium, devices } from 'playwright'

const baseUrl = process.env.MOBILE_SMOKE_URL || 'http://127.0.0.1:4173'
const outputDir = path.join(os.tmpdir(), 'myappai-mobile-smoke')

async function capturePage(context, routePath, outputName) {
  const page = await context.newPage()
  const consoleErrors = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  await page.goto(new URL(routePath, baseUrl).toString(), {
    waitUntil: 'networkidle',
  })
  await page.waitForTimeout(900)
  await page.evaluate(() => {
    window.scrollTo({ top: 480, behavior: 'instant' })
  })
  await page.waitForTimeout(450)

  const headerBackground = await page.evaluate(() => {
    const target =
      document.querySelector('.site-header__inner') || document.body
    return window.getComputedStyle(target).backgroundColor
  })
  const screenshotPath = path.join(outputDir, outputName)
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  })

  const title = await page.title()
  await page.close()

  return {
    routePath,
    title,
    headerBackground,
    screenshotPath,
    consoleErrors,
  }
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    colorScheme: 'dark',
  })

  try {
    const homepage = await capturePage(context, '/', 'home-mobile.png')
    const adminLogin = await capturePage(
      context,
      '/admin/login',
      'admin-login-mobile.png'
    )

    const summary = {
      baseUrl,
      pages: [homepage, adminLogin],
    }

    if (summary.pages.some((page) => page.consoleErrors.length > 0)) {
      throw new Error(JSON.stringify(summary, null, 2))
    }

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
