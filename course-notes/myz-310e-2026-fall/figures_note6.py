"""
Extra figures for lecture note 6 (generative classifiers). Uses the shared style and helpers of figures.py.

    python3 figures_note6.py      # writes figures/n6_*.pdf
"""
import numpy as np
from figures import *  # noqa: F401,F403  (plt, np, colours, REGION, save)


def npdf(x, mu, sd):
    return np.exp(-(x - mu) ** 2 / (2 * sd ** 2)) / (sd * np.sqrt(2 * np.pi))


def fig_gauss1d_boundaries():
    """Worked example: two 1-D Gaussian classes, equal variances (one threshold) and unequal variances (two)."""
    x = np.linspace(-5.5, 7.5, 1400)
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 2.1))
    cases = [
        ('Equal variances, $P_1 = 0.25$', (0, 1, 0.75), (3, 1, 0.25)),
        ('Unequal variances, $P_1 = 0.5$', (0, 1, 0.5), (2, 2, 0.5)),
    ]
    for ax, (title, (m0, s0, p0), (m1, s1, p1)) in zip(axes, cases):
        g0, g1 = p0 * npdf(x, m0, s0), p1 * npdf(x, m1, s1)
        top = 1.15 * max(g0.max(), g1.max())
        ax.fill_between(x, 0, top, where=g1 > g0, color='#F7E7CC', lw=0, step='mid')
        ax.fill_between(x, 0, top, where=g1 <= g0, color='#E3E6F5', lw=0, step='mid')
        ax.plot(x, g0, c=INDIGO, label='$P_0\\, p(x \\mid 0)$')
        ax.plot(x, g1, c=AMBER, label='$P_1\\, p(x \\mid 1)$')
        # exact thresholds: roots of log(p1 N(x;m1,s1)) - log(p0 N(x;m0,s0)) = 0, a quadratic in x
        a = 0.5 / s0 ** 2 - 0.5 / s1 ** 2
        b = m1 / s1 ** 2 - m0 / s0 ** 2
        c = m0 ** 2 / (2 * s0 ** 2) - m1 ** 2 / (2 * s1 ** 2) + np.log(p1 * s0 / (p0 * s1))
        flips = np.array([-c / b]) if abs(a) < 1e-12 else np.sort(np.roots([a, b, c]).real)
        for t in flips:
            ax.axvline(t, c='k', lw=0.8, ls='--')
            ax.text(t + 0.15, 0.93 * top, f'$x = {t:.2f}$', fontsize=7.5)
        print('  ', title, 'thresholds', np.round(flips, 3))
        ax.set_xlim(-5.5, 7.5); ax.set_ylim(0, top); ax.set_yticks([]); ax.set_xlabel('$x$')
        ax.set_title(title)
    axes[0].legend(frameon=False, loc='center left', bbox_to_anchor=(0.0, 0.55), fontsize=7)
    save(fig, 'n6_gauss1d')


def fig_lda_example():
    """Worked example: LDA with a shared, correlated covariance against nearest centroid."""
    S = np.array([[2.0, 1.0], [1.0, 1.0]])
    m0, m1 = np.array([0.0, 0.0]), np.array([2.0, 1.0])
    q = np.array([0.8, 1.5])
    gx, gy = np.meshgrid(np.linspace(-3, 5, 400), np.linspace(-3, 4, 400))
    fig, ax = plt.subplots(figsize=(3.4, 2.9))
    ax.contourf(gx, gy, (gx > 1).astype(int), levels=[-0.5, 0.5, 1.5], cmap=REGION)
    vals, vecs = np.linalg.eigh(S)
    ang = np.degrees(np.arctan2(vecs[1, 1], vecs[0, 1]))
    for m, col in ((m0, INDIGO), (m1, AMBER)):
        for r in (1, 2):
            ax.add_patch(Ellipse(m, 2 * r * np.sqrt(vals[1]), 2 * r * np.sqrt(vals[0]), angle=ang,
                                 fill=False, ec=col, lw=0.8, alpha=0.9 if r == 1 else 0.5))
        ax.plot(*m, 'o', c=col, ms=5)
    ax.axvline(1.0, c='k', lw=1.1, label='LDA')
    xs = np.linspace(-3, 5, 10)
    ax.plot(xs, 2.5 - 2 * xs, c=GREY, lw=1.1, ls='--', label='nearest centroid')
    ax.plot(*q, '*', c=CORAL, ms=9, label='query')
    ax.text(m0[0] - 0.2, m0[1] - 0.45, '$\\mu_0$', color=INDIGO, fontsize=9, ha='right')
    ax.text(m1[0] + 0.12, m1[1] + 0.12, '$\\mu_1$', color=AMBER, fontsize=9)
    ax.set_xlim(-3, 5); ax.set_ylim(-3, 4); ax.set_aspect('equal')
    ax.set_xlabel('$x_1$'); ax.set_ylabel('$x_2$')
    ax.legend(frameon=False, loc='upper center', bbox_to_anchor=(0.5, -0.2), ncol=3, fontsize=8,
              handlelength=1.6, columnspacing=1.0)
    save(fig, 'n6_lda_example')


if __name__ == '__main__':
    fig_gauss1d_boundaries()
    fig_lda_example()
