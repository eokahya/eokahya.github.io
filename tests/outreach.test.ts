import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bilimEkstra, bilimEkstraThemes, channels, clips, conversations, formatDuration, formatMonth, formatViews, formatViewsFloor,
  lessons, outreachSnapshot, outreachTotals, tekeTekBilimVideos, watchUrl,
} from '../src/data/outreach';

test('every video id is unique and well-formed', () => {
  const all = [...tekeTekBilimVideos(), ...lessons];
  assert.equal(new Set(all.map((video) => video.id)).size, all.length);
  for (const video of all) {
    assert.match(video.id, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(video.views > 0 && Number.isInteger(video.views));
    assert.ok(video.durationSeconds > 0);
    assert.match(video.published, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(video.published <= outreachSnapshot.checkedOn);
    if (video.aired) assert.ok(video.aired < video.published);
  }
});

test('short titles are faithful excerpts of the original YouTube titles', () => {
  for (const video of [...tekeTekBilimVideos(), ...lessons]) {
    const squash = (text: string) => text.replace(/\s+/g, ' ').replace('rˆ2', 'r²').trim();
    assert.ok(squash(video.originalTitle).startsWith(squash(video.title)), `${video.id}: ${video.title}`);
  }
  for (const video of bilimEkstra) assert.match(video.originalTitle, /Prof\. Dr\. Emre Onur Kahya ile Bilim Ekstra$/);
  for (const video of [...conversations, ...clips]) {
    assert.equal(video.lang, 'tr');
    assert.ok(/Emre Onur Kahya/.test(video.originalTitle) || ['MsMYj4Ac2b4', 'kPym_ScuZqE'].includes(video.id), `${video.id} names the guest`);
  }
});

test('Bilim Ekstra episodes are all themed and the counts add up', () => {
  const themes = new Set(bilimEkstraThemes.map((theme) => theme.id));
  for (const video of bilimEkstra) assert.ok(video.theme && themes.has(video.theme), video.id);
  const totals = outreachTotals();
  assert.equal(totals.conversations, 7);
  assert.equal(totals.bilimEkstra, 49);
  assert.equal(totals.clips, 5);
  assert.equal(totals.programmes, 56);
  assert.equal(totals.firstAired, '2021-08-01');
  const sum = [...conversations, ...clips, ...bilimEkstra].reduce((s, v) => s + v.views, 0);
  assert.equal(totals.tekeTekBilimViews, sum);
  assert.equal(formatViewsFloor(totals.tekeTekBilimViews), '5.6M');
});

test('formatting helpers never overstate', () => {
  assert.equal(formatViews(996121), '996K');
  assert.equal(formatViews(1116033), '1.1M');
  assert.equal(formatViews(8729), '8.7K');
  assert.equal(formatViews(7045), '7K');
  assert.equal(formatViewsFloor(5683992), '5.6M');
  assert.equal(formatViewsFloor(5999999), '5.9M');
  assert.equal(formatDuration(4865), '1 h 21 min');
  assert.equal(formatDuration(1179), '20 min');
  assert.equal(formatMonth('2026-09-27'), 'Sep 2026');
  assert.equal(watchUrl({ id: 'Jb4xXribPwk', format: 'short' }), 'https://www.youtube.com/shorts/Jb4xXribPwk');
  assert.equal(watchUrl({ id: 'qp0k-ak7f7c', format: 'video' }), 'https://www.youtube.com/watch?v=qp0k-ak7f7c');
  for (const channel of Object.values(channels)) assert.ok(channel.url.startsWith('https://'));
});
