import assert from 'node:assert/strict';
import test from 'node:test';
import { publications, publicationSnapshot, selectedPublications } from '../src/data/publications';
import { researchAreas } from '../src/data/research';
import { profile } from '../src/data/profile';
import { venueText } from '../src/lib/format';

test('bibliography is deduplicated and every record carries its evidence', () => {
  for (const key of ['id', 'doi', 'arxiv'] as const) {
    const values = publications.map((p) => p[key]).filter(Boolean);
    assert.equal(new Set(values).size, values.length, `duplicate ${key}`);
  }
  for (const p of publications) {
    assert.ok(p.title.trim(), `${p.id} title`);
    assert.ok(p.authors.some((author) => /Kahya/.test(author)), `${p.id} author`);
    assert.ok(Number.isInteger(p.year) && p.year >= 2002 && p.year <= 2026, `${p.id} year`);
    assert.equal(new URL(p.link).protocol, 'https:');
    assert.ok(p.sourceUrls.length > 0 && p.sourceUrls.every((url) => url.startsWith('https://')));
    assert.equal(p.verifiedOn, publicationSnapshot.verifiedOn);
    assert.ok(p.topics.length > 0, `${p.id} topics`);
    for (const topic of p.topics) assert.ok(researchAreas.some((area) => area.id === topic), `${p.id} unknown topic ${topic}`);
    assert.ok(venueText(p).length > 0, `${p.id} venue`);
  }
  assert.equal(publications.length, 42);
  assert.equal(profile.orcid, '0000-0003-2760-7091');
});

test('the corrected PLB 652 record uses the publisher page range', () => {
  const record = publications.find((p) => p.id === 'inspire-749690');
  assert.equal(record?.pages, '213–216');
  assert.equal(record?.articleNumber, undefined);
});

test('research evidence resolves and the current direction is labelled as such', () => {
  for (const area of researchAreas) for (const id of area.evidence) assert.ok(publications.some((p) => p.id === id), `missing evidence ${id}`);
  const direction = researchAreas.find((area) => area.id === 'interpretability');
  assert.equal(direction?.current, true);
  assert.equal(direction?.en.status, 'Current research direction');
  assert.equal(direction?.tr.status, 'Güncel araştırma yönelimi');
  assert.deepEqual(direction?.evidence, []);
  assert.deepEqual(researchAreas.filter((area) => area.current).map((area) => area.id), ['interpretability']);
  for (const area of researchAreas) for (const title of area.projects) assert.ok(profile.projects.some((project) => project.title === title), `${area.id}: unknown project ${title}`);
  assert.ok(selectedPublications.length >= 4 && selectedPublications.every((p) => p.type !== 'thesis'));
});

test('profile facts carry public sources and no unsupported claims', () => {
  for (const entry of profile.timeline) assert.match(entry.sourceUrl, /^(https:\/\/(akademi\.itu\.edu\.tr|inspirehep\.net|doi\.org)\/|\/cv\/Emre-Onur-Kahya-CV-EN\.pdf$)/);
  for (const award of profile.awards) assert.ok(award.title && award.titleTr && award.awardedBy && award.awardedByTr, `${award.year} award texts`);
  assert.equal(profile.email, 'eokahya@itu.edu.tr');
  const links = [...profile.academicLinks, ...profile.socialLinks].map((link) => link.url);
  for (const url of ['https://www.youtube.com/@TekeTekBilim', 'https://www.youtube.com/@emreonurkahya', 'https://x.com/EmreOnurKahya', 'https://www.instagram.com/emreokahya/']) {
    assert.ok(links.includes(url), url);
  }
});
