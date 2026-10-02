/** Checks the generated syllabus PDF: text extractable, rules identical to course.ts, no text outside pages. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { course, minimumMidtermScore, totalAssessmentPoints } from '../src/data/course';

const path = join('dist', course.syllabusPath);
const doc = await getDocument({ data: new Uint8Array(await readFile(path)), useSystemFonts: true }).promise;
let text = '';
const lines: string[] = [];
const pages: { page: number; characters: number }[] = [];
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const items = content.items.filter((item): item is typeof item & { str: string; transform: number[] } => 'str' in item);
  const [, , width, height] = page.view;
  const outside = items.filter((item) => item.str.trim() && (item.transform[4]! < 0 || item.transform[4]! > width! || item.transform[5]! < 0 || item.transform[5]! > height!));
  if (outside.length) throw new Error(`Text outside page ${i}`);
  const pageText = items.map((item) => item.str).join(' ');
  pages.push({ page: i, characters: pageText.length });
  text += `${pageText}\n`;
  // The same text regrouped into visual lines (items within 3 pt of the same baseline, left to right),
  // so the checks do not depend on the order in which a platform's PDF backend emits text runs.
  const placed = items.filter((item) => item.str.trim()).map((item) => ({ x: item.transform[4]!, y: item.transform[5]!, str: item.str })).sort((a, b) => b.y - a.y);
  let line: typeof placed = [];
  for (const item of placed) {
    if (line.length && Math.abs(line[0]!.y - item.y) > 3) { lines.push(line.sort((a, b) => a.x - b.x).map((part) => part.str).join(' ')); line = []; }
    line.push(item);
  }
  if (line.length) lines.push(line.sort((a, b) => a.x - b.x).map((part) => part.str).join(' '));
}
const normalised = text.replace(/\s+/g, ' ');
await mkdir('artifacts/pdf', { recursive: true });
await writeFile('artifacts/pdf/text.txt', text);
const minimum = minimumMidtermScore();
const required = [
  course.code, course.title, course.term, course.sourceVersion,
  `${minimum}/${course.assessment.midtermPoints}`, `${course.assessment.minimumMidtermPercent}%`,
  'AND complete both project presentations', 'Learning outcomes', 'Weekly schedule', course.weeks.at(-1)!.title, 'Project guide',
  'Research integrity and tool use', 'Proposed rubrics', 'provisional', 'Resources', 'Announcements',
];
for (const needle of required) if (!normalised.includes(needle)) throw new Error(`PDF is missing: ${needle}`);
// The assessment table, row by row as printed: label, points, then its status column.
const visual = lines.map((text) => text.replace(/\s+/g, ' ').trim());
const table: [string, number, string][] = [
  ['Midterm examination', course.assessment.midtermPoints, 'Fixed'],
  ['Project presentation I', course.planning.presentations[0]!.points, course.planning.presentationSplitProvisional ? 'Provisional' : 'Fixed'],
  ['Project presentation II', course.planning.presentations[1]!.points, course.planning.presentationSplitProvisional ? 'Provisional' : 'Fixed'],
  ['Final project paper', course.assessment.finalPaperPoints, 'Fixed'],
  ['Total', totalAssessmentPoints(), 'The two presentations'],
];
for (const [label, points, status] of table) {
  const rule = new RegExp(`^${label} ${points} ${status}`);
  const match = visual.find((text) => rule.test(text));
  if (match) { console.log(`  row: ${match.slice(0, 90)}`); continue; }
  const context = visual.filter((text) => text.includes(label.split(' ')[0]!)).slice(0, 12);
  throw new Error(`PDF assessment table mismatch: ${label} ${points} ${status}\nPrinted lines starting with "${label.split(' ')[0]}":\n${context.map((text) => `  | ${text}`).join('\n')}`);
}
if (/Not yet uploaded/.test(normalised)) throw new Error('The PDF must not contain the per-week upload placeholders');
await writeFile('artifacts/pdf/report.json', JSON.stringify({ pages: doc.numPages, details: pages }, null, 2));
console.log(`PASS syllabus PDF: ${doc.numPages} pages, rules and assessment table match course.ts, no text outside the page`);
await doc.cleanup();
