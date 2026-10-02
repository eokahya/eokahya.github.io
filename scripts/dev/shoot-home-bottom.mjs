import { chromium } from 'playwright';
import { startStaticServer } from '../static-server.mjs';
const server = await startStaticServer('dist');
const browser = await chromium.launch({ args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(server.url + '/', { waitUntil: 'networkidle' });
for (const id of ['teaching', 'selected-work']) {
  await page.evaluate((x) => document.getElementById(x).scrollIntoView({ block: 'start' }), id);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `artifacts/shots/home-${id}.png` });
}
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await page.screenshot({ path: 'artifacts/shots/home-end.png' });
await browser.close(); await server.close();
