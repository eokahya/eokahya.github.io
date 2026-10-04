/** Reading public YouTube watch pages (no API key). Pure helpers, shared by the refresh script and its tests. */

export const watchPage = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/**
 * The view count in a watch page, from the player response (`"viewCount":"720670"` in videoDetails or
 * microformat). Returns null when the page carries no count — a consent or bot-check page, for example.
 */
export function parseViewCount(html: string): number | null {
  const match = html.match(/"viewCount":"(\d+)"/);
  if (!match) return null;
  const views = Number(match[1]);
  return Number.isSafeInteger(views) ? views : null;
}

/** Decides whether a freshly read count can replace the previous one (counts only grow, give or take spam removal). */
export function acceptCount(fresh: number | null, previous: number | undefined): { ok: boolean; reason?: string } {
  if (fresh === null) return { ok: false, reason: 'no view count on the page' };
  if (previous !== undefined && fresh < previous * 0.9) return { ok: false, reason: `${fresh} is far below the earlier ${previous}` };
  return { ok: true };
}

/** Today's date in Istanbul as YYYY-MM-DD. */
export const istanbulDate = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
