import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User site repository (eokahya/eokahya.github.io): no base path.
export default defineConfig({
  site: 'https://eokahya.github.io',
  output: 'static',
  trailingSlash: 'always',
  // Astro 7 defaults to JSX-style whitespace removal; keep HTML-aware compression
  // so that spaces between inline elements in prose are preserved.
  compressHTML: true,
  integrations: [
    sitemap({
      // Canonical HTML pages only: the print route and the current-course alias are excluded.
      filter: (page) => page.endsWith('/') && !page.includes('/syllabus/') && !page.endsWith('/404/') && page !== 'https://eokahya.github.io/teaching/myz-310e/',
    }),
  ],
  devToolbar: { enabled: false },
  // Inline the (small) stylesheets: no render-blocking CSS requests on slow mobile connections.
  build: { inlineStylesheets: 'always' },
});
