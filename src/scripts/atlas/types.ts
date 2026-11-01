/**
 * Shared contract between the Projects-page renderer and the five project shapes.
 *
 * A shape is a pure function of (particle index, time, focus). The renderer evaluates the shape of the
 * act in view (and, during a scroll, of the next act) every frame and morphs particles between them,
 * so the same points are rearranged rather than cross-faded — the home-page idea, on the CPU.
 *
 * Scene units: a shape should fill the box x ∈ [-1.6, 1.6], y ∈ [-1, 1] (y up), with a little depth
 * z ∈ [-0.6, 0.6] for parallax (z > 0 is nearer and drawn slightly larger and further out).
 * All shapes are schematic illustrations of an idea, never plots of measured data.
 */
export interface Particle {
  x: number;
  y: number;
  z: number;
  /** Point size in units of the base dot; 0.4–3 is a sensible range (1 ≈ a fine dust grain). */
  size: number;
  /** Palette slot, see SLOT. Fractions blend linearly between neighbouring slots: avoid them. */
  color: number;
  /** Opacity 0–1. Use 0 to hide spare particles (park them on the shape, not at the origin). */
  alpha: number;
}

/**
 * Places particle i at time t (seconds, frozen when motion is paused or reduced) for a given focus.
 * focus ∈ [0, 1] is eased by the renderer: 0 = the default view, 1 = the alternative view revealed by
 * the act's toggle button (e.g. claim → corrected result). Must not allocate; write into `out`.
 */
export type Placer = (i: number, t: number, focus: number, out: Particle) => void;

export interface ShapeDef {
  id: string;
  /** Time used for the still frame under prefers-reduced-motion (pick a representative moment). */
  restTime: number;
  /** Called once per page view with the particle count (1200–3000) and a seeded PRNG in [0, 1). */
  create(count: number, random: () => number): Placer;
}

/** Palette slots; the renderer maps them to dark- and light-theme colours (see palette.ts). */
export const SLOT = {
  ink: 0, // soft blue — default structure
  dim: 1, // faint grey-blue — background dust, ghosts, discarded things
  gold: 2, // accent — quantum-gravity project, highlights
  cyan: 3, // MoE project
  coral: 4, // GPT-2 project; also "error" when used sparingly
  violet: 5, // conformal-scalar project
  green: 6, // split-or-enrich project
  pale: 7, // near-white neutral
  hot: 8, // warm orange
  cold: 9, // saturated blue
} as const;
export type Slot = (typeof SLOT)[keyof typeof SLOT];
