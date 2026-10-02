# Third-party notices

The site's own code, texts and PDFs carry no open licence; all rights remain with the author.

Shipped to visitors:

- **Fraunces** (variable; opsz and wght axes), © The Fraunces Project Authors — SIL Open Font License 1.1. See `licenses/Fraunces-OFL.txt`. Subset of the original Google Fonts source.
- **IBM Plex Sans** (variable; wght axis) and **IBM Plex Mono** (Regular), © IBM Corp. — SIL Open Font License 1.1. See `licenses/IBM-Plex-Sans-OFL.txt` and `licenses/IBM-Plex-Mono-OFL.txt`. Subsets of the original Google Fonts sources.
- Generated HTML/CSS/JS output of **Astro** (MIT, `licenses/astro-MIT.txt`).

Build and test tools only (not shipped): Astro, @astrojs/sitemap and @astrojs/check (MIT), pdf-lib (MIT, `licenses/pdf-lib-MIT.txt`), Playwright (Apache-2.0), pdfjs-dist (Apache-2.0), @axe-core/playwright (MPL-2.0), Lighthouse (Apache-2.0), tsx (MIT), TypeScript (Apache-2.0), fontTools (MIT; used once by `scripts/subset-fonts.py`).

The WebGL scene, the static plates, icons and illustrations were written for this site and use no third-party graphics. No YouTube thumbnails, players or third-party scripts are embedded.

## Fallback fonts (not shipped)

Georgia, Arial, Noto Serif and Roboto in `src/styles/fonts.css` are referenced only through `local()`, i.e. fonts already installed on the visitor's device; no file of these fonts is in the site or the repository. The scaling values (`scripts/fallback-metrics.py`) are numbers computed from their glyph widths.
