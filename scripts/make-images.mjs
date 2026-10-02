// One-off generator for public/apple-touch-icon.png and public/og-image.jpg (run manually: npm run images).
// Requires the dev or preview server; the OG card is a screenshot of the real WebGL hero.
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
const base = process.env.BASE ?? 'http://127.0.0.1:4321';
const browser = await chromium.launch(process.platform === 'darwin' ? { args: ['--use-angle=metal', '--ignore-gpu-blocklist'] } : {});

const icon = await browser.newPage({ viewport: { width: 180, height: 180 } });
const svg = (await readFile('public/favicon.svg', 'utf8')).replace('<rect width="32" height="32" rx="8"', '<rect width="32" height="32"');
await icon.setContent(`<html><body style="margin:0;background:#05060b">${svg.replace('<svg ', '<svg width="180" height="180" ')}</body></html>`);
await icon.screenshot({ path: 'public/apple-touch-icon.png', clip: { x: 0, y: 0, width: 180, height: 180 } });

const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('webgl-ready'));
await page.addStyleTag({ content: `
  .site-header, .journey-overlay, .hero-actions, .hero-quick, .skip-link { display: none !important; }
  .act--hero { padding-top: 0 !important; padding-bottom: 70px !important; min-height: 630px !important; }
  .hero-title { font-size: 104px !important; }
  .hero-lead { max-width: 30rem !important; }
  * { animation: none !important; }
` });
await page.waitForTimeout(3500);
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 86 });
await browser.close();
console.log('Wrote public/apple-touch-icon.png and public/og-image.jpg');
