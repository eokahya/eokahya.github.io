/** Checks the generated syllabus PDF: text extractable, rules identical to course.ts, no text outside pages. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { course, minimumMidtermScore, totalAssessmentPoints } from '../src/data/course';

const path = join('dist', course.syllabusPath);
const doc = await getDocument({ data: new Uint8Array(await readFile(path)), useSystemFonts: true }).promise;
let text = '';
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
const rules: [RegExp, string][] = [
  [new RegExp(`Midterm examination\\s+${course.assessment.midtermPoints}\\b`), 'midterm row'],
  [new RegExp(`Project presentation I\\s+${course.planning.presentations[0]!.points}\\b`), 'presentation I row'],
  [new RegExp(`Project presentation II\\s+${course.planning.presentations[1]!.points}\\b`), 'presentation II row'],
  [new RegExp(`Final project paper\\s+${course.assessment.finalPaperPoints}\\b`), 'paper row'],
  [new RegExp(`Total\\s+${totalAssessmentPoints()}\\b`), 'total row'],
];
for (const [rule, label] of rules) if (!rule.test(normalised)) throw new Error(`PDF assessment table mismatch: ${label}`);
if (/Not yet uploaded/.test(normalised)) throw new Error('The PDF must not contain the per-week upload placeholders');
await writeFile('artifacts/pdf/report.json', JSON.stringify({ pages: doc.numPages, details: pages }, null, 2));
console.log(`PASS syllabus PDF: ${doc.numPages} pages, rules and assessment table match course.ts, no text outside the page`);
await doc.cleanup();
