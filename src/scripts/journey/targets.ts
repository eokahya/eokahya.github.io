/**
 * Builds the five particle configurations of the home-page journey.
 *
 * Every particle carries one target position per stage, so a scroll between two acts is
 * a genuine transformation of the same points rather than a cross-fade:
 *
 *   0 Spacetime   — a dotted fabric curved by a binary source that radiates ripples
 *   1 Cosmos      — the same fabric wrapped into a celestial sphere with mottled "temperature"
 *   2 Learning    — longitude wedges of the sphere condense into clusters on a curved manifold
 *   3 Mechanisms  — the points become a layered network with activations flowing along edges
 *   4 Waves       — concentric wavefronts spreading from a source through a field of listeners
 *
 * All shapes are schematic illustrations. Nothing here is a simulation or a measured model.
 */
import { gaussian, mulberry32 } from './math';

export const STAGE_COUNT = 5;
export const PALETTE_SIZE = 18;

/** Layer widths of the schematic network (stage 3). */
const LAYERS = [5, 8, 8, 8, 8, 4];
/** A small "circuit": two input paths that merge at one hidden unit and reach one output. */
const CIRCUIT: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, 1, 1, 2], [1, 2, 2, 4],
  [0, 3, 1, 5], [1, 5, 2, 4],
  [2, 4, 3, 3], [3, 3, 4, 5], [4, 5, 5, 1],
];
const ABLATED: readonly [number, number] = [2, 4];

export interface SceneData {
  count: number;
  p0: Float32Array; // vec3 — spacetime fabric (y is computed in the shader)
  p1: Float32Array; // vec4 — sphere position + temperature
  p2: Float32Array; // vec3 — representation manifold
  p3: Float32Array; // vec3 — network: node position or edge start
  p3b: Float32Array; // vec3 — network: edge end, or the node centre for node particles
  p4: Float32Array; // vec3 — waves: listener position, or (angle, ring, jitter) for wavefronts
  role: Float32Array; // vec4 — (fabric role, network role, wave role, class)
  flags: Float32Array; // vec4 — (circuit, downstream of ablation, ablated node, manifold kind)
  seed: Float32Array; // vec4 — per-particle random numbers in [0, 1)
  sweep: Float32Array; // vec4 — order in which a particle moves during each of the four transitions
  lines: Float32Array; // vec3 pairs — network edges
  lineFlags: Float32Array; // vec2 per vertex — (circuit, downstream)
  lineCount: number;
}

interface Node { layer: number; index: number; x: number; y: number; z: number; circuit: boolean; ablated: boolean }
interface Edge { a: Node; b: Node; circuit: boolean; downstream: boolean; weight: number }

const key = (layer: number, index: number) => `${layer}:${index}`;

function buildNetwork(random: () => number) {
  const nodes = new Map<string, Node>();
  const width = 3.4;
  LAYERS.forEach((count, layer) => {
    for (let index = 0; index < count; index++) {
      const x = -width / 2 + (layer * width) / (LAYERS.length - 1);
      const y = (index - (count - 1) / 2) * 0.27;
      const z = 0.1 * Math.sin(layer * 1.7 + index * 0.9);
      nodes.set(key(layer, index), { layer, index, x, y, z, circuit: false, ablated: layer === ABLATED[0] && index === ABLATED[1] });
    }
  });
  const edges = new Map<string, Edge>();
  const addEdge = (a: Node, b: Node) => {
    const id = `${key(a.layer, a.index)}>${key(b.layer, b.index)}`;
    if (!edges.has(id)) edges.set(id, { a, b, circuit: false, downstream: false, weight: 1 });
    return edges.get(id)!;
  };
  for (let layer = 0; layer < LAYERS.length - 1; layer++) {
    const here = LAYERS[layer]!, next = LAYERS[layer + 1]!;
    const incoming = new Array(next).fill(0);
    for (let index = 0; index < here; index++) {
      const aligned = Math.round((index * (next - 1)) / Math.max(1, here - 1));
      const targets = new Set([aligned]);
      while (targets.size < 3) targets.add(Math.floor(random() * next));
      for (const target of targets) {
        addEdge(nodes.get(key(layer, index))!, nodes.get(key(layer + 1, target))!);
        incoming[target]++;
      }
    }
    incoming.forEach((value, target) => {
      if (value === 0) addEdge(nodes.get(key(layer, Math.floor(random() * here)))!, nodes.get(key(layer + 1, target))!);
    });
  }
  for (const [la, ia, lb, ib] of CIRCUIT) {
    const a = nodes.get(key(la, ia))!, b = nodes.get(key(lb, ib))!;
    a.circuit = b.circuit = true;
    const edge = addEdge(a, b);
    edge.circuit = true;
    edge.weight = 2.6;
  }
  // Downstream of the ablated unit: its outgoing edges and the rest of the circuit after it.
  for (const edge of edges.values()) {
    if (edge.a.ablated) edge.downstream = true;
    if (edge.circuit && edge.a.layer > ABLATED[0]) edge.downstream = true;
  }
  return { nodes: [...nodes.values()], edges: [...edges.values()] };
}

/** Pseudo "sky temperature": a sum of plane waves on the sphere, normalised to [-1, 1]. */
function makeTemperature(random: () => number) {
  const waves = Array.from({ length: 9 }, () => {
    const z = random() * 2 - 1, phi = random() * Math.PI * 2, s = Math.sqrt(1 - z * z);
    return { d: [s * Math.cos(phi), z, s * Math.sin(phi)], f: 1.6 + random() * 4.2, p: random() * Math.PI * 2, a: 0.5 + random() };
  });
  const total = waves.reduce((sum, w) => sum + w.a, 0);
  return (x: number, y: number, z: number) => {
    let value = 0;
    for (const w of waves) value += w.a * Math.sin(w.f * (x * w.d[0]! + y * w.d[1]! + z * w.d[2]!) + w.p);
    return Math.max(-1, Math.min(1, (value / total) * 2.4));
  };
}

/** Height of the curved representation manifold used in stage 2. */
const manifoldHeight = (x: number, z: number) => 0.24 * Math.sin(1.5 * x + 0.4) * Math.cos(1.25 * z - 0.3) - 0.05 * (x * x + z * z) * 0.25;

export function buildScene(requested: number): SceneData {
  const random = mulberry32(20261002);
  const count = Math.max(4000, Math.floor(requested));
  const stars = Math.round(count * 0.035);
  const active = count - stars;
  const orbs = Math.round(active * 0.014);
  const fabric = active - orbs;
  const lines = Math.max(18, Math.round(Math.sqrt(fabric / 14)));
  const perLine = Math.floor(fabric / (2 * lines));

  const p0 = new Float32Array(count * 3), p1 = new Float32Array(count * 4), p2 = new Float32Array(count * 3);
  const p3 = new Float32Array(count * 3), p3b = new Float32Array(count * 3), p4 = new Float32Array(count * 3);
  const role = new Float32Array(count * 4), flags = new Float32Array(count * 4), seed = new Float32Array(count * 4);
  const sweep = new Float32Array(count * 4);

  // A random permutation keeps any prefix of the buffers a fair sample (used by quality scaling).
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j]!, order[i]!]; }

  const temperature = makeTemperature(random);
  const network = buildNetwork(random);
  const W = 5.2, R1 = 1.25;

  // --- Stage 2 cluster geometry -------------------------------------------------------
  const K = 5;
  const centers = Array.from({ length: K }, (_, k) => {
    const angle = (2 * Math.PI * k) / K + 0.45;
    const x = 1.18 * Math.cos(angle) + (random() - 0.5) * 0.2;
    const z = 0.78 * Math.sin(angle) + (random() - 0.5) * 0.2;
    return { x, z, rot: random() * Math.PI, major: 0.26 + random() * 0.08, minor: 0.1 + random() * 0.05 };
  });
  const onManifold = (x: number, z: number, thickness: number): [number, number, number] =>
    [x, manifoldHeight(x, z) + gaussian(random) * thickness, z];

  // --- Stage 3 allocation by edge weight; each manifold class feeds one layer of edges ---
  const groups = Array.from({ length: LAYERS.length - 1 }, (_, layer) => network.edges.filter((e) => e.a.layer === layer));
  const weighted = (edges: Edge[]) => {
    const cumulative: number[] = [];
    let total = 0;
    for (const e of edges) { total += e.weight; cumulative.push(total); }
    return (r: number) => {
      const target = r * total;
      let lo = 0, hi = cumulative.length - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cumulative[mid]! < target) lo = mid + 1; else hi = mid; }
      return edges[lo]!;
    };
  };
  const pickAny = weighted(network.edges);
  const pickInLayer = groups.map(weighted);
  const pickEdge = (layerHint: number, r: number) => (random() < 0.78 ? pickInLayer[Math.min(groups.length - 1, layerHint)]!(r) : pickAny(r));

  // --- Stage 4 listener communities ---------------------------------------------------
  const communities = Array.from({ length: 46 }, () => {
    const r = Math.sqrt(0.16 + random() * (4.6 - 0.16)), a = random() * Math.PI * 2;
    return [r * Math.cos(a), r * Math.sin(a)] as const;
  });

  for (let n = 0; n < count; n++) {
    const i = order[n]!;
    const i3 = i * 3, i4 = i * 4;
    const s0 = random(), s1 = random(), s2 = random(), s3 = random();
    seed.set([s0, s1, s2, s3], i4);

    if (n >= active) {
      // Background stars: identical in every stage, so they never morph.
      const z = random() * 2 - 1, phi = random() * Math.PI * 2, r = 7 + random() * 7, s = Math.sqrt(1 - z * z);
      const star = [r * s * Math.cos(phi), r * z * 0.75, r * s * Math.sin(phi) - 3];
      p0.set(star, i3); p1.set([...star, 0], i4); p2.set(star, i3); p3.set(star, i3); p3b.set(star, i3); p4.set(star, i3);
      role.set([3, 2, 3, 0], i4);
      flags.set([0, 0, 0, 0], i4);
      sweep.set([0, 0, 0, 0], i4);
      continue;
    }

    // ---- canonical (u, v) coordinates and stage 0 ----
    let u: number, v: number, fabricRole = 0;
    if (n < orbs) {
      fabricRole = n < orbs / 2 ? 1 : 2;
      const z = random() * 2 - 1, phi = random() * Math.PI * 2, s = Math.sqrt(1 - z * z);
      const r = random() < 0.72 ? Math.abs(gaussian(random)) * 0.016 : 0.03 + random() * 0.07;
      p0.set([r * s * Math.cos(phi), r * z, r * s * Math.sin(phi)], i3);
      u = random(); v = random();
    } else {
      const f = n - orbs;
      const line = Math.floor(f / perLine);
      const along = (f % perLine) / Math.max(1, perLine - 1);
      if (line < lines) { u = along; v = line / (lines - 1); }
      else if (line < 2 * lines) { u = (line - lines) / (lines - 1); v = along; }
      else { u = random(); v = random(); }
      p0.set([(u - 0.5) * W, 0, (v - 0.5) * W], i3);
      // Dissolve the line structure perpendicular to each line, so the sphere is uniform.
      const reflect = (x: number) => (x < 0 ? -x : x > 1 ? 2 - x : x);
      if (line < lines) v = reflect(v + (random() - 0.5) / (lines - 1));
      else if (line < 2 * lines) u = (u + (random() - 0.5) / (lines - 1) + 1) % 1;
    }

    // ---- stage 1: equal-area wrap of (u, v) onto a sphere ----
    {
      const phi = 2 * Math.PI * u, cz = 1 - 2 * v, s = Math.sqrt(Math.max(0, 1 - cz * cz));
      const x = s * Math.cos(phi), y = cz, z = s * Math.sin(phi);
      p1.set([R1 * x, R1 * y, R1 * z, temperature(x, y, z)], i4);
    }

    // ---- stage 2: longitude wedge -> cluster on a curved manifold ----
    const cls = Math.min(K - 1, Math.floor(u * K));
    let kind = 0;
    const r2 = random();
    if (r2 < 0.07) {
      kind = 2; // faint lattice that reveals the manifold itself
      const gx = (Math.floor(random() * 24) / 23 - 0.5) * 3.9, gz = (Math.floor(random() * 16) / 15 - 0.5) * 2.7;
      p2.set(onManifold(gx + (random() - 0.5) * 0.02, gz + (random() - 0.5) * 0.02, 0.004), i3);
    } else if (r2 < 0.16) {
      kind = 1; // ambiguous points between neighbouring clusters
      const a = centers[cls]!, b = centers[(cls + 1) % K]!, t = random();
      p2.set(onManifold(a.x + (b.x - a.x) * t + gaussian(random) * 0.09, a.z + (b.z - a.z) * t + gaussian(random) * 0.09, 0.03), i3);
    } else {
      const c = centers[cls]!;
      const g1 = gaussian(random) * c.major, g2 = gaussian(random) * c.minor;
      const x = c.x + g1 * Math.cos(c.rot) - g2 * Math.sin(c.rot);
      const z = c.z + g1 * Math.sin(c.rot) + g2 * Math.cos(c.rot);
      p2.set(onManifold(x, z, 0.035), i3);
    }

    // ---- stage 3: nodes, flowing edges and dust ----
    let netRole = 0, circuit = 0, downstream = 0, ablated = 0;
    const r3 = random();
    if (r3 < 0.13) {
      const node = network.nodes[Math.floor(random() * network.nodes.length)]!;
      const z = random() * 2 - 1, phi = random() * Math.PI * 2, s = Math.sqrt(1 - z * z);
      const r = random() < 0.7 ? Math.abs(gaussian(random)) * 0.012 : 0.022 + random() * 0.03;
      p3.set([node.x + r * s * Math.cos(phi), node.y + r * z, node.z + r * s * Math.sin(phi)], i3);
      p3b.set([node.x, node.y, node.z], i3); // node centre, used for the glow falloff
      circuit = node.circuit ? 1 : 0;
      ablated = node.ablated ? 1 : 0;
    } else if (r3 < 0.93) {
      netRole = 1;
      const edge = pickEdge(cls, random());
      const jitter = () => (random() - 0.5) * 0.018;
      p3.set([edge.a.x + jitter(), edge.a.y + jitter(), edge.a.z + jitter()], i3);
      p3b.set([edge.b.x + jitter(), edge.b.y + jitter(), edge.b.z + jitter()], i3);
      circuit = edge.circuit ? 1 : 0;
      downstream = edge.downstream ? 1 : 0;
    } else {
      netRole = 2;
      const pos = [(random() - 0.5) * 4.6, (random() - 0.5) * 2.8, (random() - 0.5) * 1.8];
      p3.set(pos, i3); p3b.set(pos, i3);
    }

    // ---- stage 4: wavefronts, source and listeners ----
    let waveRole = 0;
    const r4 = random();
    if (r4 < 0.02) {
      waveRole = 2;
      const z = random() * 2 - 1, phi = random() * Math.PI * 2, s = Math.sqrt(1 - z * z);
      const r = random() < 0.7 ? Math.abs(gaussian(random)) * 0.02 : 0.04 + random() * 0.09;
      p4.set([r * s * Math.cos(phi), r * z, r * s * Math.sin(phi)], i3);
    } else if (r4 < 0.33) {
      waveRole = 1;
      // the ring angle follows the particle's height in the network, so the network unfurls
      const y3 = p3[i3 + 1]!;
      p4.set([Math.PI * 0.5 - y3 * 1.6 + (random() - 0.5) * 1.2, Math.floor(random() * 6), random() - 0.5], i3);
    } else {
      // listeners: radius grows with the particle's depth in the network (input → centre)
      const t = Math.min(1, Math.max(0, (p3[i3]! + 1.7) / 3.4 + (random() - 0.5) * 0.3));
      if (r4 < 0.66) {
        const target = Math.sqrt(0.16 + t * 4.4);
        let best = communities[0]!, bestScore = Infinity;
        for (let k = 0; k < 6; k++) {
          const c = communities[Math.floor(random() * communities.length)]!;
          const score = Math.abs(Math.hypot(c[0], c[1]) - target);
          if (score < bestScore) { bestScore = score; best = c; }
        }
        p4.set([best[0] + gaussian(random) * 0.11, best[1] + gaussian(random) * 0.11, gaussian(random) * 0.07], i3);
      } else {
        const r = Math.sqrt(0.09 + t * (5.3 - 0.09)), a = Math.PI * 0.5 - p3[i3 + 1]! * 1.6 + (random() - 0.5) * 3.2;
        p4.set([r * Math.cos(a), r * Math.sin(a), gaussian(random) * 0.08], i3);
      }
    }

    role.set([fabricRole, netRole, waveRole, cls], i4);
    flags.set([circuit, downstream, ablated, kind], i4);
    // Each transformation has its own order, so a half-finished morph shows structure:
    // 0→1 sweeps outward from the well, 1→2 forms the clusters one after another,
    // 2→3 builds the network layer by layer, 3→4 spreads the waves from the source outward.
    const radial = Math.min(1, Math.hypot(u - 0.5, v - 0.5) / 0.7071);
    const layerOrder = Math.min(1, Math.max(0, (p3[i3]! + 1.7) / 3.4));
    const waveOrder = waveRole === 1 ? random() : Math.min(1, Math.hypot(p4[i3]!, p4[i3 + 1]!) / 2.3);
    sweep.set([
      Math.min(1, radial * 0.82 + s0 * 0.18),
      Math.min(1, (cls / (K - 1)) * 0.78 + random() * 0.22),
      Math.min(1, layerOrder * 0.86 + random() * 0.14),
      waveRole === 2 ? 0 : Math.min(1, waveOrder * 0.85 + random() * 0.15),
    ], i4);
  }

  // Network edges as line segments (same coordinates as the stage-3 nodes).
  const lineCount = network.edges.length;
  const linesData = new Float32Array(lineCount * 6);
  const lineFlags = new Float32Array(lineCount * 4);
  network.edges.forEach((edge, e) => {
    linesData.set([edge.a.x, edge.a.y, edge.a.z, edge.b.x, edge.b.y, edge.b.z], e * 6);
    const c = edge.circuit ? 1 : 0, d = edge.downstream ? 1 : 0;
    lineFlags.set([c, d, c, d], e * 4);
  });

  return { count, p0, p1, p2, p3, p3b, p4, role, flags, seed, sweep, lines: linesData, lineFlags, lineCount };
}

export type Rgb = readonly [number, number, number];

/** Palette slots used by the shader (see shaders.ts). */
export const darkPalette: readonly Rgb[] = [
  [0.56, 0.69, 1.0], // 0 fabric
  [1.0, 0.86, 0.6], // 1 binary source
  [0.22, 0.45, 1.0], // 2 cold
  [0.62, 0.56, 0.78], // 3 neutral
  [1.0, 0.5, 0.24], // 4 hot
  [0.4, 0.9, 0.84], // 5 class: cyan
  [0.98, 0.77, 0.4], // 6 class: amber
  [1.0, 0.5, 0.46], // 7 class: coral
  [0.66, 0.58, 1.0], // 8 class: violet
  [0.58, 0.9, 0.5], // 9 class: green
  [0.36, 0.42, 0.66], // 10 manifold lattice
  [0.8, 0.84, 1.0], // 11 network node
  [0.42, 0.55, 0.96], // 12 network edge
  [1.0, 0.75, 0.33], // 13 circuit
  [1.0, 0.64, 0.46], // 14 wavefront / lit listener
  [0.62, 0.6, 0.95], // 15 listener
  [0.72, 0.76, 0.92], // 16 star
  [0.96, 0.36, 0.36], // 17 ablated unit
];

export const lightPalette: readonly Rgb[] = [
  [0.13, 0.22, 0.48],
  [0.62, 0.36, 0.02],
  [0.1, 0.3, 0.78],
  [0.42, 0.4, 0.52],
  [0.8, 0.3, 0.08],
  [0.0, 0.48, 0.44],
  [0.66, 0.42, 0.0],
  [0.78, 0.24, 0.2],
  [0.38, 0.28, 0.82],
  [0.22, 0.52, 0.16],
  [0.45, 0.48, 0.62],
  [0.16, 0.2, 0.42],
  [0.3, 0.38, 0.72],
  [0.74, 0.44, 0.0],
  [0.78, 0.3, 0.12],
  [0.4, 0.42, 0.62],
  [0.55, 0.57, 0.68],
  [0.78, 0.12, 0.12],
];

/** Ambient glow colour behind each stage (dark theme). */
export const stageGlow: readonly Rgb[] = [
  [0.09, 0.15, 0.42],
  [0.24, 0.11, 0.36],
  [0.04, 0.24, 0.25],
  [0.17, 0.13, 0.3],
  [0.32, 0.13, 0.11],
];
