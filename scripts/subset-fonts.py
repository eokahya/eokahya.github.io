"""
Builds the four self-hosted font files in src/assets/fonts/ from the original OFL sources
(github.com/google/fonts: ofl/fraunces, ofl/ibmplexsans, ofl/ibmplexmono). Run from a folder that
contains the downloaded TTFs:  python subset-fonts.py <output-folder>   (needs fonttools + brotli)
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

UNI = ("U+0020-007E,U+00A0-017F,U+0192,U+0218-021B,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0304,U+0306-0308,U+030A-030C,U+0327-0328,"
       "U+2009-200A,U+2010-2015,U+2018-201E,U+2020-2022,U+2026,U+2030,U+2032-2033,U+2039-203A,U+2044,U+2070,U+2074-2079,U+2080-2089,U+20AC,U+2113,U+2122,"
       "U+2190-2193,U+2212,U+2215,U+221D,U+2248,U+2260,U+2264-2265,U+25A1,U+27F9,U+FEFF,U+FFFD")

def unicodes(spec):
    out = []
    for part in spec.split(','):
        part = part.replace('U+', '')
        if '-' in part:
            a, b = part.split('-'); out.extend(range(int(a, 16), int(b, 16) + 1))
        else:
            out.append(int(part, 16))
    return out

def build(src, dst, limits):
    import io
    font = TTFont(src)
    if limits:
        font = instancer.instantiateVariableFont(font, limits)
        buffer = io.BytesIO(); font.save(buffer); buffer.seek(0)
        font = TTFont(buffer)
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'tnum']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    opts.hinting = False
    opts.desubroutinize = True
    s = subset.Subsetter(opts)
    s.populate(unicodes=unicodes(UNI))
    s.subset(font)
    font.flavor = 'woff2'
    font.save(dst)
    import os
    print(dst, os.path.getsize(dst))

out = sys.argv[1]
build('Fraunces[SOFT,WONK,opsz,wght].ttf', f'{out}/fraunces-normal.woff2', {'SOFT': 0, 'WONK': 0, 'wght': (300, 500)})
build('Fraunces-Italic[SOFT,WONK,opsz,wght].ttf', f'{out}/fraunces-italic.woff2', {'SOFT': 0, 'WONK': 0, 'wght': (300, 500)})
build('IBMPlexSans[wdth,wght].ttf', f'{out}/ibm-plex-sans.woff2', {'wdth': 100, 'wght': (400, 600)})
build('IBMPlexMono-Regular.ttf', f'{out}/ibm-plex-mono-400.woff2', None)
