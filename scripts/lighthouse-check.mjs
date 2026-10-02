// Mobile Lighthouse (default emulation: Moto G Power, slow 4G, 4× CPU) on the production build.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { startStaticServer } from './static-server.mjs';

const server = await startStaticServer('dist');
const output = path.resolve('artifacts/lighthouse');
await mkdir(output, { recursive: true });
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new'] });
const routes = [['home', '/'], ['research', '/research/'], ['publications', '/publications/'], ['outreach', '/outreach/'], ['course', '/teaching/myz-310e/2026-fall/'], ['tr-home', '/tr/'], ['tr-about', '/tr/hakkinda/'], ['tr-outreach', '/tr/bilim-iletisimi/'], ['about', '/about/'], ['tr-research', '/tr/arastirma/']];
const summary = [];
try {
  for (const [name, route] of routes) {
    const result = await lighthouse(new URL(route, server.url).href, { port: chrome.port, output: ['html', 'json'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    if (!result) throw new Error(`Lighthouse produced no result for ${route}`);
    const [html, json] = result.report;
    await writeFile(path.join(output, `${name}.html`), html);
    await writeFile(path.join(output, `${name}.json`), json);
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round((category.score ?? 0) * 100)]));
    const metrics = Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift'].map((id) => [id, result.lhr.audits[id]?.displayValue]));
    const row = { route, formFactor: result.lhr.configSettings.formFactor, scores, metrics, runtimeError: result.lhr.runtimeError ?? null, targetMet: scores.performance >= 90 && scores.accessibility >= 95 };
    summary.push(row);
    console.log(JSON.stringify(row));
  }
} finally {
  await chrome.kill();
  await server.close();
  await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
}
if (summary.some((row) => row.runtimeError || !row.targetMet)) process.exitCode = 1;
