import { chromium } from 'playwright';

/**
 * Fetches HTML from a URL using Playwright to render JavaScript
 * (Stealth Mode for CSR-heavy & anti-bot sites)
 */
export async function fetchDynamicHTML(url) {
  let browser = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      viewport: { width: 1366, height: 768 },
      javaScriptEnabled: true,
      ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();

    // Anti-bot tricks
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 45000
    });

    const html = await page.content();

    await browser.close();
    return html;

  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    throw err;
  }
}


