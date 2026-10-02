// Verifies the bilingual build in dist/: every page exists in both languages with the right <html lang>,
// reciprocal hreflang alternates, a language switch that leads to the counterpart, no untranslated
// navigation, and the two CV files published byte for byte.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve('dist');
const site = 'https://eokahya.github.io';
const pairs = [
  ['/', '/tr/'],
  ['/research/', '/tr/arastirma/'],
  ['/publications/', '/tr/yayinlar/'],
  ['/teaching/', '/tr/ogretim/'],
  ['/outreach/', '/tr/bilim-iletisimi/'],
  ['/about/', '/tr/hakkinda/'],
  ['/contact/', '/tr/iletisim/'],
];
const englishNav = ['Research', 'Publications', 'Teaching', 'Outreach', 'About', 'Contact'];
const turkishNav = ['Araştırma', 'Yayınlar', 'Öğretim', 'Bilim iletişimi', 'Hakkında', 'İletişim'];
const errors = [];
const fail = (route, message) => errors.push(`${route}: ${message}`);
const read = (route) => readFile(join(root, route, 'index.html'), 'utf8');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

function checkPage(route, html, lang, other) {
  if (attr(html.match(/<html[^>]*>/)?.[0] ?? '', 'lang') !== lang) fail(route, `<html lang> is not ${lang}`);
  const alternates = Object.fromEntries(Array.from(html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g), (m) => [m[1], m[2]]));
  const [en, tr] = lang === 'en' ? [route, other] : [other, route];
  if (other) {
    if (alternates.en !== site + en || alternates.tr !== site + tr || alternates['x-default'] !== site + en) fail(route, `hreflang alternates ${JSON.stringify(alternates)}`);
  } else if (Object.keys(alternates).length) fail(route, 'English-only page declares hreflang alternates');
  const switches = Array.from(html.matchAll(/<a[^>]*data-lang-switch[^>]*>/g), (m) => m[0]);
  if (switches.length !== 2) fail(route, `expected 2 language switches, found ${switches.length}`);
  const target = other ?? '/tr/ogretim/';
  const targetLang = lang === 'en' ? 'tr' : 'en';
  for (const tag of switches) {
    if (attr(tag, 'href') !== target) fail(route, `language switch leads to ${attr(tag, 'href')}, expected ${target}`);
    if (attr(tag, 'hreflang') !== targetLang || attr(tag, 'lang') !== targetLang) fail(route, 'language switch lacks hreflang/lang');
  }
  const nav = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
  const labels = Array.from(nav.matchAll(/<a [^>]*>([^<]+)<\/a>/g), (m) => m[1].trim()).filter((label) => !/English|Türkçe/.test(label));
  const expected = lang === 'en' ? englishNav : turkishNav;
  if (labels.join('|') !== expected.join('|')) fail(route, `navigation labels ${labels.join(', ')}`);
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
  if (!footer.includes('/cv/Emre-Onur-Kahya-CV-EN.pdf') || !footer.includes('/cv/Emre-Onur-Kahya-Ozgecmis-TR.pdf')) fail(route, 'footer lacks the CV links');
}

for (const [en, tr] of pairs) {
  checkPage(en, await read(en), 'en', tr);
  const html = await read(tr);
  checkPage(tr, html, 'tr', en);
  const visible = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  for (const phrase of ['Skip to content', 'opens in a new tab', 'Switch to light theme', 'Selected publications', 'Read more']) {
    if (visible.includes(phrase)) fail(tr, `untranslated phrase "${phrase}"`);
  }
}
for (const route of ['/teaching/myz-310e/', '/teaching/myz-310e/2026-fall/']) checkPage(route, await read(route), 'en', null);

const about = await read('/tr/hakkinda/');
for (const cv of ['/cv/Emre-Onur-Kahya-CV-EN.pdf', '/cv/Emre-Onur-Kahya-Ozgecmis-TR.pdf']) {
  const [built, source] = await Promise.all([readFile(join(root, cv)), readFile(resolve('public', cv.slice(1)))]);
  const hash = (data) => createHash('sha256').update(data).digest('hex');
  if (hash(built) !== hash(source)) fail(cv, 'differs from public/');
  if (!about.includes(`href="${cv}"`)) fail('/tr/hakkinda/', `no link to ${cv}`);
}
const sitemap = await readFile(join(root, 'sitemap-0.xml'), 'utf8');
for (const [, tr] of pairs) if (!sitemap.includes(`<loc>${site}${tr}</loc>`)) fail('sitemap', `missing ${tr}`);

if (errors.length) {
  console.error(`FAIL i18n:\n${errors.map((e) => `  ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`PASS i18n: ${pairs.length * 2 + 2} pages, both CVs published`);
