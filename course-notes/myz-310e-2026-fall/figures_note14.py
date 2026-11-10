"""
Figures for MYZ 310E lecture note 14 (recurrent networks). Uses the shared helpers of figures.py.

    python3 figures_note14.py     # writes figures/n14_*.pdf
"""
from figures import *


# ---------------------------------------------------------------- helpers
def tanh_rnn_backward_norms(d, g, T, rng, orth=False, input_scale=0.5):
    """Norm of d(q.h_T)/dh_{T-k}, k = 0..T-1, for a random tanh RNN driven by random +-1 inputs."""
    if orth:
        Q, _ = np.linalg.qr(rng.standard_normal((d, d)))
        W = g * Q
    else:
        W = g * rng.standard_normal((d, d)) / np.sqrt(d)
    U = input_scale * rng.standard_normal(d)
    x = rng.choice([-1.0, 1.0], T)
    h = np.zeros(d)
    hs = []
    for t in range(T):
        h = np.tanh(W @ h + U * x[t])
        hs.append(h)
    v = rng.standard_normal(d)
    v /= np.linalg.norm(v)
    gr, norms = v.copy(), [1.0]
    for k in range(1, T):
        gr = W.T @ ((1 - hs[T - k] ** 2) * gr)      # one step of the BPTT recursion
        norms.append(np.linalg.norm(gr))
    return np.array(norms)


def sigmoid(a):
    return 1 / (1 + np.exp(-a))


def lstm_backward_norms(d, bf, T, rng, input_scale=1.0):
    """Norm of d(q.c_T)/dc_{T-k} (all paths) for a random LSTM with forget-gate bias bf."""
    Wg = rng.standard_normal((4, d, d)) / np.sqrt(d)         # recurrent weights of i, f, o, c~
    Ug = input_scale * rng.standard_normal((4, d))
    b = np.zeros((4, d))
    b[1] = bf
    x = rng.choice([-1.0, 1.0], T)
    h, c = np.zeros(d), np.zeros(d)
    cache = []
    for t in range(T):
        a = Wg @ h + Ug * x[t] + b
        i, f, o, cc = sigmoid(a[0]), sigmoid(a[1]), sigmoid(a[2]), np.tanh(a[3])
        c_prev = c
        c = f * c_prev + i * cc
        tc = np.tanh(c)
        h = o * tc
        cache.append((i, f, o, cc, c_prev, tc))
    v = rng.standard_normal(d)
    v /= np.linalg.norm(v)
    gc, gh = v.copy(), np.zeros(d)          # gradients w.r.t. c_t and h_t of v.c_T
    norms = [1.0]
    for k in range(T - 1):
        i, f, o, cc, c_prev, tc = cache[T - 1 - k]
        gc_tot = gc + gh * o * (1 - tc ** 2)               # total gradient on c_t
        ga = np.stack([gc_tot * cc * i * (1 - i),           # through i
                       gc_tot * c_prev * f * (1 - f),       # through f
                       gh * tc * o * (1 - o),               # through o
                       gc_tot * i * (1 - cc ** 2)])         # through c~
        gh = np.einsum('gij,gi->j', Wg, ga)                 # to h_{t-1}
        gc = gc_tot * f                                     # to c_{t-1}: the additive path
        # norm of the total gradient on c_{t-1}, including the path through h_{t-1}
        i2, f2, o2, cc2, cp2, tc2 = cache[T - 2 - k]
        norms.append(np.linalg.norm(gc + gh * o2 * (1 - tc2 ** 2)))
    return np.array(norms)


def median_curve(fun, trials, seed):
    rng = np.random.default_rng(seed)
    runs = np.array([fun(rng) for _ in range(trials)])
    return np.exp(np.median(np.log(runs), axis=0))


# ---------------------------------------------------------------- figure 1: gradients through time
def fig_gradnorm():
    d, T, trials = 64, 101, 20
    k = np.arange(T)
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 2.6), sharey=True)
    fig.subplots_adjust(wspace=0.45)
    ax = axes[0]
    cols = [TEAL, INDIGO, AMBER, CORAL]
    for g, c in zip([0.8, 1.0, 1.5, 3.0], cols):
        r = median_curve(lambda rng: tanh_rnn_backward_norms(d, g, T, rng), trials, 14)
        ax.semilogy(k, r, c=c, label=rf'$\sigma_w = {g}$')
        print(f'  tanh RNN g={g}: k=10 {r[10]:.3g}, k=50 {r[50]:.3g}, k=100 {r[100]:.3g}')
    r = median_curve(lambda rng: tanh_rnn_backward_norms(d, 1.0, T, rng, orth=True), trials, 14)
    print(f'  tanh RNN orthogonal: k=10 {r[10]:.3g}, k=50 {r[50]:.3g}, k=100 {r[100]:.3g}')
    ax.semilogy(k, r, c=GREY, ls='--', label='orthogonal $W$')
    ax.set_title('Vanilla tanh RNN')
    ax.set_xlabel('time gap $k$')
    ax.set_ylabel(r'$\|\partial(\mathbf{q}^{\mathsf{T}}\mathbf{h}_T)/\partial\mathbf{h}_{T-k}\|$')
    ax.legend(frameon=False, loc='lower left', fontsize=7)
    ax = axes[1]
    for bf, c in zip([0, 1, 3, 5], [CORAL, AMBER, INDIGO, TEAL]):
        r = median_curve(lambda rng: lstm_backward_norms(d, bf, T, rng), trials, 15)
        ax.semilogy(k, r, c=c, label=f'$b_f = {bf}$')
        print(f'  LSTM bf={bf}: k=10 {r[10]:.3g}, k=50 {r[50]:.3g}, k=100 {r[100]:.3g}')
    ax.set_title('LSTM cell state')
    ax.set_xlabel('time gap $k$')
    ax.set_ylabel(r'$\|\partial(\mathbf{q}^{\mathsf{T}}\mathbf{c}_T)/\partial\mathbf{c}_{T-k}\|$')
    ax.tick_params(labelleft=True)
    ax.legend(frameon=False, loc='lower left', fontsize=7)
    for ax in axes:
        ax.set_ylim(1e-22, 1e13)
        ax.set_xlim(0, 100)
    save(fig, 'n14_gradnorm')


# ---------------------------------------------------------------- figure 2: an RNN as a dynamical system
def lyapunov(d, g, rng, T=600, burn=200, input_scale=0.0):
    W = g * rng.standard_normal((d, d)) / np.sqrt(d)
    U = input_scale * rng.standard_normal(d)
    h = 0.5 * rng.standard_normal(d)
    u = rng.standard_normal(d)
    u /= np.linalg.norm(u)
    s = 0.0
    for t in range(T):
        h = np.tanh(W @ h + U * rng.choice([-1.0, 1.0]))
        u = (1 - h ** 2) * (W @ u)                          # tangent vector, one Jacobian step
        n = np.linalg.norm(u)
        u /= n
        if t >= burn:
            s += np.log(n)
    return s / (T - burn)


def fig_dynamics():
    fig, axes = plt.subplots(1, 3, figsize=(7.0, 2.2))
    fig.subplots_adjust(wspace=0.55)
    th = np.pi / 6
    R = np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]])
    starts = [(0.9, 0.0), (-0.6, 0.7), (0.05, -0.05)]
    for ax, s, title in [(axes[0], 0.9, r'$W = 0.9\,R_{30^\circ}$'), (axes[1], 1.4, r'$W = 1.4\,R_{30^\circ}$')]:
        for (a, b), c in zip(starts, [INDIGO, AMBER, TEAL]):
            h = np.array([a, b])
            traj = [h]
            for t in range(60):
                h = np.tanh(s * R @ h)
                traj.append(h)
            traj = np.array(traj)
            ax.plot(traj[:, 0], traj[:, 1], '-', c=c, lw=0.8, alpha=0.9)
            ax.plot(traj[:, 0], traj[:, 1], 'o', c=c, ms=1.8)
        ax.set_xlim(-1, 1)
        ax.set_ylim(-1, 1)
        ax.set_aspect('equal')
        ax.set_title(title + ', no input')
        ax.set_xlabel('$h_1$')
        ax.set_ylabel('$h_2$')
    ax = axes[2]
    gs = np.linspace(0.4, 3.0, 27)
    for inp, c, lab in [(0.0, INDIGO, 'no input'), (0.5, AMBER, 'random inputs')]:
        lam = [np.mean([lyapunov(64, g, np.random.default_rng(100 + j), input_scale=inp) for j in range(5)])
               for g in gs]
        ax.plot(gs, lam, 'o-', c=c, ms=2.5, label=lab)
        lam = np.array(lam)
        print(f'  Lyapunov ({lab}):', ' '.join(f'{g:.1f}:{l:.3f}' for g, l in zip(gs, lam)))
    ax.axhline(0, c=GREY, lw=0.6)
    ax.set_xlabel(r'gain $\sigma_w$')
    ax.set_ylabel(r'Lyapunov exponent $\lambda$')
    ax.set_title('Random tanh RNN, $d = 64$')
    ax.legend(frameon=False, fontsize=7, loc='lower right')
    save(fig, 'n14_dynamics')


if __name__ == '__main__':
    fig_gradnorm()
    fig_dynamics()
