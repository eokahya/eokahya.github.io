"""
Figures for MYZ 310E lecture note 15 (attention and transformers). Uses the shared helpers of figures.py.

    python3 figures_note15.py     # writes figures/n15_*.pdf
"""
from figures import *
from matplotlib.colors import LinearSegmentedColormap

SEQ = LinearSegmentedColormap.from_list('seq15', ['#FFFFFF', '#C9CDEA', INDIGO])


def softmax(e, axis=-1):
    e = e - e.max(axis=axis, keepdims=True)
    w = np.exp(e)
    return w / w.sum(axis=axis, keepdims=True)


def fig_scaling():
    """Why scores are divided by sqrt(d_k): entropy and Jacobian of the softmax as d_k grows."""
    rng = np.random.default_rng(15)
    T, n = 32, 2000
    ds = np.array([2, 4, 8, 16, 32, 64, 128, 256, 512])
    ent = {True: [], False: []}
    jac = {True: [], False: []}
    for d in ds:
        q = rng.standard_normal((n, d))
        k = rng.standard_normal((n, T, d))
        s = np.einsum('nd,ntd->nt', q, k)
        for scaled in (False, True):
            a = softmax(s / np.sqrt(d) if scaled else s)
            h = -(a * np.log(np.clip(a, 1e-300, None))).sum(1) / np.log(T)
            # Frobenius norm of the softmax Jacobian diag(a) - a a^T
            J2 = ((a ** 2) * (1 - a) ** 2).sum(1) + (a ** 2).sum(1) ** 2 - (a ** 4).sum(1)
            J = np.sqrt(np.clip(J2, 0, None))
            ent[scaled].append(h.mean()); jac[scaled].append(np.median(J))
    for j in (5, 8):
        print(f'   d={ds[j]}: entropy/log T unscaled {ent[False][j]:.3f}, scaled {ent[True][j]:.3f}; '
              f'median |J| unscaled {jac[False][j]:.4f}, scaled {jac[True][j]:.4f}')
    fig, axes = plt.subplots(1, 2, figsize=(6.4, 2.1))
    ax = axes[0]
    ax.plot(ds, ent[False], 'o-', c=CORAL, ms=3, label='scores $\\mathbf{q}^{\\mathsf{T}}\\mathbf{k}$')
    ax.plot(ds, ent[True], 's-', c=INDIGO, ms=3, label='scores $\\mathbf{q}^{\\mathsf{T}}\\mathbf{k}/\\sqrt{d_k}$')
    ax.set_xscale('log', base=2); ax.set_ylim(0, 1.05)
    ax.set_xlabel('$d_k$'); ax.set_ylabel('entropy / $\\log T$')
    ax.set_title('spread of the attention weights')
    ax.legend(frameon=False, loc='lower left')
    ax = axes[1]
    ax.plot(ds, jac[False], 'o-', c=CORAL, ms=3)
    ax.plot(ds, jac[True], 's-', c=INDIGO, ms=3)
    ax.set_xscale('log', base=2); ax.set_yscale('log')
    ax.set_xlabel('$d_k$'); ax.set_ylabel('median $\\|\\partial\\alpha/\\partial \\mathbf{e}\\|_F$')
    ax.set_title('size of the softmax Jacobian')
    save(fig, 'n15_scaling')


def fig_window():
    """Graves' Gaussian-mixture window moving monotonically along a 30-character input."""
    rng = np.random.default_rng(7)
    Tsteps, U, K = 46, 30, 2
    u = np.arange(1, U + 1)
    kappa = np.zeros(K)
    phi = np.zeros((Tsteps, U))
    for t in range(Tsteps):
        kappa = kappa + np.exp(rng.normal(np.log(0.6), 0.45)) * np.exp(rng.normal(0, 0.1, K))
        alpha = np.exp(rng.normal(0, 0.2, K))
        beta = np.array([0.8, 0.3]) * np.exp(rng.normal(0, 0.2, K))
        phi[t] = (alpha[:, None] * np.exp(-beta[:, None] * (kappa[:, None] - u[None, :]) ** 2)).sum(0)
    fig, axes = plt.subplots(1, 2, figsize=(6.4, 2.15), gridspec_kw=dict(width_ratios=[1.25, 1], wspace=0.45))
    ax = axes[0]
    im = ax.imshow(phi.T, origin='lower', aspect='auto', cmap=SEQ, extent=(0.5, Tsteps + 0.5, 0.5, U + 0.5))
    ax.set_xlabel('pen step $t$'); ax.set_ylabel('input position $u$')
    ax.set_title('window weights $\\phi(t, u)$')
    cb = fig.colorbar(im, ax=ax, fraction=0.05, pad=0.02); cb.ax.tick_params(labelsize=7)
    ax = axes[1]
    for t, c in zip((5, 20, 40), (INDIGO, TEAL, AMBER)):
        ax.plot(u, phi[t - 1], c=c, label=f'$t = {t}$')
    ax.set_xlabel('input position $u$'); ax.set_ylabel('$\\phi(t, u)$')
    ax.set_title('three steps')
    ax.set_ylim(-0.05, 2.45)
    ax.legend(frameon=False, loc='upper right', fontsize=7)
    save(fig, 'n15_window')


def fig_reinforce():
    """Single-batch REINFORCE estimates with and without a baseline on a five-location glimpse task."""
    rng = np.random.default_rng(3)
    theta = np.array([0.4, 0.0, -0.2, 0.1, 0.3])
    pi = softmax(theta)
    target = 1
    def reward(a):
        return 10.0 + (a == target)
    true = pi[target] * ((np.arange(5) == target) - pi) * 1.0  # gradient of E[R] = 10 + pi_target
    M, reps = 8, 20000
    est = {False: [], True: []}
    for _ in range(reps):
        a = rng.choice(5, size=M, p=pi)
        R = reward(a)
        score = (np.eye(5)[a] - pi)          # grad of log pi(a) w.r.t. theta for a softmax policy
        for use_b in (False, True):
            b = 10.0 + pi[target] if use_b else 0.0
            g = ((R - b)[:, None] * score).mean(0)
            est[use_b].append(g[target])
    e0, e1 = np.array(est[False]), np.array(est[True])
    print(f'   true {true[target]:.4f}; mean without/with baseline {e0.mean():.4f} / {e1.mean():.4f}; '
          f'std {e0.std():.3f} / {e1.std():.3f}')
    fig, axes = plt.subplots(1, 2, figsize=(6.4, 2.0))
    for ax, e, title, c in ((axes[0], e0, 'no baseline', CORAL), (axes[1], e1, 'baseline $b = \\mathbb{E}[R]$', INDIGO)):
        vals, counts = np.unique(np.round(e, 6), return_counts=True)
        ax.vlines(vals, 0, counts / counts.sum(), color=c, lw=2.0)
        ax.axvline(true[target], c='k', lw=1.0, ls='--')
        ax.set_title(f'{title}: std {e.std():.2f}')
        ax.set_xlabel('estimate of $\\partial J/\\partial\\theta_{2}$')
        ax.set_ylabel('frequency')
    save(fig, 'n15_reinforce')


def posenc(T, d):
    pos = np.arange(T)[:, None]
    i = np.arange(d // 2)[None, :]
    ang = pos / 10000 ** (2 * i / d)
    P = np.zeros((T, d))
    P[:, 0::2] = np.sin(ang); P[:, 1::2] = np.cos(ang)
    return P


def fig_posenc():
    """Sinusoidal positional encodings and the dot product between two positions."""
    T, d = 64, 32
    P = posenc(128, d)
    fig, axes = plt.subplots(1, 2, figsize=(6.4, 2.15), gridspec_kw=dict(width_ratios=[1.2, 1], wspace=0.5))
    ax = axes[0]
    im = ax.imshow(P[:T].T, aspect='auto', origin='lower', cmap='RdBu_r', vmin=-1, vmax=1,
                   extent=(-0.5, T - 0.5, -0.5, d - 0.5))
    ax.set_xlabel('position $t$'); ax.set_ylabel('component')
    ax.set_title('$\\mathbf{p}_t$, $d = 32$')
    cb = fig.colorbar(im, ax=ax, fraction=0.05, pad=0.02); cb.ax.tick_params(labelsize=7)
    ax = axes[1]
    ks = np.arange(-40, 41)
    for t0, c in zip((40, 60, 80), (INDIGO, TEAL, AMBER)):
        ax.plot(ks, [P[t0] @ P[t0 + k] for k in ks], c=c, lw=1.0, label=f'$t = {t0}$')
    spread = max(np.ptp([P[t0] @ P[t0 + k] for t0 in (40, 60, 80)]) for k in ks)
    print(f'   max spread of p_t . p_(t+k) over t: {spread:.2e}')
    ax.set_xlabel('offset $k$'); ax.set_ylabel('$\\mathbf{p}_t^{\\mathsf{T}}\\mathbf{p}_{t+k}$')
    ax.set_title('depends on $k$ only')
    ax.legend(frameon=False, loc='lower center', fontsize=7)
    save(fig, 'n15_posenc')


if __name__ == '__main__':
    fig_scaling()
    fig_window()
    fig_reinforce()
    fig_posenc()
