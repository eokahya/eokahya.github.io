// Developer helper: screenshots of the journey acts (not part of the build).
import { chromium } from 'playwright';
const base = process.env.BASE ?? 'http://127.0.0.1:4321';
const out = process.env.OUT ?? 'artifacts/shots';
const width = Number(process.env.W ?? 1440), height = Number(process.env.H ?? 900);
const theme = process.env.THEME ?? 'dark';
const acts = (process.env.ACTS ?? 'spacetime,fields,learning,mechanisms,outreach').split(',');
const extra = process.env.EXTRA ?? '';
import { mkdir } from 'node:fs/promises';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: Number(process.env.DPR ?? 1) });
page.on('console', (m) => { if (m.type() === 'error' || m.text().includes('Journey')) console.log('console:', m.text()); });
await page.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('webgl-ready') || document.documentElement.classList.contains('no-webgl'), null, { timeout: 15000 });
console.log('classes:', await page.evaluate(() => document.documentElement.className));
for (const act of acts) {
  await page.evaluate((id) => { const el = document.getElementById(id); const r = el.getBoundingClientRect(); window.scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2); }, act);
  await page.waitForTimeout(Number(process.env.WAIT ?? 2600));
  if (extra && act === 'mechanisms') { for (const sel of extra.split('|')) { await page.click(sel); await page.waitForTimeout(1800); } }
  const stage = await page.evaluate(() => document.querySelector('[data-journey]')?.dataset.stage);
  await page.screenshot({ path: `${out}/${theme}-${width}-${act}.png` });
  console.log('shot', act, 'stage', stage);
}
await browser.close();
