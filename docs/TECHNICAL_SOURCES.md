# Public technical references

Checked 2026-10-02. No source code or personal content from the reference site was copied.

- https://mozkanitu.github.io/ and https://mozkanitu.github.io/teaching/ — public pages fetched and read. Structural reference: academic identity, research/publications/teaching separation and course subpages. Distinct typography, palette, layouts and scientific drawings implemented here.
- https://docs.astro.build/en/install-and-setup/ — official supported runtime/install guidance.
- https://registry.npmjs.org/astro — `npm view astro version engines` reported stable7.3.5, Node>=22.12.0; installed and locked7.3.5. @astrojs/check0.9.10, sitemap3.7.4, Playwright1.63.0 verified through npm metadata; exact resolved dependencies recorded in package-lock.json.
- https://docs.astro.build/en/guides/deploy/github/ — static user site uses `site: https://eokahya.github.io` and no repository base path. Current official example uses checkout@v7, deploy-pages@v5.
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site — GitHub Actions Pages source and user-site repository convention.
- https://nodejs.org/en/about/previous-releases — Node24 LTS selected for reproducible CI; local system runtime initially Node25.9.0; clean install/typecheck/tests/build also executed successfully with bundled Node24.19.0.
- https://github.com/actions/setup-node/releases/tag/v7.0.0 and https://github.com/actions/upload-pages-artifact/releases/tag/v5.0.0 — release versions verified from official GitHub API. Workflow accepts only the target repository's actual default branch; it does not assume main.

External rate limits or blocked responses are recorded separately from broken internal links. Build and PDF generation do not require any live academic API or credentials.
