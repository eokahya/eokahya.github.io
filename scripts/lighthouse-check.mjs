import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const output = path.resolve('artifacts/lighthouse');
await mkdir(output, { recursive: true });
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new'] });
const summary = [];
try {
  for (const [name, route] of [['home', '/'], ['publications', '/publications/'], ['course', '/teaching/myz-310e/2026-fall/']]) {
    const result = await lighthouse(new URL(route, base).href, { port: chrome.port, output: ['html', 'json'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    if (!result) throw new Error(`Lighthouse produced no result for ${route}`);
    const [html, json] = result.report;
    await writeFile(path.join(output, `${name}.html`), html);
    await writeFile(path.join(output, `${name}.json`), json);
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)]));
    const row = { route, checkedAt: result.lhr.fetchTime, formFactor: result.lhr.configSettings.formFactor, scores, runtimeError: result.lhr.runtimeError ?? null, warnings: result.lhr.runWarnings, targetMet: scores.performance >= 90 && scores.accessibility >= 95 };
    summary.push(row);
    console.log(JSON.stringify(row));
  }
} finally {
  await chrome.kill();
  await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
}
if (summary.some((row) => row.runtimeError || !row.targetMet)) process.exitCode = 1;
