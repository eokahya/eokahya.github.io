"""
Computes the fallback @font-face metrics in src/styles/fonts.css: system serifs scaled so that, at
heading sizes, they set the site's headings as wide as Fraunces does. Headings then wrap the same way
before and after the web font arrives, so there is no layout shift when it swaps in.

Fraunces has an optical-size axis and is ~15% narrower at desktop heading sizes than at phone sizes,
so there are three sets, matched to the h1 size at each width: S (below 840 px wide, h1 around 54 px),
M (840–1199 px, around 79 px) and L (from 1200 px, around 95 px). Other headings use S.
The sample text is every h1 of the built site (EN and TR), split into roman and italic parts.

The body font (IBM Plex Sans, no optical sizes) gets one set, matched over all paragraph text.

Run after `npm run build:html`, from a folder holding the Fraunces and IBM Plex Sans sources
(github.com/google/fonts: ofl/fraunces, ofl/ibmplexsans) and the fallback fonts:
python fallback-metrics.py <site-folder> [M-factor L-factor]   (needs fonttools)
Georgia and Arial ship with macOS, iOS and Windows; Noto Serif and Roboto are Android's
(ofl/notoserif, ofl/roboto). The optional factors fine-tune the M and L sets (see docs/DESIGN_TR.md).
"""
import html
import pathlib
import re
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

site = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
roman, italic = [], []
for page in (site / 'dist').rglob('index.html'):
    match = re.search(r'<h1[^>]*>(.*?)</h1>', page.read_text(encoding='utf-8'), re.S)
    if not match:
        continue
    heading = match.group(1)
    italic += [re.sub(r'<[^>]+>', '', part) for part in re.findall(r'<em[^>]*>(.*?)</em>', heading, re.S)]
    roman.append(re.sub(r'<[^>]+>', '', re.sub(r'<em[^>]*>.*?</em>', ' ', heading, flags=re.S)))
roman = [html.unescape(t) for t in roman]
italic = [html.unescape(t) for t in italic]
paragraphs = []
for page in (site / 'dist').rglob('index.html'):
    paragraphs += [html.unescape(re.sub(r'<[^>]+>', '', p)) for p in re.findall(r'<p[^>]*>(.*?)</p>', page.read_text(encoding='utf-8'), re.S)]
tune = {'S': 1.0, 'M': float(sys.argv[2]) if len(sys.argv) > 2 else 1.0, 'L': float(sys.argv[3]) if len(sys.argv) > 3 else 1.0}


def width(font, texts):
    cmap, hmtx, upm = font.getBestCmap(), font['hmtx'], font['head'].unitsPerEm
    space = cmap[ord(' ')]
    return sum(hmtx[cmap.get(ord(ch), space)][0] for text in texts for ch in text) / upm


def fraunces(path, weight, opsz):
    return instantiateVariableFont(TTFont(path), {'wght': weight, 'opsz': opsz, 'SOFT': 0, 'WONK': 0}, inplace=False)


def static(path, axes=None):
    font = TTFont(path)
    return instantiateVariableFont(font, axes, inplace=False) if axes else font


fallbacks = {
    'Georgia': (static('Georgia.ttf'), static('Georgia Italic.ttf'), "local('Georgia')", "local('Georgia Italic'), local('Georgia-Italic')"),
    'Noto': (static('NotoSerif[wdth,wght].ttf', {'wght': 400, 'wdth': 100}), static('NotoSerif-Italic[wdth,wght].ttf', {'wght': 400, 'wdth': 100}),
             "local('Noto Serif'), local('NotoSerif-Regular')", "local('Noto Serif Italic'), local('NotoSerif-Italic')"),
}
reference = TTFont('Fraunces[SOFT,WONK,opsz,wght].ttf')
ascent = reference['hhea'].ascent / reference['head'].unitsPerEm
descent = -reference['hhea'].descent / reference['head'].unitsPerEm

for size, opsz in (('S', 54), ('M', 79), ('L', 95)):
    targets = (width(fraunces('Fraunces[SOFT,WONK,opsz,wght].ttf', 380, opsz), roman),
               width(fraunces('Fraunces-Italic[SOFT,WONK,opsz,wght].ttf', 340, opsz), italic))
    for name, (regular, oblique, src_regular, src_italic) in fallbacks.items():
        family = f"Fraunces Fallback {size}{'' if name == 'Georgia' else ' ' + name}"
        for style, font, src, target in (('normal', regular, src_regular, targets[0]), ('italic', oblique, src_italic, targets[1])):
            adjust = tune[size] * target / width(font, roman if style == 'normal' else italic)
            print(f"@font-face {{ font-family: '{family}'; font-style: {style}; src: {src}; size-adjust: {adjust * 100:.1f}%; "
                  f"ascent-override: {ascent / adjust * 100:.1f}%; descent-override: {descent / adjust * 100:.1f}%; line-gap-override: 0%; }}")

plex = static('IBMPlexSans[wdth,wght].ttf', {'wght': 400, 'wdth': 100})
target = width(plex, paragraphs)
plex_ascent = plex['hhea'].ascent / plex['head'].unitsPerEm
plex_descent = -plex['hhea'].descent / plex['head'].unitsPerEm
for family, path, axes, src in (('IBM Plex Sans Fallback', 'Arial.ttf', None, "local('Arial'), local('ArialMT')"),
                                ('IBM Plex Sans Fallback Roboto', 'Roboto[wdth,wght].ttf', {'wght': 400, 'wdth': 100}, "local('Roboto'), local('Roboto-Regular')")):
    adjust = target / width(static(path, axes), paragraphs)
    print(f"@font-face {{ font-family: '{family}'; src: {src}; size-adjust: {adjust * 100:.1f}%; "
          f"ascent-override: {plex_ascent / adjust * 100:.1f}%; descent-override: {plex_descent / adjust * 100:.1f}%; line-gap-override: 0%; }}")
