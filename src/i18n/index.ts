/**
 * Two languages: English (default, no prefix) and Turkish (/tr/ with Turkish slugs).
 * The MYZ 310E course pages are English only (the course is taught in English); the Turkish
 * teaching page summarises the course and links to them.
 */
export type Lang = 'en' | 'tr';
export const langs: readonly Lang[] = ['en', 'tr'];

export const routes = {
  home: { en: '/', tr: '/tr/' },
  research: { en: '/research/', tr: '/tr/arastirma/' },
  publications: { en: '/publications/', tr: '/tr/yayinlar/' },
  teaching: { en: '/teaching/', tr: '/tr/ogretim/' },
  outreach: { en: '/outreach/', tr: '/tr/bilim-iletisimi/' },
  about: { en: '/about/', tr: '/tr/hakkinda/' },
  contact: { en: '/contact/', tr: '/tr/iletisim/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteId = keyof typeof routes;
export type NavId = Exclude<RouteId, 'home'>;
export const navOrder: readonly NavId[] = ['research', 'publications', 'teaching', 'outreach', 'about', 'contact'];

export const href = (lang: Lang, id: RouteId, hash = '') => `${routes[id][lang]}${hash ? `#${hash}` : ''}`;

/** Language of a path: everything under /tr/ is Turkish. */
export const langOf = (pathname: string): Lang => (pathname === '/tr' || pathname.startsWith('/tr/') ? 'tr' : 'en');

/** The same page in the other language (course pages map to the Turkish teaching page). */
export function counterpart(pathname: string): { lang: Lang; href: string } {
  const current = langOf(pathname);
  const other: Lang = current === 'en' ? 'tr' : 'en';
  const normalised = pathname.endsWith('/') ? pathname : `${pathname}/`;
  for (const id of Object.keys(routes) as RouteId[]) {
    if (routes[id][current] === normalised) return { lang: other, href: routes[id][other] };
  }
  if (normalised.startsWith('/teaching/')) return { lang: 'tr', href: routes.teaching.tr };
  return { lang: other, href: routes.home[other] };
}

/** Which nav item is current for a path (course pages belong to Teaching). */
export function currentRoute(pathname: string): NavId | null {
  const lang = langOf(pathname);
  for (const id of navOrder) {
    const base = routes[id][lang];
    if (pathname === base || pathname.startsWith(base)) return id;
  }
  return pathname.startsWith('/teaching/') ? 'teaching' : null;
}

export const htmlLang: Record<Lang, string> = { en: 'en', tr: 'tr' };
export const ogLocale: Record<Lang, string> = { en: 'en_GB', tr: 'tr_TR' };
