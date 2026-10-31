"""
Figures for MYZ 310E lecture note 12 (training neural networks). Uses the shared helpers of figures.py.

    python3 figures_note12.py     # writes figures/n12_*.pdf
"""
from figures import *

SIG = lambda a: 1.0 / (1.0 + np.exp(-a))


# ---------------------------------------------------------------- a small numpy MLP with backpropagation
def init_mlp(sizes, rng, scheme='he'):
    params = []
    for fan_in, fan_out in zip(sizes[:-1], sizes[1:]):
        if scheme == 'he':
            W = rng.normal(0.0, np.sqrt(2.0 / fan_in), (fan_out, fan_in))
        else:  # Glorot uniform
            b = np.sqrt(6.0 / (fan_in + fan_out))
            W = rng.uniform(-b, b, (fan_out, fan_in))
        params.append([W, np.zeros(fan_out)])
    return params


def forward(params, X, p_drop=0.0, rng=None):
    """ReLU hidden layers, one sigmoid output unit. Rows of X are examples. Returns the cache for backprop."""
    H = X
    cache = []
    for k, (W, b) in enumerate(params):
        A = H @ W.T + b
        last = k == len(params) - 1
        if last:
            cache.append((H, A, None))
            return SIG(A[:, 0]), cache
        Hn = np.maximum(A, 0.0)
        mask = None
        if p_drop > 0 and rng is not None:
            mask = (rng.random(Hn.shape) > p_drop) / (1.0 - p_drop)
            Hn = Hn * mask
        cache.append((H, A, mask))
        H = Hn


def bce(y, t):
    y = np.clip(y, 1e-12, 1 - 1e-12)
    return float(-np.mean(t * np.log(y) + (1 - t) * np.log(1 - y)))


def backward(params, cache, y, t):
    n = len(t)
    grads = [None] * len(params)
    D = ((y - t) / n)[:, None]                    # delta at the output pre-activation, mean loss
    for k in range(len(params) - 1, -1, -1):
        H, A, _ = cache[k]
        W, b = params[k]
        grads[k] = [D.T @ H, D.sum(0)]
        if k > 0:
            Hprev, Aprev, mask = cache[k - 1]
            G = D @ W                               # gradient w.r.t. the layer below (after activation)
            if mask is not None:
                G = G * mask
            D = G * (Aprev > 0)
    return grads


def train(params, X, t, Xv, tv, eta, epochs, batch, lam=0.0, p_drop=0.0, seed=0):
    rng = np.random.default_rng(seed)
    n = len(t)
    tr, va = [], []
    for ep in range(epochs):
        perm = rng.permutation(n)
        for s in range(0, n, batch):
            idx = perm[s:s + batch]
            y, cache = forward(params, X[idx], p_drop, rng)
            g = backward(params, cache, y, t[idx])
            for (W, b), (gW, gb) in zip(params, g):
                W -= eta * (gW + lam * W)           # weight decay on weights only
                b -= eta * gb
        tr.append(bce(forward(params, X)[0], t))
        va.append(bce(forward(params, Xv)[0], tv))
    return tr, va


def error(params, X, t):
    return float(np.mean((forward(params, X)[0] > 0.5) != t))


# ---------------------------------------------------------------- figure: scale of activations at initialisation
def fig_init():
    rng = np.random.default_rng(12)
    width, depth = 256, 30
    X = rng.standard_normal((500, width))
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 2.35))

    def run(act, std_fn):
        r = np.random.default_rng(3)
        H = X
        out, sat = [], []
        for _ in range(depth):
            W = std_fn(r)
            A = H @ W.T
            H = np.tanh(A) if act == 'tanh' else np.maximum(A, 0)
            out.append(np.sqrt(np.mean(A ** 2)))       # root mean square of the pre-activations
            sat.append(np.mean(np.abs(A) > 3))         # fraction of saturated tanh units
        return np.array(out), np.array(sat)

    gl = np.sqrt(6.0 / (2 * width))
    cases_tanh = [
        ('$\\sigma_w = 1$ (too large)', lambda r: r.normal(0, 1.0, (width, width)), CORAL),
        ('$\\sigma_w = 0.01$ (too small)', lambda r: r.normal(0, 0.01, (width, width)), GREY),
        ('Glorot', lambda r: r.uniform(-gl, gl, (width, width)), INDIGO),
    ]
    cases_relu = [
        ('Glorot', lambda r: r.uniform(-gl, gl, (width, width)), INDIGO),
        ('He', lambda r: r.normal(0, np.sqrt(2.0 / width), (width, width)), AMBER),
        ('$\\sigma_w = 0.1$', lambda r: r.normal(0, 0.1, (width, width)), CORAL),
    ]
    layers = np.arange(1, depth + 1)
    for ax, act, cases in [(axes[0], 'tanh', cases_tanh), (axes[1], 'relu', cases_relu)]:
        for lab, fn, c in cases:
            s, sat = run(act, fn)
            print(act, lab, 'rms a at layers 1,5,10,30:', np.round(s[[0, 4, 9, 29]], 4), 'saturated frac', sat[[0, 29]])
            ax.semilogy(layers, s, c=c, label=lab)
        ax.set_xlabel('layer $k$')
        ax.set_ylabel('rms of $\\mathbf{a}^{(k)}$')
        ax.legend(frameon=False, loc='lower right' if act == 'tanh' else 'lower left')
    axes[0].set_title('tanh, width 256')
    axes[1].set_title('ReLU, width 256')
    axes[0].set_ylim(1e-12, 1e3)
    axes[1].set_ylim(1e-4, 1e3)
    fig.tight_layout()
    save(fig, 'n12_init')


# ---------------------------------------------------------------- figure: gradient flow through depth
def fig_gradflow():
    # (the derivatives themselves are plotted in note 11, Figure 2)
    fig, ax = plt.subplots(1, 1, figsize=(4.3, 2.5))
    width, depth = 128, 30
    rng = np.random.default_rng(5)
    X = rng.standard_normal((256, width))
    v = rng.standard_normal(width)

    def grad_norms(kind):
        r = np.random.default_rng(7)
        gl = np.sqrt(6.0 / (2 * width))
        Ws = []
        for _ in range(depth):
            if kind in ('sigmoid', 'tanh'):
                Ws.append(r.uniform(-gl, gl, (width, width)))
            else:
                Ws.append(r.normal(0, np.sqrt(2.0 / width), (width, width)))
        if kind == 'residual':
            Ws = [W / np.sqrt(depth) for W in Ws]
        H = X
        cache = []
        for W in Ws:
            A = H @ W.T
            if kind == 'sigmoid':
                Hn = SIG(A); dg = Hn * (1 - Hn)
            elif kind == 'tanh':
                Hn = np.tanh(A); dg = 1 - Hn ** 2
            else:
                Hn = np.maximum(A, 0); dg = (A > 0).astype(float)
            if kind == 'residual':
                Hn = H + Hn
            cache.append((H, dg))
            H = Hn
        G = np.tile(v, (len(X), 1)) / len(X)       # gradient of L = mean(v . h_L)
        norms = []
        for W, (Hp, dg) in zip(Ws[::-1], cache[::-1]):
            norms.append(np.linalg.norm(G) * np.sqrt(len(X) / width))  # rms size of dl/dh^(k), per example
            D = G * dg
            G = D @ W + (G if kind == 'residual' else 0)
        return np.array(norms[::-1])

    layers = np.arange(1, depth + 1)
    for kind, lab, c in [('sigmoid', 'sigmoid, Glorot', GREY), ('tanh', 'tanh, Glorot', INDIGO),
                         ('relu', 'ReLU, He', AMBER), ('residual', 'ReLU residual', TEAL)]:
        g = grad_norms(kind)
        print(kind, 'grad norm layer1/layer30 =', g[0] / g[-1], 'layer1', g[0], 'layer30', g[-1])
        ax.semilogy(layers, g / g[-1], c=c, label=lab)
    ax.set_xlabel('layer $k$')
    ax.set_title('size of $\\partial\\ell/\\partial\\mathbf{h}^{(k)}$, relative to $k = 30$')
    ax.legend(frameon=False, loc='lower right')
    fig.tight_layout()
    save(fig, 'n12_gradflow')


# ---------------------------------------------------------------- figure: training curves and random search
def fig_training():
    rng = np.random.default_rng(2026)
    X, t = moons(200, rng, noise=0.25)
    Xv, tv = moons(2000, rng, noise=0.25)
    mu, sd = X.mean(0), X.std(0)
    X, Xv = (X - mu) / sd, (Xv - mu) / sd
    fig, axes = plt.subplots(1, 3, figsize=(6.9, 2.3))

    ax = axes[0]
    for eta, c in [(0.003, GREY), (0.1, INDIGO), (3.0, CORAL)]:
        p = init_mlp([2, 64, 64, 1], np.random.default_rng(0))
        tr, _ = train(p, X, t, Xv, tv, eta, 300, 20, seed=1)
        print('eta', eta, 'train loss at 1,50,300:', round(tr[0], 3), round(tr[49], 3), round(tr[-1], 3))
        ax.plot(np.arange(1, 301), tr, c=c, label=f'$\\eta = {eta:g}$')
    ax.set_xlabel('epoch'); ax.set_ylabel('training loss')
    ax.set_ylim(0, 1.0)
    ax.set_title('learning rate')
    ax.legend(frameon=False, loc='center right', bbox_to_anchor=(1.0, 0.47))

    ax = axes[1]
    Xs, ts = X[:40], t[:40]
    for lam, c, lab in [(0.0, CORAL, '$\\lambda = 0$'), (1e-2, INDIGO, '$\\lambda = 0.01$')]:
        p = init_mlp([2, 128, 128, 1], np.random.default_rng(0))
        tr, va = train(p, Xs, ts, Xv, tv, 0.05, 1500, 10, lam=lam, seed=1)
        best = int(np.argmin(va))
        print('lam', lam, 'final train/valid', round(tr[-1], 3), round(va[-1], 3), 'best valid', round(va[best], 3),
              'at epoch', best + 1, 'valid err', error(p, Xv, tv))
        ax.plot(np.arange(1, 1501), tr, c=c, ls='--', lw=1.0)
        ax.plot(np.arange(1, 1501), va, c=c, label=lab)
    ax.axvline(best + 1, c=GREY, ls=':', lw=1.0)    # epoch of lowest validation loss
    ax.set_xscale('log')
    ax.set_xlabel('epoch'); ax.set_ylabel('loss')
    ax.set_ylim(0, 1.7)
    ax.set_title('train (dashed), valid (solid)')
    ax.legend(frameon=False, loc='upper left')

    ax = axes[2]
    r = np.random.default_rng(11)
    lrs, lams, errs = [], [], []
    for trial in range(40):
        le = r.uniform(-3.5, 0.5); ll = r.uniform(-5, -0.5)
        p = init_mlp([2, 64, 64, 1], np.random.default_rng(trial))
        train(p, X, t, Xv, tv, 10 ** le, 60, 20, lam=10 ** ll, seed=trial)
        e = error(p, Xv, tv)
        lrs.append(le); lams.append(ll); errs.append(e)
    errs = np.array(errs)
    sc = ax.scatter(lrs, lams, c=errs, cmap='viridis_r', s=22, vmin=0.05, vmax=0.2)
    b = int(np.argmin(errs))
    print('random search best: log10 eta', round(lrs[b], 2), 'log10 lam', round(lams[b], 2), 'valid err', errs[b],
          'worst', errs.max(), 'median', np.median(errs))
    lrs_a = np.array(lrs)
    for lo, hi in [(-3.5, -2), (-2, -1), (-1, 0.5)]:
        m = (lrs_a >= lo) & (lrs_a < hi)
        print('  log10 eta in', (lo, hi), 'n =', m.sum(), 'errors min/median/max', errs[m].min(), np.median(errs[m]), errs[m].max())
    ax.scatter([lrs[b]], [lams[b]], s=90, facecolors='none', edgecolors=CORAL, lw=1.2)
    ax.set_xlabel('$\\log_{10}\\eta$'); ax.set_ylabel('$\\log_{10}\\lambda$')
    ax.set_title('random search: valid. error')
    cb = fig.colorbar(sc, ax=ax, fraction=0.05, pad=0.03)
    cb.ax.tick_params(labelsize=7)
    fig.tight_layout()
    save(fig, 'n12_training')


if __name__ == '__main__':
    fig_init()
    fig_gradflow()
    fig_training()
