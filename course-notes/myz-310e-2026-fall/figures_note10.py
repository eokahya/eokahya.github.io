"""
Figures for MYZ 310E lecture note 10 (feature maps and the kernel trick). Uses the shared helpers of figures.py.

    python3 figures_note10.py     # writes figures/n10_*.pdf
"""
from figures import *


def rbf_gram(A, B, sigma):
    sq = (A ** 2).sum(1)[:, None] + (B ** 2).sum(1)[None, :] - 2 * A @ B.T
    return np.exp(-np.maximum(sq, 0) / (2 * sigma ** 2))


def poly_gram(A, B, p):
    return (1 + A @ B.T) ** p


def kernel_svm(K, t, C, epochs=400, seed=0):
    """Soft-margin kernel SVM by dual coordinate ascent. The bias is absorbed by adding 1 to the kernel."""
    Kb = K + 1.0
    a = np.zeros(len(t)); g = np.zeros(len(t)); r = np.random.default_rng(seed)
    for _ in range(epochs):
        for i in r.permutation(len(t)):
            new = min(max(a[i] - (t[i] * g[i] - 1) / Kb[i, i], 0.0), C)
            if new != a[i]:
                g += (new - a[i]) * t[i] * Kb[:, i]; a[i] = new
    return a


def fig_kernel_widths():
    rng = np.random.default_rng(31)
    X, lab = moons(200, rng, noise=0.25); t = 2.0 * lab - 1
    Xte, labte = moons(2000, rng, noise=0.25); tte = 2.0 * labte - 1
    gx, gy = np.meshgrid(np.linspace(-1.6, 2.6, 300), np.linspace(-1.3, 1.8, 300)); G = np.c_[gx.ravel(), gy.ravel()]
    C = 10.0
    cases = [('polynomial, $p = 3$', lambda A, B: poly_gram(A, B, 3)),
             ('RBF, $\\sigma = 0.1$', lambda A, B: rbf_gram(A, B, 0.1)),
             ('RBF, $\\sigma = 0.5$', lambda A, B: rbf_gram(A, B, 0.5)),
             ('RBF, $\\sigma = 2$', lambda A, B: rbf_gram(A, B, 2.0))]
    fig, axes = plt.subplots(1, 4, figsize=(6.8, 1.95))
    for ax, (title, kern) in zip(axes, cases):
        K = kern(X, X)
        a = kernel_svm(K, t, C)
        sv = a > 1e-8
        score = lambda Q: (kern(Q, X[sv]) + 1.0) @ (a[sv] * t[sv])
        tr = (np.sign(score(X)) != t).mean(); te = (np.sign(score(Xte)) != tte).mean()
        S = score(G).reshape(gx.shape)
        ax.contourf(gx, gy, (S > 0), levels=[-0.5, 0.5, 1.5], cmap=REGION)
        ax.contour(gx, gy, S, levels=[0], colors='k', linewidths=0.8)
        ax.scatter(*X[lab == 0].T, s=4, c=INDIGO, lw=0); ax.scatter(*X[lab == 1].T, s=4, c=AMBER, lw=0)
        ax.scatter(*X[sv].T, s=13, facecolors='none', edgecolors='k', linewidths=0.35)
        ax.set_title(title); ax.set_xticks([]); ax.set_yticks([])
        ax.text(0.03, 0.03, f'train {tr:.1%}, test {te:.1%}\n{sv.sum()} SV', transform=ax.transAxes, fontsize=6.5,
                bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='none', alpha=0.85))
        print(f'   {title}: train {tr:.3f} test {te:.3f} support vectors {sv.sum()}')
    save(fig, 'n10_kernel_widths')


def fig_krr_widths():
    rng = np.random.default_rng(32)
    n = 25
    x = np.sort(rng.uniform(0, 1, n)); y = np.sin(2 * np.pi * x) + 0.3 * rng.standard_normal(n)
    xte = rng.uniform(0, 1, 2000); yte = np.sin(2 * np.pi * xte) + 0.3 * rng.standard_normal(2000)
    xg = np.linspace(-0.15, 1.15, 600)
    lam = 0.1
    fig, axes = plt.subplots(1, 3, figsize=(6.6, 1.9), sharey=True)
    for ax, s in zip(axes, (0.02, 0.2, 1.0)):
        K = rbf_gram(x[:, None], x[:, None], s)
        alpha = np.linalg.solve(K + lam * np.eye(n), y)
        f = lambda q: rbf_gram(q[:, None], x[:, None], s) @ alpha
        mse_tr = np.mean((f(x) - y) ** 2); mse_te = np.mean((f(xte) - yte) ** 2)
        ax.plot(xg, np.sin(2 * np.pi * xg), color=GREY, lw=0.9, ls='--')
        ax.plot(xg, f(xg), color=INDIGO, lw=1.3)
        ax.scatter(x, y, s=9, c=AMBER, zorder=3, lw=0)
        ax.set_title(f'$\\sigma = {s}$'); ax.set_ylim(-2.0, 2.0); ax.set_xlabel('$x$')
        ax.text(0.03, 0.03, f'train MSE {mse_tr:.3f}\ntest MSE {mse_te:.3f}', transform=ax.transAxes, fontsize=6.5,
                bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='none', alpha=0.85))
        print(f'   sigma={s}: train MSE {mse_tr:.4f} test MSE {mse_te:.4f}')
    axes[0].set_ylabel('$y$')
    save(fig, 'n10_krr_widths')


def rff_check():
    """Root-mean-square error of random Fourier features for the Gaussian kernel (numbers quoted in Section 9)."""
    rng = np.random.default_rng(10)
    x = np.array([1.0, 0.0]); z = np.array([0.0, 1.0]); k = np.exp(-np.sum((x - z) ** 2) / 2)
    for D in (10, 100, 1000, 10000):
        err = []
        for _ in range(1000):
            W = rng.standard_normal((D, 2)); b = rng.uniform(0, 2 * np.pi, D)
            err.append(2 / D * np.cos(W @ x + b) @ np.cos(W @ z + b) - k)
        print(f'   RFF D={D}: RMSE {np.sqrt(np.mean(np.square(err))):.4f}, theory {np.sqrt((1 - k**2 + k**4 / 2) / D):.4f}')


if __name__ == '__main__':
    fig_kernel_widths()
    fig_krr_widths()
    rff_check()
