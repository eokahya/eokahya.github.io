// Verifies every internal href/src (and #anchor) in dist/ resolves to a real file or element id.
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('dist');
let pages = 0, references = 0;
const errors = [];
const idCache = new Map();

async function ids(file) {
  if (!idCache.has(file)) idCache.set(file, new Set(Array.from((await readFile(file, 'utf8')).matchAll(/\sid=["']([^"']+)["']/g), (m) => m[1])));
  return idCache.get(file);
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html')) await check(path);
  }
}

async function check(file) {
  pages++;
  const html = await readFile(file, 'utf8');
  const route = '/' + file.slice(root.length + 1).replace(/index\.html$/, '');
  const found = [
    ...Array.from(html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g), (m) => m[1]),
    ...Array.from(html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g), (m) => m[1]),
  ];
  for (const raw of found) {
    const href = raw.replaceAll('&amp;', '&');
    // skip external schemes, bare '#', and fragment references nested inside data: URIs (e.g. url(%23n))
    if (/^(mailto:|tel:|data:|https?:\/\/|javascript:|%23)/.test(href) || href === '#') continue;
    const url = new URL(href, `https://eokahya.github.io${route}`);
    if (url.origin !== 'https://eokahya.github.io') continue;
    const path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    let target;
    try {
      const info = await stat(path);
      target = info.isDirectory() ? resolve(path, 'index.html') : path;
      await stat(target);
    } catch { errors.push(`${route}: missing ${href}`); continue; }
    references++;
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!(await ids(target)).has(id)) errors.push(`${route}: missing anchor ${href}`);
    }
  }
}

await walk(root);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`PASS internal links, assets and anchors: ${pages} pages, ${references} references`);
