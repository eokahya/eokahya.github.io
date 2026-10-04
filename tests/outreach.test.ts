import assert from 'node:assert/strict';
import test from 'node:test';
import {
  allYouTubeVideos, bilimEkstra, bilimEkstraThemes, channels, clips, conversations, formatDuration, formatMonth, formatViews, formatViewsFloor,
  otherChannels, outreachSnapshot, outreachTotals, watchUrl,
} from '../src/data/outreach';
import snapshot from '../src/data/outreach-views.json';
import { acceptCount, istanbulDate, parseApiCounts, parseViewCount } from '../scripts/youtube';

test('every video id is unique and well-formed, with a view count from the snapshot', () => {
  const all = allYouTubeVideos();
  assert.equal(new Set(all.map((video) => video.id)).size, all.length);
  for (const video of all) {
    assert.match(video.id, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(video.views > 0 && Number.isInteger(video.views));
    assert.ok(video.durationSeconds > 0);
    assert.match(video.published, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(video.published <= outreachSnapshot.checkedOn);
    if (video.aired) assert.ok(video.aired < video.published);
    if (video.instagram) {
      assert.match(video.instagram.url, /^https:\/\/www\.instagram\.com\/teketektv\/reel\/[A-Za-z0-9_-]+\/$/);
      assert.ok(Number.isInteger(video.instagram.views) && video.instagram.views > 0);
    }
  }
  // The snapshot holds exactly the listed videos and a valid date.
  assert.deepEqual(Object.keys(snapshot.views).sort(), all.map((video) => video.id).sort());
  assert.match(outreachSnapshot.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
});

test('short titles are faithful excerpts of the original YouTube titles', () => {
  for (const video of allYouTubeVideos()) {
    // Turkish-aware lower case: all-caps originals (FİZİK …) are shown in sentence case.
    const squash = (text: string) => text.replace(/\s+/g, ' ').replace('rˆ2', 'r²').trim().toLocaleLowerCase(video.lang);
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
  const sum = (list: readonly { views: number }[]) => list.reduce((s, v) => s + v.views, 0);
  assert.equal(totals.tekeTekBilimViews, sum([...conversations, ...clips, ...bilimEkstra]));
  assert.equal(totals.youtubeViews, sum(allYouTubeVideos()));
  assert.equal(totals.otherChannelViews, sum(otherChannels));
  assert.deepEqual([...new Set(otherChannels.map((video) => video.channel))].sort(), ['Haber Global', 'Literat']);
  assert.equal(totals.instagramViews, clips.reduce((s, v) => s + (v.instagram?.views ?? 0), 0));
  assert.equal(totals.allViews, totals.youtubeViews + totals.instagramViews);
  // Conversations and clips are shown most watched first.
  for (const list of [conversations, clips]) for (let i = 1; i < list.length; i++) assert.ok(list[i - 1]!.views >= list[i]!.views);
});

test('view counts are read from YouTube pages only when they are plausible', () => {
  assert.equal(parseViewCount('{"videoDetails":{"videoId":"x","viewCount":"720739","author":"Teke Tek Bilim"}}'), 720739);
  assert.equal(parseViewCount('<html>Sign in to confirm you are not a bot</html>'), null);
  assert.equal(parseViewCount('"viewCount":{"videoViewCountRenderer":{"viewCount":{"simpleText":"720,739 views"}}}'), null);
  assert.deepEqual(acceptCount(800, 700), { ok: true });
  assert.equal(acceptCount(500, 700).ok, false);
  assert.equal(acceptCount(null, 700).ok, false);
  assert.deepEqual(acceptCount(42, undefined), { ok: true });
  assert.equal(istanbulDate(new Date('2026-10-03T22:30:00Z')), '2026-10-04');
  assert.deepEqual(parseApiCounts({ items: [{ id: 'qp0k-ak7f7c', statistics: { viewCount: '720739' } }, { id: 'x', statistics: {} }] }), { 'qp0k-ak7f7c': 720739 });
  assert.deepEqual(parseApiCounts({ error: { code: 403 } }), {});
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
