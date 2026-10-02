// Browser acceptance checks against the production build (dist/), in Chromium and WebKit.
// Usage: npm run build && npm run check:browser   (ENGINES=chromium to limit, SHOTS=0 to skip screenshots)
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { startStaticServer } from './static-server.mjs';

const server = await startStaticServer('dist');
const base = server.url;
const out = 'artifacts/browser';
await mkdir(out, { recursive: true });
const engines = (process.env.ENGINES ?? 'chromium,webkit').split(',');
const shots = process.env.SHOTS !== '0';
const results = [];
const record = (engine, name, ok, detail = '') => {
  results.push({ engine, name, status: ok === null ? 'NOT RUN' : ok ? 'PASS' : 'FAIL', detail });
  const mark = ok === null ? 'NOT RUN' : ok ? 'PASS' : 'FAIL';
  console.log(`${mark.padEnd(7)} [${engine}] ${name}${detail ? ` — ${detail}` : ''}`);
};

const pages = [
  '/', '/research/', '/publications/', '/teaching/', '/teaching/myz-310e/', '/teaching/myz-310e/2026-fall/', '/teaching/myz-310e/2026-fall/syllabus/', '/outreach/', '/about/', '/contact/',
  '/tr/', '/tr/arastirma/', '/tr/yayinlar/', '/tr/ogretim/', '/tr/bilim-iletisimi/', '/tr/hakkinda/', '/tr/iletisim/',
];
const langFor = (path) => (path.startsWith('/tr/') ? 'tr' : 'en');
const widths = [375, 768, 1440];
const quiet = (text) => /favicon|ERR_ABORTED|Journey scene disabled/.test(text);

async function contextFor(browser, { width = 1440, height = 900, theme = 'dark', reduced = false, js = true, mobile = false, presetTheme = true } = {}) {
  const context = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: 1, javaScriptEnabled: js,
    reducedMotion: reduced ? 'reduce' : 'no-preference', colorScheme: theme, hasTouch: mobile, isMobile: mobile && browser.browserType().name() === 'chromium',
  });
  if (presetTheme) await context.addInitScript((t) => { try { if (!sessionStorage.getItem('preset')) { localStorage.setItem('theme', t); sessionStorage.setItem('preset', '1'); } } catch {} }, theme);
  return context;
}

async function scrollToAct(page, id) {
  await page.evaluate((x) => { const el = document.getElementById(x); const r = el.getBoundingClientRect(); window.scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2); }, id);
  await page.waitForTimeout(900);
}

for (const name of engines) {
  const type = name === 'webkit' ? webkit : chromium;
  // Real GPU on macOS; elsewhere (e.g. CI) the browser's default — scene checks report NOT RUN without WebGL.
  const browser = await type.launch(name === 'chromium' && process.platform === 'darwin' ? { args: ['--use-angle=metal', '--ignore-gpu-blocklist'] } : {});

  // 1 — every page, every width, both themes: status, console, overflow, headings
  for (const theme of ['dark', 'light']) {
    for (const width of widths) {
      const context = await contextFor(browser, { width, height: width < 760 ? 812 : 900, theme, mobile: width < 760 });
      const page = await context.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error' && !quiet(m.text())) errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push(e.message));
      for (const path of pages) {
        errors.length = 0;
        const response = await page.goto(base + path, { waitUntil: 'networkidle' });
        await page.waitForTimeout(250);
        const info = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          h1: document.querySelectorAll('h1').length,
          title: document.title,
          lang: document.documentElement.lang,
          emptyLinks: Array.from(document.querySelectorAll('a')).filter((a) => !(a.textContent ?? '').trim() && !a.getAttribute('aria-label')).length,
        }));
        const ok = response?.status() === 200 && info.overflow <= 0 && info.h1 === 1 && info.title.length > 10 && info.lang === langFor(path) && info.emptyLinks === 0 && errors.length === 0;
        record(name, `${path} @${width} ${theme}`, ok, ok ? '' : JSON.stringify({ status: response?.status(), ...info, errors: errors.slice(0, 2) }));
        if (shots && ((width === 1440 && theme === 'dark') || (width === 375 && theme === 'light'))) {
          await page.screenshot({ path: `${out}/${name}-${width}-${theme}-${path.replace(/\//g, '_') || 'home'}.png` });
        }
      }
      await context.close();
    }
  }

  // 2 — accessibility (axe-core): Chromium, both themes, desktop and mobile
  if (name === 'chromium') {
    for (const theme of ['dark', 'light']) {
      for (const width of [1440, 375]) {
        const context = await contextFor(browser, { width, height: width < 760 ? 812 : 900, theme, reduced: true });
        const page = await context.newPage();
        for (const path of pages) {
          await page.goto(base + path, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible')));
          const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
          const serious = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
          record(name, `axe ${path} @${width} ${theme}`, serious.length === 0, serious.map((v) => `${v.id}(${v.nodes.length})`).join(', '));
        }
        await context.close();
      }
    }
  } else record(name, 'axe-core scan', null, 'run in Chromium only');

  // 3 — the journey: real scene transformation, pause, rail, schematic controls
  {
    const context = await contextFor(browser, {});
    const page = await context.newPage();
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    const ready = await page.waitForFunction(() => document.documentElement.classList.contains('webgl-ready') || document.documentElement.classList.contains('no-webgl'), null, { timeout: 15000 }).then(() => page.evaluate(() => document.documentElement.classList.contains('webgl-ready')));
    record(name, 'home: WebGL scene initialised', ready === true ? true : null, ready ? '' : 'no WebGL in this headless engine — static plates shown instead');
    if (ready) {
      const stages = [];
      for (const id of ['spacetime', 'fields', 'learning', 'mechanisms', 'outreach']) { await scrollToAct(page, id); stages.push(await page.locator('[data-journey]').getAttribute('data-stage')); }
      record(name, 'home: scrolling morphs through all five stages', stages.join() === '0,1,2,3,4', stages.join());
      await scrollToAct(page, 'spacetime');
      const canvas = page.locator('#journey-canvas');
      const a = await canvas.screenshot(), b = (await page.waitForTimeout(700), await canvas.screenshot());
      record(name, 'home: scene animates when motion is allowed', !a.equals(b));
      await page.click('#motion-toggle');
      const pressed = await page.getAttribute('#motion-toggle', 'aria-pressed');
      await page.waitForTimeout(400);
      const c = await canvas.screenshot(), d = (await page.waitForTimeout(700), await canvas.screenshot());
      record(name, 'home: Pause animation freezes the scene', pressed === 'true' && c.equals(d), `aria-pressed=${pressed}`);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.documentElement.classList.contains('webgl-ready'));
      record(name, 'home: pause preference persists after reload', (await page.getAttribute('#motion-toggle', 'aria-pressed')) === 'true');
      await page.click('#motion-toggle');
      await scrollToAct(page, 'mechanisms');
      await page.click('[data-scene-action="circuit"]');
      await page.click('[data-scene-action="ablate"]');
      const status = (await page.textContent('#scene-status')) ?? '';
      const circuitPressed = await page.getAttribute('[data-scene-action="circuit"]', 'aria-pressed');
      const ablatePressed = await page.getAttribute('[data-scene-action="ablate"]', 'aria-pressed');
      record(name, 'home: circuit and ablation controls are announced', circuitPressed === 'true' && ablatePressed === 'true' && /schematic/i.test(status), status.slice(0, 60));
      if (shots) { await page.waitForTimeout(1500); await page.screenshot({ path: `${out}/${name}-home-ablated.png` }); }
      const rail = await page.locator('[data-rail-link][aria-current="step"]').textContent();
      record(name, 'home: chapter rail follows the scroll position', /IV/.test(rail ?? ''), rail ?? '');
    }
    await context.close();
  }

  // 4 — reduced motion: no autonomous movement, but the act in view still determines the plate
  {
    const context = await contextFor(browser, { reduced: true });
    const page = await context.newPage();
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    const ready = await page.waitForFunction(() => document.documentElement.classList.contains('webgl-ready') || document.documentElement.classList.contains('no-webgl'), null, { timeout: 15000 }).then(() => page.evaluate(() => document.documentElement.classList.contains('webgl-ready')));
    if (ready) {
      await page.waitForTimeout(600);
      const canvas = page.locator('#journey-canvas');
      const a = await canvas.screenshot(), b = (await page.waitForTimeout(800), await canvas.screenshot());
      record(name, 'reduced motion: the scene is static', a.equals(b));
      await scrollToAct(page, 'learning');
      record(name, 'reduced motion: scrolling still switches to the matching static plate', (await page.locator('[data-journey]').getAttribute('data-stage')) === '2');
    } else record(name, 'reduced motion checks', null, 'no WebGL in this engine');
    await context.close();
  }

  // 5 — JavaScript disabled: all core content readable, static plates shown, navigation visible
  {
    const context = await contextFor(browser, { js: false, width: 375, height: 812 });
    const page = await context.newPage();
    await page.goto(base + '/', { waitUntil: 'load' });
    const info = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim(),
      acts: Array.from(document.querySelectorAll('.act__content')).filter((el) => getComputedStyle(el).opacity === '1' && el.getBoundingClientRect().height > 50).length,
      plates: Array.from(document.querySelectorAll('.act__plate')).filter((el) => getComputedStyle(el).display !== 'none' && getComputedStyle(el).backgroundImage.includes('plates/')).length,
      nav: Array.from(document.querySelectorAll('.site-nav a')).filter((a) => a.getBoundingClientRect().width > 0).length,
    }));
    record(name, 'no-JS: home content, plates and navigation', info.h1?.includes('Kahya') && info.acts === 5 && info.plates === 5 && info.nav === 6, JSON.stringify(info));
    await page.goto(base + '/tr/', { waitUntil: 'load' });
    const trActs = await page.evaluate(() => Array.from(document.querySelectorAll('.act__content')).filter((el) => getComputedStyle(el).opacity === '1' && el.getBoundingClientRect().height > 50).length);
    record(name, 'no-JS: Turkish home content is readable', trActs === 5, `${trActs}`);
    await page.goto(base + '/publications/', { waitUntil: 'load' });
    const pubs = await page.locator('.pub:visible').count();
    record(name, 'no-JS: every publication is listed', pubs === 42, `${pubs}`);
    await page.goto(base + '/teaching/myz-310e/', { waitUntil: 'load' });
    record(name, 'no-JS: course page shows schedule and notes', (await page.locator('.schedule__week').count()) === 15 && (await page.locator('.notes__row').count()) === 14);
    await context.close();
  }

  // 6 — theme toggle, mobile menu, keyboard
  {
    const context = await contextFor(browser, { width: 375, height: 812, mobile: true, presetTheme: false });
    const page = await context.newPage();
    await page.goto(base + '/research/', { waitUntil: 'networkidle' });
    await page.click('[data-theme-toggle]');
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.reload({ waitUntil: 'networkidle' });
    const persisted = await page.evaluate(() => document.documentElement.dataset.theme);
    record(name, 'theme toggle switches and persists', theme === 'light' && persisted === 'light', `${theme}/${persisted}`);
    await page.click('[data-menu-toggle]');
    const expanded = await page.getAttribute('[data-menu-toggle]', 'aria-expanded');
    const focusInNav = await page.evaluate(() => document.activeElement?.closest('#site-nav') !== null);
    await page.keyboard.press('Escape');
    const closed = await page.getAttribute('[data-menu-toggle]', 'aria-expanded');
    const focusBack = await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-toggle'));
    record(name, 'mobile menu: opens, focuses a link, closes on Escape', expanded === 'true' && focusInNav && closed === 'false' && focusBack, JSON.stringify({ expanded, focusInNav, closed, focusBack }));
    await context.close();

    const desktop = await contextFor(browser, {});
    const p2 = await desktop.newPage();
    await p2.goto(base + '/teaching/myz-310e/', { waitUntil: 'networkidle' });
    await p2.keyboard.press(name === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
    const first = await p2.evaluate(() => document.activeElement?.className ?? '');
    await p2.keyboard.press('Enter');
    await p2.waitForTimeout(200);
    const target = await p2.evaluate(() => document.activeElement?.id ?? location.hash);
    record(name, 'keyboard: skip link is first and moves focus to main', /skip-link/.test(first) && /main/.test(target), `${first} → ${target}`);
    await desktop.close();
  }

  // 7 — course rules: one source for page, summary, table and PDF; teaching pages stay calm
  {
    const context = await contextFor(browser, {});
    const page = await context.newPage();
    await page.goto(base + '/teaching/myz-310e/2026-fall/', { waitUntil: 'networkidle' });
    const rows = await page.$$eval('[data-assessment] .table-wrap tbody tr, [data-assessment] .table-wrap tfoot tr', (trs) => trs.map((tr) => tr.querySelector('.num')?.textContent?.trim()));
    const text = await page.locator('main').innerText();
    record(name, 'course: assessment table is 30 + 15 + 15 + 40 = 100', rows.join() === '30,15,15,40,100', rows.join());
    record(name, 'course: eligibility rule stated with 12/30 AND both presentations', /12\/30/.test(text) && /AND complete both project presentations/.test(text) && /not to the overall course grade/.test(text));
    record(name, 'course: 14 weeks, no fabricated note links', (await page.locator('.notes__empty').count()) === 14 && (await page.locator('a[href*="/notes/"]').count()) === 0);
    record(name, 'course: no animated scene on teaching pages', (await page.locator('canvas').count()) === 0);
    const pdf = await page.request.get(base + '/teaching/myz-310e/2026-fall/myz-310e-syllabus.pdf');
    record(name, 'course: syllabus PDF is served', pdf.status() === 200 && (pdf.headers()['content-type'] ?? '').includes('pdf') && (await pdf.body()).subarray(0, 5).toString() === '%PDF-');
    const alias = await page.goto(base + '/teaching/myz-310e/', { waitUntil: 'networkidle' });
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    record(name, 'course: current-course alias points to the permanent term page', alias?.status() === 200 && canonical === 'https://eokahya.github.io/teaching/myz-310e/2026-fall/', canonical ?? '');
    const missing = await page.goto(base + '/not-a-page/', { waitUntil: 'networkidle' });
    record(name, '404 page for unknown routes', missing?.status() === 404 && /event horizon/.test(await page.locator('h1').innerText()));
    const missingTr = await page.goto(base + '/tr/olmayan-sayfa/', { waitUntil: 'networkidle' });
    const trInfo = await page.evaluate(() => ({ h1: document.querySelector('h1')?.textContent ?? '', lang: document.documentElement.lang, first: document.querySelector('[data-lost]')?.getAttribute('data-lost') }));
    record(name, '404 page answers in Turkish under /tr/', missingTr?.status() === 404 && /olay ufkunu/.test(trInfo.h1) && trInfo.lang === 'tr' && trInfo.first === 'tr', JSON.stringify(trInfo));
    await context.close();
  }

  // 8 — language: the switch leads to the same page in the other language, on desktop and in the mobile menu
  {
    const context = await contextFor(browser, {});
    const page = await context.newPage();
    await page.goto(base + '/about/', { waitUntil: 'networkidle' });
    await page.click('.lang-switch');
    await page.waitForURL('**/tr/hakkinda/');
    const tr = await page.evaluate(() => ({ lang: document.documentElement.lang, nav: document.querySelector('.site-nav a[aria-current="page"]')?.textContent, cv: document.querySelector('.page-hero .button')?.getAttribute('href') }));
    record(name, 'language switch: About → Hakkında in Turkish', tr.lang === 'tr' && tr.nav === 'Hakkında' && tr.cv === '/cv/Emre-Onur-Kahya-Ozgecmis-TR.pdf', JSON.stringify(tr));
    await page.click('.lang-switch');
    await page.waitForURL('**/about/');
    record(name, 'language switch: back to English', (await page.evaluate(() => document.documentElement.lang)) === 'en');
    for (const cv of ['/cv/Emre-Onur-Kahya-CV-EN.pdf', '/cv/Emre-Onur-Kahya-Ozgecmis-TR.pdf']) {
      const response = await page.request.get(base + cv);
      record(name, `CV served: ${cv}`, response.status() === 200 && (response.headers()['content-type'] ?? '').includes('pdf') && (await response.body()).subarray(0, 5).toString() === '%PDF-');
    }
    await page.goto(base + '/tr/', { waitUntil: 'networkidle' });
    const ready = await page.waitForFunction(() => document.documentElement.classList.contains('webgl-ready') || document.documentElement.classList.contains('no-webgl'), null, { timeout: 15000 }).then(() => page.evaluate(() => document.documentElement.classList.contains('webgl-ready')));
    if (ready) {
      await scrollToAct(page, 'mechanisms');
      await page.click('[data-scene-action="circuit"]');
      const status = (await page.textContent('#scene-status')) ?? '';
      const pause = (await page.textContent('#motion-toggle')) ?? '';
      record(name, 'Turkish home: scene controls announce in Turkish', /Şematik/.test(status) && /Animasyon/.test(pause), `${status.slice(0, 40)} | ${pause.trim()}`);
    } else record(name, 'Turkish home: scene controls', null, 'no WebGL in this headless engine');
    await context.close();

    const mobile = await contextFor(browser, { width: 375, height: 812, mobile: true });
    const phone = await mobile.newPage();
    await phone.goto(base + '/tr/yayinlar/', { waitUntil: 'networkidle' });
    await phone.click('[data-menu-toggle]');
    await phone.click('.site-nav__lang a');
    await phone.waitForURL('**/publications/');
    record(name, 'mobile menu: language link leads to the English page', (await phone.evaluate(() => document.documentElement.lang)) === 'en');
    await mobile.close();
  }
  await browser.close();
}

await server.close();
const summary = { pass: results.filter((r) => r.status === 'PASS').length, fail: results.filter((r) => r.status === 'FAIL').length, notRun: results.filter((r) => r.status === 'NOT RUN').length };
await writeFile(`${out}/results.json`, JSON.stringify({ summary, results }, null, 2));
console.log(`\nBrowser checks: ${summary.pass} PASS, ${summary.fail} FAIL, ${summary.notRun} NOT RUN`);
if (summary.fail) process.exitCode = 1;
