import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';
import { course, type Course, type LectureNote } from '../src/data/course';

const filenamePattern = /^week-(\d{2})(?:--([a-z0-9]+(?:-[a-z0-9]+)*))?\.pdf$/;

/** Build-time scan only: no client token, upload endpoint, or remote dependency. */
export async function scanLectureNotes(
  directory: string | undefined = undefined,
  model: Course = course,
): Promise<LectureNote[]> {
  const targetDirectory = directory ?? resolve(process.cwd(), `public${model.notesPath}`);
  let entries;
  try {
    entries = await readdir(targetDirectory, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Lecture notes directory cannot be read: ${targetDirectory}`, { cause: error });
  }
  const records: (LectureNote & { filename: string; supplement: boolean })[] = [];
  const validWeeks = new Map(model.weeks.map((week) => [week.week, week.title]));

  for (const entry of entries) {
    if (entry.name === '.gitkeep') continue;
    if (!entry.isFile()) {
      throw new Error(`Invalid lecture note ${entry.name}: only regular PDF files are allowed (no folders or symbolic links).`);
    }
    const match = filenamePattern.exec(entry.name);
    if (!match) {
      throw new Error(`Invalid lecture note ${entry.name}: expected week-01.pdf or week-03--worked-examples.pdf; non-PDF files are not allowed.`);
    }
    const week = Number(match[1]);
    const weeklyTitle = validWeeks.get(week);
    if (!weeklyTitle) {
      throw new Error(`Invalid lecture note ${entry.name}: week ${week} is not in the course schedule.`);
    }
    const bytes = await readFile(resolve(targetDirectory, entry.name));
    if (bytes.length === 0) throw new Error(`Invalid lecture note ${entry.name}: PDF is empty.`);
    if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-' || !bytes.subarray(Math.max(0, bytes.length - 1024)).includes(Buffer.from('%%EOF'))) {
      throw new Error(`Invalid lecture note ${entry.name}: corrupt PDF (missing PDF header or end marker).`);
    }
    let pdf: PDFDocument;
    try {
      pdf = await PDFDocument.load(bytes, { ignoreEncryption: false, updateMetadata: false, throwOnInvalidObject: true });
      if (pdf.getPageCount() < 1) throw new Error('PDF has no pages');
      pdf.getPages();
    } catch (error) {
      throw new Error(`Invalid lecture note ${entry.name}: corrupt, unreadable, encrypted or page-less PDF.`, { cause: error });
    }
    const metadataTitle = pdf.getTitle()?.replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
    const supplementTitle = match[2]?.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    records.push({
      week,
      title: metadataTitle || supplementTitle || weeklyTitle,
      relativePath: `${model.notesPath}${entry.name}`,
      fileSize: bytes.length,
      filename: entry.name,
      supplement: Boolean(match[2]),
    });
  }
  return records
    .sort((a, b) => a.week - b.week || Number(a.supplement) - Number(b.supplement) || a.filename.localeCompare(b.filename, 'en'))
    .map(({ filename: _filename, supplement: _supplement, ...note }) => note);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  scanLectureNotes().then((notes) => {
    console.log(`Lecture notes validated: ${notes.length} real PDF file(s).`);
  }).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
