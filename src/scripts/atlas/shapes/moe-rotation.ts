/**
 * Projects plate: rotation-supervised experts (MNIST pilot). Schematic only, never a plot.
 *
 * One source at the bottom releases small "digit" glyphs (a stem with a two-dot arm, a "Γ", so the four
 * 90-degree orientations are distinguishable). Every glyph is sent to both sides at once:
 * - left (cyan): a gate trained on the rotation label weights four expert lanes. All four experts run
 *   on every glyph: the gated lane carries the glyph bright, the other three carry faint copies; the
 *   lanes recombine and land in an output pool near the top centre;
 * - right (pale): the same kind of gate makes four candidate un-rotations of each glyph, weighted by the
 *   gate (the likely one bright, the others faint), and all four copies pass together through ONE wide
 *   shared channel before landing next to the left pool, very slightly ahead (higher).
 * focus 1 removes the rotation supervision on the left: the gate's orientation ticks loosen, its
 * weights flatten (faint lane copies brighten, the main copy dims), glyphs weave across lanes before
 * recombining, and the left pool settles a bit lower, leaving a faint ghost where the supervised bank
 * landed. The bank never collapses.
 */
import { SLOT, type ShapeDef } from '../types';

const TAU = Math.PI * 2;
const GATE_X = 0.78; // |x| of both gates and the recombination nodes
const GATE_Y = -0.56;
const MERGE_Y = 0.4;
const SOURCE_Y = -0.84;
const POOL_X = 0.19; // |x| of the two output pools, close together near the top centre
const POOL_Y = 0.64; // supervised bank
const LEAD = 0.045; // the shared control lands very slightly higher
const DROP = 0.13; // unsupervised bank lands a bit lower
const LANE_GAP = 0.22;
const LANE_OFF = 0.042; // glyphs ride beside the lane guide, not on it
const LANE_Y0 = -0.3, LANE_Y1 = 0.22;
const CHANNEL_HALF = 0.3; // the shared vessel is wide ...
const BUNDLE = 0.03; // ... but the glyphs pass through it as one tight bundle
const SPREAD = 0.06; // two of the faint candidate copies flank the bright one inside the channel
const VESSEL_Y = 0.01, VESSEL_H = 0.25;
const S_GATE = 0.22, S_LANE_IN = 0.34, S_LANE_OUT = 0.6, S_MERGE = 0.73;
const S_STUB = 0.3, S_CH_IN = 0.38;
const SPEED = 0.042;

// Glyph in its upright frame: a stem with a two-dot arm at the top right ("Γ").
// Sparse variant (6 points) for low counts, dense variant (9 points) for high counts.
const GX6 = [-0.012, -0.012, -0.012, -0.012, 0.006, 0.024];
const GY6 = [-0.033, -0.011, 0.011, 0.033, 0.033, 0.033];
const FAINT6 = [0, 3, 5];
const GX9 = [-0.012, -0.012, -0.012, -0.012, -0.012, -0.012, 0.0, 0.012, 0.024];
const GY9 = [-0.033, -0.0198, -0.0066, 0.0066, 0.0198, 0.033, 0.033, 0.033, 0.033];
const FAINT9 = [0, 3, 5, 8];

const smooth = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
const band = (x: number, a: number, b: number) => smooth((x - a) / (b - a));

const Role = { Dust: 0, Guide: 1, Gate: 2, Tick: 3, Merge: 4, Source: 5, Pool: 6, Glyph: 7 } as const;
type Role = (typeof Role)[keyof typeof Role];

// guide kinds: 0..3 left lanes, 4..7 right stubs, 8/9 vessel walls, 10 vessel exit,
// 11/12 feeders (left/right), 13/14 landing paths (left/right)
const GUIDE_W = [1, 1, 1, 1, 0.16, 0.16, 0.16, 0.16, 1.25, 1.25, 0.12, 0.42, 0.42, 0.34, 0.34];

export const moeRotation: ShapeDef = {
  id: 'moe-rotation',
  restTime: 7.5,
  create(count, random) {
    const role = new Uint8Array(count);
    const side = new Int8Array(count); // -1 left (expert bank), +1 right (shared control)
    const a = new Float32Array(count), b = new Float32Array(count), c = new Float32Array(count), d = new Float32Array(count);
    const phase = new Float32Array(count);
    const lane = new Uint8Array(count); // left: expert lane; right: candidate stub
    const kind = new Uint8Array(count); // glyphs: 0 main copy, 1 faint copy; guides: guide kind
    const ox0 = new Float32Array(count), oy0 = new Float32Array(count); // offsets at the input orientation
    const ox1 = new Float32Array(count), oy1 = new Float32Array(count); // after the candidate un-rotation
    const flank = new Float32Array(count); // right: x offset of a faint copy inside the channel
    const lx = new Float32Array(count), ly = new Float32Array(count); // local upright offsets
    const turnFrom = new Float32Array(count), turnBy = new Float32Array(count);

    const dense = count >= 2000;
    const GX = dense ? GX9 : GX6, GY = dense ? GY9 : GY6, FAINT = dense ? FAINT9 : FAINT6;
    const perSide = GX.length + 3 * FAINT.length;
    // the glyph count is capped so a lane never fills into a continuous column
    const glyphs = Math.max(8, Math.min(20, Math.floor((count * 0.36) / (2 * perSide))));

    const nDust = Math.round(count * 0.06);
    const nGate = Math.round(count * 0.03);
    const nTick = Math.round(count * 0.025);
    const nMerge = Math.round(count * 0.02);
    const nSource = Math.round(count * 0.045);
    const nPool = Math.round(count * 0.11);
    const nGlyph = glyphs * 2 * perSide;
    const nGuide = Math.max(0, count - nDust - nGate - nTick - nMerge - nSource - nPool - nGlyph);

    let i = 0;
    const put = (r: Role, n: number) => { for (let k = 0; k < n && i < count; k++, i++) role[i] = r; };
    put(Role.Dust, nDust); put(Role.Gate, nGate); put(Role.Tick, nTick);
    put(Role.Merge, nMerge); put(Role.Source, nSource); put(Role.Pool, nPool);
    const guideStart = i;
    put(Role.Guide, nGuide);
    const glyphStart = i;

    // guides: evenly spaced dots along each path, a little jitter
    {
      let wsum = 0;
      for (const w of GUIDE_W) wsum += w;
      let g = guideStart, acc = 0;
      for (let k = 0; k < GUIDE_W.length; k++) {
        acc += GUIDE_W[k]!;
        const end = k === GUIDE_W.length - 1 ? glyphStart : guideStart + Math.round((nGuide * acc) / wsum);
        const n = end - g;
        for (let j = 0; g < end; g++, j++) {
          kind[g] = k; a[g] = (j + 0.5 + 0.25 * (random() - 0.5)) / n;
          b[g] = random(); c[g] = random(); d[g] = random();
          side[g] = k < 4 || k === 11 || k === 13 ? -1 : 1;
        }
      }
    }

    // glyphs: orientations cycle so each lane receives one glyph in four, evenly spaced
    const ORDER = [0, 2, 1, 3];
    for (let gI = 0; gI < glyphs && i < count; gI++) {
      const o = ORDER[gI % 4]!;
      const ph = (gI + 0.3 * random()) / glyphs;
      const jit = random() * 2 - 1;
      const th = (o * Math.PI) / 2, co = Math.cos(th), si = Math.sin(th);
      for (let s = -1; s <= 1; s += 2) {
        for (let cand = 0; cand < 4; cand++) {
          const main = cand === o;
          const pts = main ? GX.length : FAINT.length;
          const weave = random();
          // right: turn back by the candidate angle, the short way
          const back = cand === 3 ? -Math.PI / 2 : (cand * Math.PI) / 2;
          const th1 = th - (s > 0 ? back : 0), co1 = Math.cos(th1), si1 = Math.sin(th1);
          for (let p = 0; p < pts && i < count; p++, i++) {
            const q = main ? p : FAINT[p]!;
            const gx = GX[q]!, gy = GY[q]!;
            role[i] = Role.Glyph; side[i] = s; phase[i] = ph; lane[i] = cand;
            kind[i] = main ? 0 : 1; a[i] = weave; b[i] = jit; c[i] = gx > 0 ? 1 : 0; d[i] = random();
            lx[i] = gx; ly[i] = gy;
            ox0[i] = gx * co - gy * si; oy0[i] = gx * si + gy * co;
            ox1[i] = gx * co1 - gy * si1; oy1[i] = gx * si1 + gy * co1;
            turnFrom[i] = th; turnBy[i] = s > 0 ? -back : 0;
            const diff = (cand - o + 4) % 4;
            flank[i] = diff === 1 ? -SPREAD : diff === 3 ? SPREAD : 0;
          }
        }
      }
    }
    // any rounding spare: quiet pool particles
    for (; i < count; i++) role[i] = Role.Pool;

    for (let k = 0; k < count; k++) {
      if (role[k] === Role.Guide || role[k] === Role.Glyph) continue;
      a[k] = random(); b[k] = random(); c[k] = random(); d[k] = random();
      side[k] = random() < 0.5 ? -1 : 1;
    }
    const guideAlpha = Math.min(1, Math.sqrt(520 / Math.max(1, nGuide)));

    // scratch for the track evaluator
    let px = 0, py = 0;
    /** Position at path parameter s for a glyph on `sd` side; laneX = lane/stub x, chanX = channel x. */
    const track = (sd: number, s: number, laneX: number, chanX: number, poolY: number) => {
      const gx = sd * GATE_X;
      if (s < S_GATE) {
        const u = s / S_GATE;
        px = sd * 0.05 + (gx - sd * 0.05) * smooth(u); py = SOURCE_Y + (GATE_Y - SOURCE_Y) * u;
      } else if (s >= S_MERGE) {
        const u = (s - S_MERGE) / (1 - S_MERGE);
        px = gx + (sd * POOL_X - gx) * smooth(u); py = MERGE_Y + (poolY - MERGE_Y) * u;
      } else if (s >= S_LANE_OUT) {
        const u = (s - S_LANE_OUT) / (S_MERGE - S_LANE_OUT);
        const from = sd < 0 ? laneX : chanX;
        px = from + (gx - from) * smooth(u); py = LANE_Y1 + (MERGE_Y - LANE_Y1) * u;
      } else if (sd < 0) {
        if (s < S_LANE_IN) {
          const u = (s - S_GATE) / (S_LANE_IN - S_GATE);
          px = gx + (laneX - gx) * smooth(u); py = GATE_Y + (LANE_Y0 - GATE_Y) * u;
        } else {
          const u = (s - S_LANE_IN) / (S_LANE_OUT - S_LANE_IN);
          px = laneX; py = LANE_Y0 + (LANE_Y1 - LANE_Y0) * u;
        }
      } else if (s < S_STUB) {
        const u = (s - S_GATE) / (S_STUB - S_GATE);
        px = gx + (laneX - gx) * smooth(u); py = GATE_Y + (-0.42 - GATE_Y) * u;
      } else if (s < S_CH_IN) {
        const u = (s - S_STUB) / (S_CH_IN - S_STUB);
        px = laneX + (chanX - laneX) * smooth(u); py = -0.42 + 0.24 * u;
      } else {
        const u = (s - S_CH_IN) / (S_LANE_OUT - S_CH_IN);
        px = chanX; py = -0.18 + (LANE_Y1 + 0.18) * u;
      }
    };
    const leftLaneX = (k: number) => -GATE_X + (k - 1.5) * LANE_GAP;
    const stubX = (k: number) => GATE_X + (k - 1.5) * 0.14;

    return (i, t, focus, out) => {
      const f = focus < 0 ? 0 : focus > 1 ? 1 : focus;
      const leftPoolY = POOL_Y - DROP * f;
      const rightPoolY = POOL_Y + LEAD;
      const rightDim = 1 - 0.2 * f;
      const sd = side[i]!;
      switch (role[i]) {
        case Role.Dust: {
          const ang = a[i]! * TAU + t * 0.01 * (b[i]! - 0.5);
          const rad = 0.3 + 1.2 * Math.sqrt(c[i]!);
          out.x = Math.cos(ang) * rad * 1.04; out.y = Math.sin(ang) * rad * 0.64;
          out.z = (d[i]! - 0.5) * 1.0;
          out.size = 0.45 + 0.45 * b[i]!;
          out.color = SLOT.dim;
          out.alpha = 0.26 + 0.16 * Math.sin(t * 0.7 + a[i]! * 40);
          return;
        }
        case Role.Guide: {
          const k = kind[i]!, u = a[i]!;
          let pulseAt = 0, base = 0.52, size = 0.95;
          if (k < 4) {
            track(-1, S_GATE + u * (S_MERGE - S_GATE), leftLaneX(k), 0, leftPoolY);
            out.z = (k - 1.5) * 0.08; pulseAt = k * 0.25;
          } else if (k < 8) {
            // short, dim candidate stubs below the shared vessel
            const c4 = k - 4;
            track(1, S_GATE + 0.02 + u * (S_CH_IN - S_GATE - 0.05), stubX(c4), GATE_X + (c4 - 1.5) * 0.06, rightPoolY);
            out.z = (c4 - 1.5) * 0.05; pulseAt = c4 * 0.25; base = 0.3; size = 0.8;
          } else if (k < 10) {
            // the shared channel: one wide rounded vessel, open where the streams enter and leave
            const w = k === 8 ? -1 : 1;
            const th = (-0.43 + 0.86 * u) * Math.PI, cs = Math.cos(th), sn = Math.sin(th);
            px = GATE_X + w * CHANNEL_HALF * Math.sqrt(cs);
            py = VESSEL_Y + VESSEL_H * (sn < 0 ? -Math.sqrt(-sn) : Math.sqrt(sn));
            out.z = w * 0.08; pulseAt = 0.5 * (k - 8); base = 0.7; size = 1.1;
          } else if (k === 10) {
            px = GATE_X; py = VESSEL_Y + VESSEL_H + u * (MERGE_Y - VESSEL_Y - VESSEL_H - 0.03); out.z = 0;
          } else if (k < 13) {
            track(sd, u * S_GATE, 0, 0, 0); out.z = 0; pulseAt = sd > 0 ? 0.5 : 0;
          } else {
            track(sd, S_MERGE + u * (1 - S_MERGE), 0, 0, sd < 0 ? leftPoolY : rightPoolY); out.z = 0; pulseAt = sd > 0 ? 0.5 : 0;
          }
          out.x = px + (b[i]! - 0.5) * 0.005; out.y = py + (c[i]! - 0.5) * 0.005;
          let ph = u - ((t * 0.07 + pulseAt) % 1);
          ph -= Math.round(ph);
          const pulse = Math.exp(-ph * ph * 120);
          out.size = size + 0.7 * pulse;
          out.color = SLOT.ink;
          out.alpha = (base * guideAlpha + 0.35 * pulse) * (sd > 0 ? rightDim : 1);
          return;
        }
        case Role.Gate:
        case Role.Merge: {
          const gate = role[i] === Role.Gate;
          const cx = sd * GATE_X, cy = gate ? GATE_Y : MERGE_Y;
          const core = c[i]! < 0.3;
          const r = core ? 0.012 * Math.sqrt(b[i]!) : (gate ? 0.05 : 0.034) + 0.006 * b[i]!;
          const ang = a[i]! * TAU + t * (gate ? 0.5 : 0.3) * sd;
          out.x = cx + Math.cos(ang) * r; out.y = cy + Math.sin(ang) * r * 0.9; out.z = Math.sin(ang) * r;
          out.size = core ? 2.1 : 1.15;
          out.color = sd < 0 ? SLOT.cyan : SLOT.pale;
          out.alpha = (core ? 0.95 : 0.7) * (gate ? 1 : 0.75) * (sd > 0 ? rightDim : 1);
          return;
        }
        case Role.Tick: {
          // four orientation ticks around each gate: the gate is trained on the rotation label
          const q = Math.floor(a[i]! * 4), ang = (q * Math.PI) / 2;
          const loose = sd < 0 ? f : 0;
          const r = 0.072 + 0.033 * b[i]! + loose * (0.08 * c[i]! + 0.02);
          const sway = loose * (d[i]! - 0.5) * 1.3 + 0.03 * Math.sin(t * 0.6 + q);
          out.x = sd * GATE_X + Math.cos(ang + sway) * r; out.y = GATE_Y + Math.sin(ang + sway) * r;
          out.z = 0.04 * (c[i]! - 0.5);
          out.size = 1.3 - 0.4 * loose;
          out.color = sd < 0 ? SLOT.cyan : SLOT.pale;
          out.alpha = (0.75 - 0.55 * loose) * (sd > 0 ? rightDim : 1);
          return;
        }
        case Role.Source: {
          // the common source: a bright core with a thin pale rim
          const rim = c[i]! < 0.4;
          const ang = a[i]! * TAU + t * (rim ? 0.12 : 0.22);
          const r = rim ? 1 + 0.03 * (b[i]! - 0.5) : 0.85 * Math.sqrt(b[i]!);
          out.x = Math.cos(ang) * r * 0.19; out.y = SOURCE_Y + Math.sin(ang) * r * 0.05; out.z = Math.sin(ang) * r * 0.1;
          out.size = rim ? 1.0 : 1.2 + 0.6 * (1 - r);
          out.color = rim || d[i]! < 0.35 ? SLOT.pale : SLOT.ink;
          out.alpha = rim ? 0.6 : 0.85;
          return;
        }
        case Role.Pool: {
          const left = sd < 0;
          const ghost = left && d[i]! < 0.32;
          const cy = left ? (ghost ? POOL_Y : leftPoolY) : rightPoolY;
          const ang = a[i]! * TAU + t * (0.16 + 0.1 * c[i]!) * (left ? 1 : -1);
          const r = 0.02 + 0.1 * Math.sqrt(b[i]!);
          out.x = sd * POOL_X + Math.cos(ang) * r * 1.05;
          out.y = cy + Math.sin(ang) * r * 0.32;
          out.z = Math.sin(ang) * r * 0.8;
          out.size = r < 0.05 ? 1.9 : 1.1 + 0.6 * (1 - b[i]!);
          out.color = left ? SLOT.cyan : SLOT.pale;
          const breathe = 0.85 + 0.15 * Math.sin(t * 0.9 + a[i]! * 30);
          out.alpha = (ghost ? 0.85 - 0.62 * f : 0.85) * breathe * (left ? 1 : rightDim);
          return;
        }
        default: {
          // glyph particle
          let s = phase[i]! + t * SPEED; s -= Math.floor(s);
          const k = lane[i]!, faint = kind[i] === 1;
          let ox: number, oy: number;
          let alpha = band(s, 0, 0.05) * (1 - band(s, 0.9, 0.995));
          // faint copies emerge from the gate and fold back in at the recombination node
          const copyEnv = band(s, S_GATE, S_GATE + 0.04) * (1 - band(s, S_LANE_OUT, S_MERGE - 0.02));
          if (sd < 0) {
            track(-1, s, leftLaneX(k), 0, leftPoolY);
            const inLane = band(s, S_GATE, S_LANE_IN) * (1 - band(s, S_LANE_OUT - 0.02, S_MERGE));
            // without supervision the copies drift across the lanes before recombining
            px += inLane * (LANE_OFF + f * (faint ? 0.055 : 0.085) * Math.sin(TAU * (s * 2.2 + a[i]!)));
            ox = ox0[i]!; oy = oy0[i]!;
            out.color = s < S_GATE - 0.004 ? SLOT.ink : SLOT.cyan;
            // the gate's weights: one lane clearly favoured, flatter without supervision
            alpha *= faint ? copyEnv * (0.3 + 0.14 * f) : 0.95 - 0.25 * f;
            out.z = (k - 1.5) * 0.08 * inLane;
          } else {
            track(1, s, stubX(k), GATE_X + b[i]! * BUNDLE + flank[i]!, rightPoolY);
            const turn = band(s, S_GATE + 0.02, S_STUB + 0.03);
            if (turn <= 0) { ox = ox0[i]!; oy = oy0[i]!; }
            else if (turn >= 1) { ox = ox1[i]!; oy = oy1[i]!; }
            else {
              const th = turnFrom[i]! + turnBy[i]! * turn, co = Math.cos(th), si = Math.sin(th);
              ox = lx[i]! * co - ly[i]! * si; oy = lx[i]! * si + ly[i]! * co;
            }
            // every candidate copy passes through the one shared channel, weighted by the gate
            alpha *= (faint ? copyEnv * 0.3 : 0.95) * rightDim;
            out.color = s < S_GATE - 0.004 ? SLOT.ink : SLOT.pale;
            out.z = (k - 1.5) * 0.05 * band(s, S_GATE, S_STUB) * (1 - band(s, S_STUB, S_CH_IN));
          }
          // glyphs dissolve into the pool as they land
          const land = band(s, 0.86, 1);
          const shrink = 1 - 0.7 * land;
          const pa = d[i]! * TAU, pr = 0.03 + 0.06 * d[i]!;
          out.x = px + ox * shrink + land * Math.cos(pa) * pr;
          out.y = py + oy * shrink + land * Math.sin(pa) * pr * 0.3;
          out.size = faint ? 1.3 : (dense ? 1.35 : 1.6) * (c[i]! > 0.5 ? 1.12 : 1);
          out.alpha = alpha;
          return;
        }
      }
    };
  },
};
