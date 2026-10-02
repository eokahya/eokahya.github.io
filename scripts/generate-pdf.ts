/**
 * Prints the syllabus route of the production build to a real, text-selectable A4 PDF.
 * Runs after `astro build`; a failure deletes any stale PDF so an old syllabus is never served.
 */
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import { course } from '../src/data/course';
import { startStaticServer } from './static-server.mjs';

const output = join('dist', course.syllabusPath);
await rm(output, { force: true });
await rm(`${output}.tmp`, { force: true });

const preview = await startStaticServer('dist');
let browser;
try {
  // Headless Chromium hints fonts fully on Linux (where the published PDF is built) and snaps glyphs to
  // whole pixels; that spaces letters unevenly and splits words in the PDF's text layer ("Midt erm").
  browser = await chromium.launch({ headless: true, args: ['--font-render-hinting=none'] });
  const page = await browser.newPage();
  const response = await page.goto(`${preview.url}${course.printPath}`, { waitUntil: 'networkidle' });
  if (response?.status() !== 200) throw new Error(`Syllabus route ${course.printPath} returned ${response?.status()}`);
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.evaluate(() => document.fonts.ready);
  const version = await page.locator('[data-course-version]').getAttribute('data-course-version');
  if (version !== course.sourceVersion) throw new Error(`Rendered version ${version} differs from ${course.sourceVersion}`);
  await mkdir(dirname(output), { recursive: true });
  await page.pdf({
    path: `${output}.tmp`,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `<div style="width:100%;margin:0 15mm;display:flex;justify-content:space-between;font-family:Helvetica,Arial,sans-serif;font-size:7.5px;color:#5b5e69"><span>${course.code} · ${course.title} · ${course.term} · ${course.sourceVersion}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });
  const bytes = await readFile(`${output}.tmp`);
  const pdf = await PDFDocument.load(bytes);
  if (pdf.getPageCount() < 1) throw new Error('The generated PDF has no pages');
  pdf.setTitle(`${course.code} — ${course.title} · Syllabus (${course.term})`);
  pdf.setAuthor(course.instructor);
  pdf.setSubject(`${course.institution} · source version ${course.sourceVersion}`);
  pdf.setKeywords(['MYZ 310E', 'machine learning', 'physics', 'mechanistic interpretability', 'syllabus']);
  pdf.setCreator('eokahya.github.io (Astro + Playwright)');
  pdf.setLanguage('en');
  const finalBytes = await pdf.save({ useObjectStreams: false });
  await writeFile(`${output}.tmp`, finalBytes);
  await rename(`${output}.tmp`, output);
  console.log(`Syllabus PDF generated: ${pdf.getPageCount()} pages, ${finalBytes.length} bytes, source ${course.sourceVersion}`);
} catch (error) {
  await rm(`${output}.tmp`, { force: true });
  await rm(output, { force: true });
  throw error;
} finally {
  await browser?.close();
  await preview.close();
}
