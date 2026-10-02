/**
 * Static "plates": deterministic SVG drawings generated at build time from the same
 * geometry as the WebGL journey. Used on the research page and as the no-WebGL fallback.
 * Decorative and schematic — they illustrate ideas, not data.
 */
import { gaussian, mulberry32, smoothstep } from '../scripts/journey/math';

export type PlateName = 'spacetime' | 'cosmos' | 'manifold' | 'circuit' | 'waves';
export const plateNames: readonly PlateName[] = ['spacetime', 'cosmos', 'manifold', 'circuit', 'waves'];

type ColorKey = 'ink' | 'dim' | 'gold' | 'cold' | 'neutral' | 'hot' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'coral';
const palettes: Record<'dark' | 'light', Record<ColorKey, string>> = {
  dark: { ink: '#8fb0ff', dim: '#4b5577', gold: '#f2c46d', cold: '#4a78ff', neutral: '#d6cdee', hot: '#ff8a4d', c1: '#66e5d6', c2: '#f7c466', c3: '#ff8075', c4: '#a894ff', c5: '#94e680', coral: '#ff9a75' },
  light: { ink: '#22386f', dim: '#8a8fa6', gold: '#9a6100', cold: '#1b4fc4', neutral: '#6b6680', hot: '#c4501a', c1: '#00796f', c2: '#9a6a00', c3: '#c13b30', c4: '#5a45cc', c5: '#3a7f2a', coral: '#b24a26' },
};

export type PlateMode = 'vars' | 'dark' | 'light';
const W = 600, H = 420;
const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

function colorFor(mode: PlateMode) {
  return (key: ColorKey) => (mode === 'vars' ? `var(--plate-${key})` : palettes[mode][key]);
}

function projector(yaw: number, pitch: number, dist: number, focal: number, cx: number, cy: number, ty = 0) {
  const sp = Math.sin(pitch), cp = Math.cos(pitch), sy = Math.sin(yaw), cy0 = Math.cos(yaw);
  const ex = 0, ey = ty + dist * sp, ez = dist * cp;
  return (x: number, y: number, z: number) => {
    const rx = cy0 * x - sy * z, rz = sy * x + cy0 * z;
    const vx = rx - ex, vy = y - ey, vz = rz - ez;
    const depth = vy * -sp + vz * -cp;
    const yv = vy * cp + vz * -sp;
    return [cx + (focal * vx) / depth, cy - (focal * yv) / depth, depth] as const;
  };
}

const well = (x: number, z: number) => -0.9 / Math.pow(1 + (x * x + z * z) / 0.28, 0.8);

function spacetime(c: (k: ColorKey) => string) {
  const project = projector(0, 0.55, 4.3, 520, W / 2, H * 0.44, -0.3);
  const height = (x: number, z: number) => {
    const r = Math.hypot(x, z), ph = Math.atan2(z, x);
    const env = smoothstep(0.16, 0.6, r) * Math.exp(-r * 0.42);
    return well(x, z) + 0.08 * env * Math.cos(2 * ph + (2 * 0.8 * r) / 0.22);
  };
  const lines: string[] = [];
  const N = 23, S = 48, E = 2.2;
  for (let dir = 0; dir < 2; dir++) {
    for (let i = 0; i < N; i++) {
      const fixed = -E + (2 * E * i) / (N - 1);
      let d = '';
      for (let s = 0; s < S; s++) {
        const along = -E + (2 * E * s) / (S - 1);
        const x = dir ? fixed : along, z = dir ? along : fixed;
        const [px, py] = project(x, height(x, z), z);
        d += `${s ? 'L' : 'M'}${f1(px)} ${f1(py)}`;
      }
      lines.push(`<path d="${d}"/>`);
    }
  }
  const orbs = [0, Math.PI].map((a) => project(Math.cos(a + 0.6) * 0.19, well(0, 0) + 0.07, Math.sin(a + 0.6) * 0.19));
  return `<defs><radialGradient id="st-fade" cx="50%" cy="46%" r="58%"><stop offset="0" stop-color="#fff"/><stop offset="0.7" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="st-mask"><rect width="${W}" height="${H}" fill="url(#st-fade)"/></mask><radialGradient id="st-orb"><stop offset="0" stop-color="${c('gold')}"/><stop offset="0.35" stop-color="${c('gold')}" stop-opacity="0.55"/><stop offset="1" stop-color="${c('gold')}" stop-opacity="0"/></radialGradient></defs>`
    + `<g mask="url(#st-mask)" fill="none" stroke="${c('ink')}" stroke-width="0.8" stroke-opacity="0.75">${lines.join('')}</g>`
    + orbs.map(([x, y]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="16" fill="url(#st-orb)"/><circle cx="${f1(x)}" cy="${f1(y)}" r="3.2" fill="${c('gold')}"/>`).join('');
}

function temperatureField(random: () => number) {
  const waves = Array.from({ length: 9 }, () => {
    const z = random() * 2 - 1, phi = random() * Math.PI * 2, s = Math.sqrt(1 - z * z);
    return { d: [s * Math.cos(phi), z, s * Math.sin(phi)], f: 2.2 + random() * 6.5, p: random() * Math.PI * 2, a: 0.5 + random() };
  });
  const total = waves.reduce((sum, w) => sum + w.a, 0);
  return (x: number, y: number, z: number) => {
    let v = 0;
    for (const w of waves) v += w.a * Math.sin(w.f * (x * w.d[0]! + y * w.d[1]! + z * w.d[2]!) + w.p);
    return Math.max(-1, Math.min(1, (v / total) * 2.4));
  };
}

function cosmos(c: (k: ColorKey) => string) {
  const random = mulberry32(7);
  const T = temperatureField(random);
  const R = 168, cx = W / 2, cy = H / 2;
  const n = 1100, golden = Math.PI * (3 - Math.sqrt(5));
  const dots: string[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), th = golden * i;
    const x = Math.cos(th) * r, z = Math.sin(th) * r;
    // rotate to a three-quarter view
    const a = 0.6, b = 0.32;
    const x1 = Math.cos(a) * x + Math.sin(a) * z, z1 = -Math.sin(a) * x + Math.cos(a) * z;
    const y2 = Math.cos(b) * y - Math.sin(b) * z1, z2 = Math.sin(b) * y + Math.cos(b) * z1;
    if (z2 < 0) continue;
    const t = T(x, y, z);
    const key: ColorKey = t < -0.15 ? 'cold' : t > 0.15 ? 'hot' : 'neutral';
    const strength = Math.min(1, Math.abs(t) * 1.4);
    const opacity = (key === 'neutral' ? 0.42 : 0.38 + 0.5 * strength) * (0.45 + 0.55 * z2);
    dots.push(`<circle cx="${f1(cx + x1 * R)}" cy="${f1(cy - y2 * R)}" r="${f1(1.2 + 1.5 * z2)}" fill="${c(key)}" fill-opacity="${(Math.round(opacity * 100) / 100).toString()}"/>`);
  }
  return `<defs><radialGradient id="cm-glow"><stop offset="0.6" stop-color="${c('neutral')}" stop-opacity="0.1"/><stop offset="1" stop-color="${c('neutral')}" stop-opacity="0"/></radialGradient></defs>`
    + `<circle cx="${cx}" cy="${cy}" r="${R + 34}" fill="url(#cm-glow)"/><circle cx="${cx}" cy="${cy}" r="${R + 3}" fill="none" stroke="${c('dim')}" stroke-opacity="0.55" stroke-width="0.8"/>`
    + `<ellipse cx="${cx}" cy="${cy}" rx="${R + 3}" ry="${f1((R + 3) * 0.32)}" fill="none" stroke="${c('dim')}" stroke-opacity="0.35" stroke-width="0.6" stroke-dasharray="2 5"/>`
    + dots.join('');
}

function manifold(c: (k: ColorKey) => string) {
  const random = mulberry32(11);
  const h = (x: number, z: number) => 0.24 * Math.sin(1.5 * x + 0.4) * Math.cos(1.25 * z - 0.3) - 0.0125 * (x * x + z * z);
  const project = projector(-0.5, 0.64, 4.4, 520, W / 2, H * 0.5, -0.08);
  const mesh: string[] = [];
  for (let dir = 0; dir < 2; dir++) {
    const count = dir ? 15 : 11;
    for (let i = 0; i < count; i++) {
      const fixed = dir ? -2 + (4 * i) / (count - 1) : -1.4 + (2.8 * i) / (count - 1);
      let d = '';
      for (let s = 0; s < 26; s++) {
        const along = dir ? -1.4 + (2.8 * s) / 25 : -2 + (4 * s) / 25;
        const x = dir ? fixed : along, z = dir ? along : fixed;
        const [px, py] = project(x, h(x, z), z);
        d += `${s ? 'L' : 'M'}${f1(px)} ${f1(py)}`;
      }
      mesh.push(`<path d="${d}"/>`);
    }
  }
  const keys: ColorKey[] = ['c1', 'c2', 'c3', 'c4', 'c5'];
  const centers = keys.map((_, k) => {
    const angle = (2 * Math.PI * k) / 5 + 0.45;
    return { x: 1.18 * Math.cos(angle), z: 0.78 * Math.sin(angle), rot: random() * Math.PI, major: 0.27, minor: 0.12 };
  });
  const dots: string[] = [];
  centers.forEach((center, k) => {
    for (let i = 0; i < 80; i++) {
      const g1 = gaussian(random) * center.major, g2 = gaussian(random) * center.minor;
      const x = center.x + g1 * Math.cos(center.rot) - g2 * Math.sin(center.rot);
      const z = center.z + g1 * Math.sin(center.rot) + g2 * Math.cos(center.rot);
      const [px, py, depth] = project(x, h(x, z) + gaussian(random) * 0.03, z);
      dots.push(`<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(2.6 * (4.4 / depth))}" fill="${c(keys[k]!)}" fill-opacity="0.82"/>`);
    }
  });
  return `<g fill="none" stroke="${c('dim')}" stroke-width="0.7" stroke-opacity="0.6">${mesh.join('')}</g>${dots.join('')}`;
}

function circuit(c: (k: ColorKey) => string) {
  const layers = [5, 8, 8, 8, 8, 4];
  const x0 = 70, x1 = 530, gap = 37;
  const pos = (l: number, i: number) => [x0 + ((x1 - x0) * l) / (layers.length - 1), H / 2 + (i - (layers[l]! - 1) / 2) * gap] as const;
  const random = mulberry32(5);
  const edges: string[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (let i = 0; i < layers[l]!; i++) {
      const targets = new Set([Math.round((i * (layers[l + 1]! - 1)) / (layers[l]! - 1))]);
      while (targets.size < 3) targets.add(Math.floor(random() * layers[l + 1]!));
      for (const t of targets) {
        const [ax, ay] = pos(l, i), [bx, by] = pos(l + 1, t);
        edges.push(`<path d="M${f1(ax)} ${f1(ay)}L${f1(bx)} ${f1(by)}"/>`);
      }
    }
  }
  const circuitEdges = [[0, 1, 1, 2], [1, 2, 2, 4], [0, 3, 1, 5], [1, 5, 2, 4], [2, 4, 3, 3], [3, 3, 4, 5], [4, 5, 5, 1]] as const;
  const onCircuit = new Set(circuitEdges.flatMap(([a, b, cc, d]) => [`${a}:${b}`, `${cc}:${d}`]));
  const flow: string[] = [];
  const traced = circuitEdges.map(([la, ia, lb, ib]) => {
    const [ax, ay] = pos(la, ia), [bx, by] = pos(lb, ib);
    for (let k = 1; k < 6; k++) {
      const t = k / 6 + (random() - 0.5) * 0.05;
      flow.push(`<circle cx="${f1(ax + (bx - ax) * t)}" cy="${f1(ay + (by - ay) * t)}" r="1.8" fill="${c('gold')}" fill-opacity="${f1(0.4 + 0.5 * t)}"/>`);
    }
    return `<path d="M${f1(ax)} ${f1(ay)}L${f1(bx)} ${f1(by)}"/>`;
  });
  const nodes: string[] = [];
  layers.forEach((count, l) => {
    for (let i = 0; i < count; i++) {
      const [x, y] = pos(l, i);
      const hot = onCircuit.has(`${l}:${i}`);
      nodes.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${hot ? 6 : 4.6}" fill="${hot ? c('gold') : 'none'}" stroke="${hot ? c('gold') : c('ink')}" stroke-width="1.2" stroke-opacity="${hot ? 1 : 0.65}"/>`);
    }
  });
  return `<g stroke="${c('ink')}" stroke-width="0.8" stroke-opacity="0.28">${edges.join('')}</g>`
    + `<g stroke="${c('gold')}" stroke-width="2" stroke-opacity="0.9" stroke-linecap="round">${traced.join('')}</g>${flow.join('')}${nodes.join('')}`;
}

function waves(c: (k: ColorKey) => string) {
  const random = mulberry32(3);
  const cx = W / 2, cy = H / 2, rings = [34, 70, 106, 142, 178, 214];
  const ring = rings.map((r, i) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c('coral')}" stroke-width="${f1(1.8 - i * 0.2)}" stroke-opacity="${f1(0.85 - i * 0.12)}"/>`).join('');
  const dots: string[] = [];
  for (let i = 0; i < 400; i++) {
    const r = Math.sqrt(0.02 + random() * 0.98) * 230, a = random() * Math.PI * 2;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a) * 0.86;
    if (y < 6 || y > H - 6) continue;
    const near = Math.min(...rings.map((rr) => Math.abs(rr - r)));
    const lit = Math.exp(-((near / 9) ** 2));
    dots.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.4 + 1.6 * lit)}" fill="${lit > 0.35 ? c('coral') : c('dim')}" fill-opacity="${f1(0.45 + 0.5 * lit)}"/>`);
  }
  return `<defs><radialGradient id="wv-src"><stop offset="0" stop-color="${c('gold')}"/><stop offset="1" stop-color="${c('gold')}" stop-opacity="0"/></radialGradient></defs>${ring}${dots.join('')}<circle cx="${cx}" cy="${cy}" r="20" fill="url(#wv-src)"/><circle cx="${cx}" cy="${cy}" r="4" fill="${c('gold')}"/>`;
}

const builders: Record<PlateName, (c: (k: ColorKey) => string) => string> = { spacetime, cosmos, manifold, circuit, waves };

/** Full SVG markup. `vars` mode uses CSS custom properties so inline plates follow the theme. */
export function plateSvg(name: PlateName, mode: PlateMode = 'vars', idPrefix = ''): string {
  let body = builders[name](colorFor(mode));
  if (idPrefix) body = body.replace(/id="([a-z-]+)"/g, `id="${idPrefix}$1"`).replace(/url\(#([a-z-]+)\)/g, `url(#${idPrefix}$1)`);
  const attributes = mode === 'vars' ? ' aria-hidden="true" focusable="false"' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"${attributes}>${body}</svg>`;
}
