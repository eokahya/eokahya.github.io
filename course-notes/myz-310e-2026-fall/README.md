# MYZ 310E lecture notes, weeks 1–6 (Fall 2026)

LaTeX sources of the fifteen lecture notes published on the course page
(`/teaching/myz-310e/2026-fall/#lecture-notes`).

| Source | Published PDF | Week |
| --- | --- | --- |
| `note1-learning-from-data.tex` | `week-01--learning-from-data.pdf` | 1 |
| `note2-probability-gaussians.tex` | `week-01--probability-and-gaussians.pdf` | 1 |
| `note3-histograms-curse.tex` | `week-02--histograms-and-curse-of-dimensionality.pdf` | 2 |
| `note4-risk-model-selection.tex` | `week-02--risk-and-model-selection.pdf` | 2 |
| `note5-neighbours-parzen.tex` | `week-03--nearest-neighbours-and-parzen.pdf` | 3 |
| `note6-bayes-classifiers.tex` | `week-04--bayes-classifier-and-naive-bayes.pdf` | 4 |
| `note7-optimisation.tex` | `week-04--gradient-descent-and-optimisation.pdf` | 4 |
| `note8-linear-regression.tex` | `week-04--least-squares-ridge-and-lasso.pdf` | 4 |
| `note9-linear-classifiers.tex` | `week-04--linear-classifiers.pdf` | 4 |
| `note10-kernels.tex` | `week-04--nonlinear-feature-maps-and-kernels.pdf` | 4 |
| `note11-neural-networks.tex` | `week-05--multilayer-perceptrons.pdf` | 5 |
| `note12-training-networks.tex` | `week-05--neural-network-training.pdf` | 5 |
| `note13-convnets.tex` | `week-05--translation-symmetry-and-convolutional-networks.pdf` | 5 |
| `note14-recurrent-networks.tex` | `week-06--recurrent-neural-networks.pdf` | 6 |
| `note15-attention-transformers.tex` | `week-06--soft-attention-and-transformers.pdf` | 6 |

The choice and order of topics follow IFT 6390 at Université de Montréal (Ioannis Mitliagkas;
slides by Pascal Vincent, and by Hugo Larochelle for neural-network training and convolutional networks). The text, examples, exercises and figures are original. Every figure is
computed from synthetic data with fixed random seeds by `figures.py` and the per-note scripts
`figures_noteN.py`.

Every note shows derivations step by step, works examples with numbers, gives pseudocode and the
running time of each algorithm, and ends with questions sorted into A (conceptual), B (short
calculations), C (derivations) and D (programming); A and B are midterm-style.

To avoid repetition, each idea has one home: notation and the task/loss table are in Note 1, the
Gaussian in Note 2, the curse of dimensionality in Note 3, capacity, validation and the
hyperparameter table in Note 4, nearest neighbours, kernels and distances in Note 5, generative
classifiers and LDA in Note 6, gradients and optimisers in Note 7, least squares and the ridge/lasso
penalties in Note 8, linear classifiers, the perceptron and margins in Note 9, feature maps and
the kernel trick in Note 10, neurons, activations and the multilayer perceptron in Note 11,
backpropagation, regularisation, initialisation and training practice in Note 12, and
convolutions, pooling and convolution arithmetic in Note 13, recurrent networks, BPTT, LSTM/GRU and
sequence-to-sequence learning in Note 14, and attention, the Transformer and a first look inside it in Note 15. Later notes refer
back instead of restating.

## Rebuild

Requirements: Python 3 with `numpy` and `matplotlib`, and [Tectonic](https://tectonic-typesetting.github.io)
(`brew install tectonic`). Fonts (Libertinus) are fetched by Tectonic on first use.

```bash
./course-notes/myz-310e-2026-fall/build.sh
```

The script regenerates `figures/`, compiles each note into `build/` (ignored by git) and copies the
PDFs into `public/teaching/myz-310e/2026-fall/notes/`. The site build then lists them automatically
under the matching week; titles come from each PDF's metadata.
