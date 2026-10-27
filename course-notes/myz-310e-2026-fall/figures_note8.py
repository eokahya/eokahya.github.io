"""Extra figures for Note 8 (linear regression and regularisation). Run from this folder: python3 figures_note8.py"""
from figures import *  # noqa: F401,F403  (colours, save, plt, np)


def fig_line_fit():
    """Worked example of Section 2: five points, least-squares line with residuals, and ridge lines."""
    x = np.array([0, 1, 2, 3, 4.]); y = np.array([1, 3, 4, 7, 10.])
    xb, yb = x.mean(), y.mean()
    Sxy, Sxx = ((x - xb) * (y - yb)).sum(), ((x - xb) ** 2).sum()
    g = np.linspace(-0.3, 4.3, 50)
    fig, axes = plt.subplots(1, 2, figsize=(6.4, 2.35), sharey=True)
    ax = axes[0]
    w = Sxy / Sxx; b = yb - w * xb
    for xi, yi in zip(x, y):
        ax.plot([xi, xi], [yi, b + w * xi], c=CORAL, lw=2.0, solid_capstyle='butt')
    ax.plot(g, b + w * g, c=INDIGO, label=f'$\\hat y = {b:.1f} + {w:.1f}\\,x$')
    ax.scatter(x, y, s=22, c='k', zorder=3)
    ax.set_xlabel('time $x$ (s)'); ax.set_ylabel('position $y$ (cm)')
    ax.set_title('Least squares and residuals')
    ax.legend(frameon=False, loc='upper left')
    ax = axes[1]
    for lam, c in ((0, INDIGO), (5, TEAL), (40, AMBER)):
        wl = Sxy / (Sxx + lam); bl = yb - wl * xb
        ax.plot(g, bl + wl * g, c=c, label=f'$\\lambda={lam}$: $w={wl:.2f}$')
        print(f'   lambda={lam}: w={wl:.4f}, b={bl:.4f}')
    ax.scatter(x, y, s=22, c='k', zorder=3)
    ax.plot(xb, yb, 'o', mfc='white', mec='k', ms=7, zorder=4)
    ax.annotate('$(\\bar x, \\bar y)$', (xb, yb), xytext=(2.35, 2.2), fontsize=8,
                arrowprops=dict(arrowstyle='-', lw=0.5, color='k'))
    ax.set_xlabel('time $x$ (s)'); ax.set_title('Ridge: the slope shrinks')
    ax.legend(frameon=False, loc='upper left')
    save(fig, 'n8_line_fit')


def soft(z, t):
    return np.sign(z) * np.maximum(np.abs(z) - t, 0)


def fig_shrinkage():
    """(a) Ridge and lasso as functions of the least-squares coefficient for an orthonormal design;
    (b) constrained forms: elliptical contours of the squared error touching an L2 disc and an L1 diamond."""
    fig, axes = plt.subplots(1, 2, figsize=(6.4, 2.75), gridspec_kw=dict(wspace=0.32))
    ax = axes[0]
    a = np.linspace(-3.4, 3.4, 400); lam = 1.0
    ax.plot(a, a, c=GREY, lw=0.9, ls='--', label='least squares')
    ax.plot(a, a / (1 + lam), c=TEAL, label='ridge $a/(1+\\lambda)$')
    ax.plot(a, soft(a, lam / 2), c=AMBER, label='lasso $S(a, \\lambda/2)$')
    pts = np.array([3.0, -1.2, 0.4, -0.1])
    ax.scatter(pts, soft(pts, lam / 2), s=16, c=AMBER, zorder=3)
    ax.scatter(pts, pts / (1 + lam), s=26, facecolors='none', edgecolors=TEAL, linewidths=1.0, zorder=4)
    ax.axhline(0, c='k', lw=0.4); ax.axvline(0, c='k', lw=0.4)
    ax.set_xlabel('least-squares coefficient $a$'); ax.set_ylabel('regularised coefficient')
    ax.set_title('Shrinkage, $\\lambda = 1$, $X^{\\mathsf{T}}X = I$')
    ax.legend(frameon=False, loc='upper left', fontsize=7.2)
    ax.set_xlim(-3.4, 3.4); ax.set_ylim(-3.4, 3.4)
    # (b) geometry
    ax = axes[1]
    w0 = np.array([2.0, 1.1]); A = np.array([[1.0, 0.45], [0.45, 0.7]])
    q = lambda W: np.einsum('...i,ij,...j->...', W - w0, A, W - w0)
    g1, g2 = np.meshgrid(np.linspace(-1.6, 3.2, 300), np.linspace(-1.6, 2.6, 300))
    G = np.stack([g1, g2], -1)
    # constrained minima on a fine parameterisation of the boundaries
    th = np.linspace(0, 2 * np.pi, 200001)
    circ = np.c_[np.cos(th), np.sin(th)]
    wr = circ[np.argmin(q(circ))]
    s = np.linspace(-1, 1, 200001)
    dia = np.vstack([np.c_[s, 1 - np.abs(s)], np.c_[s, -(1 - np.abs(s))]])
    wl = dia[np.argmin(q(dia))]
    levels = sorted({float(q(wr)), float(q(wl)), 0.15, 0.6, 3.0})
    ax.contour(g1, g2, q(G), levels=levels, colors=INDIGO, linewidths=0.7)
    ax.plot(*circ[::500].T, c=TEAL, lw=1.2)
    ax.fill(*circ[::500].T, color=TEAL, alpha=0.10)
    dpts = np.array([[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]])
    ax.plot(*dpts.T, c=AMBER, lw=1.2); ax.fill(*dpts.T, color=AMBER, alpha=0.12)
    ax.plot(*w0, 'k*', ms=8); ax.annotate('least squares', w0, xytext=(1.25, 2.25), fontsize=7.5)
    ax.plot(*wr, 'o', c=TEAL, ms=5); ax.plot(*wl, 'o', c=AMBER, ms=5)
    ax.annotate('ridge', wr, xytext=(-1.2, 1.2), fontsize=7.5, color=TEAL,
                arrowprops=dict(arrowstyle='-', lw=0.5, color=TEAL))
    ax.annotate('lasso', wl, xytext=(0.15, -1.35), fontsize=7.5, color=AMBER,
                arrowprops=dict(arrowstyle='-', lw=0.5, color=AMBER))
    ax.axhline(0, c='k', lw=0.4); ax.axvline(0, c='k', lw=0.4)
    ax.set_aspect('equal'); ax.set_xlim(-1.6, 3.2); ax.set_ylim(-1.6, 2.6)
    ax.set_xlabel('$w_1$'); ax.set_ylabel('$w_2$', labelpad=1); ax.set_title('Constraint regions $\\|w\\|_2 \\leq 1$, $\\|w\\|_1 \\leq 1$')
    save(fig, 'n8_shrinkage')
    print('   ridge point', wr.round(3), 'lasso point', wl.round(3))


if __name__ == '__main__':
    fig_line_fit()
    fig_shrinkage()
