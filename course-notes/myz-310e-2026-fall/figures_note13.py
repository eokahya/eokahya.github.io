"""
Figures for MYZ 310E lecture note 13 (convolutional networks). Uses the shared helpers of figures.py.

    python3 figures_note13.py     # writes figures/n13_*.pdf
"""
from figures import *
from matplotlib.patches import Rectangle


def xcorr2(x, k, stride=1, pad=0):
    """Valid 2-D cross-correlation (the 'convolution' of deep-learning libraries)."""
    x = np.pad(x, pad)
    kh, kw = k.shape
    H = (x.shape[0] - kh) // stride + 1
    W = (x.shape[1] - kw) // stride + 1
    out = np.empty((H, W))
    for i in range(H):
        for j in range(W):
            out[i, j] = np.sum(x[i * stride:i * stride + kh, j * stride:j * stride + kw] * k)
    return out


def maxpool(a, m=2):
    H, W = a.shape[0] // m, a.shape[1] // m
    return a[:H * m, :W * m].reshape(H, m, W, m).max(axis=(1, 3))


def fig_connectivity():
    """Dense, locally connected and convolutional layers in one dimension."""
    n_in, n_out, k = 7, 5, 3
    xin = np.arange(n_in); xout = np.arange(n_out) + 1
    cols = [INDIGO, AMBER, TEAL]
    fig, axes = plt.subplots(1, 3, figsize=(6.8, 1.75))
    titles = ['fully connected: 35 weights', 'locally connected: 15 weights', 'convolutional: 3 shared weights']
    rng = np.random.default_rng(13)
    for ax, title, mode in zip(axes, titles, ['dense', 'local', 'conv']):
        for j, xo in enumerate(xout):
            srcs = range(n_in) if mode == 'dense' else range(j, j + k)
            for m, i in enumerate(srcs):
                if mode == 'dense':
                    c, lw = GREY, 0.5
                elif mode == 'local':
                    c, lw = plt.cm.Greys(0.35 + 0.6 * rng.random()), 0.9
                else:
                    c, lw = cols[m], 1.1
                ax.plot([xin[i], xo], [0, 1], color=c, lw=lw, zorder=1)
        ax.scatter(xin, np.zeros(n_in), s=42, c='white', edgecolors='k', linewidths=0.7, zorder=3)
        ax.scatter(xout, np.ones(n_out), s=42, c='white', edgecolors='k', linewidths=0.7, zorder=3)
        ax.set_title(title, fontsize=8.5)
        ax.set_xlim(-0.6, n_in - 0.4); ax.set_ylim(-0.25, 1.25); ax.axis('off')
    axes[0].text(-0.55, 0, 'input', fontsize=7, ha='right', va='center')
    axes[0].text(-0.55, 1, 'hidden', fontsize=7, ha='right', va='center')
    save(fig, 'n13_connectivity')


def test_image():
    """A 32 x 32 synthetic grey image: a bright bar, a disc and a diagonal stroke."""
    yy, xx = np.mgrid[0:32, 0:32]
    img = np.zeros((32, 32))
    img[6:26, 5:11] = 1.0                                         # vertical bar
    img[((xx - 22) ** 2 + (yy - 10) ** 2) <= 25] = 1.0             # disc
    img[(np.abs((xx - 14) - (yy - 18)) <= 1) & (yy >= 20) & (yy <= 29) & (xx >= 15)] = 1.0  # diagonal stroke
    return img


def fig_feature_maps():
    img = test_image()
    kv = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], float)    # responds to dark-to-bright, left to right
    kh = kv.T                                                      # dark-to-bright, top to bottom
    v = np.maximum(xcorr2(img, kv, pad=1), 0)
    h = np.maximum(xcorr2(img, kh, pad=1), 0)
    vp = maxpool(v, 2)
    shifted = np.roll(img, (3, 4), axis=(0, 1)); shifted[:3, :] = 0; shifted[:, :4] = 0
    vs = np.maximum(xcorr2(shifted, kv, pad=1), 0)
    # equivariance check away from the borders
    err = np.abs(np.roll(v, (3, 4), axis=(0, 1))[4:-1, 5:-1] - vs[4:-1, 5:-1]).max()
    print(f'   equivariance check (max abs difference in the interior): {err:.2e}')
    panels = [(img, 'input\n$32 \\times 32$'), (v, 'map 1: ReLU of\nvertical-edge filter'), (h, 'map 2: ReLU of\nhorizontal-edge filter'),
              (vp, 'map 1 after\n$2 \\times 2$ max pooling'), (vs, 'map 1 of the input\nshifted by (3, 4)')]
    fig, axes = plt.subplots(1, 5, figsize=(6.8, 1.65))
    for ax, (a, t) in zip(axes, panels):
        ax.imshow(a, cmap='Greys', vmin=0, interpolation='nearest')
        ax.set_title(t, fontsize=7); ax.set_xticks([]); ax.set_yticks([])
        for s in ax.spines.values():
            s.set_visible(True); s.set_linewidth(0.4)
    save(fig, 'n13_feature_maps')


def glyph(n=28):
    """A synthetic hand-written-looking 'six': a ring and a curved stroke, blurred."""
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    r = np.hypot(xx - 14, yy - 18)
    ring = np.exp(-((r - 5.5) ** 2) / 2.0)
    t = np.linspace(0, 1, 200)
    sx = 9.0 + 2.0 * t + 6 * t ** 2; sy = 17 - 13 * t
    stroke = np.zeros((n, n))
    for a, b in zip(sx, sy):
        stroke = np.maximum(stroke, np.exp(-((xx - a) ** 2 + (yy - b) ** 2) / 2.0))
    return np.clip(np.maximum(ring, stroke) * 1.2, 0, 1)


def gaussian_blur(f, sigma):
    """Separable Gaussian smoothing with reflecting borders (pure numpy)."""
    rad = int(3 * sigma) + 1
    g = np.exp(-np.arange(-rad, rad + 1) ** 2 / (2 * sigma ** 2)); g /= g.sum()
    fp = np.pad(f, rad, mode='reflect')
    tmp = np.apply_along_axis(lambda v: np.convolve(v, g, mode='valid'), 1, fp)
    return np.apply_along_axis(lambda v: np.convolve(v, g, mode='valid'), 0, tmp)


def bilinear(img, X, Y):
    n0, n1 = img.shape
    X = np.clip(X, 0, n1 - 1.001); Y = np.clip(Y, 0, n0 - 1.001)
    x0 = np.floor(X).astype(int); y0 = np.floor(Y).astype(int); fx = X - x0; fy = Y - y0
    return ((1 - fx) * (1 - fy) * img[y0, x0] + fx * (1 - fy) * img[y0, x0 + 1]
            + (1 - fx) * fy * img[y0 + 1, x0] + fx * fy * img[y0 + 1, x0 + 1])


def elastic(img, alpha, sigma, rng):
    dx = rng.uniform(-1, 1, img.shape); dy = rng.uniform(-1, 1, img.shape)
    if sigma > 0:
        dx = gaussian_blur(dx, sigma); dy = gaussian_blur(dy, sigma)
    dx *= alpha; dy *= alpha
    yy, xx = np.mgrid[0:img.shape[0], 0:img.shape[1]].astype(float)
    return bilinear(img, xx + dx, yy + dy), dx, dy


def fig_elastic():
    img = glyph()
    cases = [('original', None), ('$\\sigma = 0.5$, $\\alpha = 2$', (2.0, 0.5)), ('$\\sigma = 4$, $\\alpha = 34$', (34.0, 4.0)),
             ('$\\sigma = 4$, $\\alpha = 34$, new draw', (34.0, 4.0)), ('$\\sigma = 8$, $\\alpha = 60$', (60.0, 8.0))]
    rng = np.random.default_rng(1303)
    fig, axes = plt.subplots(2, 5, figsize=(6.8, 2.9), gridspec_kw=dict(height_ratios=[1, 1]))
    yy, xx = np.mgrid[0:28:3, 0:28:3]
    for col, (title, par) in enumerate(cases):
        ax, axf = axes[0, col], axes[1, col]
        if par is None:
            out, dx, dy = img, np.zeros_like(img), np.zeros_like(img)
        else:
            out, dx, dy = elastic(img, par[0], par[1], rng)
            print(f'   {title}: max displacement {np.hypot(dx, dy).max():.2f} px, rms {np.sqrt((dx**2 + dy**2).mean()):.2f} px')
        ax.imshow(out, cmap='Greys', vmin=0, vmax=1, interpolation='bilinear')
        ax.set_title(title, fontsize=7.5); ax.set_xticks([]); ax.set_yticks([])
        axf.quiver(xx, yy, dx[::3, ::3], dy[::3, ::3], color=INDIGO, angles='xy', scale_units='xy', scale=1, width=0.012)
        axf.set_xlim(-2, 29); axf.set_ylim(29, -2); axf.set_aspect('equal'); axf.set_xticks([]); axf.set_yticks([])
        for s in list(ax.spines.values()) + list(axf.spines.values()):
            s.set_visible(True); s.set_linewidth(0.4)
    axes[1, 0].text(13.5, 13.5, 'no displacement', ha='center', va='center', fontsize=7, color=GREY)
    save(fig, 'n13_elastic')


def fig_dilated():
    """Causal dilated convolutions with kernel size 2 and dilations 1, 2, 4, 8 (receptive field 16)."""
    n = 20; dil = [1, 2, 4, 8]; L = len(dil)
    fig, ax = plt.subplots(figsize=(6.6, 2.15))
    names = ['input', 'hidden, $d = 1$', 'hidden, $d = 2$', 'hidden, $d = 4$', 'output, $d = 8$']
    for lev in range(L + 1):
        ax.scatter(np.arange(n), np.full(n, lev), s=20, c='white', edgecolors=GREY, linewidths=0.6, zorder=3)
        ax.text(-0.8, lev, names[lev], ha='right', va='center', fontsize=7.5)
    # connections that feed the last output unit
    active = {n - 1}
    for lev in range(L, 0, -1):
        d = dil[lev - 1]; new = set()
        for j in active:
            for src in (j, j - d):
                if src >= 0:
                    ax.plot([src, j], [lev - 1, lev], color=INDIGO, lw=1.0, zorder=2); new.add(src)
        for j in active:
            ax.scatter([j], [lev], s=26, c=INDIGO if lev < L else AMBER, edgecolors='k', linewidths=0.5, zorder=4)
        active = new
    ax.scatter(sorted(active), np.zeros(len(active)), s=26, c=TEAL, edgecolors='k', linewidths=0.5, zorder=4)
    print(f'   dilated stack: receptive field {len(active)} inputs, from {min(active)} to {max(active)}')
    ax.annotate('', xy=(min(active) - 0.3, -0.55), xytext=(max(active) + 0.3, -0.55),
                arrowprops=dict(arrowstyle='<->', color=TEAL, lw=0.8))
    ax.text((min(active) + max(active)) / 2, -0.85, f'receptive field: {len(active)} past samples', ha='center', fontsize=7.5,
            color=TEAL)
    ax.set_xlim(-6.5, n - 0.3); ax.set_ylim(-1.1, L + 0.4); ax.axis('off')
    save(fig, 'n13_dilated')


def tconv2(z, k, s):
    """2-D transposed convolution by scattering: each input value adds a scaled copy of k."""
    H = s * (z.shape[0] - 1) + k.shape[0]; W = s * (z.shape[1] - 1) + k.shape[1]
    out = np.zeros((H, W))
    for i in range(z.shape[0]):
        for j in range(z.shape[1]):
            out[i * s:i * s + k.shape[0], j * s:j * s + k.shape[1]] += z[i, j] * k
    return out


def fig_checkerboard():
    z = np.ones((8, 8))
    a = tconv2(z, np.ones((3, 3)), 2)[2:-2, 2:-2]
    b = tconv2(z, np.ones((4, 4)), 2)[3:-3, 3:-3]
    up = np.kron(z, np.ones((2, 2)))
    c = xcorr2(up, np.ones((3, 3)))[1:-1, 1:-1]
    print(f'   transposed k=3,s=2 interior values {sorted(set(a.ravel()))}; k=4,s=2 {sorted(set(b.ravel()))};'
          f' upsample+conv {sorted(set(c.ravel()))}')
    rng = np.random.default_rng(7)
    zr = 0.8 + 0.4 * rng.random((8, 8))
    ar = tconv2(zr, np.ones((3, 3)), 2)[2:-2, 2:-2]
    panels = [(a, 'transposed, $k = 3$, $s = 2$'), (b, 'transposed, $k = 4$, $s = 2$'), (c, 'nearest $\\times 2$, then $3 \\times 3$ conv'),
              (ar, '$k = 3$, $s = 2$, random input')]
    fig, axes = plt.subplots(1, 4, figsize=(6.8, 1.95))
    for ax, (m, t) in zip(axes, panels):
        im = ax.imshow(m / m.mean(), cmap='Greys_r', vmin=0, vmax=2.0, interpolation='nearest')
        ax.set_title(t, fontsize=7.5); ax.set_xticks([]); ax.set_yticks([])
    cb = fig.colorbar(im, ax=axes, fraction=0.025, pad=0.02); cb.ax.tick_params(labelsize=7)
    cb.set_label('value / mean', fontsize=7)
    save(fig, 'n13_checkerboard')


def fig_padding():
    """Valid, same and full padding for i = 6, k = 3, s = 1, and a strided case."""
    cases = [('valid: $p = 0$, $o = 4$', 6, 3, 1, 0), ('same: $p = 1$, $o = 6$', 6, 3, 1, 1),
             ('full: $p = 2$, $o = 8$', 6, 3, 1, 2), ('strided: $p = 1$, $s = 2$, $o = 3$', 6, 3, 2, 1)]
    for title, i, k, s, p in cases:
        assert f'$o = {(i + 2 * p - k) // s + 1}$' in title
    fig, axes = plt.subplots(2, 2, figsize=(6.4, 2.5))
    for ax, (title, i, k, s, p) in zip(axes.ravel(), cases):
        o = (i + 2 * p - k) // s + 1
        xs_in = np.arange(i + 2 * p) - p
        for x in xs_in:
            pad = x < 0 or x >= i
            ax.add_patch(Rectangle((x - 0.42, -0.42), 0.84, 0.84, fc='white' if pad else '#E3E6F5',
                                   ec=GREY if pad else INDIGO, ls='--' if pad else '-', lw=0.7))
            if pad:
                ax.text(x, 0, '0', ha='center', va='center', fontsize=8, color=GREY)
        off = (i - 1) / 2 - (o - 1) / 2
        for j in range(o):
            xo = off + j
            ax.add_patch(Rectangle((xo - 0.42, 1.38), 0.84, 0.84, fc='#D5ECE8', ec=TEAL, lw=0.7))
            if j == 0 or (s > 1 and j == 1):
                for m in range(k):
                    src = j * s + m - p
                    ax.plot([src, xo], [0.42, 1.38], color=AMBER if j == 0 else CORAL, lw=0.7)
        ax.set_xlim(-4.6, i + 2.6); ax.set_ylim(-0.6, 2.35); ax.set_aspect('equal'); ax.axis('off')
        ax.set_title(title, fontsize=8.5)
        ax.text(-4.5, 0, 'input', fontsize=7, va='center'); ax.text(-4.5, 1.8, 'output', fontsize=7, va='center')
    save(fig, 'n13_padding')


if __name__ == '__main__':
    fig_connectivity()
    fig_feature_maps()
    fig_elastic()
    fig_dilated()
    fig_checkerboard()
    fig_padding()
