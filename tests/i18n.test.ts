import assert from 'node:assert/strict';
import test from 'node:test';
import { counterpart, currentRoute, href, langOf, navOrder, routes } from '../src/i18n';
import { ui } from '../src/i18n/ui';
import { homeCopy } from '../src/i18n/copy/home';
import { pagesCopy } from '../src/i18n/copy/pages';
import { researchAreas } from '../src/data/research';
import { profile } from '../src/data/profile';
import { talks } from '../src/data/talks';
import { lessonTopics } from '../src/data/outreach';

/** Strings that are intentionally empty in one language (an extra note shown only in the other). */
const optional = new Set(['outreach.trNote', 'teaching.languageNote']);

function compare(en: unknown, tr: unknown, path: string, piece = false) {
  assert.equal(typeof tr, typeof en, `${path}: type`);
  if (typeof en === 'string') {
    // Pieces of a heading (text around an <em>) may be empty; whole strings may not.
    if (!piece && !optional.has(path)) assert.ok((tr as string).trim() && en.trim(), `${path}: empty`);
  } else if (typeof en === 'function') {
    const args = Array.from({ length: en.length }, (_, i) => (i === 0 ? '7' : '2026'));
    const out = [(en as (...a: unknown[]) => unknown)(...args), (tr as (...a: unknown[]) => unknown)(...args)];
    for (const value of out) assert.ok(typeof value === 'string' ? value.trim() : Array.isArray(value) && value.length, `${path}: output`);
    if (Array.isArray(out[0])) assert.equal((out[1] as unknown[]).length, out[0].length, `${path}: pieces`);
  } else if (Array.isArray(en)) {
    assert.equal((tr as unknown[]).length, en.length, `${path}: length`);
    if (en.every((item) => typeof item === 'string')) assert.ok(en.join('').trim() && (tr as string[]).join('').trim(), `${path}: empty`);
    en.forEach((item, i) => compare(item, (tr as unknown[])[i], `${path}[${i}]`, true));
  } else if (en && typeof en === 'object') {
    assert.deepEqual(Object.keys(tr as object).sort(), Object.keys(en).sort(), `${path}: keys`);
    for (const key of Object.keys(en)) compare((en as Record<string, unknown>)[key], (tr as Record<string, unknown>)[key], path ? `${path}.${key}` : key);
  }
}

test('Turkish copy covers every English string', () => {
  compare(ui.en, ui.tr, '');
  compare(homeCopy.en, homeCopy.tr, '');
  compare(pagesCopy.en, pagesCopy.tr, '');
  for (const area of researchAreas) compare(area.en, area.tr, area.id);
  for (const entry of profile.timeline) assert.ok(entry.titleTr && entry.institutionTr && (!entry.detail || entry.detailTr), entry.title);
  for (const project of profile.projects) assert.ok(project.titleTr && project.funderTr, project.title);
  for (const talk of talks) assert.ok(talk.dateTr && talk.placeTr, talk.title);
  for (const topic of lessonTopics) assert.ok(topic.titleTr, topic.id);
  assert.equal(profile.aboutBio.tr.length, profile.aboutBio.en.length);
});

test('Turkish pages live under /tr/ with Turkish slugs and map back to English', () => {
  for (const id of Object.keys(routes) as (keyof typeof routes)[]) {
    const { en, tr } = routes[id];
    assert.equal(langOf(en), 'en');
    assert.equal(langOf(tr), 'tr');
    assert.ok(tr.startsWith('/tr/') && tr.endsWith('/') && en.endsWith('/'));
    assert.deepEqual(counterpart(en), { lang: 'tr', href: tr });
    assert.deepEqual(counterpart(tr), { lang: 'en', href: en });
    assert.deepEqual(counterpart(tr.slice(0, -1)), { lang: 'en', href: en }, 'without a trailing slash');
  }
  assert.equal(new Set(Object.values(routes).map((r) => r.tr)).size, Object.keys(routes).length);
  // The course is taught in English: its pages exist once and point to the Turkish teaching page.
  assert.deepEqual(counterpart('/teaching/myz-310e/2026-fall/'), { lang: 'tr', href: '/tr/ogretim/' });
  assert.equal(currentRoute('/teaching/myz-310e/'), 'teaching');
  assert.equal(currentRoute('/tr/yayinlar/'), 'publications');
  assert.equal(currentRoute('/tr/'), null);
  assert.equal(href('tr', 'about', 'talks'), '/tr/hakkinda/#talks');
  assert.deepEqual([...navOrder].sort(), Object.keys(routes).filter((id) => id !== 'home').sort());
});

test('the language switch is labelled in the language it leads to', () => {
  assert.deepEqual(ui.en.langSwitch, { text: 'TR', label: 'Türkçe sürüm', lang: 'tr' });
  assert.deepEqual(ui.tr.langSwitch, { text: 'EN', label: 'English version', lang: 'en' });
});
