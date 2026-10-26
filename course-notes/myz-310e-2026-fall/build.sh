#!/usr/bin/env bash
# Rebuild the MYZ 310E lecture notes for weeks 1-4 and copy the PDFs into the website.
# Requires python3 with numpy and matplotlib, and Tectonic (https://tectonic-typesetting.github.io).
# Usage: ./build.sh            (from any directory)
set -euo pipefail
cd "$(dirname "$0")"

notes_dir=../../public/teaching/myz-310e/2026-fall/notes
# source file (without .tex) : published name (without .pdf); see scripts/scan-notes.ts for the naming rule
pairs=(
  "note1-learning-from-data:week-01--learning-from-data"
  "note2-probability-gaussians:week-01--probability-and-gaussians"
  "note3-histograms-curse:week-02--histograms-and-curse-of-dimensionality"
  "note4-risk-model-selection:week-02--risk-and-model-selection"
  "note5-neighbours-parzen:week-03--nearest-neighbours-and-parzen"
  "note6-bayes-classifiers:week-04--bayes-classifier-and-naive-bayes"
  "note7-optimisation:week-04--gradient-descent-and-optimisation"
  "note8-linear-regression:week-04--least-squares-ridge-and-lasso"
  "note9-linear-classifiers:week-04--linear-classifiers-and-feature-maps"
)

python3 figures.py
mkdir -p build "$notes_dir"
for pair in "${pairs[@]}"; do
  source_name=${pair%%:*}
  published_name=${pair##*:}
  tectonic -X compile --outdir build "$source_name.tex"
  cp "build/$source_name.pdf" "$notes_dir/$published_name.pdf"
  echo "published $published_name.pdf"
done
