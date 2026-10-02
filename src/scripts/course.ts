/** Highlights the course section in view in the side navigation (purely cosmetic). */
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-spy]'));
const targets = links.map((link) => document.getElementById(link.dataset.spy!)).filter((el): el is HTMLElement => Boolean(el));
if (links.length && 'IntersectionObserver' in window) {
  const visible = new Set<string>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) { if (entry.isIntersecting) visible.add(entry.target.id); else visible.delete(entry.target.id); }
    const current = targets.find((target) => visible.has(target.id))?.id;
    links.forEach((link) => link.setAttribute('aria-current', String(link.dataset.spy === current)));
  }, { rootMargin: '-20% 0px -65% 0px' });
  targets.forEach((target) => observer.observe(target));
}
