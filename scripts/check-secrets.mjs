// Refuses to continue if a credential-looking string or an .env file is present in the sources.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const skip = new Set(['node_modules', 'dist', '.git', '.astro', 'artifacts', 'tmp', '.claude']);
const binary = /\.(pdf|png|jpe?g|webp|ico|woff2?)$/i;
const patterns = [
  /gh[pousr]_[A-Za-z0-9]{30,}/, /github_pat_[A-Za-z0-9_]{30,}/, /AKIA[0-9A-Z]{16}/, /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/,
  /sk-[A-Za-z0-9_-]{32,}/, /xox[baprs]-[A-Za-z0-9-]{10,}/, /AIza[0-9A-Za-z_-]{35}/,
];
const problems = [];
let files = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { await walk(path); continue; }
    if (/^\.env(\.|$)/.test(entry.name) && entry.name !== '.env.example') problems.push(`${path}: environment file`);
    if (binary.test(entry.name)) continue;
    const text = await readFile(path, 'utf8');
    files++;
    for (const pattern of patterns) if (pattern.test(text)) problems.push(`${path}: possible credential (value not printed)`);
  }
}
await walk('.');
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`PASS credential scan: ${files} text files (a manual diff review is still required before a public push)`);
