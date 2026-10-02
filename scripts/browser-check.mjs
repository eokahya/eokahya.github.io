import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const output = path.resolve('artifacts');
const screenshots = path.join(output, 'screenshots');
const report = { checkedAt: new Date().toISOString(), base, checks: [], browserAvailability: {} };
const widths = [375, 768, 1440];
const contentRoutes = ['/', '/research/', '/publications/', '/teaching/', '/about/', '/contact/', '/teaching/myz-310e/', '/teaching/myz-310e/2026-fall/', '/teaching/myz-310e/2026-fall/syllabus/'];
const permanentCourse = '/teaching/myz-310e/2026-fall/';
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
const label = (route) => route === '/' ? 'home' : route.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '-').replace(/\.html$/, '');
const errorText = (error) => error instanceof Error ? error.message : String(error);

await mkdir(screenshots, { recursive: true });

async function check(name, fn) {
  try {
    const detail = await fn();
    const status = detail?.status === 'NOT RUN' ? 'NOT RUN' : 'PASS';
    report.checks.push({ name, status, ...(detail === undefined ? {} : { detail }) });
    console.log(`${status} ${name}`);
  } catch (error) {
    report.checks.push({ name, status: 'FAIL', error: errorText(error) });
    console.error(`FAIL ${name}: ${errorText(error)}`);
  }
}

async function exportedRoutes(directory = 'dist', prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) result.push(...await exportedRoutes(path.join(directory, entry.name), `${relative}/`));
    else if (entry.name.endsWith('.html')) result.push(relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`);
  }
  return result.sort();
}

let routes = [];
await check('static output includes every required direct route', async () => {
  routes = await exportedRoutes();
  for (const route of contentRoutes) assert(routes.includes(route), `Missing exported page: ${route}`);
  return routes;
});

function attachErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`);
  });
  return errors;
}

async function navigate(page, route) {
  const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
  assert(response, `No response for ${route}`);
  assert.equal(response.status(), 200, `${route} direct HTTP status`);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('main').count(), 1, 'Exactly one main landmark');
  assert.equal(await page.locator('h1').count(), 1, 'Exactly one page h1');
  assert(await page.locator('h1').isVisible(), 'Page heading visible');
}

async function ensureNoOverflow(page) {
  const result = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert(result.document <= result.viewport + 1 && result.body <= result.viewport + 1, `Horizontal overflow: ${JSON.stringify(result)}`);
  return result;
}

async function setTheme(page, theme) {
  await page.evaluate((value) => {
    localStorage.setItem('theme', value);
    document.documentElement.dataset.theme = value;
    window.dispatchEvent(new Event('themechange'));
  }, theme);
}

for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  let browser;
  try {
    browser = await engine.launch();
    report.browserAvailability[engineName] = { status: 'RUN', version: browser.version() };
  } catch (error) {
    report.browserAvailability[engineName] = { status: 'BLOCKED', error: errorText(error) };
    if (engineName === 'chromium') report.checks.push({ name: 'Chromium browser available', status: 'FAIL', error: errorText(error) });
    console.error(`BLOCKED ${engineName}: ${errorText(error)}`);
    continue;
  }

  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'dark', reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = attachErrors(page);
    for (const route of routes) {
      await check(`${engineName} ${width}px direct ${route}`, async () => {
        errors.length = 0;
        await navigate(page, route);
        const overflow = await ensureNoOverflow(page);
        const file = `${engineName}-${width}-${label(route)}-dark.png`;
        if (['/', '/research/', '/publications/', permanentCourse].includes(route)) await page.screenshot({ path: path.join(screenshots, `${engineName}-${width}-${label(route)}-viewport.png`) });
        if (engineName === 'chromium' && route === '/' && width === 1440) await page.screenshot({ path: path.join(screenshots, 'final-home-desktop.png') });
        if (engineName === 'chromium' && route === permanentCourse && width === 375) await page.screenshot({ path: path.join(screenshots, 'final-course-mobile.png') });
        await page.screenshot({ path: path.join(screenshots, file), fullPage: true });
        if (route === '/') {
          for (let stage = 1; stage < 3; stage++) {
            await page.locator(`[data-scene-stage="${stage}"]`).evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
            await page.waitForFunction((expected) => document.querySelector('.scientific-scene')?.dataset.stage === String(expected), stage);
            await page.waitForTimeout(100);
            await ensureNoOverflow(page);
            assert.equal(await page.evaluate(() => scrollX), 0, 'Scene scrolling preserves the horizontal viewport');
            await page.screenshot({ path: path.join(screenshots, `${engineName}-${width}-home-stage-${stage}.png`) });
          }
        }
        assert.deepEqual(errors, [], 'No browser or resource errors');
        return { ...overflow, screenshot: `screenshots/${file}` };
      });
    }
    await context.close();
  }

  for (const width of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of contentRoutes) {
      await check(`${engineName} ${width}px text 200 percent ${route}`, async () => {
        await navigate(page, route);
        const sizes = await page.evaluate(() => {
          const before = parseFloat(getComputedStyle(document.body).fontSize);
          document.documentElement.style.fontSize = '200%';
          return { before, after: parseFloat(getComputedStyle(document.body).fontSize) };
        });
        assert(sizes.after >= sizes.before * 1.99, `Body text actually enlarged: ${JSON.stringify(sizes)}`);
        if (['/', '/research/', '/publications/', permanentCourse].includes(route)) await page.screenshot({ path: path.join(screenshots, `${engineName}-${width}-${label(route)}-text200.png`) });
        await ensureNoOverflow(page);
        return sizes;
      });
    }
    await context.close();
  }

  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width: 375, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of ['/', permanentCourse]) {
      await check(`${engineName} axe mobile ${theme} ${route}`, async () => {
        await navigate(page, route);
        await setTheme(page, theme);
        await page.locator('.mobile-menu summary').click();
        const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
        assert.deepEqual(result.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(({ target }) => target) })), [], 'Mobile axe violations with menu open');
        await page.screenshot({ path: path.join(screenshots, `${engineName}-375-${label(route)}-${theme}-menu-open.png`) });
        return { violations: 0, rulesPassed: result.passes.length };
      });
    }
    await context.close();
  }

  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of contentRoutes) {
      await check(`${engineName} axe ${theme} ${route}`, async () => {
        await navigate(page, route);
        await setTheme(page, theme);
        const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
        assert.deepEqual(result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), [], 'Axe violations');
        if (theme === 'light') await page.screenshot({ path: path.join(screenshots, `${engineName}-1440-${label(route)}-light.png`), fullPage: true });
        return { violations: 0, rulesPassed: result.passes.length, incompleteRules: result.incomplete.map(({ id }) => id) };
      });
    }
    await context.close();
  }

  for (const width of [375, 1440]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    await check(`${engineName} ${width}px JavaScript disabled navigation and course`, async () => {
      await navigate(page, '/');
      assert(await page.locator('h1').innerText().then((value) => value.includes('Kahya')));
      if (width === 375) {
        await page.locator('.mobile-menu summary').click();
        assert(await page.locator('.mobile-menu[open]').isVisible());
        await page.locator('.mobile-menu').getByRole('link', { name: 'Teaching', exact: true }).click();
      } else await page.locator('.desktop-nav').getByRole('link', { name: 'Teaching', exact: true }).click();
      assert.equal(new URL(page.url()).pathname, '/teaching/');
      await page.getByRole('link', { name: /MYZ 310E|Open.*course|Course page/i }).first().click();
      assert.equal(new URL(page.url()).pathname, '/teaching/myz-310e/');
      assert((await page.locator('main').innerText()).includes('12/30'));
      await page.getByRole('navigation', { name: 'Course sections' }).getByRole('link', { name: 'Assessment', exact: true }).click();
      assert.equal(new URL(page.url()).hash, '#assessment');
      assert(await page.locator('#assessment').isVisible());
      await ensureNoOverflow(page);
      for (const route of contentRoutes) {
        await navigate(page, route);
        assert((await page.locator('main').innerText()).trim().length > 100, `${route} retains basic content without JavaScript`);
      }
      return 'Native details menu, direct course navigation and assessment anchor work with JavaScript disabled.';
    });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await check(`${engineName} theme control and persisted preference`, async () => {
    await navigate(page, '/');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.locator('#theme-toggle').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    assert.equal(await page.locator('#theme-toggle').getAttribute('aria-label'), 'Switch to dark theme');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.locator('#theme-toggle').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    assert.equal(await page.locator('#theme-toggle').getAttribute('aria-label'), 'Switch to light theme');
  });

  await check(`${engineName} keyboard skip link and visible focus`, async () => {
    await navigate(page, permanentCourse);
    // macOS WebKit uses Option-Tab to include links with its default keyboard setting.
    const advanceKey = engineName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
    await page.keyboard.press(advanceKey);
    assert(await page.locator('.skip-link').evaluate((element) => element === document.activeElement), 'First navigation focus reaches the skip link');
    const rect = await page.locator('.skip-link').boundingBox();
    assert(rect && rect.y >= 0 && rect.y < 900, 'Skip link visible on keyboard focus');
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#main');
    await page.keyboard.press(advanceKey);
    const focus = await page.evaluate(() => {
      const element = document.activeElement;
      const style = getComputedStyle(element);
      return { insideMain: Boolean(element.closest('main')), outline: style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1 && !['transparent', 'rgba(0, 0, 0, 0)'].includes(style.outlineColor), shadow: style.boxShadow !== 'none', text: element.textContent };
    });
    assert(focus.insideMain, `Skip link moves subsequent focus inside main: ${JSON.stringify(focus)}`);
    assert(focus.outline || focus.shadow, `Keyboard focus has a visible indicator: ${JSON.stringify(focus)}`);
    return { ...focus, advanceKey };
  });

  await check(`${engineName} canonical current course and term share content`, async () => {
    await navigate(page, '/teaching/myz-310e/');
    const alias = await page.locator('.course-content').innerHTML();
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://eokahya.github.io/teaching/myz-310e/2026-fall/');
    await navigate(page, permanentCourse);
    assert.equal(await page.locator('.course-content').innerHTML(), alias);
  });

  await check(`${engineName} rendered assessment, empty notes and lightweight teaching`, async () => {
    for (const route of ['/teaching/', '/teaching/myz-310e/', permanentCourse]) {
      await navigate(page, route);
      assert.equal(await page.locator('canvas').count(), 0, 'No teaching canvas');
      const scripts = await page.locator('script[src]').evaluateAll((elements) => elements.map((element) => element.src));
      for (const src of scripts) {
        const response = await page.request.get(src);
        assert.equal(response.status(), 200);
        const source = await response.text();
        assert(!/science-canvas|WebGL|three\.js|requestAnimationFrame/.test(source), `No scene animation code in ${src}`);
      }
    }
    const text = await page.locator('main').innerText();
    assert.match(text, /at least 12\/30 on the midterm AND completion of both project presentations/);
    assert.match(text, /at least 40% on the midterm examination AND complete both project presentations/);
    assert.match(text, /threshold applies to the midterm itself, not to the overall course grade/);
    const rows = await page.locator('.assessment-table tbody tr').evaluateAll((elements) => elements.map((element) => Number(element.querySelector('td').textContent.trim())));
    assert.deepEqual(rows, [30, 15, 15, 40]);
    assert.equal(rows.reduce((sum, value) => sum + value, 0), 100);
    assert.equal(await page.locator('.assessment-table tfoot td').first().innerText(), '100');
    const noteFiles = (await readdir('public/teaching/myz-310e/2026-fall/notes')).filter((file) => file.toLowerCase().endsWith('.pdf'));
    const links = await page.locator('.notes-list a').count();
    assert.equal(links, noteFiles.length * 2, 'Only existing PDF notes receive open/download links');
    if (!noteFiles.length) {
      assert.equal(await page.locator('.not-uploaded').count(), 14);
      assert.equal(links, 0, 'No links for absent notes');
    }
    assert.match(text, /provisional teaching choices/);
    return { assessmentPoints: rows, notesPresent: noteFiles.length, noteLinks: links };
  });

  await check(`${engineName} home actual scroll transformation, pause and pathway`, async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await navigate(page, '/');
    const figure = page.locator('.scientific-scene');
    const canvas = page.locator('#science-canvas');
    await page.waitForFunction(() => document.querySelector('.scientific-scene')?.dataset.ready === 'true');
    const stages = page.locator('[data-scene-stage]');
    assert.equal(await stages.count(), 3);
    await page.locator('#motion-toggle').click();
    assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#motion-toggle').innerText(), 'Resume animations');
    await page.waitForTimeout(150);
    const stable1 = hash(await canvas.screenshot());
    await page.waitForTimeout(250);
    assert.equal(hash(await canvas.screenshot()), stable1, 'Pause stops continuous drawing');
    const stageHashes = [];
    for (let stage = 0; stage < 3; stage++) {
      await stages.nth(stage).evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction((expected) => document.querySelector('.scientific-scene')?.dataset.stage === String(expected), stage);
      stageHashes.push(hash(await canvas.screenshot()));
      await figure.screenshot({ path: path.join(screenshots, `${engineName}-scene-${stage}.png`) });
    }
    assert.equal(new Set(stageHashes).size, 3, 'Three visibly different scientific geometries');
    await page.locator('#path-toggle').click();
    assert.equal(await page.locator('#path-toggle').getAttribute('aria-pressed'), 'true');
    await page.waitForTimeout(150);
    assert.notEqual(hash(await canvas.screenshot()), stageHashes[2], 'Pathway control changes circuit drawing');
    await page.locator('#motion-toggle').click();
    assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'false');
    await page.waitForTimeout(150);
    for (const fraction of [0.25, 0.75]) {
      await page.evaluate((progress) => {
        const stages = Array.from(document.querySelectorAll('[data-scene-stage]'));
        const centers = stages.slice(0, 2).map((element) => {
          const rect = element.getBoundingClientRect();
          return scrollY + rect.top + rect.height / 2;
        });
        scrollTo({ top: centers[0] + progress * (centers[1] - centers[0]) - innerHeight / 2, behavior: 'instant' });
      }, fraction);
      await page.waitForTimeout(150);
      await canvas.screenshot({ path: path.join(screenshots, `${engineName}-scene-morph-${fraction}.png`) });
    }
    await stages.nth(0).evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(200);
    const moving1 = hash(await canvas.screenshot());
    await page.waitForTimeout(150);
    assert.notEqual(hash(await canvas.screenshot()), moving1, 'Resume restarts the field animation');
    return { distinctStageDrawings: new Set(stageHashes).size, pausedStable: true, resumedMoving: true };
  });

  await check(`${engineName} reduced motion meaningful static scene`, async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await navigate(page, '/');
    await page.waitForFunction(() => document.querySelector('.scientific-scene')?.dataset.ready === 'true');
    assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#science-canvas').getAttribute('aria-hidden'), 'true');
    assert.match(await page.locator('.scientific-scene figcaption').innerText(), /Schematic illustration/);
    await page.waitForTimeout(150);
    const initial = hash(await page.locator('#science-canvas').screenshot());
    await page.waitForTimeout(250);
    assert.equal(hash(await page.locator('#science-canvas').screenshot()), initial, 'Reduced motion stops ongoing drawing');
    await page.locator('[data-scene-stage="2"]').evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('.scientific-scene')?.dataset.stage === '2');
    assert.notEqual(hash(await page.locator('#science-canvas').screenshot()), initial, 'Reduced motion retains a distinct static interpretation scene');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => document.querySelector('#motion-toggle')?.getAttribute('aria-pressed') === 'false');
    assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'false', 'Live preference change resumes animations');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('#motion-toggle')?.getAttribute('aria-pressed') === 'true');
    assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'true', 'Live preference change pauses animations');
  });

  await check(`${engineName} tab visibility animation lifecycle`, async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await navigate(page, '/');
    await page.waitForFunction(() => document.querySelector('.scientific-scene')?.dataset.ready === 'true');
    let testPage = page;
    let testContext = context;
    let headed;
    let background = await testContext.newPage();
    await background.goto('about:blank');
    await background.bringToFront();
    let visibility = await testPage.evaluate(() => document.visibilityState);
    let mode = 'headless';
    try {
      if (visibility !== 'hidden') {
        await background.close();
        try { headed = await engine.launch({ headless: false }); }
        catch (error) { return { status: 'NOT RUN', reason: 'Headless tabs remain visible and a headed browser is unavailable.', error: errorText(error) }; }
        mode = 'headed';
        testContext = await headed.newContext({ viewport: { width: 1440, height: 900 } });
        testPage = await testContext.newPage();
        await navigate(testPage, '/');
        await testPage.waitForFunction(() => document.querySelector('.scientific-scene')?.dataset.ready === 'true');
        await testPage.waitForTimeout(150);
        const foregroundDrawing = await testPage.evaluate(() => document.querySelector('#science-canvas').toDataURL());
        await testPage.waitForTimeout(150);
        assert.notEqual(await testPage.evaluate(() => document.querySelector('#science-canvas').toDataURL()), foregroundDrawing, 'Foreground scene animates before tab hiding');
        background = await testContext.newPage();
        await background.goto('about:blank');
        await background.bringToFront();
        visibility = await testPage.evaluate(() => document.visibilityState);
      }
      if (visibility !== 'hidden') return { status: 'NOT RUN', reason: 'This browser keeps both tabs visible even in headed mode; native hidden-tab behavior cannot be asserted.', observedVisibility: visibility, mode };
      await testPage.waitForTimeout(100);
      const drawing = await testPage.evaluate(() => document.querySelector('#science-canvas').toDataURL());
      await testPage.waitForTimeout(250);
      assert.equal(await testPage.evaluate(() => document.querySelector('#science-canvas').toDataURL()), drawing, 'Hidden tab stops canvas drawing');
      await testPage.bringToFront();
      await testPage.waitForTimeout(150);
      assert.notEqual(await testPage.evaluate(() => document.querySelector('#science-canvas').toDataURL()), drawing, 'Visible tab resumes canvas drawing');
      return { observedVisibility: visibility, hiddenStatic: true, resumed: true, mode };
    } finally {
      if (!background.isClosed()) await background.close();
      if (headed) await headed.close();
    }
  });

  await context.close();
  await browser.close();
}

const failed = report.checks.filter(({ status }) => status === 'FAIL');
report.summary = { passed: report.checks.filter(({ status }) => status === 'PASS').length, failed: failed.length, notRun: report.checks.filter(({ status }) => status === 'NOT RUN').length, screenshots: (await readdir(screenshots)).filter((file) => file.endsWith('.png')).length };
await writeFile(path.join(output, 'browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.summary));
if (failed.length) process.exitCode = 1;
