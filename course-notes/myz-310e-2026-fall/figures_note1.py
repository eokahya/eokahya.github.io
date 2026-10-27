"""
Extra figure for lecture note 1 (MYZ 310E). Uses the shared style and helpers of figures.py.

    python3 figures_note1.py      # writes figures/n1_*.pdf
"""
import numpy as np

from figures import *  # noqa: F401,F403  (plt, colours, save)


def fig_distances_cosine():
    """Left: the three points of the worked distance example. Right: Euclidean distance versus cosine."""
    fig, axes = plt.subplots(1, 2, figsize=(6.4, 2.55))

    # Left panel: x1=(1,2), x2=(4,6), x3=(2,0) with squared distances on the segments.
    ax = axes[0]
    P = np.array([[1, 2], [4, 6], [2, 0]], float)
    sq = lambda i, j: int(((P[i] - P[j]) ** 2).sum())
    for (i, j), off in (((0, 1), (-0.55, 0.15)), ((0, 2), (-0.6, -0.35)), ((1, 2), (0.45, -0.1))):
        ax.plot(*P[[i, j]].T, c=GREY, lw=1.0, zorder=1)
        mid = P[[i, j]].mean(0) + np.array(off)
        ax.text(*mid, f'{sq(i, j)}', fontsize=8.5, color=INDIGO, ha='center', va='center')
    ax.scatter(*P.T, s=26, c=AMBER, zorder=3)
    for k, off in enumerate(((-15, 6), (8, 6), (9, -4))):
        ax.annotate(f'$\\mathbf{{x}}_{k + 1}$', xy=P[k], xytext=off, textcoords='offset points',
                    fontsize=9, ha='center', va='center')
    ax.set_xlim(-0.5, 5.5); ax.set_ylim(-1.0, 7.0); ax.set_aspect('equal')
    ax.set_xlabel('$x[1]$'); ax.set_ylabel('$x[2]$')
    ax.set_title('Squared distances of three points')

    # Right panel: u, 3u and w. Euclidean: w is closer to u; cosine: 3u is more similar.
    ax = axes[1]
    u, w = np.array([1.0, 2.0]), np.array([2.0, 1.0])
    for v, c, lab, pos in ((3 * u, TEAL, '$3\\mathbf{u}$', (0.35, 0.0)), (u, INDIGO, '$\\mathbf{u}$', (-0.35, 0.05)),
                           (w, AMBER, '$\\mathbf{w}$', (0.3, -0.1))):
        ax.annotate('', xy=v, xytext=(0, 0), arrowprops=dict(arrowstyle='-|>', color=c, lw=1.4,
                                                              shrinkA=0, shrinkB=0, mutation_scale=9))
        ax.text(v[0] + pos[0], v[1] + pos[1], lab, color=c, fontsize=9, ha='center', va='center')
    ax.plot(*np.c_[u, w], c=GREY, lw=0.9, ls='--')
    ax.plot(*np.c_[u, 3 * u], c=GREY, lw=0.9, ls=':')
    ax.text(2.6, 0.55, '$\\|\\mathbf{u}-\\mathbf{w}\\| = 1.41$,  $\\cos = 0.80$', fontsize=8, ha='left', color=INDIGO)
    ax.text(3.35, 5.2, '$\\|\\mathbf{u}-3\\mathbf{u}\\| = 4.47$,  $\\cos = 1$', fontsize=8, ha='left', color=INDIGO)
    ax.set_xlim(-0.3, 7.6); ax.set_ylim(-0.3, 6.6); ax.set_aspect('equal')
    ax.set_xlabel('$x[1]$'); ax.set_ylabel('$x[2]$')
    ax.set_title('Distance or direction')
    fig.tight_layout(w_pad=0.5)
    save(fig, 'n1_distances_cosine')


if __name__ == '__main__':
    fig_distances_cosine()
