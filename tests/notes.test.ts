import assert from 'node:assert/strict';
import { mkdtemp, rm, stat, symlink, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test, { type TestContext } from 'node:test';
import { PDFDocument } from 'pdf-lib';
import { scanLectureNotes } from '../scripts/scan-notes';
import { course } from '../src/data/course';

async function temporaryNotes(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), 'myz-notes-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

async function createTestPdf(directory: string, filename: string, title?: string) {
  const pdf = await PDFDocument.create();
  pdf.addPage([300, 300]);
  if (title) pdf.setTitle(title);
  const path = join(directory, filename);
  await writeFile(path, await pdf.save());
  return path;
}

test('empty note folder and .gitkeep produce no PDF records or fake links', async (t) => {
  const directory = await temporaryNotes(t);
  assert.deepEqual(await scanLectureNotes(directory), []);
  await writeFile(join(directory, '.gitkeep'), '');
  assert.deepEqual(await scanLectureNotes(directory), []);
});

test('actual PDFs are sorted by week, main before supplement; metadata is optional', async (t) => {
  const directory = await temporaryNotes(t);
  const supplement = await createTestPdf(directory, 'week-03--worked-examples.pdf');
  await createTestPdf(directory, 'week-14.pdf', 'Paper workshop');
  await createTestPdf(directory, 'week-03.pdf');
  await createTestPdf(directory, 'week-01.pdf');
  const notes = await scanLectureNotes(directory);
  assert.deepEqual(notes.map((note) => note.week), [1, 3, 3, 14]);
  assert.equal(notes[0]?.title, course.weeks[0]?.title);
  assert.equal(notes[1]?.title, course.weeks[2]?.title);
  assert.equal(notes[2]?.title, 'Worked Examples');
  assert.equal(notes[3]?.title, 'Paper workshop');
  assert.equal(notes[2]?.fileSize, (await stat(supplement)).size);
  assert.equal(notes[2]?.relativePath, `${course.notesPath}week-03--worked-examples.pdf`);
  assert.deepEqual(Object.keys(notes[0] ?? {}).sort(), ['fileSize', 'relativePath', 'title', 'week']);
});

test('PDF upload and removal immediately update the build-time list', async (t) => {
  const directory = await temporaryNotes(t);
  assert.equal((await scanLectureNotes(directory)).length, 0);
  const path = await createTestPdf(directory, 'week-11.pdf');
  assert.equal((await scanLectureNotes(directory)).length, 1);
  assert.equal((await scanLectureNotes(directory))[0]?.week, 11);
  await unlink(path);
  assert.deepEqual(await scanLectureNotes(directory), []);
});

test('non-PDF file fails clearly rather than being silently published', async (t) => {
  const directory = await temporaryNotes(t);
  await writeFile(join(directory, 'week-01.txt'), 'Not a PDF');
  await assert.rejects(scanLectureNotes(directory), /week-01\.txt.*non-PDF files are not allowed/);
});

test('empty PDF is rejected', async (t) => {
  const directory = await temporaryNotes(t);
  await writeFile(join(directory, 'week-01.pdf'), '');
  await assert.rejects(scanLectureNotes(directory), /week-01\.pdf.*PDF is empty/);
});

test('corrupt PDF header and corrupt PDF objects are rejected', async (t) => {
  const directory = await temporaryNotes(t);
  await writeFile(join(directory, 'week-01.pdf'), 'This is not a PDF');
  await assert.rejects(scanLectureNotes(directory), /week-01\.pdf.*corrupt PDF/);
  await writeFile(join(directory, 'week-01.pdf'), '%PDF-1.7\nnot a valid PDF object graph\n%%EOF');
  await assert.rejects(scanLectureNotes(directory), /week-01\.pdf.*corrupt, unreadable/);
});

test('out-of-range weeks and unsupported names are rejected', async (t) => {
  const directory = await temporaryNotes(t);
  await createTestPdf(directory, 'week-15.pdf');
  await assert.rejects(scanLectureNotes(directory), /week 15 is not in the course schedule/);
  await unlink(join(directory, 'week-15.pdf'));
  await createTestPdf(directory, 'week-3.pdf');
  await assert.rejects(scanLectureNotes(directory), /expected week-01\.pdf/);
});

test('symlinks cannot expose files from outside the note folder', async (t) => {
  const directory = await temporaryNotes(t);
  await symlink('/etc/hosts', join(directory, 'week-01.pdf'));
  await assert.rejects(scanLectureNotes(directory), /no folders or symbolic links/);
});
