import type { Publication } from '../data/publications';

/** Journal, volume and article number/pages, or a free-text venue. */
export function venueParts(p: Publication): { journal?: string; volume?: string; locator?: string; text?: string } {
  if (p.venue) return { text: p.venue };
  if (p.type === 'preprint') return { text: p.arxiv ? `arXiv:${p.arxiv}` : 'Preprint' };
  return { journal: p.journal, volume: p.volume, locator: p.articleNumber ?? p.pages };
}

export function venueText(p: Publication): string {
  const v = venueParts(p);
  if (v.text) return v.text;
  return [v.journal, [v.volume, v.locator].filter(Boolean).join(', ')].filter(Boolean).join(' ');
}

export const isSelf = (name: string) => /Kahya/.test(name);

export function authorList(authors: readonly string[], max = 6): { names: string[]; more: number } {
  if (authors.length <= max) return { names: [...authors], more: 0 };
  const self = authors.findIndex(isSelf);
  const names = authors.slice(0, max - 1);
  if (self >= max - 1) names.push(authors[self]!);
  return { names, more: authors.length - names.length };
}

export function publicationLinks(p: Publication): { label: string; url: string }[] {
  const links: { label: string; url: string }[] = [];
  if (p.doi) links.push({ label: 'DOI', url: `https://doi.org/${p.doi}` });
  if (p.arxiv) links.push({ label: 'arXiv', url: `https://arxiv.org/abs/${p.arxiv}` });
  const inspire = p.sourceUrls.find((url) => url.includes('inspirehep.net/literature'));
  if (inspire) links.push({ label: 'INSPIRE', url: inspire });
  if (!links.length) links.push({ label: 'Record', url: p.link });
  return links;
}

const monthNames = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
};
/** "2026-10-02" → "2 October 2026" / "2 Ekim 2026" without locale data. */
export function longDate(iso: string, lang: 'en' | 'tr' = 'en'): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${monthNames[lang][(m ?? 1) - 1]} ${y}`;
}

/** Spell out small counts at the start of a sentence. */
export function numberWord(n: number, lang: 'en' | 'tr' = 'en'): string {
  const words = { en: ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'], tr: ['Sıfır', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz', 'On'] };
  return words[lang][n] ?? String(n);
}
