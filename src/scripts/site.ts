/** Site-wide progressive enhancement: theme toggle, mobile menu, header state, reveals. */
const root = document.documentElement;

// ---- theme --------------------------------------------------------------------------
const themeButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
function syncThemeButton() {
  if (!themeButton) return;
  const light = root.dataset.theme === 'light';
  themeButton.setAttribute('aria-label', (light ? themeButton.dataset.labelDark : themeButton.dataset.labelLight) ?? '');
  themeButton.setAttribute('aria-pressed', String(light));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f4f0e7' : '#05060b');
}
if (themeButton) {
  themeButton.hidden = false;
  syncThemeButton();
  themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
    syncThemeButton();
    dispatchEvent(new Event('themechange'));
  });
}

// ---- mobile menu --------------------------------------------------------------------
const header = document.querySelector<HTMLElement>('[data-header]');
const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const navPanel = document.getElementById('site-nav');
if (header && menuButton && navPanel) {
  menuButton.hidden = false;
  const setOpen = (open: boolean, restoreFocus = false) => {
    header.dataset.menuOpen = String(open);
    menuButton.setAttribute('aria-expanded', String(open));
    const label = menuButton.querySelector('.menu-toggle__label');
    if (label) label.textContent = (open ? menuButton.dataset.labelClose : menuButton.dataset.labelOpen) ?? '';
    root.classList.toggle('menu-open', open);
    if (open) navPanel.querySelector<HTMLAnchorElement>('a')?.focus();
    else if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
  navPanel.addEventListener('click', (event) => { if ((event.target as HTMLElement).closest('a')) setOpen(false); });
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  matchMedia('(min-width: 961px)').addEventListener('change', (event) => { if (event.matches) setOpen(false); });
}

// ---- header background once the page scrolls -----------------------------------------
if (header) {
  const update = () => header.classList.toggle('is-scrolled', scrollY > 24);
  update();
  addEventListener('scroll', update, { passive: true });
}

// ---- gentle reveal of content blocks ------------------------------------------------
const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reveals.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  root.classList.add('reveal-ready');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((element) => observer.observe(element));
}

// ---- copy-to-clipboard buttons --------------------------------------------------------
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy ?? '');
      button.dataset.copied = 'true';
      const status = button.querySelector<HTMLElement>('[data-copy-status]');
      const original = status?.textContent ?? '';
      if (status) status.textContent = status.dataset.done ?? original;
      setTimeout(() => { button.dataset.copied = 'false'; if (status) status.textContent = original; }, 1800);
    } catch { /* clipboard not permitted: the address remains selectable */ }
  });
});
