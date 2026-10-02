// Developer helper: the canvas alone (act content hidden) at a given viewport.
import { chromium } from 'playwright';
const width = Number(process.env.W ?? 390), height = Number(process.env.H ?? 844);
const browser = await chromium.launch({ args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: Number(process.env.DPR ?? 2), isMobile: width < 760, hasTouch: width < 760 });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('webgl-ready'));
await page.addStyleTag({ content: '.act__content, .journey-overlay, .site-header { visibility: hidden !important; }' });
for (const id of (process.env.ACTS ?? 'spacetime,fields,learning,mechanisms,outreach').split(',')) {
  await page.evaluate((x) => { const el = document.getElementById(x); const r = el.getBoundingClientRect(); window.scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2); }, id);
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `artifacts/shots/bare-${width}-${id}.png` });
}
await browser.close();
