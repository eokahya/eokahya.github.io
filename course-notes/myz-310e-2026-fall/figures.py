"""
Figures for the MYZ 310E lecture notes (weeks 1-3). Every figure is computed here from synthetic data
with fixed seeds, so the notes can be rebuilt bit-for-bit. Requires numpy and matplotlib.

    python3 figures.py            # writes figures/*.pdf
"""
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import ListedColormap
from matplotlib.patches import Ellipse

OUT = Path(__file__).resolve().parent / 'figures'
OUT.mkdir(exist_ok=True)

INDIGO, AMBER, TEAL, GREY, CORAL = '#2E3A8C', '#C77D0A', '#1A7F74', '#8A8FA3', '#B5452B'
plt.rcParams.update({
    'font.family': 'serif', 'font.serif': ['STIXGeneral', 'DejaVu Serif'], 'mathtext.fontset': 'stix',
    'font.size': 9, 'axes.titlesize': 9.5, 'axes.labelsize': 9, 'legend.fontsize': 8, 'xtick.labelsize': 8, 'ytick.labelsize': 8,
    'axes.spines.top': False, 'axes.spines.right': False, 'axes.linewidth': 0.6, 'lines.linewidth': 1.4,
    'savefig.bbox': 'tight', 'savefig.pad_inches': 0.02, 'pdf.fonttype': 42,
})
REGION = ListedColormap(['#E3E6F5', '#F7E7CC'])  # light indigo / light amber


def save(fig, name):
    fig.savefig(OUT / f'{name}.pdf')
    plt.close(fig)
    print('wrote', name)


def two_class_data(n, rng, sep=1.0):
    """Signal (y=1) and background (y=0) events described by two observables."""
    n1 = n // 2
    background = rng.multivariate_normal([0.0, 0.0], [[1.0, 0.35], [0.35, 0.8]], n - n1)
    signal = rng.multivariate_normal([sep * 1.6, sep * 1.1], [[0.6, -0.2], [-0.2, 0.9]], n1)
    X = np.vstack([background, signal])
    y = np.r_[np.zeros(n - n1, int), np.ones(n1, int)]
    return X, y


# ---------------------------------------------------------------- note 1: one dataset, three tasks
def fig_tasks():
    rng = np.random.default_rng(1)
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 2.1))
    X, y = two_class_data(240, rng)
    ax = axes[0]
    ax.scatter(*X[y == 0].T, s=7, c=INDIGO, alpha=0.7, label='background')
    ax.scatter(*X[y == 1].T, s=7, c=AMBER, alpha=0.8, label='signal')
    ax.set_title('Classification: $y\\in\\{0,1\\}$')
    ax = axes[1]
    x = rng.uniform(0, 1, 80)
    t = 1.2 * np.sin(2 * np.pi * x) * np.exp(-0.6 * x) + 0.25 * rng.standard_normal(80)
    grid = np.linspace(0, 1, 200)
    ax.scatter(x, t, s=7, c=INDIGO, alpha=0.75)
    ax.plot(grid, 1.2 * np.sin(2 * np.pi * grid) * np.exp(-0.6 * grid), c=AMBER, label='$\\mathbb{E}[Y\\mid X=x]$')
    ax.set_title('Regression: $y\\in\\mathbb{R}$')
    ax.legend(frameon=False, loc='lower left')
    ax = axes[2]
    Xd = np.vstack([rng.normal([-1, 0], 0.5, (150, 2)), rng.normal([1.2, 0.8], [0.4, 0.7], (100, 2))])
    gx, gy = np.meshgrid(np.linspace(-2.6, 2.8, 120), np.linspace(-2, 3, 120))
    pts = np.c_[gx.ravel(), gy.ravel()]
    h = 0.35
    dens = np.exp(-((pts[:, None, :] - Xd[None]) ** 2).sum(-1) / (2 * h * h)).mean(1) / (2 * np.pi * h * h)
    ax.contour(gx, gy, dens.reshape(gx.shape), levels=6, colors=AMBER, linewidths=0.8)
    ax.scatter(*Xd.T, s=5, c=INDIGO, alpha=0.55)
    ax.set_title('Density estimation: no $y$')
    for ax in axes:
        ax.set_xticks([]); ax.set_yticks([])
    save(fig, 'tasks')


# ---------------------------------------------------------------- note 2: Gaussians
def fig_gaussian_1d():
    fig, ax = plt.subplots(figsize=(3.2, 1.9))
    x = np.linspace(-5, 6, 600)
    for (mu, s, c) in [(0, 1, INDIGO), (0, 2, TEAL), (2.5, 0.6, AMBER)]:
        ax.plot(x, np.exp(-(x - mu) ** 2 / (2 * s * s)) / np.sqrt(2 * np.pi * s * s), c=c, label=f'$\\mu={mu},\\ \\sigma={s}$')
    ax.set_xlabel('$x$'); ax.set_ylabel('$p(x)$')
    ax.legend(frameon=False)
    save(fig, 'gaussian_1d')


def fig_gaussian_2d():
    rng = np.random.default_rng(2)
    covs = [('Isotropic: $\\Sigma=\\sigma^2 I$', np.eye(2) * 0.8),
            ('Diagonal', np.diag([1.6, 0.35])),
            ('Full covariance', np.array([[1.2, 0.85], [0.85, 1.0]]))]
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 2.25))
    for ax, (title, S) in zip(axes, covs):
        pts = rng.multivariate_normal([0, 0], S, 300)
        ax.scatter(*pts.T, s=4, c=GREY, alpha=0.5)
        vals, vecs = np.linalg.eigh(S)
        for k in (1, 2):
            ang = np.degrees(np.arctan2(vecs[1, 1], vecs[0, 1]))
            ax.add_patch(Ellipse((0, 0), 2 * k * np.sqrt(vals[1]), 2 * k * np.sqrt(vals[0]), angle=ang, fill=False, ec=INDIGO, lw=1.1))
        for i, c in zip(range(2), (AMBER, TEAL)):
            v = vecs[:, i] * np.sqrt(vals[i]) * 2
            ax.annotate('', xy=v, xytext=(0, 0), arrowprops=dict(arrowstyle='->', color=c, lw=1.4))
        ax.set_title(title)
        ax.set_xlim(-3.6, 3.6); ax.set_ylim(-3.2, 3.2); ax.set_aspect('equal')
        ax.set_xticks([]); ax.set_yticks([])
    save(fig, 'gaussian_2d')


def fig_diffusion():
    """Forward process of a diffusion model on a 1-D data distribution: q(x_t|x_0)=N(sqrt(a)x_0,(1-a)I)."""
    rng = np.random.default_rng(3)
    x0 = np.r_[rng.normal(-2.0, 0.25, 6000), rng.normal(1.5, 0.45, 4000)]
    T = 1000
    betas = np.linspace(1e-4, 0.02, T)
    abar = np.cumprod(1 - betas)
    fig, axes = plt.subplots(1, 4, figsize=(6.6, 1.55), sharey=True)
    for ax, t in zip(axes, (0, 100, 300, 1000)):
        a = abar[t - 1] if t else 1.0
        xt = np.sqrt(a) * x0 + np.sqrt(1 - a) * rng.standard_normal(x0.size)
        ax.hist(xt, bins=80, range=(-4, 4), density=True, color=INDIGO, alpha=0.75)
        if t == 1000:
            g = np.linspace(-4, 4, 300)
            ax.plot(g, np.exp(-g * g / 2) / np.sqrt(2 * np.pi), c=AMBER, lw=1.2)
        ax.set_title(f'$t={t}$,  $\\bar\\alpha_t={a:.2f}$' if t else '$t=0$ (data)')
        ax.set_yticks([])
        ax.set_xticks([-3, 0, 3])
    save(fig, 'diffusion_forward')


# ---------------------------------------------------------------- note 3: histograms and the curse
def hist_classifier(Xtr, ytr, edges_list, Xq):
    """Majority vote per cell; empty cells fall back to the overall majority class."""
    def cell(X):
        idx = [np.clip(np.digitize(X[:, j], e[1:-1]), 0, len(e) - 2) for j, e in enumerate(edges_list)]
        return np.ravel_multi_index(idx, [len(e) - 1 for e in edges_list])
    ncell = int(np.prod([len(e) - 1 for e in edges_list]))
    counts = np.zeros((ncell, 2))
    np.add.at(counts, (cell(Xtr), ytr), 1)
    default = np.bincount(ytr).argmax()
    pred_cell = np.where(counts.sum(1) > 0, counts.argmax(1), default)
    return pred_cell[cell(Xq)]


def fig_hist_classifier():
    rng = np.random.default_rng(4)
    Xtr, ytr = two_class_data(400, rng)
    Xte, yte = two_class_data(4000, rng)
    lo, hi = Xtr.min(0) - 0.3, Xtr.max(0) + 0.3
    gx, gy = np.meshgrid(np.linspace(lo[0], hi[0], 300), np.linspace(lo[1], hi[1], 300))
    G = np.c_[gx.ravel(), gy.ravel()]
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 2.3))
    setups = [('Feature $x_1$ only, 8 bins', [np.linspace(lo[0], hi[0], 9)], [0]),
              ('Both features, $8\\times 8$ cells', [np.linspace(lo[0], hi[0], 9), np.linspace(lo[1], hi[1], 9)], [0, 1]),
              ('Both features, $40\\times 40$ cells', [np.linspace(lo[0], hi[0], 41), np.linspace(lo[1], hi[1], 41)], [0, 1])]
    for ax, (title, edges, cols) in zip(axes, setups):
        pg = hist_classifier(Xtr[:, cols], ytr, edges, G[:, cols])
        ax.contourf(gx, gy, pg.reshape(gx.shape), levels=[-0.5, 0.5, 1.5], cmap=REGION)
        ax.scatter(*Xtr[ytr == 0].T, s=4, c=INDIGO, alpha=0.6)
        ax.scatter(*Xtr[ytr == 1].T, s=4, c=AMBER, alpha=0.7)
        tr = (hist_classifier(Xtr[:, cols], ytr, edges, Xtr[:, cols]) != ytr).mean()
        te = (hist_classifier(Xtr[:, cols], ytr, edges, Xte[:, cols]) != yte).mean()
        ax.set_title(title)
        ax.text(0.02, 0.02, f'train error {tr:.1%}\ntest error {te:.1%}', transform=ax.transAxes, fontsize=7.5,
                va='bottom', bbox=dict(boxstyle='round,pad=0.25', fc='white', ec='none', alpha=0.85))
        ax.set_xticks([]); ax.set_yticks([])
        ax.set_xlabel('$x_1$'); ax.set_ylabel('$x_2$')
    save(fig, 'hist_classifier')


def fig_hist_density():
    rng = np.random.default_rng(5)
    x = np.r_[rng.normal(-1.2, 0.45, 120), rng.normal(1.0, 0.8, 80)]
    g = np.linspace(-3.5, 3.8, 400)
    true = 0.6 * np.exp(-(g + 1.2) ** 2 / (2 * 0.45 ** 2)) / np.sqrt(2 * np.pi * 0.45 ** 2) + 0.4 * np.exp(-(g - 1.0) ** 2 / (2 * 0.8 ** 2)) / np.sqrt(2 * np.pi * 0.8 ** 2)
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 1.75), sharey=True)
    for ax, m in zip(axes, (3, 15, 80)):
        ax.hist(x, bins=np.linspace(-3.5, 3.8, m + 1), density=True, color=INDIGO, alpha=0.7)
        ax.plot(g, true, c=AMBER, lw=1.2)
        ax.set_title(f'{m} bins')
        ax.set_yticks([])
    axes[0].set_ylabel('$\\hat p(x)$')
    save(fig, 'hist_density')


def fig_curse():
    rng = np.random.default_rng(6)
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 2.2))
    ax = axes[0]
    d = np.arange(1, 13)
    n, m = 100_000, 10
    empty = np.exp(n * np.log1p(-1.0 / m ** d.astype(float)))  # expected fraction of empty cells, (1-m^-d)^n
    occupied_cells = (1 - empty) * m ** d.astype(float)
    ax.semilogy(d, n / occupied_cells, 'o-', c=INDIGO, ms=3, label='points per occupied cell')
    ax.semilogy(d, n / m ** d.astype(float), 's--', c=AMBER, ms=3, label='points per cell, $n/m^d$')
    ax.axhline(1, c=GREY, lw=0.6)
    ax.set_xlabel('dimension $d$  ($m=10$ bins per axis, $n=10^5$)')
    ax.legend(frameon=False)
    ax.set_title('Histograms run out of data')
    ax = axes[1]
    dims = [1, 2, 5, 10, 50, 100, 500, 1000]
    ratios = []
    for dd in dims:
        r = []
        for _ in range(20):
            P = rng.uniform(size=(1000, dd)); q = rng.uniform(size=dd)
            dist = np.sqrt(((P - q) ** 2).sum(1))
            r.append((dist.max() - dist.min()) / dist.min())
        ratios.append(np.median(r))
    ax.loglog(dims, ratios, 'o-', c=INDIGO, ms=3)
    ax.set_xlabel('dimension $d$  (1000 uniform points)')
    ax.set_ylabel('$(d_{\\max}-d_{\\min})/d_{\\min}$')
    ax.set_title('Distances concentrate')
    save(fig, 'curse')


# ---------------------------------------------------------------- note 4: risk and model selection
def poly_data(n, rng):
    x = rng.uniform(-1, 1, n)
    return x, np.sin(np.pi * x) + 0.3 * rng.standard_normal(n)


def fig_poly_fits():
    rng = np.random.default_rng(7)
    x, t = poly_data(15, rng)
    g = np.linspace(-1, 1, 300)
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 1.9), sharey=True)
    for ax, (deg, label) in zip(axes, [(1, 'degree 1: underfitting'), (3, 'degree 3'), (12, 'degree 12: overfitting')]):
        coef = np.polynomial.polynomial.polyfit(x, t, deg)
        ax.plot(g, np.sin(np.pi * g), c=GREY, lw=1, ls='--')
        ax.plot(g, np.polynomial.polynomial.polyval(g, coef), c=AMBER)
        ax.scatter(x, t, s=10, c=INDIGO, zorder=3)
        ax.set_ylim(-2, 2); ax.set_title(label)
        ax.set_xticks([])
    save(fig, 'poly_fits')


def fig_capacity_curve():
    rng = np.random.default_rng(8)
    degs = np.arange(0, 13)
    tr_all, va_all = [], []
    for _ in range(200):
        x, t = poly_data(20, rng)
        xv, tv = poly_data(500, rng)
        tr, va = [], []
        for deg in degs:
            c = np.polynomial.polynomial.polyfit(x, t, deg)
            tr.append(np.mean((np.polynomial.polynomial.polyval(x, c) - t) ** 2))
            va.append(np.mean((np.polynomial.polynomial.polyval(xv, c) - tv) ** 2))
        tr_all.append(tr); va_all.append(va)
    tr, va = np.median(tr_all, 0), np.median(va_all, 0)
    fig, ax = plt.subplots(figsize=(3.4, 2.1))
    ax.semilogy(degs, tr, 'o-', c=INDIGO, ms=3, label='training error')
    ax.semilogy(degs, va, 's-', c=AMBER, ms=3, label='validation error')
    best = degs[np.argmin(va)]
    ax.axvline(best, c=GREY, lw=0.6, ls=':')
    ax.axhline(0.09, c=GREY, lw=0.6, ls='--')
    ax.text(12, 0.095, 'noise level', ha='right', va='bottom', fontsize=7, color=GREY)
    ax.set_xlabel('polynomial degree (capacity)'); ax.set_ylabel('mean squared error')
    ax.legend(frameon=False)
    save(fig, 'capacity_curve')


def fig_learning_curve():
    rng = np.random.default_rng(9)
    ns = np.array([12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512])
    fig, ax = plt.subplots(figsize=(3.4, 2.1))
    for deg, c in ((3, INDIGO), (9, AMBER)):
        tr_m, va_m = [], []
        for n in ns:
            tr, va = [], []
            for _ in range(100):
                x, t = poly_data(n, rng); xv, tv = poly_data(400, rng)
                cf = np.polynomial.polynomial.polyfit(x, t, deg)
                tr.append(np.mean((np.polynomial.polynomial.polyval(x, cf) - t) ** 2))
                va.append(np.mean((np.polynomial.polynomial.polyval(xv, cf) - tv) ** 2))
            tr_m.append(np.median(tr)); va_m.append(np.median(va))
        ax.semilogx(ns, va_m, '-', c=c, label=f'degree {deg}: validation')
        ax.semilogx(ns, tr_m, '--', c=c, label=f'degree {deg}: training')
    ax.axhline(0.09, c=GREY, lw=0.6, ls=':')
    ax.set_ylim(0, 0.3)
    ax.set_xlabel('training-set size $n$'); ax.set_ylabel('mean squared error')
    ax.legend(frameon=False, fontsize=7)
    save(fig, 'learning_curve')


def fig_double_descent():
    """Minimum-norm least squares on random ReLU features of 10-D inputs (n = 100 training points):
    the test error peaks where the model starts to interpolate (p = n) and falls again beyond it."""
    rng = np.random.default_rng(10)
    n, d, noise = 100, 10, 0.1
    ps = np.unique(np.round(np.geomspace(5, 6000, 40)).astype(int))
    beta = rng.standard_normal(d) / np.sqrt(d)
    errs = []
    for _ in range(20):
        X = rng.standard_normal((n, d)); t = np.tanh(2 * X @ beta) + noise * rng.standard_normal(n)
        Xt = rng.standard_normal((2000, d)); tt = np.tanh(2 * Xt @ beta)
        W = rng.standard_normal((d, ps.max())) / np.sqrt(d)
        e = []
        for p in ps:
            F = np.maximum(0, X @ W[:, :p]) / np.sqrt(p); Ft = np.maximum(0, Xt @ W[:, :p]) / np.sqrt(p)
            w = np.linalg.lstsq(F, t, rcond=None)[0]   # minimum-norm solution once p > n
            e.append(np.mean((Ft @ w - tt) ** 2))
        errs.append(e)
    med = np.median(errs, 0)
    fig, ax = plt.subplots(figsize=(3.4, 2.1))
    ax.loglog(ps, med, c=INDIGO)
    ax.axvline(n, c=AMBER, lw=0.9, ls='--')
    ax.text(n * 2.2, med.max() * 0.8, 'interpolation\nthreshold $p=n$', fontsize=7, color=AMBER, va='top')
    ax.annotate('', xy=(n * 1.05, med.max() * 0.62), xytext=(n * 2.1, med.max() * 0.62), arrowprops=dict(arrowstyle='->', color=AMBER, lw=0.8))
    ax.set_xlabel('number of random features $p$ (parameters)')
    ax.set_ylabel('test error (MSE)')
    save(fig, 'double_descent')
    print('  first minimum', ps[np.argmin(med[ps < n])], med[ps < n].min().round(4), 'peak', ps[np.argmax(med)], med.max().round(3), 'p=6000', med[-1].round(4))


# ---------------------------------------------------------------- note 5: neighbourhood methods
def knn_predict(Xtr, ytr, Xq, k):
    d2 = (Xq ** 2).sum(1)[:, None] + (Xtr ** 2).sum(1)[None] - 2 * Xq @ Xtr.T
    idx = np.argpartition(d2, kth=min(k, len(Xtr) - 1) - 1, axis=1)[:, :k]
    return (ytr[idx].mean(1) > 0.5).astype(int)


def moons(n, rng, noise=0.25):
    a = rng.uniform(0, np.pi, n)
    lab = rng.integers(0, 2, n)
    X = np.where(lab[:, None] == 0, np.c_[np.cos(a), np.sin(a)], np.c_[1 - np.cos(a), 0.5 - np.sin(a)])
    return X + noise * rng.standard_normal((n, 2)), lab


def fig_voronoi():
    rng = np.random.default_rng(11)
    X = rng.uniform(0, 1, (14, 2)); y = (X[:, 0] + 0.4 * rng.standard_normal(14) > 0.5).astype(int)
    gx, gy = np.meshgrid(np.linspace(0, 1, 500), np.linspace(0, 1, 500))
    G = np.c_[gx.ravel(), gy.ravel()]
    nearest = ((G[:, None] - X[None]) ** 2).sum(-1).argmin(1)
    fig, ax = plt.subplots(figsize=(2.5, 2.5))
    ax.contourf(gx, gy, y[nearest].reshape(gx.shape), levels=[-0.5, 0.5, 1.5], cmap=REGION)
    ax.contour(gx, gy, nearest.reshape(gx.shape), levels=np.arange(15) - 0.5, colors=GREY, linewidths=0.4)
    ax.contour(gx, gy, y[nearest].reshape(gx.shape), levels=[0.5], colors='k', linewidths=1.1)
    ax.scatter(*X[y == 0].T, s=18, c=INDIGO, zorder=3); ax.scatter(*X[y == 1].T, s=18, c=AMBER, zorder=3)
    ax.set_xticks([]); ax.set_yticks([]); ax.set_aspect('equal')
    save(fig, 'voronoi')


def fig_knn_k():
    rng = np.random.default_rng(12)
    Xtr, ytr = moons(300, rng); Xte, yte = moons(3000, rng)
    gx, gy = np.meshgrid(np.linspace(-1.6, 2.6, 520), np.linspace(-1.3, 1.8, 520))
    G = np.c_[gx.ravel(), gy.ravel()]
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 2.0))
    for ax, k in zip(axes, (1, 15, 151)):
        ax.contourf(gx, gy, knn_predict(Xtr, ytr, G, k).reshape(gx.shape), levels=[-0.5, 0.5, 1.5], cmap=REGION)
        ax.scatter(*Xtr[ytr == 0].T, s=2.5, c=INDIGO, alpha=0.8, lw=0); ax.scatter(*Xtr[ytr == 1].T, s=2.5, c=AMBER, alpha=0.9, lw=0)
        tr = (knn_predict(Xtr, ytr, Xtr, k) != ytr).mean(); te = (knn_predict(Xtr, ytr, Xte, k) != yte).mean()
        ax.set_title(f'$k={k}$')
        ax.text(0.02, 0.02, f'train {tr:.1%} · test {te:.1%}', transform=ax.transAxes, fontsize=7,
                bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='none', alpha=0.85))
        ax.set_xticks([]); ax.set_yticks([])
    save(fig, 'knn_k')


def fig_kde():
    rng = np.random.default_rng(13)
    def sample(n):
        comp = rng.uniform(size=n)
        return np.where(comp < 0.45, rng.normal(-1.5, 0.35, n), np.where(comp < 0.85, rng.normal(1.0, 0.7, n), rng.uniform(-3, 3, n)))
    g = np.linspace(-3.4, 3.4, 500)
    true = (0.45 * np.exp(-(g + 1.5) ** 2 / (2 * 0.35 ** 2)) / np.sqrt(2 * np.pi * 0.35 ** 2)
            + 0.40 * np.exp(-(g - 1.0) ** 2 / (2 * 0.7 ** 2)) / np.sqrt(2 * np.pi * 0.7 ** 2) + 0.15 * (np.abs(g) <= 3) / 6)
    fig, axes = plt.subplots(2, 3, figsize=(6.6, 2.9), sharex=True, sharey=True)
    for i, n in enumerate((20, 1000)):
        x = sample(n)
        for j, h in enumerate((0.05, 0.25, 1.0)):
            ax = axes[i, j]
            est = np.exp(-(g[:, None] - x[None]) ** 2 / (2 * h * h)).mean(1) / np.sqrt(2 * np.pi * h * h)
            ax.plot(g, true, c=GREY, lw=1, ls='--'); ax.plot(g, est, c=INDIGO, lw=1.1)
            if n == 20:
                ax.plot(x, np.zeros_like(x) - 0.03, '|', c=AMBER, ms=5)
            ax.set_ylim(-0.08, 1.0); ax.set_yticks([])
            if i == 0: ax.set_title(f'$h={h}$')
            if j == 0: ax.set_ylabel(f'$n={n}$')
    save(fig, 'kde')


def fig_parzen_classifier():
    rng = np.random.default_rng(14)
    Xtr, ytr = moons(200, rng)
    gx, gy = np.meshgrid(np.linspace(-1.6, 2.6, 400), np.linspace(-1.3, 1.8, 400))
    G = np.c_[gx.ravel(), gy.ravel()]
    fig, axes = plt.subplots(1, 2, figsize=(4.6, 2.0))
    for ax, s in zip(axes, (0.08, 0.6)):
        W = np.exp(-((G[:, None] - Xtr[None]) ** 2).sum(-1) / (2 * s * s))
        score = (W * (2 * ytr - 1)[None]).sum(1) / np.maximum(W.sum(1), 1e-300)
        ax.contourf(gx, gy, (score > 0).reshape(gx.shape), levels=[-0.5, 0.5, 1.5], cmap=REGION)
        ax.scatter(*Xtr[ytr == 0].T, s=2.5, c=INDIGO, alpha=0.8, lw=0); ax.scatter(*Xtr[ytr == 1].T, s=2.5, c=AMBER, alpha=0.9, lw=0)
        ax.set_title(f'Gaussian kernel, $\\sigma={s}$')
        ax.set_xticks([]); ax.set_yticks([])
    save(fig, 'parzen_classifier')


def fig_unit_balls():
    fig, ax = plt.subplots(figsize=(2.3, 2.3))
    th = np.linspace(0, 2 * np.pi, 800)
    for p, c, lab in ((1, AMBER, '$L_1$'), (2, INDIGO, '$L_2$'), (np.inf, TEAL, '$L_\\infty$'), (0.5, GREY, '$p=\\frac{1}{2}$')):
        u, v = np.cos(th), np.sin(th)
        r = 1 / np.max(np.abs(np.c_[u, v]), 1) if p == np.inf else 1 / (np.abs(u) ** p + np.abs(v) ** p) ** (1 / p)
        ax.plot(r * u, r * v, c=c, ls=':' if p == 0.5 else '-', label=lab)
    ax.set_aspect('equal'); ax.set_xticks([-1, 0, 1]); ax.set_yticks([-1, 0, 1])
    ax.legend(frameon=False, fontsize=7, loc='upper left', bbox_to_anchor=(1.02, 1.0))
    save(fig, 'unit_balls')


if __name__ == '__main__':
    for f in (fig_tasks, fig_gaussian_1d, fig_gaussian_2d, fig_diffusion, fig_hist_classifier, fig_hist_density, fig_curse,
              fig_poly_fits, fig_capacity_curve, fig_learning_curve, fig_double_descent,
              fig_voronoi, fig_knn_k, fig_kde, fig_parzen_classifier, fig_unit_balls):
        f()
