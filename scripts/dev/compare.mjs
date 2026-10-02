// Developer helper: side-by-side screenshots of the live GPT version and this version.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { startStaticServer } from '../static-server.mjs';
const server = await startStaticServer('dist');
await mkdir('artifacts/compare', { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
const targets = { gpt: 'https://eokahya.github.io', claude: server.url };
const shots = [
  ['home-1', '/', 0], ['home-2', '/', 0.32], ['home-3', '/', 0.55], ['course', '/teaching/myz-310e/', 0], ['publications', '/publications/', 0], ['research', '/research/', 0],
];
for (const [label, origin] of Object.entries(targets)) {
  for (const [vw, vh, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    for (const [name, path, frac] of shots) {
      if (tag === 'mobile' && name !== 'home-1' && name !== 'course') continue;
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      if (frac) {
        await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), frac);
        await page.waitForTimeout(2400);
      } else await page.waitForTimeout(1500);
      await page.screenshot({ path: `artifacts/compare/${label}-${tag}-${name}.png` });
    }
    await page.close();
  }
}
await browser.close(); await server.close();
console.log('done');
