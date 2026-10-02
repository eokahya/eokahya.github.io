// Developer helper: full-page screenshots of inner pages.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const base = process.env.BASE ?? 'http://127.0.0.1:4321';
const width = Number(process.env.W ?? 1440), height = Number(process.env.H ?? 900);
const theme = process.env.THEME ?? 'dark';
const pages = (process.env.PAGES ?? '/research/,/publications/,/outreach/,/teaching/,/teaching/myz-310e/,/about/,/contact/,/missing-page/').split(',');
await mkdir('artifacts/pages', { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=metal'] });
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference' });
await context.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
const page = await context.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('console error:', m.text()); });
page.on('pageerror', (e) => console.log('page error:', e.message));
for (const path of pages) {
  const response = await page.goto(base + path, { waitUntil: 'networkidle' });
  // reveal everything that is revealed on scroll
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 140)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1300);
  const name = path.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home';
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: `artifacts/pages/${theme}-${width}-${name}.png`, fullPage: process.env.FULL !== '0' });
  console.log(path, response?.status(), 'overflowX', overflow);
}
await browser.close();
