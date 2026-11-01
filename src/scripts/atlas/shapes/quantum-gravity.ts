/**
 * Plate for "Auditing a one-loop quantum gravity calculation".
 *
 * Focus 0: the audited calculation as a nearly level chain of nine stages (Feynman rules → late-time mode
 * function), joined by dotted links; a soft checking pulse travels along it, pausing at every stage, and
 * runs out onto a single line that settles flat at a constant level inside a faint drifting cloud (the
 * infrared graviton sea). A dashed shortcut arcs over the last stages on three struts, and a quieter
 * companion pulse runs along it, reaching the last stage at the same moment as the main pulse.
 * Focus 1: the corrections appear inside the chain: the third stage's needle turns over (the overall sign)
 * until it lines up with a fixed tick, the paper's own definition; two missing pieces slot into the gaps
 * of the seventh stage; the shortcut loses its struts yet still meets the main path at the same point, and
 * the main links over that stretch brighten a little (the full calculation carries the result). The
 * endpoint and the flat line do not move at all.
 * Schematic only: no axes, no numbers, nothing measured.
 */
import { SLOT, type ShapeDef } from '../types';

const NODES = 9;
const STEP = 0.27;
const NX = new Float32Array(NODES);
// nearly level: a gentle drift of 0.1 with a small wobble, so it reads as a chain of stages, not a curve
const NY = new Float32Array([0.1, 0.12, 0.065, 0.09, 0.04, 0.06, 0.012, 0.034, 0]);
for (let k = 0; k < NODES; k++) NX[k] = -1.44 + k * STEP;
const LEVEL = NY[NODES - 1]!; // the late-time level: the flat line stays here
const END_X = 1.54;
const RING = 0.064;
const SIGN_NODE = 2; // S1: overall sign of the printed self-mass
const SLOT_NODE = 6; // S2, S3: two entries of the final table
const CUT_A = 5, CUT_B = 8; // S4: the shortcut, from stage 6 to the last stage
const ARC_H = 0.34;
const STRUTS = [0.165, 0.5, 0.835]; // each lands in a link gap, clear of every ring
const GAP_A = [-Math.PI / 2 - 0.62, -Math.PI / 2 + 0.62]; // the slot stage's gaps, on its free lower side
const GAP_W = 0.8;
const SHAFT = 0.1; // half length of the S1 needle
const PERIOD = 24;
const ringR = (k: number) => (k === NODES - 1 || k === SLOT_NODE ? 0.08 : RING);

// role ids
const DUST = 0, SEA = 1, LINK = 2, NODE = 3, NEEDLE = 4, TICK = 5, PIECE = 6, FLAT = 7, ARC = 8, STRUT = 9, PULSE = 10, SPULSE = 11;
// share of particles per role (sums to 1; the last role takes the remainder)
const SHARE: ReadonlyArray<readonly [number, number]> = [
  [DUST, 0.07], [SEA, 0.13], [LINK, 0.2], [NODE, 0.24], [NEEDLE, 0.03], [TICK, 0.008], [PIECE, 0.03],
  [FLAT, 0.13], [ARC, 0.07], [STRUT, 0.05], [PULSE, 0.027], [SPULSE, 0.015],
];

const smooth = (e0: number, e1: number, x: number) => {
  const v = x <= e0 ? 0 : x >= e1 ? 1 : (x - e0) / (e1 - e0);
  return v * v * (3 - 2 * v);
};
/** The late-time line: a small ripple that dies away within the first stretch, then exactly flat. */
const flatY = (d: number) => (d > 0.6 ? LEVEL : LEVEL + 0.06 * Math.sin(d * 19) * Math.exp(-d * 9.5));
/** Height of the main chain at x (cosine-smoothed between stage centres). */
function chainY(x: number) {
  if (x >= NX[NODES - 1]!) return flatY(x - NX[NODES - 1]!);
  let k = Math.floor((x - NX[0]!) / STEP);
  k = k < 0 ? 0 : k > NODES - 2 ? NODES - 2 : k;
  const s = (x - NX[k]!) / STEP;
  return NY[k]! + (NY[k + 1]! - NY[k]!) * (1 - Math.cos(Math.PI * s)) * 0.5;
}
const arcX = (s: number) => NX[CUT_A]! + (NX[CUT_B]! - NX[CUT_A]!) * s;
const arcY = (s: number) => NY[CUT_A]! + (NY[CUT_B]! - NY[CUT_A]!) * s + ARC_H * Math.sin(Math.PI * s);

// pulse timeline: p ∈ [0, P_END) walks q from 0 to Q_END (pausing at each stage, including the last);
// then the pulse runs out onto the flat line and fades
const P_END = 0.82, Q_END = NODES - 1 + 0.42;

export const quantumGravity: ShapeDef = {
  id: 'quantum-gravity',
  // both pulses at the last stage: checked to the end, and the shortcut meets the main path here
  restTime: ((NODES - 1 - 0.04) / Q_END) * P_END * PERIOD,
  create(count, random) {
    const role = new Uint8Array(count), node = new Uint8Array(count);
    const a = new Float32Array(count), b = new Float32Array(count), c = new Float32Array(count), d = new Float32Array(count);
    const bx = new Float32Array(count), by = new Float32Array(count), bz = new Float32Array(count);

    // Stratified assignment: role by index fraction, parameter evenly spread inside each role.
    let start = 0;
    for (let r = 0; r < SHARE.length; r++) {
      const [id, share] = SHARE[r]!;
      const end = r === SHARE.length - 1 ? count : Math.min(count, start + Math.max(4, Math.round(share * count)));
      const n = end - start;
      for (let i = start; i < end; i++) {
        const j = i - start;
        role[i] = id;
        a[i] = (j + 0.2 + 0.6 * random()) / n; // evenly spread parameter
        b[i] = random(); c[i] = random(); d[i] = random();
      }
      start = end;
    }

    const slotSpan = Math.PI * 2 - 2 * GAP_W;
    const slotFirst = GAP_A[1]! - GAP_W / 2 - (GAP_A[0]! + GAP_W / 2);
    for (let i = 0; i < count; i++) {
      const r = role[i]!;
      if (r === LINK) {
        // eight links between stage centres, leaving room for the rings
        const u = a[i]! * (NODES - 1);
        const k = Math.min(NODES - 2, Math.floor(u));
        const x0 = NX[k]! + ringR(k) + 0.014, x1 = NX[k + 1]! - ringR(k + 1) - 0.014;
        const x = x0 + (x1 - x0) * (u - k);
        node[i] = k;
        a[i] = k + (x - NX[k]!) / STEP; // chain coordinate, used for the pulse glow
        bx[i] = x; by[i] = chainY(x); bz[i] = (b[i]! - 0.5) * 0.03;
      } else if (r === NODE) {
        const k = Math.min(NODES - 1, Math.floor(a[i]! * NODES));
        node[i] = k;
        const v = a[i]! * NODES - k; // even angles per node; the slot node leaves two gaps open
        let ang = v * Math.PI * 2;
        if (k === SLOT_NODE) {
          const w = v * slotSpan; // walk round the ring skipping the gaps
          ang = GAP_A[0]! + GAP_W / 2 + w + (w > slotFirst ? GAP_W : 0);
        }
        c[i] = ang;
        a[i] = d[i]! < 0.2 ? -1 : 1; // -1: bright core dot
      } else if (r === FLAT) {
        const x0 = NX[NODES - 1]! + ringR(NODES - 1) * 0.9;
        const x = x0 + (END_X - x0) * a[i]!;
        bx[i] = x; by[i] = flatY(x - NX[NODES - 1]!); bz[i] = (b[i]! - 0.5) * 0.02;
      } else if (r === ARC) {
        // dashes along the shortcut, starting and ending just outside the two rings it joins
        const dashes = 14;
        const q = Math.floor(a[i]! * dashes);
        const s = 0.065 + 0.87 * (q + 0.55 * (a[i]! * dashes - q)) / dashes;
        a[i] = s;
        bx[i] = arcX(s); by[i] = arcY(s); bz[i] = 0.04 * Math.sin(Math.PI * s);
      } else if (r === STRUT) {
        const k = Math.floor(b[i]! * STRUTS.length) % STRUTS.length;
        const s = STRUTS[k]!;
        const x = arcX(s), top = arcY(s) - 0.022, bottom = chainY(x) + 0.03;
        node[i] = k;
        bx[i] = x + (d[i]! - 0.5) * 0.005; by[i] = bottom + (top - bottom) * a[i]!; bz[i] = 0.03 * Math.sin(Math.PI * s);
      } else if (r === SEA) {
        // a soft cloud round the flat line
        const ang = b[i]! * Math.PI * 2, rad = 0.07 + 0.41 * Math.sqrt(c[i]!);
        bx[i] = 1.04 + Math.cos(ang) * rad * 0.85; by[i] = LEVEL + Math.sin(ang) * rad * 0.95; bz[i] = (d[i]! - 0.5) * 0.5;
      } else if (r === DUST) {
        const ang = b[i]! * Math.PI * 2, rad = 0.3 + 1.3 * Math.sqrt(c[i]!);
        bx[i] = Math.max(-1.52, Math.min(1.52, Math.cos(ang) * rad * 1.18));
        by[i] = Math.max(-0.92, Math.min(0.92, Math.sin(ang) * rad * 0.66)); bz[i] = (d[i]! - 0.5) * 0.8;
      }
    }

    // Pulse state, computed once per time value (no allocation).
    let lastT = NaN, pu = 0, pAlpha = 0, sS = 0, sAlpha = 0, cx = 0, cy = 0;
    const chainPoint = (u: number) => {
      if (u < NODES - 1) {
        const k = u < 0 ? 0 : Math.floor(u), s = u < 0 ? 0 : u - k;
        cx = NX[k]! + STEP * s;
        cy = NY[k]! + (NY[k + 1]! - NY[k]!) * (1 - Math.cos(Math.PI * s)) * 0.5;
      } else {
        cx = Math.min(END_X, NX[NODES - 1]! + (u - (NODES - 1)) * STEP);
        cy = flatY(cx - NX[NODES - 1]!);
      }
    };
    const updatePulse = (t: number) => {
      lastT = t;
      const p = ((t / PERIOD) % 1 + 1) % 1;
      let q: number;
      if (p < P_END) {
        q = (p / P_END) * Q_END;
        const k = Math.floor(q);
        pu = k >= NODES - 1 ? NODES - 1 : k + smooth(0.42, 1, q - k);
      } else {
        const u = (p - P_END) / (1 - P_END);
        q = Q_END + u;
        pu = NODES - 1 + 3.2 * u * u; // eases out onto the flat line, fading as it goes
      }
      pAlpha = smooth(0, 0.025, p) * (1 - smooth(0.88, 0.98, p));
      sS = (q - CUT_A) / (CUT_B - CUT_A);
      sAlpha = smooth(0, 0.08, sS) * (1 - smooth(1.0, 1.12, sS));
    };

    return (i, t, focus, out) => {
      if (t !== lastT) updatePulse(t);
      const f = focus < 0 ? 0 : focus > 1 ? 1 : focus;
      const r = role[i]!;
      switch (r) {
        case DUST: {
          const w = t * 0.05 + b[i]! * 40;
          out.x = bx[i]! + 0.03 * Math.sin(w); out.y = by[i]! + 0.02 * Math.cos(w * 0.8); out.z = bz[i]!;
          out.size = 0.45 + 0.4 * d[i]!; out.color = SLOT.dim;
          out.alpha = 0.3 + 0.12 * Math.sin(t * 0.6 + c[i]! * 50);
          return;
        }
        case SEA: {
          // drifting slowly on small loops: the infrared sea round the flat line
          const w = t * (0.12 + 0.1 * d[i]!) + b[i]! * 60;
          out.x = bx[i]! + 0.05 * Math.sin(w); out.y = by[i]! + 0.04 * Math.sin(w * 1.3 + 1.1); out.z = bz[i]!;
          out.size = 0.6 + 0.6 * (1 - c[i]!); out.color = d[i]! < 0.3 ? SLOT.ink : SLOT.dim;
          const edge = 1 - 0.55 * c[i]!;
          out.alpha = (0.55 + 0.18 * Math.sin(t * 0.7 + b[i]! * 90)) * edge;
          return;
        }
        case LINK: {
          const du = (a[i]! - pu) * 5;
          const glow = pAlpha * Math.exp(-du * du);
          // with the corrections shown, the full path over the shortcut's stretch carries a little more light
          const carry = node[i]! >= CUT_A ? 0.1 * smooth(0, 1, f) : 0;
          out.x = bx[i]!; out.y = by[i]!; out.z = bz[i]!;
          out.size = 0.85 + 0.6 * glow; out.color = glow > 0.45 ? SLOT.pale : SLOT.ink;
          out.alpha = 0.55 + carry + 0.4 * glow;
          return;
        }
        case NODE: {
          const k = node[i]!;
          const du = (k - pu) * 2.2;
          const check = pAlpha * Math.exp(-du * du); // the stage being checked brightens a little
          const nx = NX[k]!, ny = NY[k]!;
          if (a[i]! < 0) {
            out.x = nx + (b[i]! - 0.5) * 0.016; out.y = ny + (c[i]! / 6.3 - 0.5) * 0.016; out.z = 0;
            out.size = 1.5 + 0.6 * check; out.color = SLOT.gold; out.alpha = 0.75 + 0.25 * check;
            return;
          }
          const ring = ringR(k) * (1 + 0.2 * check);
          // the slot stage holds still, so its gaps stay on its free lower side
          const ang = c[i]! + (k === SLOT_NODE ? 0 : t * 0.22 * (k % 2 ? -1 : 1));
          out.x = nx + Math.cos(ang) * ring;
          out.y = ny + Math.sin(ang) * ring * 0.9;
          out.z = Math.sin(ang) * ring * 0.6;
          out.size = 1.05 + 0.45 * check; out.color = SLOT.gold; out.alpha = 0.72 + 0.28 * check;
          return;
        }
        case NEEDLE: {
          // S1: a needle through the early stage. Printed, it points away from the fixed tick (the paper's own
          // definition); "show the corrections" turns it over (a 3D half turn) until it lines up with the tick.
          const u = a[i]!;
          let dx: number, dy: number;
          if (u < 0.6) { dx = 0; dy = SHAFT - (u / 0.6) * 2 * SHAFT; } // shaft, drawn tip-last
          else { const v = (u - 0.6) / 0.4, side = v < 0.5 ? -1 : 1, w = (v < 0.5 ? v : v - 0.5) * 2; dx = side * 0.042 * w; dy = -SHAFT + 0.042 * w; }
          const th = Math.PI * smooth(0.05, 0.95, f);
          out.x = NX[SIGN_NODE]! + dx;
          out.y = NY[SIGN_NODE]! + dy * Math.cos(th);
          out.z = dy * Math.sin(th) * 1.6;
          const on = smooth(0, 1, f);
          out.size = 0.85 + 0.35 * on;
          out.color = f < 0.5 ? SLOT.ink : SLOT.gold; // switches while the needle is edge-on
          out.alpha = 0.38 + 0.5 * on;
          return;
        }
        case TICK: {
          // the fixed reference: a short dim tick just above the third stage's ring, identical at every focus
          out.x = NX[SIGN_NODE]! + (b[i]! - 0.5) * 0.004;
          out.y = NY[SIGN_NODE]! + SHAFT + 0.03 + 0.036 * a[i]!;
          out.z = 0;
          out.size = 1.05; out.color = SLOT.dim; out.alpha = 0.85;
          return;
        }
        case PIECE: {
          // S2, S3: two short arcs hovering below the late stage; with focus they slot into its two gaps
          const k = a[i]! < 0.5 ? 0 : 1;
          const ang = GAP_A[k]! + (a[i]! * 2 - k - 0.5) * GAP_W * 0.84;
          const e = smooth(0, 1, f);
          const loose = 1 - e;
          const ring = ringR(SLOT_NODE) * (1 + loose * (0.95 + 0.08 * Math.sin(t * 0.5 + k * 2.1)));
          out.x = NX[SLOT_NODE]! + Math.cos(ang) * ring;
          out.y = NY[SLOT_NODE]! + Math.sin(ang) * ring * 0.9;
          out.z = Math.sin(ang) * ring * 0.6;
          const home = e > 0.85;
          out.size = 1.2; out.color = home ? SLOT.gold : SLOT.ink;
          out.alpha = home ? 0.72 : 0.44 + 0.2 * e;
          return;
        }
        case FLAT: {
          // the late-time line: identical at focus 0 and 1 (it only glows faintly while the corrections come in)
          const du = (NODES - 1 + (bx[i]! - NX[NODES - 1]!) / STEP - pu) * 4;
          const glow = pAlpha * Math.exp(-du * du);
          out.x = bx[i]!; out.y = by[i]!; out.z = bz[i]!;
          const fade = 1 - smooth(0.9, 1, a[i]!);
          out.size = 1.25 + 0.6 * glow; out.color = glow > 0.45 ? SLOT.pale : SLOT.gold;
          out.alpha = (0.68 + 0.3 * glow + 0.04 * Math.sin(t * 0.9 + a[i]! * 30) + 0.8 * f * (1 - f)) * (0.35 + 0.65 * fade);
          return;
        }
        case ARC: {
          const ds = (a[i]! - sS) * 7;
          const glow = sAlpha * Math.exp(-ds * ds);
          out.x = bx[i]!; out.y = by[i]!; out.z = bz[i]!;
          out.size = 0.95 + 0.45 * glow; out.color = SLOT.ink;
          out.alpha = 0.62 + 0.3 * glow;
          return;
        }
        case STRUT: {
          // with focus the struts crumble away and fade; the arc they held stays
          const e = smooth(0, 1, f);
          const fall = e * (0.04 + 0.1 * c[i]!) * (0.4 + a[i]!);
          out.x = bx[i]! + e * (d[i]! - 0.5) * 0.05;
          out.y = by[i]! - fall;
          out.z = bz[i]! + e * (b[i]! - 0.5) * 0.1;
          out.size = 0.85 - 0.3 * e; out.color = e > 0.85 ? SLOT.dim : SLOT.ink;
          out.alpha = 0.45 * (1 - 0.85 * e);
          return;
        }
        case PULSE: {
          // a tight head and a short tail trailing it along the chain
          const isTail = a[i]! >= 0.3;
          const tail = isTail ? (a[i]! - 0.3) * 0.75 : 0;
          chainPoint(pu - tail);
          const spread = isTail ? 0.004 : 0.006 + 0.008 * b[i]!;
          const ang = c[i]! * 6.2832 + t * 1.3;
          out.x = cx + Math.cos(ang) * spread;
          out.y = cy + Math.sin(ang) * spread;
          out.z = 0.05;
          out.size = isTail ? 0.95 - tail * 0.7 : 1.7 + 0.5 * d[i]!;
          out.color = SLOT.pale;
          out.alpha = pAlpha * (isTail ? 0.55 * (1 - tail * 1.6) : 0.92);
          return;
        }
        default: {
          // a quieter companion pulse along the shortcut, reaching the last stage at the same moment
          const s = Math.min(1, sS) - a[i]! * 0.15;
          const sc = s < 0 ? 0 : s;
          const ang = c[i]! * 6.2832 + t * 1.1;
          out.x = arcX(sc) + Math.cos(ang) * 0.01 * b[i]!;
          out.y = arcY(sc) + Math.sin(ang) * 0.01 * b[i]!;
          out.z = 0.05;
          out.size = 1.25 - 0.5 * a[i]!; out.color = SLOT.gold;
          out.alpha = sAlpha * 0.85 * (1 - 0.65 * a[i]!);
        }
      }
    };
  },
};
