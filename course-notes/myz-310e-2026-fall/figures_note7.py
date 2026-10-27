"""
Extra figures for lecture note 7 (optimisation). Run from this folder:

    python3 figures_note7.py      # writes figures/n7_*.pdf

Uses the colours, rcParams and save() helper of figures.py.
"""
import math

from figures import *  # noqa: F401,F403  (np, plt, colours, save)


def fig_steps_1d():
    """Gradient descent on J(θ) = (θ − 3)² from θ = 0 with a stable, an oscillating and a diverging step size."""
    dJ = lambda t: 2.0 * (t - 3.0)
    cases = [(0.1, 'stable, $\\eta=0.1$ (factor $0.8$)', TEAL, 'o'),
             (0.75, 'oscillating, $\\eta=0.75$ (factor $-0.5$)', AMBER, 's'),
             (1.1, 'diverging, $\\eta=1.1$ (factor $-1.2$)', CORAL, '^')]
    fig, ax = plt.subplots(figsize=(3.9, 2.0))
    ax.axhline(3, c=GREY, lw=0.6, ls=':', label='minimum $\\theta^*=3$')
    for eta, label, c, m in cases:
        t, path = 0.0, [0.0]
        for _ in range(5):
            t = t - eta * dJ(t)
            path.append(t)
        path = np.array(path)
        ax.plot(np.arange(len(path)), path, '-' + m, c=c, ms=3.2, lw=0.9, label=label)
        print(f'   eta={eta}: path {np.round(path, 5)}')
    ax.set_xlabel('step $t$'); ax.set_ylabel('$\\theta_t$')
    ax.set_xlim(-0.2, 5.6); ax.set_ylim(-4.5, 11.5)
    ax.legend(frameon=False, fontsize=7.5, loc='center left', bbox_to_anchor=(1.0, 0.5))
    save(fig, 'n7_steps_1d')


def fig_quartic():
    """Landscape J = θ1⁴/4 − θ1θ2 + θ2²/2 with two minima and a saddle; gradient-descent and Newton paths."""
    J = lambda a, b: a ** 4 / 4 - a * b + b ** 2 / 2
    g = lambda t: np.array([t[0] ** 3 - t[1], -t[0] + t[1]])
    H = lambda t: np.array([[3 * t[0] ** 2, -1.0], [-1.0, 1.0]])
    fig, ax = plt.subplots(figsize=(3.7, 2.75))
    gx, gy = np.meshgrid(np.linspace(-2.2, 2.4, 400), np.linspace(-1.9, 1.9, 400))
    ax.contour(gx, gy, J(gx, gy), levels=[-0.24, -0.2, -0.1, 0.0, 0.2, 0.5, 1.0, 2.0, 3.5, 5.5],
               colors=INDIGO, linewidths=0.45, alpha=0.55)
    # non-convex strip |θ1| < 1/sqrt(3)
    s = 1 / math.sqrt(3)
    ax.axvspan(-s, s, color=GREY, alpha=0.12, lw=0)
    # gradient descent, eta = 0.1, from (2, 1) and from (-0.1, -1.5)
    for start, c, lab in (((2.0, 1.0), TEAL, 'gradient descent, $\\eta=0.1$'), ((-0.1, -1.5), TEAL, None)):
        t = np.array(start); path = [t.copy()]
        for _ in range(60):
            t = t - 0.1 * g(t); path.append(t.copy())
        path = np.array(path)
        ax.plot(*path.T, '-o', c=c, ms=1.8, lw=0.8, label=lab)
        print(f'   GD from {start}: first steps {np.round(path[:3], 4).tolist()}, end {np.round(path[-1], 4)}')
    # Newton from (2, 1) and from (0.3, 0.5)
    for start, lab, sty in (((2.0, 1.0), "Newton from $(2,1)$", '--s'), ((0.3, 0.5), "Newton from $(0.3,0.5)$: saddle", ':^')):
        t = np.array(start); path = [t.copy()]
        for _ in range(8):
            t = t - np.linalg.solve(H(t), g(t)); path.append(t.copy())
        path = np.array(path)
        ax.plot(*path.T, sty, c=AMBER, ms=2.6, lw=0.9, label=lab)
        print(f'   Newton from {start}: {np.round(path[:4], 4).tolist()}, end {np.round(path[-1], 6)}')
    ax.plot([1, -1], [1, -1], '*', c='k', ms=7)
    ax.plot([0], [0], 'x', c=CORAL, ms=6, mew=1.4)
    box = dict(boxstyle='round,pad=0.15', fc='white', ec='none', alpha=0.85)
    ax.annotate('minimum', (1, 1), textcoords='offset points', xytext=(-40, 9), fontsize=7, bbox=box)
    ax.annotate('minimum', (-1, -1), textcoords='offset points', xytext=(-14, -15), fontsize=7, bbox=box)
    ax.annotate('saddle', (0, 0), textcoords='offset points', xytext=(-30, -9), fontsize=7, color=CORAL)
    ax.set_xlabel('$\\theta_1$'); ax.set_ylabel('$\\theta_2$')
    ax.set_xlim(-2.2, 2.4); ax.set_ylim(-1.9, 1.9)
    ax.legend(frameon=False, fontsize=7, loc='lower center', bbox_to_anchor=(0.5, 1.0), ncol=2, handlelength=2.0)
    save(fig, 'n7_quartic')


def fig_nonconvex():
    """Gradient descent from three starts on a 1-D non-convex function: three different local minima."""
    x = np.linspace(-3, 3.2, 600)
    f = lambda x: 0.12 * x ** 4 - 0.5 * x ** 2 + 0.25 * np.sin(5 * x) + 0.3 * x
    df = lambda x: 0.48 * x ** 3 - x + 1.25 * np.cos(5 * x) + 0.3
    fig, ax = plt.subplots(figsize=(3.4, 1.9))
    ax.plot(x, f(x), c=INDIGO)
    for x0, c in ((-2.8, AMBER), (0.0, TEAL), (2.9, CORAL)):
        t = x0; path = [t]
        for _ in range(200):
            t -= 0.02 * df(t); path.append(t)
        path = np.array(path)
        ax.plot(path[::8], f(path[::8]), 'o', c=c, ms=2.5)
        ax.plot(path[-1], f(path[-1]), 'o', c=c, ms=6, mfc='white', mew=1.4)
        print(f'   nonconvex start {x0}: end {path[-1]:.3f}, J {f(path[-1]):.3f}')
    # all local minima on the plotted range
    fx = f(x); mins = x[1:-1][(fx[1:-1] < fx[:-2]) & (fx[1:-1] < fx[2:])]
    print('   local minima on grid:', np.round(mins, 3), 'values', np.round(f(mins), 3))
    ax.set_xticks([]); ax.set_yticks([]); ax.set_xlabel('$\\theta$'); ax.set_ylabel('$J(\\theta)$')
    save(fig, 'n7_nonconvex')


def schedules(t, eta_max=0.1, T=1000, warm=100, t0=100, drop=400):
    t = np.asarray(t, dtype=float)
    inv = eta_max * t0 / (t0 + t)
    step = eta_max * 0.1 ** np.floor(t / drop)
    cos = np.where(t < warm, eta_max * (t + 1) / warm,
                   eta_max * 0.5 * (1 + np.cos(np.pi * np.clip(t - warm, 0, None) / (T - warm))))
    return inv, step, cos


def table_schedules():
    """Print the learning-rate schedule table of Section 3.3 (no figure)."""
    for tt in (0, 50, 100, 325, 550, 775, 1000):
        a, b, c = schedules(tt)
        print(f'   t={tt}: 1/t {float(a):.4f}  step {float(b):.4f}  cosine {float(c):.4f}')


if __name__ == '__main__':
    for f in (fig_steps_1d, fig_quartic, fig_nonconvex, table_schedules):
        f()
