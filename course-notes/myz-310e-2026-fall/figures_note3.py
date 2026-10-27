"""
Extra figures for lecture note 3 (histograms and the curse of dimensionality).
Run from the notes folder:  python3 figures_note3.py   (writes figures/n3_*.pdf)
"""
import math

from figures import *  # noqa: F401,F403  (colours, REGION, save, numpy as np, plt)

# The ten labelled points of the hand-worked examples (Section 1): (x1, x2, class)
TOY = {'P1': (0.6, 1.2, 0), 'P2': (0.3, 1.7, 0), 'P3': (1.4, 0.5, 0), 'P4': (1.7, 1.3, 0), 'P5': (2.5, 0.4, 0),
       'P6': (1.5, 2.4, 1), 'P7': (2.1, 2.3, 1), 'P8': (2.4, 2.7, 1), 'P9': (2.7, 2.3, 1), 'P10': (2.8, 2.1, 0)}
QUERIES = {'$q_1$': (2.5, 1.5), '$q_2$': (1.2, 2.8), '$q_3$': (2.75, 2.75)}
OFFSET = {'P9': (0.06, -0.02), 'P10': (-0.05, -0.17), 'P7': (-0.32, -0.03), 'P8': (-0.3, 0.03)}  # label positions that avoid overlaps
LIGHT = {0: '#E3E6F5', 1: '#F7E7CC'}


def _toy_points(ax):
    for name, (x1, x2, c) in TOY.items():
        ax.scatter(x1, x2, s=22, c=AMBER if c else INDIGO, marker='o' if c else 's', zorder=3, lw=0)
        dx, dy = OFFSET.get(name, (0.07, 0.05))
        ax.text(x1 + dx, x2 + dy, name, fontsize=7, family='DejaVu Sans', zorder=4)
    for name, (x1, x2) in QUERIES.items():
        ax.scatter(x1, x2, s=55, marker='*', c=CORAL, zorder=3, lw=0)
        dx, dy = OFFSET.get(name, (0.08, -0.16))
        ax.text(x1 + dx, x2 + dy, name, fontsize=7.5, color=CORAL, zorder=4)
    ax.set_xlim(0, 3); ax.set_ylim(0, 3); ax.set_aspect('equal')
    ax.set_xticks([0, 1, 2, 3]); ax.set_yticks([0, 1, 2, 3])
    ax.set_xlabel('$x_1$'); ax.set_ylabel('$x_2$')


def fig_toy():
    X = np.array([v[:2] for v in TOY.values()]); y = np.array([v[2] for v in TOY.values()])
    fig, axes = plt.subplots(1, 2, figsize=(6.0, 2.9))
    ax = axes[0]
    for c1 in range(3):
        for c2 in range(3):
            inside = (np.floor(X[:, 0]) == c1) & (np.floor(X[:, 1]) == c2)
            n0, n1 = int((y[inside] == 0).sum()), int((y[inside] == 1).sum())
            if n0 + n1 == 0:
                ax.add_patch(plt.Rectangle((c1, c2), 1, 1, fc=LIGHT[0], ec=GREY, hatch='////', lw=0.0, alpha=0.6))
            else:
                ax.add_patch(plt.Rectangle((c1, c2), 1, 1, fc=LIGHT[int(n1 > n0)], ec='none'))
            ax.text(c1 + 0.5, c2 + 0.08, f'({n0},{n1})', ha='center', fontsize=7, color=GREY)
    for t in (1, 2):
        ax.axvline(t, c=GREY, lw=0.6); ax.axhline(t, c=GREY, lw=0.6)
    _toy_points(ax)
    ax.set_title('$3\\times 3$ histogram: 9 cells, 3 empty')
    ax = axes[1]
    ax.add_patch(plt.Rectangle((0, 0), 3, 2, fc=LIGHT[0], ec='none'))
    ax.add_patch(plt.Rectangle((0, 2), 3, 1, fc=LIGHT[1], ec='none'))
    ax.axhline(2, c=GREY, lw=0.9)
    ax.text(0.08, 1.05, '$x_2<2$: (5,0)', fontsize=7, color=GREY)
    ax.text(0.08, 2.85, '$x_2\\geq 2$: (1,4)', fontsize=7, color=GREY, va='top')
    _toy_points(ax)
    ax.set_title('Decision tree: one split, 2 cells')
    save(fig, 'n3_toy')


# ---------------------------------------------------------------- bias and variance of the histogram density
W, MU, SD = (0.6, 0.4), (-1.2, 1.0), (0.45, 0.8)   # the bimodal density of figure hist_density
LO, HI = -3.5, 3.8


def mix_pdf(x):
    return sum(w * np.exp(-(x - m) ** 2 / (2 * s * s)) / np.sqrt(2 * np.pi * s * s) for w, m, s in zip(W, MU, SD))


def mix_cdf(x):
    erf = np.vectorize(math.erf)
    return sum(w * 0.5 * (1 + erf((x - m) / (s * np.sqrt(2)))) for w, m, s in zip(W, MU, SD))


def imse_parts(nbins, n):
    """Exact integrated squared bias and integrated variance of the histogram on [LO, HI] with nbins bins."""
    edges = np.linspace(LO, HI, nbins + 1); h = edges[1] - edges[0]
    pc = np.diff(mix_cdf(edges))
    g = np.linspace(-7, 8, 30001); dx = g[1] - g[0]
    k = np.floor((g - LO) / h).astype(int)
    mean_est = np.where((k >= 0) & (k < nbins), pc[np.clip(k, 0, nbins - 1)] / h, 0.0)
    bias2 = ((mean_est - mix_pdf(g)) ** 2).sum() * dx
    var = (pc * (1 - pc)).sum() / (n * h)
    return bias2, var


def fig_biasvar():
    bins = np.unique(np.round(np.geomspace(2, 200, 60)).astype(int))
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 2.3))
    best = {}
    for n in (200, 2000):
        parts = np.array([imse_parts(b, n) for b in bins])
        tot = parts.sum(1); best[n] = (bins[tot.argmin()], tot.min())
        print(f'   n={n}: best number of bins {bins[tot.argmin()]} (h={(HI - LO) / bins[tot.argmin()]:.3f}), IMSE {tot.min():.4f}')
        if n == 200:
            ax = axes[0]
            ax.loglog(bins, parts[:, 0], c=INDIGO, label='integrated bias$^2$')
            ax.loglog(bins, parts[:, 1], c=AMBER, label='integrated variance')
            ax.loglog(bins, tot, c='k', lw=1.0, ls='--', label='sum (IMSE)')
            ax.axvline(best[n][0], c=GREY, lw=0.6)
            ax.set_title('$n = 200$ points')
            ax.legend(frameon=False, loc='lower left', fontsize=7)
            for b in (3, 15, 80):
                i = int(np.argmin(np.abs(bins - b)))
                print(f'   n=200, {bins[i]} bins: bias2 {parts[i, 0]:.4f}, var {parts[i, 1]:.4f}')
        axes[1].loglog(bins, tot, c=INDIGO if n == 200 else TEAL, label=f'$n = {n}$')
        axes[1].scatter([best[n][0]], [best[n][1]], s=14, c=INDIGO if n == 200 else TEAL, zorder=3)
    axes[1].set_title('Total error and its minimum')
    axes[1].legend(frameon=False, fontsize=7)
    for ax in axes:
        ax.set_xlabel('number of bins on $[-3.5, 3.8]$')
    axes[0].set_ylabel('error')
    save(fig, 'n3_biasvar')


if __name__ == '__main__':
    fig_toy()
    fig_biasvar()
