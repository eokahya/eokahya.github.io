# MYZ 310E lecture notes, weeks 1–3 (Fall 2026)

LaTeX sources of the five lecture notes published on the course page
(`/teaching/myz-310e/2026-fall/#lecture-notes`).

| Source | Published PDF | Week |
| --- | --- | --- |
| `note1-learning-from-data.tex` | `week-01--learning-from-data.pdf` | 1 |
| `note2-probability-gaussians.tex` | `week-01--probability-and-gaussians.pdf` | 1 |
| `note3-histograms-curse.tex` | `week-02--histograms-and-curse-of-dimensionality.pdf` | 2 |
| `note4-risk-model-selection.tex` | `week-02--risk-and-model-selection.pdf` | 2 |
| `note5-neighbours-parzen.tex` | `week-03--nearest-neighbours-and-parzen.pdf` | 3 |

The choice and order of topics follow IFT 6390 at Université de Montréal (Ioannis Mitliagkas;
slides by Pascal Vincent). The text, examples, exercises and figures are original. Every figure is
computed from synthetic data with fixed random seeds by `figures.py`.

To avoid repetition, each idea has one home: notation and the task/loss table are in Note 1, the
Gaussian in Note 2, the curse of dimensionality in Note 3, capacity, validation and the
hyperparameter table in Note 4, and nearest neighbours, kernels and distances in Note 5. Later
notes refer back instead of restating.

## Rebuild

Requirements: Python 3 with `numpy` and `matplotlib`, and [Tectonic](https://tectonic-typesetting.github.io)
(`brew install tectonic`). Fonts (Libertinus) are fetched by Tectonic on first use.

```bash
./course-notes/myz-310e-2026-fall/build.sh
```

The script regenerates `figures/`, compiles each note into `build/` (ignored by git) and copies the
PDFs into `public/teaching/myz-310e/2026-fall/notes/`. The site build then lists them automatically
under the matching week; titles come from each PDF's metadata.
