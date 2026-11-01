/**
 * Scroll-driven "research atlas" on the Projects page, the sibling of the home-page journey.
 *
 * - Normal scrolling is never intercepted: the scene reads where the act sections are and morphs
 *   the same particles from one project's schematic to the next.
 * - Each act may have a toggle ([data-atlas-focus]) that eases the schematic from its default view to
 *   an alternative one (e.g. claim → corrected result). The text always states the result itself.
 * - prefers-reduced-motion: no autonomous motion; a still frame per act, switched when the act changes.
 * - "Pause animations" (shared with the home page) freezes time.
 * - Rendering stops when the tab is hidden or the atlas is scrolled out of view.
 * - Without WebGL or JavaScript, a static SVG plate in each act remains visible.
 */
import { clamp, damp, mulberry32, smoothstep } from '../journey/math';
import { createRenderer, STRIDE, type Renderer } from './renderer';
import { darkPalette, lightPalette, type Rgb } from './palette';
import { stages } from './shapes';
import type { Particle, Placer } from './types';

const root = document.documentElement;
const container = document.querySelector<HTMLElement>('[data-atlas]');
const canvas = document.querySelector<HTMLCanvasElement>('#atlas-canvas');
const acts = Array.from(document.querySelectorAll<HTMLElement>('[data-atlas-act]'));

interface AtlasStrings { labels: [string, string][]; pause: string; resume: string }
const strings: AtlasStrings = JSON.parse(container?.dataset.i18n ?? '{}');

function storage(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    if (value === '') localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* private mode or blocked storage: the default applies */ }
  return null;
}

function particleBudget() {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  let budget = coarse ? 1500 : 2600;
  if (cores <= 4 || memory <= 4) budget *= 0.75;
  return Math.max(1200, Math.round(budget));
}

/** Where a stage sits on screen: the half opposite its text on wide screens, the top on phones. */
function anchor(textSide: string, aspect: number) {
  if (aspect < 0.85) return { ox: 0, oy: 0.4, scale: Math.min(0.5, 0.56 * aspect) };
  if (aspect < 1.25) return { ox: textSide === 'left' ? 0.3 : textSide === 'right' ? -0.3 : 0, oy: 0.12, scale: 0.36 * aspect };
  const ox = textSide === 'left' ? 0.46 : textSide === 'right' ? -0.48 : 0;
  return { ox, oy: 0.02, scale: Math.min(0.5, 0.205 * aspect) };
}

function start() {
  if (!container || !canvas || acts.length !== stages.length) return;

  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reduceQuery.matches;
  let paused = storage('motion') === 'paused';
  const count = particleBudget();

  let renderer: Renderer;
  try {
    renderer = createRenderer(canvas, count);
  } catch (error) {
    root.classList.add('no-webgl');
    console.info('Atlas scene disabled:', error instanceof Error ? error.message : error);
    return;
  }

  const placers: Placer[] = stages.map((shape, k) => shape.create(count, mulberry32(1009 + 7919 * k)));
  const order = mulberry32(42);
  const sweep = new Float32Array(count), jitterX = new Float32Array(count), jitterY = new Float32Array(count);
  for (let i = 0; i < count; i++) { sweep[i] = order(); jitterX[i] = order() - 0.5; jitterY[i] = order() - 0.5; }
  const data = new Float32Array(count * STRIDE);
  const pa: Particle = { x: 0, y: 0, z: 0, size: 1, color: 0, alpha: 1 };
  const pb: Particle = { x: 0, y: 0, z: 0, size: 1, color: 0, alpha: 1 };

  const sides = acts.map((act) => act.dataset.side ?? 'left');
  const focusTarget = new Float32Array(stages.length), focus = new Float32Array(stages.length);
  let palette: readonly Rgb[] = darkPalette;
  let width = 1, height = 1, ratio = 1, pointScale = 1;
  let progress = 0, targetProgress = 0, time = 0, pointerX = 0, pointerY = 0, pointerTargetX = 0, pointerTargetY = 0;
  let frame = 0, last = 0, visible = true, currentAct = -1;

  const motionButton = document.querySelector<HTMLButtonElement>('#atlas-motion');
  const plateNumber = document.querySelector<HTMLElement>('[data-plate-number]');
  const plateName = document.querySelector<HTMLElement>('[data-plate-name]');
  const railLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-rail-link]'));

  const syncTheme = () => {
    const light = root.dataset.theme === 'light';
    palette = light ? lightPalette : darkPalette;
    renderer.setTheme(light);
    request();
  };

  function measureTarget() {
    const mid = innerHeight * 0.5;
    const centers = acts.map((act) => { const r = act.getBoundingClientRect(); return r.top + r.height * 0.5; });
    if (mid <= centers[0]!) return 0;
    for (let i = 0; i < centers.length - 1; i++) {
      if (mid <= centers[i + 1]!) return i + (mid - centers[i]!) / Math.max(1, centers[i + 1]! - centers[i]!);
    }
    return centers.length - 1;
  }

  function resize() {
    const rect = canvas!.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    ratio = Math.min(devicePixelRatio || 1, 2);
    pointScale = 3.1 * ratio * clamp(Math.sqrt(Math.min(width, height) / 820), 0.75, 1.25);
    renderer.resize(width, height, ratio);
    request();
  }

  function updateLabels(act: number) {
    if (act === currentAct) return;
    currentAct = act;
    const [numeral, name] = strings.labels?.[act] ?? ['', ''];
    if (plateNumber) plateNumber.textContent = numeral;
    if (plateName) plateName.textContent = name;
    container!.dataset.stage = String(act);
    container!.dataset.textSide = sides[act] ?? 'left';
    container!.style.setProperty('--project', acts[act]!.style.getPropertyValue('--project') || 'var(--accent)');
    railLinks.forEach((link, i) => { if (i === act) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current'); });
    if (reduced) {
      canvas!.classList.remove('is-switching');
      void canvas!.offsetWidth;
      canvas!.classList.add('is-switching');
    }
  }

  let overlayActive = false;
  function syncOverlay() {
    const rect = container!.getBoundingClientRect();
    const active = rect.top < innerHeight * 0.5 && rect.bottom > innerHeight * 0.85;
    if (active !== overlayActive) { overlayActive = active; container!.classList.toggle('is-active', active); }
  }

  function project(p: Particle, stage: number, out: Float32Array, o: number) {
    const aspect = width / height;
    const { ox, oy, scale } = anchor(sides[stage]!, aspect);
    const depth = 1 / (1 - clamp(p.z, -0.9, 0.9) * 0.22);
    out[o] = (p.x * scale * depth) / aspect + ox + pointerX * p.z * 0.025;
    out[o + 1] = p.y * scale * depth + oy - pointerY * p.z * 0.02;
    out[o + 2] = p.size * depth;
  }

  const screenA = new Float32Array(3), screenB = new Float32Array(3);
  function compose() {
    const p = clamp(progress, 0, stages.length - 1);
    const a = Math.min(stages.length - 2, Math.floor(p));
    const f = p - a;
    const placeA = placers[a]!, placeB = placers[a + 1]!;
    const sizeScale = pointScale * (0.9 + 0.1 * Math.min(1, width / 900));
    for (let i = 0; i < count; i++) {
      // Each particle leaves a little later or earlier than its neighbours: a wave, not a fade.
      const local = smoothstep(0, 1, clamp((f - sweep[i]! * 0.42) / 0.58));
      const o = i * STRIDE;
      let x: number, y: number, size: number, alpha: number, r: number, g: number, bl: number;
      if (local < 1) { placeA(i, time, focus[a]!, pa); project(pa, a, screenA, 0); }
      if (local > 0) { placeB(i, time, focus[a + 1]!, pb); project(pb, a + 1, screenB, 0); }
      if (local <= 0) {
        x = screenA[0]!; y = screenA[1]!; size = screenA[2]!; alpha = pa.alpha;
        [r, g, bl] = palette[pa.color] ?? palette[0]!;
      } else if (local >= 1) {
        x = screenB[0]!; y = screenB[1]!; size = screenB[2]!; alpha = pb.alpha;
        [r, g, bl] = palette[pb.color] ?? palette[0]!;
      } else {
        const arc = Math.sin(Math.PI * local);
        x = screenA[0]! + (screenB[0]! - screenA[0]!) * local + arc * jitterX[i]! * 0.22;
        y = screenA[1]! + (screenB[1]! - screenA[1]!) * local + arc * jitterY[i]! * 0.22;
        size = screenA[2]! + (screenB[2]! - screenA[2]!) * local;
        alpha = pa.alpha + (pb.alpha - pa.alpha) * local;
        const ca = palette[pa.color] ?? palette[0]!, cb = palette[pb.color] ?? palette[0]!;
        r = ca[0] + (cb[0] - ca[0]) * local; g = ca[1] + (cb[1] - ca[1]) * local; bl = ca[2] + (cb[2] - ca[2]) * local;
      }
      data[o] = x; data[o + 1] = y; data[o + 2] = Math.max(0, size) * sizeScale;
      data[o + 3] = r; data[o + 4] = g; data[o + 5] = bl; data[o + 6] = clamp(alpha);
    }
    renderer.draw(data, count);
  }

  function animating() {
    // Reduced motion has no easing: each scroll, resize, theme or toggle event requests one frame.
    if (reduced) return false;
    if (!paused) return true;
    if (Math.abs(progress - targetProgress) > 1e-4) return true;
    for (let k = 0; k < stages.length; k++) if (Math.abs(focus[k]! - focusTarget[k]!) > 1e-3) return true;
    return Math.abs(pointerX - pointerTargetX) > 1e-3 || Math.abs(pointerY - pointerTargetY) > 1e-3;
  }

  function tick(now: number) {
    frame = 0;
    if (!visible || document.hidden || renderer.isContextLost) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    targetProgress = measureTarget();
    if (reduced) {
      progress = Math.round(targetProgress);
      focus.set(focusTarget);
      pointerX = pointerY = 0;
      time = stages[Math.round(progress)]!.restTime;
    } else {
      if (!paused) time += dt;
      progress = Math.abs(targetProgress - progress) < 5e-4 ? targetProgress : damp(progress, targetProgress, 5.5, dt);
      for (let k = 0; k < stages.length; k++) focus[k] = damp(focus[k]!, focusTarget[k]!, 3.2, dt);
      pointerX = damp(pointerX, pointerTargetX, 2.5, dt);
      pointerY = damp(pointerY, pointerTargetY, 2.5, dt);
    }
    compose();
    updateLabels(Math.round(clamp(progress, 0, stages.length - 1)));
    if (animating()) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function request() {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function setPaused(value: boolean, persist = true) {
    paused = value;
    if (value) { pointerTargetX = pointerX; pointerTargetY = pointerY; }
    if (persist) storage('motion', value ? 'paused' : '');
    if (motionButton) {
      motionButton.dataset.paused = String(value);
      const label = motionButton.querySelector('[data-label]');
      if (label) label.textContent = value ? strings.resume : strings.pause;
    }
    root.classList.toggle('motion-paused', value);
    request();
  }

  // ---- controls ----------------------------------------------------------------------
  if (motionButton) {
    motionButton.hidden = reduced;
    motionButton.addEventListener('click', () => setPaused(!paused));
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-atlas-focus]')) {
    const stage = Number(button.dataset.atlasFocus);
    const caption = document.getElementById(button.getAttribute('aria-describedby') ?? '');
    button.hidden = false;
    button.addEventListener('click', () => {
      const on = focusTarget[stage]! < 0.5;
      focusTarget[stage] = on ? 1 : 0;
      button.setAttribute('aria-pressed', String(on));
      if (caption) caption.textContent = (on ? button.dataset.captionOn : button.dataset.captionOff) ?? '';
      request();
    });
  }

  // ---- environment -------------------------------------------------------------------
  reduceQuery.addEventListener('change', () => { reduced = reduceQuery.matches; if (motionButton) motionButton.hidden = reduced; root.classList.toggle('reduced-motion', reduced); request(); });
  root.classList.toggle('reduced-motion', reduced);
  addEventListener('scroll', () => { syncOverlay(); request(); }, { passive: true });
  addEventListener('resize', resize);
  new ResizeObserver(resize).observe(canvas);
  document.addEventListener('visibilitychange', () => { last = 0; request(); });
  new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (!visible) { cancelAnimationFrame(frame); frame = 0; last = 0; } else request();
  }, { rootMargin: '10% 0px' }).observe(container);
  if (matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (event) => {
      if (reduced || paused) return;
      pointerTargetX = (event.clientX / innerWidth) * 2 - 1;
      pointerTargetY = (event.clientY / innerHeight) * 2 - 1;
      request();
    }, { passive: true });
  }
  addEventListener('themechange', syncTheme);
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); root.classList.add('no-webgl'); });

  syncTheme();
  setPaused(paused, false);
  resize();
  progress = targetProgress = measureTarget();
  root.classList.add('webgl-ready');
  syncOverlay();
  request();
}

const idle = (callback: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(callback, { timeout: 900 }) : setTimeout(callback, 120));
if (document.readyState === 'complete') idle(start);
else addEventListener('load', () => idle(start), { once: true });
