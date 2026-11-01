/**
 * GPT-2 spectral-mean plate: a layer drawn as a spectrum of directions.
 *
 * A stream enters a hub and fans out into directions whose reach and brightness fall with their
 * strength: a few strong kept directions above (coral, the reduced model keeps them) and a wide bundle
 * of many faint discarded ones below. The discarded bundle is cut and folded onto one steady dotted
 * line, its mean, which stands in for it. A pulse (the intervention) runs through: it lights the kept
 * arcs, but it runs most strongly through the faint discarded bundle and on along its ghost paths to
 * the output (the full model's route); the stand-in line does not answer. Past the layer, two families
 * of ripples leave the output once per pulse: the full model's echo (ink), a wide fan opening to the
 * right, and the reduced model's echo (coral), much weaker, smaller and lopsided, which leaves the same
 * output but lands well away from the original, in a narrow fan bent down below it. The two never meet:
 * the large common gap is the point (both stand-ins leave a large error).
 *
 * focus 1 ("Gaussian stand-in"): the steady line widens into a soft, fainter band that reaches a little
 * further into the discarded bundle, while the reduced echo turns only slightly further away still; the
 * change is small next to the gap that both stand-ins share.
 * Schematic only; no axes, no measured values.
 */
import { SLOT, type Particle, type ShapeDef } from '../types';

const TAU = Math.PI * 2;
const PERIOD = 6; // seconds per pulse
const Y0 = -0.07;
const HX = -0.94; // hub
const OX = 0.54; // output, centre of the echoes
const SPAN = OX - HX;
const IN_X = -1.54; // left end of the incoming stream
const CUT = 0.36; // where the discarded bundle is cut (fraction along the layer)
const JOIN = 0.5; // where the folded bundle meets its mean line
// One monotone spectrum: reach falls with strength, kept above, discarded below (4 kept, 10 discarded).
const KEPT = [0.58, 0.48, 0.39, 0.31];
const DROP = [-0.28, -0.255, -0.23, -0.205, -0.18, -0.155, -0.13, -0.105, -0.08, -0.055];
const MEAN = DROP.reduce((sum, b) => sum + b, 0) / DROP.length;
const RINGS = [0.17, 0.37, 0.58, 0.8];
const THETA = 0.86; // half-opening of the full echo's arcs
// The reduced echo: a narrow fan about a direction bent well below the full fan (the gap between the
// fans stays open at every focus), smaller and lopsided; the Gaussian turns it a little further away.
const RED_DIR = -1.56, RED_TURN = -0.04, RED_HALF = 0.44, RED_SCALE = 0.6;
// An echo crest runs from just inside the first ring (R0) to just beyond the last (R1) once per period, so
// there is one crest per pulse and its clock wraps while every ring is dark.
const R0 = -0.06, R1 = 1.03;
const CREST = 0.1; // radial width of a crest
// Pulse timing, as fractions of a period: on the stream, then through the layer, then the echo.
const S0 = 0.1, S1 = 0.34; // stream: glint enters at S0 (off-path), reaches the hub at S1
const LAYER = 0.4; // the layer takes this long; the pulse reaches the output at S1 + LAYER
const LEAD = 0.2; // layer glint starts this far before the hub, so the wrap of its clock is invisible
const ECHO0 = S1 + LAYER;

// Roles, in allocation order with their shares of the particles.
const DUST = 0, STREAM = 1, KNOT = 2, KEEP = 3, DISC = 4, FOLD = 5, GHOST = 6, STAND = 7, FULL = 8, REDUCED = 9;
const SHARE = [0.08, 0.08, 0.03, 0.19, 0.11, 0.05, 0.15, 0.035, 0.2, 0.075];

const bulgeY = (b: number, s: number) => Y0 + b * Math.sin(Math.PI * s);
const discZ = (l: number, s: number) => -0.12 * Math.sin(Math.PI * s) * (l / (DROP.length - 1) - 0.5);
// per-line stagger so the dots of neighbouring lines do not stack into columns
const stagger = (l: number) => ((l * 0.618034) % 1) - 0.5;

export const gpt2Spectral: ShapeDef = {
  id: 'gpt2-spectral',
  restTime: 3.2,
  create(count, random) {
    const role = new Uint8Array(count);
    const line = new Uint8Array(count);
    const bx = new Float32Array(count), by = new Float32Array(count), bz = new Float32Array(count);
    const s = new Float32Array(count); // position along a path (pulse coordinate) or ring angle
    const ca = new Float32Array(count), sa = new Float32Array(count); // ring angle
    const gx = new Float32Array(count), gy = new Float32Array(count); // Gaussian offsets (squashed)
    const ph = new Float32Array(count), weight = new Float32Array(count);

    // Assign roles at random (so morphs from other shapes stay well mixed), then stratify inside each role.
    const cumulative = SHARE.map((_, k) => SHARE.slice(0, k + 1).reduce((a, b) => a + b, 0));
    const members: number[][] = SHARE.map(() => []);
    for (let i = 0; i < count; i++) {
      const r = random();
      let k = 0;
      while (k < SHARE.length - 1 && r >= cumulative[k]!) k++;
      role[i] = k;
      members[k]!.push(i);
      ph[i] = random();
      const u = Math.max(1e-6, random()), v = random();
      const m = Math.sqrt(-2 * Math.log(u));
      gx[i] = Math.tanh(0.8 * m * Math.cos(TAU * v));
      gy[i] = Math.tanh(0.8 * m * Math.sin(TAU * v));
    }

    const along = (list: number[], lines: number, place: (i: number, j: number, n: number, l: number) => void) => {
      const perLine = Math.max(1, Math.ceil(list.length / lines));
      list.forEach((i, j) => place(i, Math.floor(j / lines), perLine, j % lines));
    };

    // Dust: a wide, faint ellipse behind everything.
    for (const i of members[DUST]!) {
      const angle = random() * TAU, radius = 0.3 + 0.75 * Math.sqrt(random());
      bx[i] = Math.cos(angle) * radius * 1.5;
      by[i] = Math.sin(angle) * radius * 0.92;
      bz[i] = (random() - 0.5) * 1.0;
      s[i] = random() * TAU;
      weight[i] = random();
    }
    // Incoming stream: three strands converging on the hub.
    along(members[STREAM]!, 3, (i, j, n, l) => {
      const t = (j + 0.5 + (random() - 0.5) * 0.5) / n;
      line[i] = l;
      s[i] = t;
      const spread = (l - 1) * 0.07 * (1 - t) * (1 - t);
      bx[i] = IN_X + (HX - IN_X) * t;
      by[i] = Y0 + spread + 0.012 * Math.sin(t * 9 + l * 2);
      bz[i] = (l - 1) * 0.08 * (1 - t);
    });
    // Knots at the hub and at the output.
    along(members[KNOT]!, 2, (i, j, n, l) => {
      line[i] = l;
      const angle = TAU * (j / n) + l;
      const radius = 0.018 + 0.05 * Math.pow(random(), 1.4);
      s[i] = angle;
      weight[i] = radius;
      ph[i] = j & 1; // at the output, alternate ink (full model) and coral (reduced model)
      bx[i] = l === 0 ? HX : OX;
      by[i] = Y0;
    });
    // Kept directions: strong arcs from hub to output, reach and brightness falling with strength.
    along(members[KEEP]!, KEPT.length, (i, j, n, l) => {
      const t = Math.min(0.995, (j + 0.5 + 0.6 * stagger(l) + (random() - 0.5) * 0.25) / n);
      line[i] = l;
      s[i] = t;
      weight[i] = 1 - l * 0.16;
      bx[i] = HX + SPAN * t;
      by[i] = bulgeY(KEPT[l]!, t);
      bz[i] = 0.16 * Math.sin(Math.PI * t) * (0.5 - l / (KEPT.length - 1));
    });
    // Discarded directions up to the cut: many, faint, reach and brightness still falling with strength.
    along(members[DISC]!, DROP.length, (i, j, n, l) => {
      const t = Math.min(CUT, (CUT * (j + 0.5 + 0.8 * stagger(l) + (random() - 0.5) * 0.25)) / n);
      line[i] = l;
      s[i] = t;
      weight[i] = 1 - l * 0.05;
      bx[i] = HX + SPAN * t;
      by[i] = bulgeY(DROP[l]!, t);
      bz[i] = discZ(l, t);
    });
    // Folding: each discarded direction bends onto the mean line between the cut and the join.
    // Fixed slots: interleaved ink and coral dots cross-fade along the fold instead of switching colour.
    along(members[FOLD]!, DROP.length, (i, j, n, l) => {
      const f = (j + 0.5) / n;
      const t = CUT + (JOIN - CUT) * f;
      const e = f * f * (3 - 2 * f);
      line[i] = l;
      s[i] = t;
      weight[i] = e;
      ph[i] = (j + l) & 1;
      bx[i] = HX + SPAN * t;
      by[i] = bulgeY(DROP[l]! + (MEAN - DROP[l]!) * e, t);
      bz[i] = discZ(l, t) * (1 - e);
    });
    // Ghosts: where the discarded directions would have gone, beyond the cut (the full model's route).
    along(members[GHOST]!, DROP.length, (i, j, n, l) => {
      const t = Math.min(0.995, CUT + ((1 - CUT) * (j + 0.5 + 0.8 * stagger(l) + (random() - 0.5) * 0.25)) / n);
      line[i] = l;
      s[i] = t;
      weight[i] = 1 - l * 0.04;
      bx[i] = HX + SPAN * t;
      by[i] = bulgeY(DROP[l]!, t);
      bz[i] = discZ(l, t);
    });
    // The stand-in: one steady dotted line, the mean of the discarded bundle. Its Gaussian band offsets are
    // spread evenly (not drawn at random) and gathered towards the middle, so the band reads as a soft blur.
    along(members[STAND]!, 1, (i, j, n) => {
      const t = JOIN + ((1 - JOIN) * (j + 0.5)) / n;
      const v = 2 * ((j * 0.618034 + 0.31) % 1) - 1;
      gy[i] = Math.sign(v) * Math.pow(Math.abs(v), 1.5);
      s[i] = t;
      bx[i] = HX + SPAN * t;
      by[i] = bulgeY(MEAN, t);
      // the Gaussian band is as wide as the bundle it replaces, narrowing towards the output
      weight[i] = Math.sin(Math.PI * t);
    });
    // Echo arcs: stratified by arc length so dot density is even.
    const ringLength = RINGS.reduce((sum, r) => sum + r, 0);
    for (const family of [FULL, REDUCED]) {
      const list = members[family]!;
      list.forEach((i, j) => {
        let tau = ((j + 0.5) / list.length) * ringLength, k = 0;
        while (k < RINGS.length - 1 && tau > RINGS[k]!) { tau -= RINGS[k]!; k++; }
        const theta = THETA * (2 * Math.min(1, tau / RINGS[k]!) - 1);
        line[i] = k;
        s[i] = theta;
        ca[i] = Math.cos(theta);
        sa[i] = Math.sin(theta);
        weight[i] = 1 - Math.pow(Math.abs(theta) / THETA, 6); // soft ends
      });
    }

    // Fewer particles: slightly larger dots, so thin lines and rings keep their presence.
    const grow = Math.min(1.22, Math.max(1, Math.pow(2600 / Math.max(1, count), 0.25)));

    return (i, t, focus, out) => {
      place(i, t, focus, out);
      if (role[i]! !== DUST) out.size *= grow;
    };
    function place(i: number, t: number, focus: number, out: Particle) {
      const u = t / PERIOD - Math.floor(t / PERIOD); // pulse phase
      const k = role[i]!;
      const l = line[i]!;
      out.z = bz[i]!;

      if (k === DUST) {
        out.x = bx[i]! + 0.012 * Math.sin(t * 0.11 + s[i]!);
        out.y = by[i]! + 0.01 * Math.cos(t * 0.09 + s[i]!);
        out.size = 0.55 + 0.45 * weight[i]!;
        out.color = SLOT.dim;
        out.alpha = 0.3 + 0.14 * Math.sin(t * 0.6 + s[i]! * 7);
        return;
      }
      if (k === FULL || k === REDUCED) {
        // One crest per pulse: it leaves the output as the pulse arrives and spreads past the last ring.
        const rho = RINGS[l]!;
        let w = u - ECHO0 - R0 / (R1 - R0);
        w -= Math.floor(w);
        const d = (rho - R0 - (R1 - R0) * w) / CREST;
        const crest = Math.exp(-d * d) * (1.05 - 0.35 * rho);
        const edge = weight[i]!;
        if (k === FULL) {
          const r = rho + 0.03 * crest;
          out.x = OX + r * ca[i]!;
          out.y = Y0 + r * sa[i]! * 0.92;
          out.z = 0.06 * sa[i]!;
          out.size = 0.95 + 0.75 * crest;
          out.color = SLOT.ink;
          out.alpha = edge * (0.14 + 0.62 * crest);
          return;
        }
        // Reduced echo: same output, but bent well below the full fan, smaller, weaker and lopsided; with
        // the Gaussian it turns slightly further away. v runs across the fan (-1..1).
        const v = s[i]! / THETA;
        const theta = RED_DIR + RED_TURN * focus + RED_HALF * v + 0.07 * (1 - v * v);
        const r = RED_SCALE * rho * (1 + 0.07 * v + (0.028 + 0.006 * focus) * Math.sin(2.6 * v + 0.9 + l)) + 0.01 * crest;
        out.x = OX + r * Math.cos(theta);
        out.y = Y0 + r * Math.sin(theta) * 0.92;
        out.z = 0.05 * Math.sin(RED_HALF * v) - 0.03;
        out.size = 0.8 + 0.32 * crest;
        out.color = SLOT.coral;
        out.alpha = edge * (0.11 + 0.38 * crest) * (1 - 0.06 * focus);
        return;
      }

      out.x = bx[i]!;
      out.y = by[i]!;
      if (k === STREAM) {
        const p = s[i]!;
        const q = (p - (u - S0) / (S1 - S0)) * 7;
        const glint = Math.exp(-q * q);
        out.y += 0.006 * Math.sin(t * 1.3 + p * 14 + l);
        out.size = 0.95 + 1.0 * glint;
        out.color = SLOT.ink;
        out.alpha = Math.min(1, p * 5) * (0.46 + 0.45 * glint);
        return;
      }
      if (k === KNOT) {
        const angle = s[i]! + t * (l === 0 ? 0.5 : -0.4);
        const r = weight[i]!;
        const q = ((l === 0 ? u - S1 : u - ECHO0)) * 12;
        const glow = Math.exp(-q * q);
        out.x += Math.cos(angle) * r;
        out.y += Math.sin(angle) * r * 0.8;
        out.z = Math.sin(angle) * r;
        out.size = r < 0.04 ? 1.7 : 1.1;
        out.color = l === 0 || ph[i]! < 0.5 ? SLOT.ink : SLOT.coral;
        out.alpha = (r < 0.04 ? 0.72 : 0.55) + 0.28 * glow;
        return;
      }

      // Paths through the layer: the pulse front is at c along the layer (0 at the hub, 1 at the output).
      // Its clock wraps while the front is far off-path, so nothing pops.
      let w = u - (S1 - LEAD * LAYER);
      w -= Math.floor(w);
      const c = w / LAYER - LEAD;
      const p = s[i]!;
      const ahead = (p - c) * 14, behind = (c - p) * 4.5; // sharp front, longer wake
      const glint = p > c ? Math.exp(-ahead * ahead) : Math.exp(-behind * behind);
      if (k === KEEP) {
        const wt = weight[i]!;
        out.size = 1.0 + 0.4 * wt + 0.55 * glint;
        out.color = SLOT.coral;
        out.alpha = (0.52 + 0.24 * wt) * (0.92 + 0.08 * Math.sin(t * 0.9 + p * 10 + l)) + 0.24 * glint;
        return;
      }
      if (k === DISC) {
        const wt = weight[i]!;
        out.size = 0.8 + 0.15 * wt + 0.75 * glint;
        out.color = SLOT.ink;
        out.alpha = (0.26 + 0.12 * wt) * (1 - 0.3 * (p / CUT) * (p / CUT)) + 0.5 * glint;
        return;
      }
      if (k === GHOST) {
        out.size = 0.65 + 0.9 * glint;
        out.color = SLOT.ink;
        out.alpha = 0.08 + 0.6 * glint * weight[i]!;
        return;
      }
      if (k === FOLD) {
        // steady: the fold does not carry the pulse
        const e = weight[i]!;
        const coral = ph[i]! > 0.5;
        const share = coral ? e : 1 - e;
        out.size = 0.8 + 0.2 * e;
        out.color = coral ? SLOT.coral : SLOT.ink;
        out.alpha = share * (coral ? 0.5 : 0.36) * (1 - 0.55 * e * e) * (1 - 0.3 * focus * e);
        return;
      }
      // STAND: steady (it does not answer the pulse); with the Gaussian it widens into a soft band.
      const band = focus * weight[i]!;
      const sway = 1 + 0.02 * Math.sin(t * 0.3 + ph[i]! * TAU);
      out.x += band * 0.02 * gx[i]!;
      out.y += band * 0.075 * gy[i]! * sway;
      out.z = band * 0.05 * gx[i]!;
      out.size = 1.05 - 0.15 * focus;
      out.color = SLOT.coral;
      out.alpha = 0.6 - 0.17 * focus;
    }
  },
};
