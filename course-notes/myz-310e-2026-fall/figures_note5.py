"""
Additional figures for lecture note 5 (neighbourhood methods). Run from this folder:

    python3 figures_note5.py        # writes figures/n5_*.pdf
"""
from figures import *  # noqa: F401,F403  (colours, save, moons, plt, np)
from matplotlib.patches import Circle, Rectangle


# The toy dataset used in every worked example of the note.
TOY_X = np.array([[2, 3], [1, 1], [3, 1], [0, 3], [4, 3], [3, 5], [0, 0], [5, 1]], float)
TOY_C = np.array([0, 1, 1, 0, 0, 0, 1, 1])          # 0 = class A, 1 = class B
TOY_Y = np.array([5, 2, 3, 4, 6, 7, 1, 4], float)   # regression targets
TOY_Q = np.array([2.0, 2.0])
# label offsets (points) chosen so that labels do not sit on the neighbourhood circles
TOY_LABEL_OFFSETS = {0: (-8, 7), 1: (-33, -4), 2: (5, -10), 6: (5, -11)}


def fig_toy():
    fig, ax = plt.subplots(figsize=(2.7, 2.55))
    for k, r2, ls in ((1, 1, '-'), (3, 2, '--'), (5, 5, ':')):
        ax.add_patch(Circle(TOY_Q, np.sqrt(r2), fill=False, ec=GREY, lw=0.8, ls=ls))
    for i, (p, c, yv) in enumerate(zip(TOY_X, TOY_C, TOY_Y)):
        ax.scatter(*p, s=34, c=INDIGO if c == 0 else AMBER, marker='o' if c == 0 else 's', zorder=3)
        off = TOY_LABEL_OFFSETS.get(i, (4, 4))
        ax.annotate(f'$\\mathbf{{x}}_{i + 1}$  ({yv:g})', p, xytext=off, textcoords='offset points', fontsize=7,
                    bbox=dict(fc='white', ec='none', pad=0.4), zorder=5)
    ax.scatter(*TOY_Q, s=70, marker='*', c=CORAL, zorder=4)
    ax.annotate('query', TOY_Q, xytext=(-14, -14), textcoords='offset points', fontsize=7, color=CORAL,
                bbox=dict(fc='white', ec='none', pad=0.4), zorder=5)
    ax.set_xlim(-0.7, 6.0); ax.set_ylim(-0.7, 5.8); ax.set_aspect('equal')
    ax.set_xticks(range(0, 6)); ax.set_yticks(range(0, 6)); ax.grid(lw=0.3, color='#DDDDDD')
    ax.set_xlabel('$x_1$'); ax.set_ylabel('$x_2$')
    save(fig, 'n5_toy')


def fig_regression():
    rng = np.random.default_rng(51)
    n = 40
    x = np.sort(rng.uniform(0, 1, n))
    truth = lambda t: np.sin(2 * np.pi * t) + 0.5 * t
    y = truth(x) + 0.3 * rng.standard_normal(n)
    g = np.linspace(0, 1, 1200)
    D = np.abs(g[:, None] - x[None])
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 1.95), sharey=True)
    for ax, (kind, par) in zip(axes, (('knn', 1), ('knn', 7), ('nw', 0.05))):
        if kind == 'knn':
            idx = np.argsort(D, axis=1, kind='stable')[:, :par]
            f = y[idx].mean(1); title = f'$k$-NN, $k={par}$'
        else:
            logw = -D ** 2 / (2 * par ** 2)
            W = np.exp(logw - logw.max(1, keepdims=True))
            f = W @ y / W.sum(1); title = f'Nadaraya–Watson, $\\sigma={par}$'
        ax.plot(g, truth(g), c=GREY, lw=1, ls='--')
        ax.plot(g, f, c=INDIGO, lw=1.1)
        ax.scatter(x, y, s=7, c=AMBER, lw=0, zorder=3)
        ax.set_title(title); ax.set_xticks([0, 0.5, 1]); ax.set_xlabel('$x$')
    axes[0].set_ylabel('$y$')
    save(fig, 'n5_regression')


def mixture_pdf(g, h=0.0):
    """True density of the KDE figure of the note (two Gaussians on a uniform background), convolved with N(0, h^2)."""
    out = 0.0
    for w, m, s in ((0.45, -1.5, 0.35), (0.40, 1.0, 0.7)):
        v = s * s + h * h
        out = out + w * np.exp(-(g - m) ** 2 / (2 * v)) / np.sqrt(2 * np.pi * v)
    if h == 0:
        uni = (np.abs(g) <= 3) / 6
    else:  # uniform on [-3, 3] convolved with a Gaussian: difference of normal CDFs
        from math import erf
        Phi = np.vectorize(lambda t: 0.5 * (1 + erf(t / np.sqrt(2))))
        uni = (Phi((g + 3) / h) - Phi((g - 3) / h)) / 6
    return out + 0.15 * uni


def sample_mixture(n, rng):
    comp = rng.uniform(size=n)
    return np.where(comp < 0.45, rng.normal(-1.5, 0.35, n),
                    np.where(comp < 0.85, rng.normal(1.0, 0.7, n), rng.uniform(-3, 3, n)))


def loo_loglik(x, h):
    D = x[:, None] - x[None]
    logK = -D ** 2 / (2 * h * h) - np.log(np.sqrt(2 * np.pi) * h)
    np.fill_diagonal(logK, -np.inf)
    a = logK.max(1, keepdims=True)
    return float((a[:, 0] + np.log(np.exp(logK - a).sum(1)) - np.log(len(x) - 1)).mean())


def full_loglik(x, h):
    D = x[:, None] - x[None]
    logK = -D ** 2 / (2 * h * h) - np.log(np.sqrt(2 * np.pi) * h)
    a = logK.max(1, keepdims=True)
    return float((a[:, 0] + np.log(np.exp(logK - a).sum(1)) - np.log(len(x))).mean())


def fig_kde_bias_loo():
    g = np.linspace(-3.4, 3.4, 700)
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 2.2))
    ax = axes[0]
    ax.plot(g, mixture_pdf(g), c=GREY, ls='--', lw=1, label='true $p$')
    for h, c in ((0.25, INDIGO), (0.6, AMBER)):
        ax.plot(g, mixture_pdf(g, h), c=c, lw=1.1, label=f'$\\mathbb{{E}}[\\hat p]$, $h={h}$')
    ax.set_title('Bias: the average estimate is $p * K_h$'); ax.set_yticks([0, 0.2, 0.4])
    ax.legend(frameon=False, loc='upper right', fontsize=7)
    ax.set_xlabel('$x$')
    ax = axes[1]
    rng = np.random.default_rng(52)
    x = sample_mixture(100, rng)
    hs = np.geomspace(0.03, 2.0, 160)
    loo = np.array([loo_loglik(x, h) for h in hs]); full = np.array([full_loglik(x, h) for h in hs])
    ax.plot(hs, full, c=GREY, lw=1.1, label='self included')
    ax.plot(hs, loo, c=INDIGO, lw=1.2, label='leave-one-out')
    hb = hs[loo.argmax()]
    ax.axvline(hb, c=INDIGO, lw=0.6, ls=':')
    hs_rule = 1.06 * x.std(ddof=1) * len(x) ** -0.2
    ax.axvline(hs_rule, c=AMBER, lw=0.8, ls='--')
    ax.text(hs_rule * 1.06, -2.65, 'rule of\nthumb', color=AMBER, fontsize=7, va='bottom')
    ax.set_xscale('log'); ax.set_ylim(-2.7, 0.6)
    ax.set_xlabel('bandwidth $h$'); ax.set_ylabel('mean log-likelihood')
    ax.set_title(f'Choosing $h$ ($n={len(x)}$)')
    ax.legend(frameon=False, loc='upper left', fontsize=7)
    print('n5_kde_bias_loo: LOO best h = %.3f, rule of thumb h = %.3f, sample std = %.3f' % (hb, hs_rule, x.std(ddof=1)))
    print('  peak heights true / h=0.25 / h=0.6:', [round(float(mixture_pdf(np.array([-1.5]), h)[0]), 3) for h in (0, 0.25, 0.6)])
    print('  LOO at best:', round(loo.max(), 3), ' LOO at rule:', round(loo_loglik(x, hs_rule), 3))
    save(fig, 'n5_kde_bias_loo')


def kd_build(P, idx, depth, box, segs, leaves, b=2):
    """Rank split as in Algorithm 3 of the note: the lower half goes left, the split line lies midway between halves."""
    if len(idx) <= b:
        leaves.append((box, list(idx)))
        return
    axis = depth % 2
    order = idx[np.argsort(P[idx, axis], kind='stable')]
    mid = len(order) // 2
    split = 0.5 * (P[order[mid - 1], axis] + P[order[mid], axis])
    if axis == 0:
        segs.append(((split, split), (box[2], box[3]), depth))
        kd_build(P, order[:mid], depth + 1, (box[0], split, box[2], box[3]), segs, leaves, b)
        kd_build(P, order[mid:], depth + 1, (split, box[1], box[2], box[3]), segs, leaves, b)
    else:
        segs.append(((box[0], box[1]), (split, split), depth))
        kd_build(P, order[:mid], depth + 1, (box[0], box[1], box[2], split), segs, leaves, b)
        kd_build(P, order[mid:], depth + 1, (box[0], box[1], split, box[3]), segs, leaves, b)


def _box_dist(q, box):
    dx = max(box[0] - q[0], 0, q[0] - box[1]); dy = max(box[2] - q[1], 0, q[1] - box[3])
    return float(np.hypot(dx, dy))


def fig_kdtree():
    rng = np.random.default_rng(53)
    P = rng.uniform(0, 1, (24, 2))
    segs, leaves = [], []
    kd_build(P, np.arange(len(P)), 0, (0, 1, 0, 1), segs, leaves)
    q = np.array([0.24, 0.87])
    own = [i for i, (bx, _) in enumerate(leaves) if _box_dist(q, bx) == 0][0]
    cand = min(leaves[own][1], key=lambda j: np.hypot(*(P[j] - q)))
    rho = float(np.hypot(*(P[cand] - q)))          # best distance after searching the query's own leaf
    hit = [i for i, (bx, _) in enumerate(leaves) if _box_dist(q, bx) < rho]
    nn = int(np.sqrt(((P - q) ** 2).sum(1)).argmin())
    fig, ax = plt.subplots(figsize=(2.5, 2.5))
    for i in hit:
        bx = leaves[i][0]
        ax.add_patch(Rectangle((bx[0], bx[2]), bx[1] - bx[0], bx[3] - bx[2], fc=INDIGO, alpha=0.13, ec='none'))
    ax.add_patch(Rectangle((0, 0), 1, 1, fill=False, ec='k', lw=0.6))
    for (xs, ys, dep) in segs:
        ax.plot(xs, ys, c=INDIGO if dep == 0 else (AMBER if dep == 1 else GREY), lw=max(1.6 - 0.35 * dep, 0.5))
    ax.scatter(*P.T, s=10, c='k', zorder=3)
    ax.scatter(*P[nn], s=26, facecolors='none', edgecolors=CORAL, lw=0.9, zorder=4)
    ax.scatter(*q, s=60, marker='*', c=CORAL, zorder=4)
    ax.add_patch(Circle(q, rho, fill=False, ec=CORAL, lw=0.8, ls='--'))
    ax.set_xlim(-0.02, 1.02); ax.set_ylim(-0.02, 1.02); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values():
        s.set_visible(False)
    print('n5_kdtree: %d leaves, cells searched %s, own-leaf candidate %.3f, true NN %.3f, NN in other cell: %s'
          % (len(leaves), hit, rho, float(np.hypot(*(P[nn] - q))), nn not in leaves[own][1]))
    save(fig, 'n5_kdtree')


def fig_kde_bumps():
    """The KDE worked example of the note: data 0, 1, 3, 4, each scaled bump K_h(x - x_i)/n and their sum."""
    data = np.array([0.0, 1.0, 3.0, 4.0])
    g = np.linspace(-2.5, 6.5, 901)
    fig, axes = plt.subplots(1, 2, figsize=(6.0, 1.75), sharey=True)
    for ax, h in zip(axes, (0.5, 2.0)):
        bumps = np.exp(-(g[None] - data[:, None]) ** 2 / (2 * h * h)) / (np.sqrt(2 * np.pi) * h) / len(data)
        for b in bumps:
            ax.plot(g, b, c=GREY, lw=0.7)
        ax.plot(g, bumps.sum(0), c=INDIGO, lw=1.4)
        ax.plot(data, np.zeros_like(data), '|', c=AMBER, ms=8, mew=1.2)
        for x0 in (1.0, 2.0):
            v = float((np.exp(-(x0 - data) ** 2 / (2 * h * h)) / (np.sqrt(2 * np.pi) * h)).mean())
            ax.plot([x0], [v], 'o', ms=3.5, c=CORAL, zorder=4)
        top = g[np.r_[False, (bumps.sum(0)[1:-1] > bumps.sum(0)[:-2]) & (bumps.sum(0)[1:-1] > bumps.sum(0)[2:]), False]]
        print('n5_kde_bumps: h = %g, local maxima at' % h, np.round(top, 2),
              'values', np.round([float(bumps.sum(0)[np.argmin(abs(g - t))]) for t in top], 3))
        ax.set_title(f'$h = {h:g}$'); ax.set_xlabel('$x$'); ax.set_xticks(range(-2, 7))
    axes[0].set_ylabel(r'$\hat p(x)$'); axes[0].set_ylim(0, 0.26)
    save(fig, 'n5_kde_bumps')


if __name__ == '__main__':
    import sys
    figs = {f.__name__: f for f in (fig_toy, fig_regression, fig_kde_bias_loo, fig_kdtree, fig_kde_bumps)}
    for name in (sys.argv[1:] or figs):
        figs[name]()
