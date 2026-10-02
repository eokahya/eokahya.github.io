import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { profile } from '../src/data/profile';
import { media, talks } from '../src/data/talks';

const publicDir = resolve(import.meta.dirname, '../public');

async function pdfText(path: string) {
  const data = new Uint8Array(await readFile(join(publicDir, path)));
  assert.equal(new TextDecoder().decode(data.slice(0, 5)), '%PDF-', `${path} is a PDF`);
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
  }
  await doc.cleanup();
  return text;
}

/** Compare letters and digits only, so line breaks, quotes and dashes in the PDFs do not matter. */
const squash = (text: string) => text.toLocaleLowerCase('en').normalize('NFKD').replace(/[^a-z0-9]/g, '');

const en = squash(await pdfText(profile.cv.en));
const tr = squash(await pdfText(profile.cv.tr));

test('both CVs are published under /cv/ and carry the contact details shown on the site', () => {
  for (const cv of [en, tr]) {
    assert.ok(cv.includes(squash('Emre Onur Kahya')));
    assert.ok(cv.includes(squash(profile.email)));
    assert.ok(cv.includes(squash(profile.phone)) && cv.includes(squash(profile.fax)));
  }
  for (const date of Object.values(profile.cv.updated)) assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
});

test('every talk and press item on the site is listed in the English CV', () => {
  assert.equal(talks.length, 26);
  for (const talk of talks) assert.ok(en.includes(squash(talk.title)), talk.title);
  for (const item of media) {
    assert.ok(en.includes(squash(item.outlet)), item.outlet);
    assert.ok(en.includes(squash(item.title)), item.title);
  }
});

test('awards, projects and degrees on the site match the CVs', () => {
  for (const award of profile.awards) {
    assert.ok(en.includes(squash(award.title.replace(/ \(.*\)$/, ''))), award.title);
    assert.ok(tr.includes(squash(award.titleTr.replace(/ \(.*\)$/, ''))), award.titleTr);
  }
  for (const project of profile.projects) {
    assert.ok(en.includes(squash(project.title)), project.title);
    assert.ok(en.includes(squash(project.period)) && tr.includes(squash(project.period)), `${project.title} period`);
    if (project.number) assert.ok(en.includes(squash(project.number)) && tr.includes(squash(project.number)), project.number);
  }
  for (const thesis of ['Identifying Electrons with Deep Learning Methods', 'Quantum Gravitational Correction to Scalar Field Equations During Inflation', 'Higher dimensional metrics of colliding gravitational plane waves']) {
    assert.ok(en.includes(squash(thesis)) && tr.includes(squash(thesis)), thesis);
  }
  for (const journal of profile.refereeFor) assert.ok(en.includes(squash(journal)), journal);
});
