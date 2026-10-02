import { chromium } from 'playwright';
import { startStaticServer } from '../static-server.mjs';
const server = await startStaticServer('dist');
const browser = await chromium.launch();
for (const [reduced, js, name] of [[false, false, 'nojs'], [true, true, 'reduced']]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: js, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  await page.goto(server.url + '/', { waitUntil: 'networkidle' });
  for (const id of ['spacetime', 'learning', 'outreach']) {
    await page.evaluate((x) => { const el = document.getElementById(x); const r = el.getBoundingClientRect(); window.scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2); }, id);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `artifacts/shots/${name}-${id}.png` });
  }
  await context.close();
}
await browser.close(); await server.close();
