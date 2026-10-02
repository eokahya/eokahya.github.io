import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { PDFDocument } from 'pdf-lib';
import { course } from '../src/data/course';

const execFileAsync = promisify(execFile);
const repository = resolve(import.meta.dirname, '..');

async function buildHtml(directory: string) {
  const args = [join(directory, 'node_modules/astro/bin/astro.mjs'), 'build'];
  const options = {
    cwd: directory,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', CI: 'true' },
    timeout: 60_000,
    maxBuffer: 4 * 1024 * 1024,
  };
  try {
    const result = await execFileAsync(process.execPath, args, options);
    return { success: true, output: `${result.stdout}\n${result.stderr}` };
  } catch (error: unknown) {
    const failure = error as { stdout?: string; stderr?: string; message?: string };
    return { success: false, output: `${failure.stdout ?? ''}\n${failure.stderr ?? ''}\n${failure.message ?? ''}` };
  }
}

function noteLinks(html: string) {
  return Array.from(html.matchAll(/<a\b([^>]*)>/g)).flatMap((match) => {
    const attributes = match[1] ?? '';
    const href = /\bhref="([^"]+)"/.exec(attributes)?.[1];
    return href?.startsWith(course.notesPath) ? [{ href, download: /\bdownload(?:\s|=|$)/.test(attributes) }] : [];
  });
}

async function fixturePdf(path: string, title: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([300, 300]);
  page.drawText('Disposable integration-test PDF. Never published.', { x: 20, y: 160, size: 9 });
  pdf.setTitle(title);
  await writeFile(path, await pdf.save());
}

test('isolated Astro builds list actual uploads, remove stale files, and fail for a corrupt note', { timeout: 240_000 }, async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'myz-notes-build-'));
  t.after(() => rm(directory, { recursive: true, force: true }));

  // Copy public source files only. Never copy credentials, local reports, or .git.
  for (const name of ['src', 'public', 'scripts', 'astro.config.mjs', 'tsconfig.json', 'package.json']) {
    await cp(join(repository, name), join(directory, name), { recursive: true });
  }
  await symlink(join(repository, 'node_modules'), join(directory, 'node_modules'), 'dir');

  const notesDirectory = join(directory, 'public', course.notesPath.slice(1));
  const outputNotes = join(directory, 'dist', course.notesPath.slice(1));
  const courseHtml = join(directory, 'dist', course.termPath.slice(1), 'index.html');
  const aliasHtml = join(directory, 'dist', course.path.slice(1), 'index.html');
  // Existing real repository notes, if any, are removed only from the disposable copy.
  await rm(notesDirectory, { recursive: true, force: true });
  await mkdir(notesDirectory, { recursive: true });
  await writeFile(join(notesDirectory, '.gitkeep'), '');

  const empty = await buildHtml(directory);
  assert.equal(empty.success, true, empty.output);
  assert.deepEqual(noteLinks(await readFile(courseHtml, 'utf8')), []);
  assert.deepEqual(noteLinks(await readFile(aliasHtml, 'utf8')), []);
  assert.equal(((await readFile(courseHtml, 'utf8')).match(/Not yet uploaded/g) ?? []).length, course.weeks.length);
  t.diagnostic('Empty Astro build: no links to missing lecture-note PDFs.');

  const primaryFilename = 'week-03.pdf';
  const supplementalFilename = 'week-03--worked-examples.pdf';
  const primaryPath = join(notesDirectory, primaryFilename);
  const supplementalPath = join(notesDirectory, supplementalFilename);
  await fixturePdf(primaryPath, 'Integration fixture: classification');
  await fixturePdf(supplementalPath, 'Integration fixture: worked examples');
  const uploaded = await buildHtml(directory);
  assert.equal(uploaded.success, true, uploaded.output);
  const expectedLinks = [
    { href: `${course.notesPath}${primaryFilename}`, download: false },
    { href: `${course.notesPath}${primaryFilename}`, download: true },
    { href: `${course.notesPath}${supplementalFilename}`, download: false },
    { href: `${course.notesPath}${supplementalFilename}`, download: true },
  ];
  assert.deepEqual(noteLinks(await readFile(courseHtml, 'utf8')), expectedLinks);
  assert.deepEqual(noteLinks(await readFile(aliasHtml, 'utf8')), expectedLinks);
  assert.equal(((await readFile(courseHtml, 'utf8')).match(/Not yet uploaded/g) ?? []).length, course.weeks.length - 1);
  assert.deepEqual((await readdir(outputNotes)).filter((filename) => filename.endsWith('.pdf')).sort(), [supplementalFilename, primaryFilename].sort());
  assert.deepEqual(await readFile(join(outputNotes, primaryFilename)), await readFile(primaryPath));
  assert.deepEqual(await readFile(join(outputNotes, supplementalFilename)), await readFile(supplementalPath));
  t.diagnostic('Upload Astro build: two actual PDF assets and four sorted open/download links in current and permanent pages.');

  await unlink(primaryPath);
  await unlink(supplementalPath);
  const removed = await buildHtml(directory);
  assert.equal(removed.success, true, removed.output);
  assert.deepEqual(noteLinks(await readFile(courseHtml, 'utf8')), []);
  assert.deepEqual(noteLinks(await readFile(aliasHtml, 'utf8')), []);
  assert.equal(((await readFile(courseHtml, 'utf8')).match(/Not yet uploaded/g) ?? []).length, course.weeks.length);
  await assert.rejects(access(join(outputNotes, primaryFilename)), { code: 'ENOENT' });
  await assert.rejects(access(join(outputNotes, supplementalFilename)), { code: 'ENOENT' });
  t.diagnostic('Removal Astro build: links disappear and old PDFs are absent from dist.');

  await writeFile(primaryPath, '%PDF-1.7\ncorrupt object graph\n%%EOF');
  const corrupt = await buildHtml(directory);
  assert.equal(corrupt.success, false, 'A corrupt uploaded note must fail the production HTML build.');
  assert.match(corrupt.output, /Invalid lecture note week-03\.pdf: corrupt, unreadable, encrypted or page-less PDF/);
  t.diagnostic('Corrupt-note Astro build: fails with a clear error identifying week-03.pdf.');
});
