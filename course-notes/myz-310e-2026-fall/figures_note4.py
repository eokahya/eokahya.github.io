"""
Extra figures for lecture note 4 (risk, generalisation and model selection). Run from this folder:

    python3 figures_note4.py      # writes figures/n4_*.pdf

Uses the colours and helpers of figures.py; every figure is computed from fixed seeds or exact formulas.
"""
from figures import *  # noqa: F401,F403  (colours, save, numpy, matplotlib)
from matplotlib.patches import Patch, Rectangle

P = np.polynomial.polynomial


def fig_surrogates():
    """Classification losses as functions of the margin z = t g(x), t in {-1, +1}."""
    z = np.linspace(-2, 2.5, 500)
    fig, ax = plt.subplots(figsize=(3.4, 2.2))
    ax.plot(z, (z <= 0).astype(float), c=GREY, lw=1.6, label='0–1 error', drawstyle='steps-mid')
    ax.plot(z, np.maximum(0, 1 - z), c=INDIGO, label='hinge')
    ax.plot(z, np.log2(1 + np.exp(-z)), c=AMBER, label='cross-entropy (bits)')
    ax.plot(z, (1 - z) ** 2, c=TEAL, ls='--', label='squared')
    ax.set_ylim(-0.1, 3.2); ax.set_xlim(-2, 2.5)
    ax.axvline(0, c=GREY, lw=0.5, ls=':')
    ax.set_xlabel('margin $z = t\\,g(\\mathbf{x})$  (wrong $\\leftarrow$ | $\\rightarrow$ right)')
    ax.set_ylabel('loss')
    ax.legend(frameon=False, loc='upper right')
    save(fig, 'n4_surrogates')


def bias_variance_exact(x, sigma2, degs, g):
    """Exact squared bias and variance (averaged over the grid g) of least-squares polynomials on fixed inputs x."""
    fs = np.sin(np.pi * g)
    out = []
    for deg in degs:
        V = np.vander(x, deg + 1, increasing=True)
        Vg = np.vander(g, deg + 1, increasing=True)
        H = Vg @ np.linalg.pinv(V)               # prediction on g = H @ targets
        mean = H @ np.sin(np.pi * x)             # average fit: fit to the noiseless targets
        out.append((np.mean((mean - fs) ** 2), sigma2 * np.mean((H ** 2).sum(1))))
    return np.array(out)


def fig_bias_variance():
    n, sigma = 15, 0.3
    x = np.linspace(-1, 1, n)
    g = np.linspace(-1, 1, 401)
    rng = np.random.default_rng(41)
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 2.0), gridspec_kw=dict(width_ratios=[1, 1, 1.25]))
    for ax, deg, title in ((axes[0], 1, 'degree 1: high bias'), (axes[1], 12, 'degree 12: high variance')):
        for _ in range(20):
            t = np.sin(np.pi * x) + sigma * rng.standard_normal(n)
            ax.plot(g, P.polyval(g, P.polyfit(x, t, deg)), c=AMBER, lw=0.6, alpha=0.55)
        ax.plot(g, np.sin(np.pi * g), c=INDIGO, lw=1.3, ls='--')
        ax.set_ylim(-2, 2); ax.set_xticks([]); ax.set_title(title)
    degs = np.arange(0, 13)
    bv = bias_variance_exact(x, sigma ** 2, degs, g)
    ax = axes[2]
    ax.plot(degs, bv[:, 0], 'o-', c=INDIGO, ms=2.5, label='bias$^2$')
    ax.plot(degs, bv[:, 1], 's-', c=AMBER, ms=2.5, label='variance')
    ax.plot(degs, bv.sum(1) + sigma ** 2, '-', c=TEAL, lw=1.6, label='expected error')
    ax.axhline(sigma ** 2, c=GREY, lw=0.6, ls='--', label='noise $\\sigma^2$')
    ax.set_xlabel('polynomial degree'); ax.set_ylim(0, 0.65)
    ax.legend(frameon=False, fontsize=7, loc='upper center')
    save(fig, 'n4_biasvar')
    for d, (b2, v) in zip(degs, bv):
        print(f'  degree {d:2d}: bias2 {b2:.4f}  variance {v:.4f}  total {b2 + v + sigma**2:.4f}')


def fig_splits():
    """Five-fold cross-validation and sequential (rolling-origin) validation with a test block per step."""
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 1.9))
    ax = axes[0]
    k = 5
    for r in range(k):
        for j in range(k):
            c = AMBER if j == r else INDIGO
            ax.add_patch(Rectangle((j, k - 1 - r + 0.12), 0.94, 0.76, color=c, alpha=0.85 if j == r else 0.35, lw=0))
        ax.text(-0.15, k - 1 - r + 0.5, f'round {r + 1}', ha='right', va='center', fontsize=7.5)
    ax.set_xlim(-1.4, k); ax.set_ylim(-0.1, k); ax.axis('off')
    ax.set_title('5-fold cross-validation')
    ax = axes[1]
    blocks = 8
    for r in range(4):
        y0 = 3 - r + 0.12
        for j in range(blocks):
            if j < 3 + r:
                c, a = INDIGO, 0.35
            elif j == 3 + r:
                c, a = AMBER, 0.85
            elif j == 4 + r:
                c, a = TEAL, 0.85
            else:
                c, a = GREY, 0.12
            ax.add_patch(Rectangle((j, y0), 0.94, 0.76, color=c, alpha=a, lw=0))
        ax.text(-0.15, y0 + 0.38, f'step {r + 1}', ha='right', va='center', fontsize=7.5)
    ax.annotate('', xy=(blocks, -0.05), xytext=(0, -0.05), arrowprops=dict(arrowstyle='->', color=GREY, lw=0.8))
    ax.text(blocks / 2, -0.15, 'time', ha='center', va='top', fontsize=7.5, color=GREY)
    ax.set_xlim(-1.4, blocks); ax.set_ylim(-0.6, 4); ax.axis('off')
    ax.set_title('sequential validation')
    handles = [Patch(color=INDIGO, alpha=0.35, label='train'), Patch(color=AMBER, alpha=0.85, label='validate'),
               Patch(color=TEAL, alpha=0.85, label='test (after retraining on train + validate)'),
               Patch(color=GREY, alpha=0.12, label='not used yet')]
    fig.legend(handles=handles, loc='lower center', ncol=4, frameon=False, fontsize=7.5,
               bbox_to_anchor=(0.5, -0.1))
    save(fig, 'n4_splits')


def fig_search():
    """Nine trials of grid search and of random search when only one of two hyperparameters matters."""
    def score(h1):  # validation error as a function of the important hyperparameter only
        return 0.25 - 0.16 * np.exp(-((h1 - 0.62) / 0.09) ** 2)
    rng = np.random.default_rng(5)
    grid = np.array([(a, b) for a in (1 / 6, 1 / 2, 5 / 6) for b in (1 / 6, 1 / 2, 5 / 6)])
    rand = rng.uniform(0, 1, (9, 2))
    h = np.linspace(0, 1, 300)
    fig, axes = plt.subplots(2, 2, figsize=(6.0, 2.9), sharex=True, gridspec_kw=dict(height_ratios=[1.6, 1], hspace=0.12))
    for col, (pts, title) in enumerate(((grid, 'grid search (3 $\\times$ 3)'), (rand, 'random search (9 trials)'))):
        top, bot = axes[0, col], axes[1, col]
        top.scatter(pts[:, 0], pts[:, 1], s=14, c=INDIGO, zorder=3)
        top.set_ylim(-0.06, 1.06); top.set_yticks([]); top.set_title(title)
        bot.plot(h, score(h), c=AMBER, lw=1.2)
        bot.scatter(pts[:, 0], score(pts[:, 0]), s=12, c=AMBER, zorder=3)
        for p in pts:
            bot.axvline(p[0], c=GREY, lw=0.4, ls=':')
            top.axvline(p[0], c=GREY, lw=0.4, ls=':')
        bot.set_xlim(0, 1); bot.set_ylim(0.06, 0.28); bot.set_yticks([0.1, 0.2])
        bot.set_xticks([0, 1]); bot.set_xticklabels(['low', 'high'])
        bot.set_xlabel('important hyperparameter')
        best = pts[np.argmin(score(pts[:, 0])), 0]
        print(f'  {title}: distinct values {len(np.unique(np.round(pts[:, 0], 6)))}, best error {score(best):.3f}')
    axes[0, 0].set_ylabel('unimportant\nhyperparameter', fontsize=7.5)
    axes[1, 0].set_ylabel('validation\nerror', fontsize=7.5)
    axes[1, 1].set_yticklabels([])
    save(fig, 'n4_search')


if __name__ == '__main__':
    for f in (fig_surrogates, fig_bias_variance, fig_splits, fig_search):
        f()
