// Developer helper: screenshots at fractional journey progress (between acts).
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const base = process.env.BASE ?? 'http://127.0.0.1:4321';
const out = 'artifacts/shots';
await mkdir(out, { recursive: true });
const width = Number(process.env.W ?? 1440), height = Number(process.env.H ?? 900);
const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.classList.contains('webgl-ready'));
const points = (process.env.P ?? '0.5,1.5,2.5,3.5').split(',').map(Number);
for (const p of points) {
  await page.evaluate((target) => {
    const acts = [...document.querySelectorAll('[data-act]')];
    const i = Math.floor(target), f = target - i;
    const c = (el) => { const r = el.getBoundingClientRect(); return scrollY + r.top + r.height / 2; };
    const y = c(acts[i]) + (c(acts[Math.min(i + 1, acts.length - 1)]) - c(acts[i])) * f;
    window.scrollTo(0, y - innerHeight / 2);
  }, p);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/transition-${width}-${p}.png` });
  console.log('shot', p);
}
await browser.close();
