"""
Extra figures for lecture note 9 (linear classifiers). Run from this folder:

    python3 figures_note9.py      # writes figures/n9_*.pdf

Uses the shared style, colours and save() of figures.py.
"""
from figures import *  # noqa: F401,F403  (np, plt, colours, save)
from matplotlib.patches import FancyArrowPatch

# The four-point dataset used in the perceptron trace and in the hand-solved SVM (Sections 3 and 5).
XB = np.array([(1, 2), (0, 0), (3, 1), (2, 0)], float)
TB = np.array([1, -1, 1, -1])


def perceptron_trace(X, t, epochs=10):
    """Cyclic perceptron from zero; returns the list of (w, b) after each update."""
    w = np.zeros(2); b = 0.0; hist = []
    for _ in range(epochs):
        mistakes = 0
        for i in range(len(X)):
            if t[i] * (w @ X[i] + b) <= 0:
                w = w + t[i] * X[i]; b += t[i]; hist.append((w.copy(), b)); mistakes += 1
        if mistakes == 0:
            break
    return hist


def draw_line(ax, w, b, xs, **kw):
    if abs(w[1]) > 1e-12:
        ax.plot(xs, -(w[0] * xs + b) / w[1], **kw)
    else:
        ax.axvline(-b / w[0], **kw)


def fig_losses():
    z = np.linspace(-2, 3, 501)
    fig, ax = plt.subplots(figsize=(4.4, 2.2))
    ax.plot(z, (z <= 0).astype(float), c='k', lw=1.2, label='0–1 (error rate)')
    ax.plot(z, np.maximum(0, -z), c=INDIGO, ls='-.', label='perceptron $\\max(0,-z)$')
    ax.plot(z, np.maximum(0, 1 - z), c=TEAL, label='hinge $\\max(0,1-z)$')
    ax.plot(z, np.log2(1 + np.exp(-z)), c=AMBER, ls='--', label='logistic $\\log_2(1+e^{-z})$')
    ax.plot(z, (1 - z) ** 2, c=CORAL, ls=':', lw=1.6, label='squared $(1-z)^2$')
    ax.set_xlim(-2, 3); ax.set_ylim(-0.1, 4); ax.set_xlabel('margin $z = t\\,g(\\mathbf{x})$'); ax.set_ylabel('loss')
    ax.axvline(0, c=GREY, lw=0.5)
    ax.legend(frameon=False, fontsize=7, loc='center left', bbox_to_anchor=(1.0, 0.5))
    save(fig, 'n9_losses')


def fig_perceptron():
    fig, axes = plt.subplots(1, 2, figsize=(6.2, 2.75))
    # (a) one update, no bias: w_new = w_old + x for a misclassified positive x
    ax = axes[0]
    w_old = np.array([1.5, -1.0]); x = np.array([1.0, 2.0]); w_new = w_old + x
    print('   update: w_old.x =', w_old @ x, ' w_new.x =', w_new @ x, ' |x|^2 =', x @ x)
    xs = np.linspace(-3, 3, 10)
    draw_line(ax, w_old, 0, xs, c=GREY, ls='--', lw=1)
    draw_line(ax, w_new, 0, xs, c='k', lw=1.1)
    for v, c, lab, off in ((w_old, GREY, '$\\mathbf{w}$', (0.12, -0.25)), (w_new, 'k', '$\\mathbf{w}+\\mathbf{x}_i$', (0.1, 0.05)),
                           (x, AMBER, '$\\mathbf{x}_i$', (-0.45, 0.1))):
        ax.add_patch(FancyArrowPatch((0, 0), v, arrowstyle='-|>', mutation_scale=9, color=c, lw=1.2))
        ax.text(v[0] + off[0], v[1] + off[1], lab, color=c, fontsize=8.5)
    ax.add_patch(FancyArrowPatch(w_old, w_new, arrowstyle='-|>', mutation_scale=8, color=AMBER, lw=0.8, ls=(0, (2, 2))))
    ax.scatter(*x, s=28, c=AMBER, zorder=5)
    # each label sits just beside its own line: old y = 1.5x, new y = -2.5x
    box = dict(boxstyle='square,pad=0.05', fc='white', ec='none')
    ax.text(-1.6, -2.75, 'old boundary', color=GREY, fontsize=7, ha='left', bbox=box)
    ax.text(-1.25, 2.55, 'new boundary', color='k', fontsize=7, ha='right', bbox=box)
    ax.set_xlim(-3, 3); ax.set_ylim(-3, 3); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
    ax.set_title('(a) one update on a misclassified $t_i = +1$')
    # (b) the boundaries of the worked trace
    ax = axes[1]
    hist = perceptron_trace(XB, TB)
    xs = np.linspace(-1.5, 4, 10)
    shades = [GREY] * (len(hist) - 1) + ['k']
    for k, ((w, b), c) in enumerate(zip(hist, shades), 1):
        print(f'   update {k}: w = {w}, b = {b}')
        draw_line(ax, w, b, xs, c=c, lw=1.4 if k == len(hist) else 0.8, ls='-' if k == len(hist) else (0, (3, 2)))
    lab = {1: 0.6, 2: -1.2, 3: 3.3, 4: 1.5, 5: 3.6}   # x-position of each label on its line
    for k, px in lab.items():
        w, b = hist[k - 1]; py = -(w[0] * px + b) / w[1]
        ax.text(px, py, str(k), fontsize=7.5, color=shades[k - 1], ha='center',
                bbox=dict(boxstyle='circle,pad=0.12', fc='white', ec=shades[k - 1], lw=0.5))
    ax.scatter(*XB[TB > 0].T, s=34, c=AMBER, zorder=5, label='$t=+1$')
    ax.scatter(*XB[TB < 0].T, s=34, c=INDIGO, marker='s', zorder=5, label='$t=-1$')
    for i, p in enumerate(XB):
        ax.text(p[0] + 0.1, p[1] + 0.12, f'$\\mathbf{{x}}_{i + 1}$', fontsize=8)
    ax.set_xlim(-1.5, 4); ax.set_ylim(-1.6, 3.3); ax.set_aspect('equal'); ax.set_xticks(range(-1, 5)); ax.set_yticks(range(0, 4))
    ax.set_title('(b) boundaries after updates 1–5')
    ax.legend(frameon=False, fontsize=7, loc='upper left', bbox_to_anchor=(0.0, 1.0))
    save(fig, 'n9_perceptron')


def fig_svm_example():
    w = np.array([2 / 3, 4 / 3]); b = -7 / 3
    fig, ax = plt.subplots(figsize=(3.0, 2.7))
    xs = np.linspace(-1, 4, 10)
    draw_line(ax, w, b, xs, c='k', lw=1.2, label='maximum margin')
    for off in (1, -1):
        draw_line(ax, w, b - off, xs, c=GREY, ls='--', lw=0.9)
    draw_line(ax, np.array([0, 3.0]), -1, xs, c=INDIGO, ls='-.', lw=1, label='perceptron (Table 1)')
    ax.scatter(*XB[TB > 0].T, s=34, c=AMBER, zorder=5)
    ax.scatter(*XB[TB < 0].T, s=34, c=INDIGO, marker='s', zorder=5)
    sv = np.abs(TB * (XB @ w + b) - 1) < 1e-9
    ax.scatter(*XB[sv].T, s=150, facecolors='none', edgecolors='k', lw=0.8, zorder=6)
    for i, p in enumerate(XB):
        off = (0.15, -0.38) if i == 3 else (0.14, 0.14)   # x4: below right, clear of the margin arrow
        ax.text(p[0] + off[0], p[1] + off[1], f'$\\mathbf{{x}}_{i + 1}$', fontsize=8)
    # margin arrow from x4 to its projection on g = +1
    foot = XB[3] + 2 * w / (w @ w)
    ax.add_patch(FancyArrowPatch(XB[3], foot, arrowstyle='<|-|>', mutation_scale=7, color=TEAL, lw=0.9))
    ax.text(2.62, 0.55, '$2/\\|\\mathbf{w}\\|$', color=TEAL, fontsize=8, bbox=dict(boxstyle='square,pad=0.05', fc='white', ec='none'))
    print('   support vectors:', np.where(sv)[0] + 1, ' margin width', 2 / np.linalg.norm(w), ' foot', foot)
    ax.set_xlim(-0.8, 4); ax.set_ylim(-0.8, 3.0); ax.set_aspect('equal'); ax.set_xticks(range(0, 5)); ax.set_yticks(range(0, 4))
    ax.legend(frameon=False, fontsize=6.5, loc='upper right')
    save(fig, 'n9_svm_example')


def fig_ovr():
    """Three classes, one-versus-rest with linear scores g_c(x) = u_c.x - theta (u_c unit vectors at 90, 210, 330 deg).
    (a) raw yes/no answers: regions claimed by exactly one, by two (ambiguous) or by none; (b) argmax of the scores."""
    ang = np.deg2rad([90, 210, 330]); U = np.c_[np.cos(ang), np.sin(ang)]; theta = 0.6
    cols = [INDIGO, AMBER, TEAL]
    g = np.linspace(-3, 3, 601); xx, yy = np.meshgrid(g, g); P = np.c_[xx.ravel(), yy.ravel()]
    S = P @ U.T - theta
    yes = S > 0; nyes = yes.sum(1); win = S.argmax(1)
    fig, axes = plt.subplots(1, 2, figsize=(5.6, 2.7))
    from matplotlib.colors import to_rgb
    light = [np.array(to_rgb(c)) * 0.28 + 0.72 for c in cols]
    for k, ax in enumerate(axes):
        img = np.ones((len(P), 3))
        if k == 0:
            for c in range(3):
                img[(nyes == 1) & yes[:, c]] = light[c]
            img[nyes >= 2] = (0.45, 0.46, 0.52)
            img[nyes == 0] = (1, 1, 1)
        else:
            for c in range(3):
                img[win == c] = light[c]
        ax.imshow(img.reshape(len(g), len(g), 3), origin='lower', extent=(-3, 3, -3, 3), interpolation='nearest')
        if k == 0:
            for c in range(3):   # the three lines g_c = 0
                u = U[c]; d = np.array([-u[1], u[0]]); p0 = theta * u
                pts = np.array([p0 - 6 * d, p0 + 6 * d]); ax.plot(pts[:, 0], pts[:, 1], c=cols[c], lw=1)
        for c in range(3):
            q = 1.9 * U[c]; ax.text(q[0], q[1], str(c + 1), color=cols[c], fontsize=10, ha='center', va='center', weight='bold')
        ax.set_xlim(-3, 3); ax.set_ylim(-3, 3); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
    for (c1, c2), a in (((1, 2), 150), ((1, 3), 30), ((2, 3), 270)):   # the three ambiguous wedges
        q = 2.45 * np.array([np.cos(np.deg2rad(a)), np.sin(np.deg2rad(a))])
        axes[0].text(q[0], q[1], f'{c1} and {c2}', fontsize=6.5, color='white', ha='center', va='center')
    axes[0].text(0, -0.05, 'none', fontsize=6.5, ha='center', va='center')
    axes[0].set_title('(a) one-versus-rest, yes/no answers')
    axes[1].set_title('(b) highest score $\\arg\\max_c\\, g_c(\\mathbf{x})$')
    n_amb = (nyes >= 2).mean(); n_none = (nyes == 0).mean()
    print(f'   fraction of the square: ambiguous {n_amb:.3f}, unclaimed {n_none:.3f}')
    save(fig, 'n9_ovr')


if __name__ == '__main__':
    import sys
    figs = {'losses': fig_losses, 'perceptron': fig_perceptron, 'svm_example': fig_svm_example, 'ovr': fig_ovr}
    for name in (sys.argv[1:] or figs):   # e.g. python3 figures_note9.py ovr
        figs[name]()
