/**
 * Conformal-scalar audit: modes carried outward on an expanding grid keep fading.
 *
 * A dotted comoving grid streams from left to right; its points and cross-rungs spread apart as they
 * travel (the scale factor growing). A few mode threads ride the same flow: their wavelength
 * stretches, their ripple flattens and their glow fades (redshifting); nothing grows in absolute
 * terms. Two thin dotted edge lines around the track (the counterterm-dependent relative ln a term,
 * which may be zero) slowly widen and collapse back onto the outermost thread; only their width
 * moves, never their brightness, which follows the same fading as the modes.
 *
 * focus 1 ("Show the published claim"): faint dust gathers into a dashed ghost trace that starts just
 * above the modes near their source and curves upward away from them (the printed growth). It never
 * touches the threads and thins out along its own line as it climbs. The corrected track is unchanged.
 * Schematic only: no axes, no data.
 */
import { SLOT, type ShapeDef } from '../types';

const TAU = Math.PI * 2;
/** Flow speed in comoving units per second (one crossing = 40 s). */
const SPEED = 0.025;
/** Expansion: x = X0 + LENGTH · (e^{C u} − 1)/(e^C − 1); dx/du grows by e^C ≈ 7 across the field. */
const X0 = -1.3, LENGTH = 2.85, C = 2.0, NORM = LENGTH / (Math.exp(C) - 1);
/** Vertical centre of the track and half-width of the band of mode threads. */
const YC = -0.18, BAND = 0.2;
/** Grid rows (offsets from the track centre) and number of comoving rungs. */
const ROWS = [-0.8, -0.58, -0.38, 0.38, 0.58, 0.8];
const RUNGS = 8;
/** Mode threads: vertical lane, ripples per comoving length (integers keep the wrap seamless), phase. */
const LANES = [-0.19, -0.095, 0.004, 0.1, 0.198];
const WAVES = [7, 10, 8, 9, 6];
const PHASES = [0.3, 2.1, 4.0, 5.2, 1.2];
/** Ripple amplitude where the modes enter, and the halo's widest extra offset beyond the band. */
const AMP0 = 0.03, HALO_W = 0.075;
/** Ghost trace (the printed growth): dashes along it, gap above the top thread, total rise. */
const DASHES = 24, GAP = 0.08, RISE = 0.75, G0 = -1.28, GLEN = 2.8;

const xOf = (u: number) => X0 + NORM * (Math.exp(C * u) - 1);
/** Mild spreading of the grid with distance: rows open by ~16% from left to right. */
const fan = (u: number) => 0.84 + 0.16 * u;
/** Smooth fade-in below `lo` and fade-out above `hi` (u in [0, 1]). */
const fade = (u: number, lo: number, hi: number) => {
  const a = u < lo ? Math.max(0, u / lo) : 1;
  const b = u > hi ? Math.max(0, (1 - u) / (1 - hi)) : 1;
  return a * a * (3 - 2 * a) * b * b * (3 - 2 * b);
};
/** Brightness of anything carried by the flow: only ever decreases with u. */
const envelope = (u: number) => Math.exp(-1.3 * u);

export const conformalScalar: ShapeDef = {
  id: 'conformal-scalar',
  restTime: 4.25,
  create(count, random) {
    // roles: 0 dust, 1 ghost (dust at focus 0), 2 grid row, 3 rung, 4 halo, 5 mode thread
    const role = new Uint8Array(count);
    const a = new Float32Array(count), b = new Float32Array(count), c = new Float32Array(count), d = new Float32Array(count);
    const total = new Uint32Array(6);
    for (let i = 0; i < count; i++) {
      const r = random();
      a[i] = random(); b[i] = random(); c[i] = random(); d[i] = random();
      role[i] = r < 0.05 ? 0 : r < 0.17 ? 1 : r < 0.3 ? 2 : r < 0.42 ? 3 : r < 0.5 ? 4 : 5;
      total[role[i]!]!++;
    }
    // Rows, rungs, halo lines and threads get evenly spaced comoving labels (k / count in that line,
    // so there is no missing slot), and their spacing on screen widens smoothly as the grid expands.
    const inLine = (kind: number, line: number, lines: number) => Math.max(1, Math.floor((total[kind]! - line - 1) / lines) + 1);
    const rank = new Uint32Array(6);
    for (let i = 0; i < count; i++) {
      const kind = role[i]!, k = rank[kind]!++;
      if (kind === 2) {
        const row = k % ROWS.length, n = inLine(2, row, ROWS.length);
        b[i] = (row + 0.5) / ROWS.length;
        a[i] = (Math.floor(k / ROWS.length) + 0.5 * (row % 2)) / n;
      } else if (kind === 3) {
        const rung = k % RUNGS, n = inLine(3, rung, RUNGS);
        a[i] = (rung + 0.5) / RUNGS;
        b[i] = (Math.floor(k / RUNGS) + 0.5) / n;
      } else if (kind === 4) {
        const side = k % 2, n = inLine(4, side, 2);
        c[i] = side;
        a[i] = (Math.floor(k / 2) + 0.5 * side) / n;
      } else if (kind === 5) {
        const lane = k % LANES.length, n = inLine(5, lane, LANES.length);
        c[i] = (lane + 0.5) / LANES.length;
        a[i] = (Math.floor(k / LANES.length) + lane / LANES.length) / n;
      }
    }
    // the halo's width breathes slowly between zero and a narrow sheath
    const BREATH = TAU / 17;

    return (i, t, focus, out) => {
      const kind = role[i]!;
      const ai = a[i]!, bi = b[i]!, ci = c[i]!, di = d[i]!;

      if (kind <= 1) {
        // background dust: slow drift over the whole field
        const dx = -1.52 + 3.04 * ai + 0.03 * Math.sin(t * 0.11 + di * TAU);
        const dy = -0.95 + 1.9 * bi + 0.03 * Math.cos(t * 0.09 + ci * TAU);
        const dz = (ci - 0.5) * 0.9;
        const twinkle = 0.22 + 0.1 * Math.sin(t * 0.6 + ai * 50);
        if (kind === 0 || focus <= 0) {
          out.x = dx; out.y = dy; out.z = dz;
          out.size = 0.5 + 0.5 * di;
          out.color = SLOT.dim;
          out.alpha = twinkle;
          return;
        }
        // ghost trace: a faint dashed curve that starts just above the top thread near the source and
        // bends upward (convex) away from it. Past the middle the dashes shorten, shrink and fade along
        // the line itself: it thins out rather than bursting. Dust gathers into it as focus rises.
        let e = (focus - di * 0.35) / 0.65;
        e = e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e);
        const s = ((Math.floor(ai * DASHES) + 0.5) / DASHES + t * 0.011) % 1;
        const loose = s < 0.55 ? 0 : (s - 0.55) / 0.45;
        const half = 0.03 * (1 - 0.75 * loose);
        const along = (bi - 0.5) * 2 * half;
        const cx = G0 + GLEN * s;
        // the top thread's crest envelope below this point (lane, fan and ripple amplitude)
        const q = 1 + (cx - X0) / NORM;
        const uq = q > 1 ? Math.log(q) / C : 0;
        const crest = YC + LANES[4]! * fan(uq) + AMP0 / q;
        const slope = (2 * RISE * s) / GLEN;
        out.x = dx + (cx + along - dx) * e;
        const gy = crest + GAP + RISE * s * s + slope * along + (ci - 0.5) * 0.004 + loose * (di - 0.5) * 0.05;
        out.y = dy + (gy - dy) * e;
        out.z = dz + (LANES[4]! * 0.9 - dz) * e;
        const ds = 0.5 + 0.5 * di, gs = 1.25 * (1 - 0.45 * loose);
        out.size = ds + (gs - ds) * e;
        out.color = SLOT.dim;
        const ga = 0.3 * fade(s, 0.06, 0.55) * (1 - loose) * (1 - loose);
        // near the loop seam (s wraps 1 → 0) a half-gathered grain would jump: hide it there
        const seam = Math.min(1, Math.min(s, 1 - s) / 0.05);
        out.alpha = (twinkle + (ga - twinkle) * e) * (1 - (1 - seam) * Math.min(1, 25 * e));
        return;
      }

      if (kind === 2) {
        // grid rows: comoving points that spread apart as they travel
        const row = Math.floor(bi * ROWS.length);
        const u = (ai + t * SPEED) % 1;
        out.x = xOf(u);
        out.y = YC + ROWS[row]! * fan(u);
        out.z = ROWS[row]! * 0.25;
        out.size = 1.2;
        out.color = SLOT.dim;
        out.alpha = 0.85 * fade(u, 0.06, 0.92);
        return;
      }

      if (kind === 3) {
        // rungs: comoving cross-lines, evenly spaced in u, so their spacing on screen keeps widening
        const k = Math.floor(ai * RUNGS);
        const u = ((k + 0.5) / RUNGS + t * SPEED) % 1;
        const span = ROWS[ROWS.length - 1]! * fan(u);
        out.x = xOf(u);
        out.y = YC + (bi * 2 - 1) * span;
        out.z = (bi - 0.5) * 0.3;
        out.size = 1.2;
        out.color = SLOT.dim;
        out.alpha = fade(u, 0.06, 0.92);
        return;
      }

      if (kind === 4) {
        // halo: two thin dotted edge lines; their offset breathes from the outermost thread (zero) to a
        // narrow sheath, while their brightness depends only on position and only ever fades
        const u = (ai + t * SPEED) % 1;
        const breath = 0.5 - 0.5 * Math.cos(t * BREATH);
        const side = ci < 0.5 ? -1 : 1;
        out.x = xOf(u);
        out.y = YC + side * (BAND + HALO_W * breath) * fan(u);
        out.z = side * 0.18;
        out.size = 1.1;
        out.color = SLOT.violet;
        out.alpha = 0.55 * envelope(u) * fade(u, 0.12, 0.9);
        return;
      }

      // mode threads: comoving dots, so crests spread apart (wavelength stretches) while the ripple
      // flattens and the glow fades; dots also thin out as the grid expands
      const lane = Math.floor(ci * LANES.length);
      const u = (ai + t * SPEED) % 1;
      const amplitude = AMP0 * Math.exp(-C * u);
      const ripple = Math.sin(TAU * WAVES[lane]! * ai + PHASES[lane]! + t * 0.5);
      out.x = xOf(u);
      out.y = YC + LANES[lane]! * fan(u) + amplitude * ripple + (bi - 0.5) * 0.006;
      out.z = LANES[lane]! * 0.9 + (di - 0.5) * 0.04;
      const glow = envelope(u) * fade(u, 0.12, 0.9);
      const accent = di < 0.035;
      out.size = (accent ? 2.6 : 1.9) * (1 - 0.35 * u);
      out.color = accent ? SLOT.pale : SLOT.violet;
      out.alpha = glow;
    };
  },
};
