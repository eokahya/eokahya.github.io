/**
 * Renews src/data/outreach-views.json from the public YouTube watch pages (no API key).
 * Runs in CI before every build and weekly; locally: `npm run refresh:views` (add `-- --strict` to fail
 * instead of keeping the old snapshot). If fewer than 80% of the pages can be read — YouTube sometimes
 * shows bot checks to data-centre addresses — the previous snapshot and its date stay unchanged, so the
 * site never presents a partly stale figure as current.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { allYouTubeVideos } from '../src/data/outreach';
import { acceptCount, istanbulDate, parseViewCount, watchPage } from './youtube';

const file = new URL('../src/data/outreach-views.json', import.meta.url);
const strict = process.argv.includes('--strict');
const agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

const previous = JSON.parse(await readFile(file, 'utf8')) as { checkedOn: string; source: string; views: Record<string, number> };
const ids = [...new Set(allYouTubeVideos().map((video) => video.id))];
const views: Record<string, number> = {};
const problems: string[] = [];
let fresh = 0;

for (const id of ids) {
  let count: number | null = null;
  let failure = '';
  try {
    const response = await fetch(watchPage(id), { headers: { 'User-Agent': agent, 'Accept-Language': 'en-US,en;q=0.9' }, signal: AbortSignal.timeout(20_000) });
    if (response.ok) count = parseViewCount(await response.text());
    else failure = `HTTP ${response.status}`;
  } catch (error) {
    failure = error instanceof Error ? error.message : String(error);
  }
  const verdict = acceptCount(count, previous.views[id]);
  if (verdict.ok) {
    views[id] = count!;
    fresh++;
  } else {
    problems.push(`${id}: ${failure || verdict.reason}`);
    if (previous.views[id] !== undefined) views[id] = previous.views[id];
  }
  await new Promise((resolve) => setTimeout(resolve, 250));
}

const summary = `${fresh}/${ids.length} YouTube view counts`;
if (fresh < ids.length * 0.8) {
  console.warn(`View refresh skipped: only ${summary} could be read; keeping the snapshot of ${previous.checkedOn}.`);
  for (const line of problems.slice(0, 10)) console.warn(`  ${line}`);
  process.exit(strict ? 1 : 0);
}
const checkedOn = istanbulDate();
await writeFile(file, `${JSON.stringify({ checkedOn, source: previous.source, views }, null, 2)}\n`);
const total = Object.values(views).reduce((sum, value) => sum + value, 0);
console.log(`Refreshed ${summary} on ${checkedOn}; ${total.toLocaleString('en-US')} views in total.`);
for (const line of problems) console.log(`  kept earlier figure — ${line}`);
