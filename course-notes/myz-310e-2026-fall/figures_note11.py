"""
Figures for MYZ 310E lecture note 11 (feed-forward neural networks). Uses the shared helpers of figures.py.

    python3 figures_note11.py     # writes figures/n11_*.pdf
"""
from math import erf

from matplotlib.colors import LinearSegmentedColormap

from figures import *

SEQ = LinearSegmentedColormap.from_list('seq', ['#FFFFFF', '#C9CDEA', INDIGO])


def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))


def relu(z):
    return np.maximum(z, 0.0)


def gelu(z):
    return z * 0.5 * (1.0 + np.vectorize(erf)(z / np.sqrt(2.0)))


# ---------------------------------------------------------------- activation functions and derivatives
def fig_activations():
    z = np.linspace(-4, 4, 801)
    phi = np.exp(-z * z / 2) / np.sqrt(2 * np.pi)
    Phi = 0.5 * (1 + np.vectorize(erf)(z / np.sqrt(2)))
    s = sigmoid(z)
    curves = [('sigmoid $\\sigma$', s, s * (1 - s), INDIGO, '-'),
              ('tanh', np.tanh(z), 1 - np.tanh(z) ** 2, TEAL, '-'),
              ('ReLU', relu(z), (z > 0).astype(float), AMBER, '-'),
              ('GELU', z * Phi, Phi + z * phi, CORAL, '--'),
              ('SiLU', z * s, s * (1 + z * (1 - s)), GREY, ':')]
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 2.35))
    for name, f, df, c, ls in curves:
        axes[0].plot(z, f, c=c, ls=ls, label=name)
        if name == 'ReLU':
            axes[1].plot(z[z < 0], df[z < 0], c=c, ls=ls); axes[1].plot(z[z > 0], df[z > 0], c=c, ls=ls)
        else:
            axes[1].plot(z, df, c=c, ls=ls)
    axes[0].set_ylim(-1.3, 3.2); axes[1].set_ylim(-0.2, 1.25)
    axes[0].set_title('Activation $g(a)$'); axes[1].set_title("Derivative $g'(a)$")
    for ax in axes:
        ax.axhline(0, c='k', lw=0.4); ax.axvline(0, c='k', lw=0.4); ax.set_xlabel('$a$')
    axes[0].legend(frameon=False, loc='upper left', fontsize=7.5)
    save(fig, 'n11_activations')


# ---------------------------------------------------------------- XOR: input space and hidden space
def fig_xor():
    X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], float)
    t = np.array([0, 1, 1, 0])
    Z = relu(X @ np.array([[1, 1], [1, 1]]).T + np.array([0, -1]))
    fig, axes = plt.subplots(1, 2, figsize=(5.6, 2.45))
    ax = axes[0]
    g = np.linspace(-0.5, 1.5, 400); gx, gy = np.meshgrid(g, g)
    out = relu(gx + gy) - 2 * relu(gx + gy - 1)
    ax.contourf(gx, gy, out > 0.5, levels=[-0.5, 0.5, 1.5], cmap=REGION)
    ax.plot(g, -g, c=GREY, lw=0.9, ls='--'); ax.plot(g, 1 - g, c=GREY, lw=0.9, ls='--')
    ax.text(-0.45, 0.32, '$a_1 = 0$', color=GREY, fontsize=7.5, rotation=-45)
    ax.text(0.62, 0.55, '$a_2 = 0$', color=GREY, fontsize=7.5, rotation=-45)
    for (x, c) in zip(X, t):
        ax.scatter(*x, s=42, c=AMBER if c else INDIGO, edgecolors='k', linewidths=0.4, zorder=3)
    ax.set_xlim(-0.5, 1.5); ax.set_ylim(-0.5, 1.5); ax.set_aspect('equal')
    ax.set_xlabel('$x_1$'); ax.set_ylabel('$x_2$'); ax.set_title('Input space: output $y > 1/2$ shaded')
    ax = axes[1]
    g2 = np.linspace(-0.3, 2.4, 300)
    ax.fill_between(g2, (g2 - 0.5) / 2, 2.4, color='#E3E6F5', lw=0)
    ax.fill_between(g2, -0.3, (g2 - 0.5) / 2, color='#F7E7CC', lw=0)
    ax.plot(g2, (g2 - 0.5) / 2, c='k', lw=0.8)
    for (z, c, lab, off) in zip(Z, t, ['(0,0)', '(0,1), (1,0)', None, '(1,1)'], [(5, 5), (-14, -14), None, (-28, 4)]):
        ax.scatter(*z, s=42, c=AMBER if c else INDIGO, edgecolors='k', linewidths=0.4, zorder=3)
        if lab:
            ax.annotate(lab, z, xytext=off, textcoords='offset points', fontsize=7.5)
    ax.set_xlim(-0.3, 2.4); ax.set_ylim(-0.3, 1.4); ax.set_aspect('equal')
    ax.set_xlabel('$h_1$'); ax.set_ylabel('$h_2$'); ax.set_title('Hidden space: $h_1 - 2h_2 = 1/2$')
    save(fig, 'n11_xor')


# ---------------------------------------------------------------- one hidden layer builds bumps from ridges
def fig_ridges():
    g = np.linspace(-3, 3, 301); gx, gy = np.meshgrid(g, g)
    k = 4.0
    ridge = sigmoid(k * (0.8 * gx + 0.6 * gy - 0.5))
    band = sigmoid(k * (gx + 1)) - sigmoid(k * (gx - 1))
    s = band + sigmoid(k * (gy + 1)) - sigmoid(k * (gy - 1))
    bump = sigmoid(8 * (s - 1.5))
    panels = [('one hidden unit: $\\sigma(\\mathbf{w}^{\\mathsf{T}}\\mathbf{x} + b)$', ridge),
              ('two units: $\\sigma(4(x_1+1)) - \\sigma(4(x_1-1))$', band),
              ('four units + output sigmoid', bump)]
    fig, axes = plt.subplots(1, 3, figsize=(6.8, 2.3))
    for ax, (title, F) in zip(axes, panels):
        im = ax.contourf(gx, gy, F, levels=np.linspace(0, 1, 11), cmap=SEQ)
        ax.contour(gx, gy, F, levels=[0.5], colors='k', linewidths=0.6)
        ax.set_aspect('equal'); ax.set_xticks([-2, 0, 2]); ax.set_yticks([-2, 0, 2])
        ax.set_title(title, fontsize=8)
        ax.set_xlabel('$x_1$')
    axes[0].set_ylabel('$x_2$')
    fig.colorbar(im, ax=axes, shrink=0.8, pad=0.02, ticks=[0, 0.5, 1])
    save(fig, 'n11_ridges')


# ---------------------------------------------------------------- ReLU pieces: width and depth
def fig_relu_depth():
    fig, axes = plt.subplots(1, 3, figsize=(6.8, 2.1))
    x = np.linspace(-0.5, 2.5, 601)
    ax = axes[0]
    ax.plot(x, relu(x), c=GREY, lw=0.9, ls='--', label='$\\mathrm{ReLU}(x - k)$')
    ax.plot(x, relu(x - 1), c=GREY, lw=0.9, ls='--'); ax.plot(x, relu(x - 2), c=GREY, lw=0.9, ls='--')
    ax.plot(x, relu(x) - 2 * relu(x - 1) + relu(x - 2), c=INDIGO, lw=1.6, label='hat')
    ax.set_ylim(-0.2, 2.0); ax.set_title('Three units make a hat'); ax.legend(frameon=False, loc='upper left', fontsize=7)
    ax = axes[1]
    xs = np.linspace(0, np.pi, 601)
    f = np.sin(2 * xs) + 0.5 * xs
    ax.plot(xs, f, c='k', lw=1.0, label='target')
    for N, c, ls in [(4, AMBER, '-'), (12, TEAL, '--')]:
        knots = np.linspace(0, np.pi, N + 1)
        ax.plot(xs, np.interp(xs, knots, np.sin(2 * knots) + 0.5 * knots), c=c, ls=ls, lw=1.2, label=f'{N} pieces')
        err = np.abs(np.interp(xs, knots, np.sin(2 * knots) + 0.5 * knots) - f).max()
        print(f'   interpolation of sin(2x)+x/2 with {N} pieces: max error {err:.3f}')
    ax.set_title('Piecewise-linear fits'); ax.legend(frameon=False, loc='upper center', bbox_to_anchor=(0.62, 1.0), fontsize=7)
    ax = axes[2]
    u = np.linspace(0, 1, 4001)
    y = u.copy()
    for L, c, ls in [(1, GREY, ':'), (2, TEAL, '--'), (3, INDIGO, '-')]:
        y = 2 * relu(y) - 4 * relu(y - 0.5)
        ax.plot(u, y + 1.15 * (3 - L), c=c, ls=ls, lw=1.1)
        ax.text(1.02, 1.15 * (3 - L) + 0.4, f'$T^{{{L}}}$', fontsize=8, color=c)
    ax.set_yticks([]); ax.set_xlim(0, 1.15); ax.set_title('Depth: $T$ composed $L$ times')
    save(fig, 'n11_relu_depth')


# ---------------------------------------------------------------- capacity: width, weight decay, epochs
def mlp_train(X, t, width, lam=0.0, epochs=4000, lr=0.01, seed=0, monitor=None, every=10):
    """One-hidden-layer ReLU network, sigmoid output, mean cross-entropy + lam*||W||^2, full-batch Adam."""
    r = np.random.default_rng(seed); d = X.shape[1]
    P = {'W1': r.standard_normal((width, d)) * np.sqrt(2 / d), 'b1': np.zeros(width),
         'w2': r.standard_normal(width) * np.sqrt(1 / width), 'b2': np.zeros(1)}
    m = {k: np.zeros_like(v) for k, v in P.items()}; v = {k: np.zeros_like(v) for k, v in P.items()}
    hist = []
    for it in range(1, epochs + 1):
        A = X @ P['W1'].T + P['b1']; Z = relu(A); y = sigmoid(Z @ P['w2'] + P['b2'])
        da = (y - t) / len(t)
        G = {'w2': Z.T @ da + 2 * lam * P['w2'], 'b2': np.array([da.sum()])}
        dZ = np.outer(da, P['w2']) * (A > 0)
        G['W1'] = dZ.T @ X + 2 * lam * P['W1']; G['b1'] = dZ.sum(0)
        for k in P:
            m[k] = 0.9 * m[k] + 0.1 * G[k]; v[k] = 0.999 * v[k] + 0.001 * G[k] ** 2
            P[k] = P[k] - lr * (m[k] / (1 - 0.9 ** it)) / (np.sqrt(v[k] / (1 - 0.999 ** it)) + 1e-8)
        if monitor is not None and (it % every == 0 or it == 1):
            hist.append([it] + [f(P) for f in monitor])
    return P, np.array(hist)


def mlp_score(P, X):
    return relu(X @ P['W1'].T + P['b1']) @ P['w2'] + P['b2']


def mlp_ce(P, X, t):
    a = mlp_score(P, X)
    return np.mean(t * np.logaddexp(0, -a) + (1 - t) * np.logaddexp(0, a))


def mlp_err(P, X, t):
    return np.mean((mlp_score(P, X) > 0) != t)


def fig_capacity():
    rng = np.random.default_rng(41)
    X, t = moons(100, rng, noise=0.3); Xte, tte = moons(5000, rng, noise=0.3)
    gx, gy = np.meshgrid(np.linspace(-1.8, 2.8, 300), np.linspace(-1.5, 2.0, 300)); G = np.c_[gx.ravel(), gy.ravel()]
    cases = [('width 2', 2, 0.0), ('width 8', 8, 0.0), ('width 200', 200, 0.0),
             ('width 200, $\\lambda = 10^{-3}$', 200, 1e-3)]
    fig, axes = plt.subplots(1, 4, figsize=(6.8, 1.95))
    for ax, (title, w, lam) in zip(axes, cases):
        P, _ = mlp_train(X, t, w, lam)
        tr, te = mlp_err(P, X, t), mlp_err(P, Xte, tte)
        S = mlp_score(P, G).reshape(gx.shape)
        ax.contourf(gx, gy, S > 0, levels=[-0.5, 0.5, 1.5], cmap=REGION)
        ax.contour(gx, gy, S, levels=[0], colors='k', linewidths=0.8)
        ax.scatter(*X[t == 0].T, s=5, c=INDIGO, lw=0); ax.scatter(*X[t == 1].T, s=5, c=AMBER, lw=0)
        ax.set_title(title); ax.set_xticks([]); ax.set_yticks([])
        ax.text(0.03, 0.03, f'train {tr:.0%}, test {te:.1%}', transform=ax.transAxes, fontsize=6.5,
                bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='none', alpha=0.85))
        print(f'   {title}: train {tr:.3f} test {te:.4f}')
    save(fig, 'n11_capacity')


def fig_epochs():
    rng = np.random.default_rng(41)
    X, t = moons(100, rng, noise=0.3); Xte, tte = moons(5000, rng, noise=0.3)
    Xv, tv = moons(200, np.random.default_rng(5), noise=0.3)
    mon = [lambda P: mlp_ce(P, X, t), lambda P: mlp_ce(P, Xv, tv), lambda P: mlp_err(P, X, t), lambda P: mlp_err(P, Xv, tv),
           lambda P: mlp_err(P, Xte, tte)]
    _, h = mlp_train(X, t, 200, 0.0, epochs=3000, lr=0.003, monitor=mon, every=10)
    fig, axes = plt.subplots(1, 2, figsize=(6.0, 2.2))
    ax = axes[0]
    ax.plot(h[:, 0], h[:, 1], c=INDIGO, label='training'); ax.plot(h[:, 0], h[:, 2], c=AMBER, label='validation')
    best = h[np.argmin(h[:, 2])]
    ax.axvline(best[0], c=GREY, ls='--', lw=0.8)
    ax.set_xscale('log'); ax.set_xlabel('epoch'); ax.set_title('Cross-entropy'); ax.legend(frameon=False)
    ax = axes[1]
    ax.plot(h[:, 0], h[:, 3], c=INDIGO, label='training'); ax.plot(h[:, 0], h[:, 4], c=AMBER, label='validation')
    ax.axvline(best[0], c=GREY, ls='--', lw=0.8)
    ax.set_xscale('log'); ax.set_xlabel('epoch'); ax.set_title('Classification error'); ax.set_ylim(0, 0.3)
    save(fig, 'n11_epochs')
    k = np.argmin(h[:, 2]); bv = np.argmin(h[:, 4])
    print(f'   best validation CE at epoch {h[k,0]:.0f}: train CE {h[k,1]:.3f}, valid CE {h[k,2]:.3f}, '
          f'train err {h[k,3]:.3f}, valid err {h[k,4]:.3f}, test err {h[k,5]:.4f}')
    print(f'   lowest validation error {h[bv,4]:.3f} first at epoch {h[bv,0]:.0f} (test err {h[bv,5]:.4f})')
    print(f'   final epoch {h[-1,0]:.0f}: train CE {h[-1,1]:.3f}, valid CE {h[-1,2]:.3f}, train err {h[-1,3]:.3f}, '
          f'valid err {h[-1,4]:.3f}, test err {h[-1,5]:.4f}')


if __name__ == '__main__':
    fig_activations()
    fig_xor()
    fig_ridges()
    fig_relu_depth()
    fig_capacity()
    fig_epochs()
