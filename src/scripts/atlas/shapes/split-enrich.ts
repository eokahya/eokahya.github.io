/**
 * "Split or enrich": sizing experts before training under a fixed parameter budget.
 *
 * Focus 0 — a fixed pool of identical green particles (the budget; the number of lit particles never
 * changes) gathers once per loop into three candidate layouts of equal area, each held by a faint
 * enclosing outline: one large expert cluster in the middle, a diagonal pair of medium clusters on the
 * left and a stacked pair of elongated medium clusters on the right (a different factor shape). A faint
 * four-small outline sits below as a mere possibility and is never filled or chosen. Two pointer rings,
 * the tested gradient score (green) and the simple covariance baseline (pale), each keep their own
 * schedule: they leave, glide and settle at their own moments, over their own distances, and land on
 * good layouts, sometimes the same one (side by side, not mirrored), sometimes different ones, and
 * sometimes one stays while the other moves; they never cross mid-glide. The green ring carries a faint
 * dashed halo a little beyond itself: the margin it would need to clear to show an added benefit over
 * the baseline. It never clears it, not even when it swells while reading. No winner is marked; nothing
 * is red.
 * Focus 1 — "the initial gradients": drifting dust condenses into faint flow lines with a soft front
 * sweeping through the pool; all three layouts shimmer together and both stems read the flow with their
 * own, unsynchronised pulses. The halo stays uncleared. Schematic only, never data.
 */
import { SLOT, type ShapeDef } from '../types';

const CY = -0.06; // vertical centre of the candidate band
const CX = [-1.08, 0, 1.08] as const; // left pair, large cluster, right pair
const R_BIG = 0.31;
const R_MED = 0.22; // equal area: two medium clusters hold what one large one holds
const PAIR = 0.175; // diagonal offset of each left-pair cluster from its pair centre
const STACK = 0.19; // vertical offset of each right-pair cluster
const EL = 1.22; // right-pair elongation (equal area: x·EL, y/EL)
const G_Y = 0.7; // settled heights of the pointer rings: each keeps its own
const P_Y = 0.66;
const PTR_R = 0.085;
const HALO_R = 0.148; // the required margin: a dashed halo the green ring never reaches
const DASHES = 11;
const STEM_BOTTOM = CY + 0.46;
const E4_Y = -0.62;
const LINES = 5; // flow lines under focus
const LOOP = 64;
/** Environments of unequal length; the pool dissolves and regathers across the turn of the loop. */
const ENV_START = [0, 15, 31.5, 48] as const;
/**
 * Settled ring x per environment and selector. Chosen layouts: green 1, 2, 2, 1; pale 1, 1, 2, 0.
 * Shared layouts are held side by side at unequal offsets that swap which ring sits nearer the layout
 * centre, and at different heights; each selector has its own departure delay, so the moves are neither
 * simultaneous nor of equal length.
 */
const G_X = [0.19, 1.08, 1.2, 0] as const;
const P_X = [-0.12, 0, 0.89, -1.08] as const;
const G_DELAY = [0.6, 0.9, 1.2, 1.6] as const;
const P_DELAY = [1.5, 2.4, 0.5, 0.3] as const;
const G_START = new Float32Array(4), P_START = new Float32Array(4), G_DUR = new Float32Array(4), P_DUR = new Float32Array(4);
for (let e = 0; e < 4; e++) {
  const q = (e + 3) % 4;
  G_START[e] = ENV_START[e]! + G_DELAY[e]!; P_START[e] = ENV_START[e]! + P_DELAY[e]!;
  G_DUR[e] = 1.4 + 1.25 * Math.abs(G_X[e]! - G_X[q]!);
  P_DUR[e] = 1.4 + 1.25 * Math.abs(P_X[e]! - P_X[q]!);
}
/** Enclosing outlines per layout: centre x, semi-axes (a along the rotated x), rotation cos/sin. */
const S45 = Math.SQRT1_2;
const ENC = [
  { a: 0.51, b: 0.28, c: S45, s: S45 },
  { a: R_BIG + 0.045, b: R_BIG * 0.9 + 0.045, c: 1, s: 0 },
  { a: 0.36, b: 0.44, c: 1, s: 0 },
] as const;

const TAU = Math.PI * 2;
const frac = (v: number) => v - Math.floor(v);
const wrap = (v: number) => ((v % LOOP) + LOOP) % LOOP;
const sstep = (a: number, b: number, x: number) => {
  const v = x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a);
  return v * v * (3 - 2 * v);
};
const ellipseLen = (a: number, b: number) => Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));

/** Most recent departure of a selector at loop time tt (index into its schedule). */
const lastStart = (start: Float32Array, tt: number) => {
  let best = 0, bestAge = Infinity;
  for (let e = 0; e < 4; e++) {
    const age = wrap(tt - start[e]!);
    if (age < bestAge) { bestAge = age; best = e; }
  }
  return best;
};

export const splitEnrich: ShapeDef = {
  id: 'split-enrich',
  restTime: 57.5, // green on the large cluster, pale on the left pair, both settled
  create(count, random) {
    // ---- roles ----
    const nPtr = Math.max(12, Math.round(count * 0.06)); // per pointer
    const nHalo = Math.max(DASHES * 4, Math.round(count * 0.026));
    const nDust = Math.round(count * 0.02);
    const nFlow = Math.round(count * 0.18);
    const nGhost = Math.round(count * 0.08);
    const nPool = count - 2 * nPtr - nHalo - nDust - nFlow - nGhost;
    const role = new Uint8Array(count); // 0 pool, 1 green pointer, 2 pale pointer, 3 ghost, 4 flow, 5 dust, 6 halo
    const local = new Uint16Array(count);
    {
      let i = 0;
      const put = (r: number, n: number) => { for (let j = 0; j < n && i < count; j++, i++) { role[i] = r; local[i] = j; } };
      put(0, nPool); put(1, nPtr); put(2, nPtr); put(6, nHalo); put(3, nGhost); put(4, nFlow); put(5, nDust);
    }

    // ---- per-particle data ----
    const ax = new Float32Array(count), ay = new Float32Array(count), az = new Float32Array(count); // home / cloud
    const bx = new Float32Array(count), by = new Float32Array(count); // cluster / outline centre
    const rad = new Float32Array(count), ang = new Float32Array(count), spin = new Float32Array(count);
    const ea = new Float32Array(count), eb = new Float32Array(count), rc = new Float32Array(count), rs = new Float32Array(count);
    const cloudR = new Float32Array(count), delay = new Float32Array(count), seed = new Float32Array(count), kind = new Uint8Array(count);

    // ghost budget: the four-small possibility gets a fixed small share, the three enclosures share the rest by length
    const nE4 = Math.min(nGhost, Math.max(20, Math.round(nGhost * 0.2)));
    const encLen = [ellipseLen(ENC[0].a, ENC[0].b), ellipseLen(ENC[1].a, ENC[1].b), ellipseLen(ENC[2].a, ENC[2].b)];
    const encTot = encLen[0]! + encLen[1]! + encLen[2]!;
    const perDash = Math.ceil(nHalo / DASHES);

    for (let i = 0; i < count; i++) {
      const j = local[i]!;
      seed[i] = random();
      switch (role[i]) {
        case 0: {
          // pool: cloud position, then a cluster in one of the three candidate layouts
          ang[i] = random() * TAU; // cloud angle
          cloudR[i] = Math.sqrt(random()); // cloud radius fraction
          az[i] = (random() - 0.5) * 0.8;
          const k = j % 3, m = Math.floor(j / 3) % 2;
          kind[i] = k;
          let cx: number = CX[k]!, cy = CY, r = R_BIG;
          ea[i] = 1; eb[i] = 0.9;
          if (k === 0) {
            r = R_MED;
            const sx = m ? 1 : -1;
            cx += sx * PAIR; cy += sx * PAIR; // diagonal pair, rising to the right
          } else if (k === 2) {
            r = R_MED;
            cy += (m ? 1 : -1) * STACK; // stacked pair of elongated clusters
            ea[i] = EL; eb[i] = 0.9 / EL;
          }
          bx[i] = cx; by[i] = cy;
          rad[i] = r * Math.pow(random(), 0.62);
          spin[i] = (k === 1 || m ? 1 : -1) * (0.2 + 0.32 * (1 - rad[i]! / r));
          delay[i] = random() * 1.2;
          seed[i] = random() * TAU; // orbit phase
          break;
        }
        case 1: case 2: {
          const nRing = Math.round(nPtr * 0.7);
          if (j < nRing) { kind[i] = 0; ang[i] = (j / nRing) * TAU; }
          else { kind[i] = 1; ang[i] = (j - nRing + 0.5) / (nPtr - nRing); }
          break;
        }
        case 6: {
          // halo: DASHES short arcs, each covering about half of its segment
          const d = j % DASHES, q = Math.floor(j / DASHES);
          ang[i] = ((d + 0.48 * (q + 0.5) / perDash) / DASHES) * TAU;
          break;
        }
        case 3: {
          // ghost outlines: one enclosure per candidate layout, and the faint four-small possibility
          if (j < nE4) {
            const f = (j / nE4) * 4;
            const q = Math.min(3, Math.floor(f));
            bx[i] = (q % 2 ? 1 : -1) * 0.09; by[i] = E4_Y + (q < 2 ? 1 : -1) * 0.09;
            ea[i] = eb[i] = 0.068; rc[i] = 1; rs[i] = 0; kind[i] = 3;
            ang[i] = (f - q) * TAU;
          } else {
            let g = ((j - nE4 + 0.5) / (nGhost - nE4)) * encTot;
            let k = 0;
            while (k < 2 && g > encLen[k]!) { g -= encLen[k]!; k++; }
            const e = ENC[k]!;
            kind[i] = k;
            bx[i] = CX[k]!; by[i] = CY;
            ea[i] = e.a; eb[i] = e.b; rc[i] = e.c; rs[i] = e.s;
            ang[i] = (g / encLen[k]!) * TAU;
          }
          break;
        }
        case 4: {
          // flow: drifting dust that condenses onto gentle streamlines under focus
          const line = j % LINES;
          kind[i] = line;
          ax[i] = (Math.floor(j / LINES) + 0.35 * random()) / Math.ceil(nFlow / LINES); // evenly spaced along the line
          ay[i] = (random() - 0.5) * 0.6; // dust offset at focus 0
          az[i] = (random() - 0.5) * 0.5;
          by[i] = CY - 0.4 + (line * 0.8) / (LINES - 1);
          break;
        }
        default: {
          ax[i] = (random() * 2 - 1) * 1.55; ay[i] = (random() * 2 - 1) * 0.94; az[i] = (random() - 0.5) * 1.1;
          rad[i] = 0.6 + 0.5 * random();
          break;
        }
      }
    }

    // ---- per-frame state, recomputed once per distinct (t, focus) ----
    let lastT = NaN, lastF = NaN, tt = 0, cloudness = 0, gather = 1;
    let gx = 0, gy = 0, px = 0, py = 0, settleG = 0, settleP = 0, breathG = 0, breathP = 0;
    let pulseFront = 0, shimmer = 0, stemG = 0, stemP = 0, readG = 0, readP = 0;
    const chosen = new Float32Array(3);

    const frameState = (t: number, focus: number) => {
      lastT = t; lastF = focus;
      tt = wrap(t);
      // the pool dissolves and regathers once per loop, across the turn of the loop
      cloudness = tt > 60 ? sstep(61.6, 63.8, tt) : 1 - sstep(0.4, 3, tt);
      gather = 1 - cloudness;
      const gate = sstep(0.55, 0.95, gather);
      {
        const e = lastStart(G_START, tt), q = (e + 3) % 4;
        const age = wrap(tt - G_START[e]!), dur = G_DUR[e]!;
        const s = sstep(0, dur, age);
        gx = G_X[q]! + (G_X[e]! - G_X[q]!) * s;
        const toNext = wrap(G_START[(e + 1) % 4]! - tt);
        settleG = sstep(dur + 0.15, dur + 1.05, age) * sstep(0.15, 1.05, toNext) * gate;
        breathG = Math.sin(Math.PI * s);
        gy = G_Y + 0.07 * breathG * (1 - settleG) + 0.009 * Math.sin(t * 0.53 + 0.4);
      }
      {
        const e = lastStart(P_START, tt), q = (e + 3) % 4;
        const age = wrap(tt - P_START[e]!), dur = P_DUR[e]!;
        const s = sstep(0, dur, age);
        px = P_X[q]! + (P_X[e]! - P_X[q]!) * s;
        const toNext = wrap(P_START[(e + 1) % 4]! - tt);
        settleP = sstep(dur + 0.3, dur + 1.3, age) * sstep(0.2, 1.2, toNext) * gate;
        breathP = Math.sin(Math.PI * s);
        py = P_Y + 0.06 * breathP * (1 - settleP) + 0.008 * Math.sin(t * 0.41 + 2.1);
      }
      // whichever layout a settled ring points at brightens a little more; two rings add, softly
      for (let k = 0; k < 3; k++) {
        const a = Math.max(0, 1 - Math.abs(gx - CX[k]!) / 0.5) * settleG;
        const b = Math.max(0, 1 - Math.abs(px - CX[k]!) / 0.5) * settleP;
        chosen[k] = 1 - (1 - 0.8 * a) * (1 - 0.8 * b);
      }
      // focus: a soft front sweeps the flow lines every 8 s; each stem reads with its own rhythm
      pulseFront = -2.2 + 4.4 * frac((t + 1.5) / 8);
      shimmer = focus * Math.exp(-pulseFront * pulseFront * 0.9);
      stemG = -0.3 + 1.9 * frac(t / 4.1);
      stemP = -0.3 + 1.9 * frac((t + 1.3) / 4.7);
      const rg = (stemG - 1.06) * 5, rp = (stemP - 1.06) * 5;
      readG = focus * settleG * Math.exp(-rg * rg);
      readP = focus * settleP * Math.exp(-rp * rp);
    };

    return (i, t, focus, out) => {
      if (t !== lastT || focus !== lastF) frameState(t, focus);
      const r = role[i]!;

      if (r === 0) {
        // ---- pool ----
        const d = delay[i]!;
        const g = tt > 60 ? 1 - sstep(61.4 + 0.5 * d, 63.2 + 0.6 * d, tt) : sstep(0.2 + 0.6 * d, 2.4 + 0.6 * d, tt);
        const k = kind[i]!;
        const ca = ang[i]! + t * 0.035;
        const cloudX = 0.45 * bx[i]! + Math.cos(ca) * cloudR[i]! * 0.98;
        const cloudY = CY + Math.sin(ca) * cloudR[i]! * 0.6;
        const th = seed[i]! + t * spin[i]!;
        const rr = rad[i]!;
        const c = Math.cos(th), sn = Math.sin(th);
        const kx = bx[i]! + c * rr * ea[i]!, ky = by[i]! + sn * rr * eb[i]!;
        const arc = Math.sin(Math.PI * g) * 0.06;
        out.x = cloudX + (kx - cloudX) * g;
        out.y = cloudY + (ky - cloudY) * g + arc;
        out.z = az[i]! * (1 - g) + c * rr * 0.55 * g;
        const R = k === 1 ? R_BIG : R_MED;
        const core = 1 - rad[i]! / R;
        const pick = chosen[k]! * g;
        out.size = 1.05 + (0.4 + 0.8 * core * core) * g + 0.25 * pick + 0.18 * shimmer;
        out.color = SLOT.green;
        out.alpha = 0.55 + 0.12 * g + 0.3 * pick + 0.05 * shimmer;
        return;
      }

      if (r === 1 || r === 2) {
        // ---- pointer rings: same kind of instrument, each on its own schedule ----
        const green = r === 1;
        const cx = green ? gx : px, cy = green ? gy : py;
        const settle = green ? settleG : settleP, read = green ? readG : readP;
        out.color = green ? SLOT.green : SLOT.pale;
        if (kind[i] === 0) {
          const a = ang[i]! + t * (green ? 0.3 : 0.26);
          // reading swells the ring a little; for green it stays well inside the dashed margin
          const pr = PTR_R * (1 + 0.05 * settle + 0.14 * read);
          out.x = cx + Math.cos(a) * pr;
          out.y = cy + Math.sin(a) * pr;
          out.z = 0.12 + Math.sin(a) * 0.04;
          const bead = local[i]! % 5 === 0 ? 1 : 0;
          out.size = 1.25 + 0.75 * bead + 0.6 * read;
          // the pale ring gets a small lift so both read with comparable weight on warm paper
          out.alpha = 0.66 + 0.2 * settle + 0.15 * read + (green ? 0 : 0.06);
        } else {
          // dotted stem: drawn down onto the chosen layout once settled (the dots keep their spacing and
          // appear top first, so nothing piles up under a moving ring); under focus, pulses rise
          const s = ang[i]!;
          const top = cy - PTR_R - 0.025;
          const depth = 1 - s;
          out.x = cx;
          out.y = top - (top - STEM_BOTTOM) * depth;
          out.z = 0.1;
          const pd = (s - (green ? stemG : stemP)) * 8;
          const pulse = Math.exp(-pd * pd) * focus;
          out.size = 0.85 + 0.9 * pulse;
          const reveal = sstep(depth * 0.92, depth * 0.92 + 0.08, settle);
          out.alpha = (0.3 + 0.25 * settle + 0.45 * pulse + (green ? 0 : 0.04)) * reveal;
        }
        return;
      }

      if (r === 6) {
        // ---- required margin: a faint dashed halo around the green ring, never reached ----
        const a = ang[i]! - t * 0.05;
        out.x = gx + Math.cos(a) * HALO_R;
        out.y = gy + Math.sin(a) * HALO_R;
        out.z = 0.1;
        out.size = 1;
        out.color = SLOT.ink;
        out.alpha = 0.24 + 0.18 * settleG;
        return;
      }

      if (r === 3) {
        // ---- enclosing outlines of the candidate layouts; the four-small possibility stays faint ----
        const a = ang[i]! + t * 0.04;
        const lx = Math.cos(a) * ea[i]!, ly = Math.sin(a) * eb[i]!;
        out.x = bx[i]! + lx * rc[i]! - ly * rs[i]!;
        out.y = by[i]! + lx * rs[i]! + ly * rc[i]!;
        out.z = -0.05;
        out.color = SLOT.ink;
        const k = kind[i]!;
        if (k === 3) {
          out.size = 1.1;
          out.alpha = 0.2 + 0.08 * cloudness;
        } else {
          out.size = 1.2;
          out.alpha = 0.34 + 0.1 * cloudness + 0.1 * chosen[k]!;
        }
        return;
      }

      if (r === 4) {
        // ---- flow: drifting dust at focus 0, faint streamlines with a travelling front at focus 1 ----
        const f = frac(ax[i]! + t * 0.024);
        const x = -1.56 + 3.12 * f;
        const env = Math.sin(Math.PI * f);
        const line = kind[i]!;
        const ly = by[i]! + 0.07 * Math.sin(1.9 * x + line * 1.3 + t * 0.12);
        out.x = x;
        out.y = ly + ay[i]! * (1 - focus);
        out.z = az[i]! * (1 - 0.8 * focus);
        const dx = x - pulseFront;
        const sweep = focus * Math.exp(-dx * dx * 4);
        out.size = 0.72 + 0.26 * focus + 0.22 * sweep;
        out.color = SLOT.ink;
        out.alpha = env * (0.2 + 0.2 * focus + 0.15 * sweep);
        return;
      }

      // ---- dust ----
      const ph = seed[i]! * TAU;
      out.x = ax[i]! + 0.03 * Math.sin(t * 0.09 + ph);
      out.y = ay[i]! + 0.025 * Math.cos(t * 0.07 + ph * 1.7);
      out.z = az[i]!;
      out.size = rad[i]!;
      out.color = SLOT.dim;
      out.alpha = 0.4 + 0.18 * Math.sin(t * 0.5 + ph * 5);
    };
  },
};
