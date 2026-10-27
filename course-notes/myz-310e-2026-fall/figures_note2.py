"""
Extra figures for lecture note 2 (probability and the Gaussian). Run from this folder:

    python3 figures_note2.py      # writes figures/n2_*.pdf

All numbers match the worked examples of the note.
"""
from figures import *  # noqa: F401,F403  (colours, rcParams, save, numpy, matplotlib)


def fig_categorical():
    """Worked example of Section 2: counts (12, 30, 8) -> estimates and the inverse-c.d.f. sampler."""
    counts = np.array([12, 30, 8])
    pi = counts / counts.sum()
    cum = np.cumsum(pi)
    fig, axes = plt.subplots(1, 2, figsize=(6.2, 1.95), gridspec_kw=dict(width_ratios=[1, 1.35]))
    ax = axes[0]
    ax.bar([0, 1, 2], pi, width=0.55, color=INDIGO, alpha=0.85)
    for k in range(3):
        ax.text(k, pi[k] + 0.02, f'$\\hat\\pi_{k}={pi[k]:.2f}$', ha='center', va='bottom', fontsize=8)
    ax.set_xticks([0, 1, 2]); ax.set_ylim(0, 0.78)
    ax.set_xlabel('number of jets $k$'); ax.set_ylabel('estimated probability')
    ax.set_title('Learned from counts $12, 30, 8$')
    ax = axes[1]
    xs = [-0.5, 0, 0, 1, 1, 2, 2, 2.9]
    ys = [0, 0, cum[0], cum[0], cum[1], cum[1], 1, 1]
    ax.plot(xs, ys, c=INDIGO)
    for u, c in ((0.10, TEAL), (0.55, AMBER), (0.90, CORAL)):
        k = int(np.searchsorted(cum, u, side='right'))
        ax.annotate('', xy=(k, u), xytext=(-0.5, u), arrowprops=dict(arrowstyle='->', color=c, lw=1.1))
        ax.plot([k, k], [u, 0], ls=':', c=c, lw=1.0)
        ax.text(-0.45, u + 0.025, f'$u={u:.2f}$', color=c, fontsize=8)
    box = dict(facecolor='white', edgecolor='none', pad=0.6)
    for k, v in enumerate(cum):        # above the step, except F(1), which would meet the u=0.90 arrow
        above = k != 1
        ax.text(k + 0.5, v + 0.035 if above else v - 0.035, f'$F({k})={v:.2f}$', fontsize=8, color=GREY,
                ha='center', va='bottom' if above else 'top', bbox=box)
    ax.set_xticks([0, 1, 2]); ax.set_xlim(-0.5, 2.9); ax.set_ylim(0, 1.2)
    ax.set_xlabel('$k$'); ax.set_ylabel('$F(k)=P(X\\leq k)$')
    ax.set_title('Sampling: first $k$ with $F(k)>u$')
    fig.tight_layout(w_pad=2.0)
    save(fig, 'n2_categorical')


def fig_example2d():
    """Worked examples of Section 4: mu=(1,2), Sigma=[[5,2],[2,2]]."""
    mu = np.array([1.0, 2.0])
    S = np.array([[5.0, 2.0], [2.0, 2.0]])
    vals, vecs = np.linalg.eigh(S)            # 1, 6
    fig, axes = plt.subplots(1, 2, figsize=(6.4, 2.75), gridspec_kw=dict(width_ratios=[1.15, 1]))
    ax = axes[0]
    ang = np.degrees(np.arctan2(vecs[1, 1], vecs[0, 1]))
    for k, ls in ((1, '-'), (2, '--')):
        ax.add_patch(Ellipse(mu, 2 * k * np.sqrt(vals[1]), 2 * k * np.sqrt(vals[0]), angle=ang, fill=False,
                             ec=INDIGO, lw=1.1, ls=ls))
    t = np.linspace(0, 2 * np.pi, 200)
    ax.plot(mu[0] + np.sqrt(5) * np.cos(t), mu[1] + np.sqrt(5) * np.sin(t), c=GREY, lw=0.8, ls=':')
    for i, c in zip((1, 0), (AMBER, TEAL)):
        # long axis drawn towards the lower left so that its head is not hidden under point A = (3, 3)
        v = vecs[:, i] * np.sign(vecs[0, i]) * np.sqrt(vals[i]) * (-1 if i == 1 else 1)
        ax.annotate('', xy=mu + v, xytext=mu, arrowprops=dict(arrowstyle='->', color=c, lw=1.1))
    ax.axhline(3, c=TEAL, lw=0.8, ls='-.')
    ax.text(-4.3, 3.15, '$x_2=3$', color=TEAL, fontsize=8)
    ax.plot(*mu, 'o', c=INDIGO, ms=3.5)
    ax.text(mu[0] - 0.25, mu[1] - 0.55, '$\\mu$', fontsize=9, color=INDIGO)
    for p, name, off in (((3, 3), 'A', (0.2, 0.2)), ((2, 0), 'B', (0.18, -0.35))):
        ax.plot(*p, 's', c=CORAL, ms=4.5, zorder=5)
        ax.text(p[0] + off[0], p[1] + off[1], name, color=CORAL, fontsize=9)
    ax.set_xlim(-4.5, 6.5); ax.set_ylim(-1.8, 5.8); ax.set_aspect('equal')
    ax.set_xlabel('$x_1$'); ax.set_ylabel('$x_2$')
    ax.set_title('Contours $\\Delta=1$ (solid), $\\Delta=2$ (dashed)')
    ax = axes[1]
    g = np.linspace(-6, 8, 400)
    for m, v, c, lab in ((1, 5, INDIGO, 'marginal $p(x_1)$: $\\mathcal{N}(1, 5)$'),
                         (2, 3, TEAL, '$p(x_1\\mid x_2=3)$: $\\mathcal{N}(2, 3)$')):
        ax.plot(g, np.exp(-(g - m) ** 2 / (2 * v)) / np.sqrt(2 * np.pi * v), c=c, label=lab)
    ax.set_xlabel('$x_1$'); ax.set_ylabel('density'); ax.set_ylim(0, 0.33)
    ax.legend(frameon=False, loc='upper left', fontsize=7.5)
    ax.set_title('Observing $x_2$ shifts and narrows $x_1$')
    fig.tight_layout(w_pad=1.5)
    save(fig, 'n2_example2d')


if __name__ == '__main__':
    for f in (fig_categorical, fig_example2d):
        f()
