/**
 * Scroll-driven journey on the home page. Normal scrolling is never intercepted: the
 * scene simply reads the position of the five act sections and morphs accordingly.
 *
 * - prefers-reduced-motion: no autonomous motion; the scene shows the static plate of the
 *   act in view and changes only when another act becomes current.
 * - "Pause animations" freezes autonomous motion (stored per browser).
 * - Rendering stops when the tab is hidden or the journey is scrolled out of view.
 * - Without WebGL or JavaScript the static SVG plates in each act remain visible.
 */
import { clamp, damp } from './math';
import { createRenderer, type FrameState, type Renderer } from './engine';
import { buildScene, STAGE_COUNT } from './targets';

const root = document.documentElement;
const journey = document.querySelector<HTMLElement>('[data-journey]');
const canvas = document.querySelector<HTMLCanvasElement>('#journey-canvas');
const acts = Array.from(document.querySelectorAll<HTMLElement>('[data-act]'));

interface JourneyStrings {
  labels: [string, string, string][];
  pause: string; resume: string;
  circuitOn: string; circuitOff: string; ablateOn: string; ablateOff: string;
}
// All visible copy comes from the page (data-i18n), so the same script serves every language.
const strings: JourneyStrings = JSON.parse(journey?.dataset.i18n ?? '{}');
const labels = strings.labels ?? [];

function storage(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    if (value === '') localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* private mode or blocked storage: the default applies */ }
  return null;
}

function particleBudget() {
  const area = innerWidth * innerHeight;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  let budget = 24000 * Math.sqrt(Math.min(1.6, area / (1440 * 900)));
  if (coarse) budget = Math.min(budget, 11000);
  if (cores <= 4 || memory <= 4) budget *= 0.72;
  return Math.round(clamp(budget, 6500, 26000));
}

function start() {
  if (!journey || !canvas || acts.length !== STAGE_COUNT) return;

  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reduceQuery.matches;
  let paused = storage('motion') === 'paused';

  let renderer: Renderer;
  try {
    renderer = createRenderer(canvas, buildScene(particleBudget()));
  } catch (error) {
    root.classList.add('no-webgl');
    console.info('Journey scene disabled:', error instanceof Error ? error.message : error);
    return;
  }

  const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle');
  const circuitButton = document.querySelector<HTMLButtonElement>('[data-scene-action="circuit"]');
  const ablateButton = document.querySelector<HTMLButtonElement>('[data-scene-action="ablate"]');
  const status = document.querySelector<HTMLElement>('#scene-status');
  const plateNumber = document.querySelector<HTMLElement>('[data-plate-number]');
  const plateName = document.querySelector<HTMLElement>('[data-plate-name]');
  const plateCaption = document.querySelector<HTMLElement>('[data-plate-caption]');
  const railLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-rail-link]'));

  const state: FrameState = { progress: 0, time: 0, circuit: 0, ablate: 0, pointerX: 0, pointerY: 0, drift: 0 };
  let targetProgress = 0, circuitTarget = 0, ablateTarget = 0;
  let pointerTargetX = 0, pointerTargetY = 0;
  let frame = 0, last = 0, visible = true, currentAct = -1;
  let slowFrames = 0, measuredFrames = 0, qualityReduced = false;

  const syncTheme = () => { renderer.setTheme(root.dataset.theme === 'light'); request(); };

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
    const ratio = Math.min(devicePixelRatio || 1, matchMedia('(pointer: coarse)').matches ? 2 : 1.75) * (qualityReduced ? 0.75 : 1);
    renderer.resize(rect.width, rect.height, ratio);
    request();
  }

  function updateLabels(act: number) {
    if (act === currentAct) return;
    currentAct = act;
    const [numeral, name, caption] = labels[act] ?? ['', '', ''];
    if (plateNumber) plateNumber.textContent = numeral;
    if (plateName) plateName.textContent = name;
    if (plateCaption) plateCaption.textContent = caption;
    journey!.dataset.stage = String(act);
    railLinks.forEach((link, i) => { if (i === act) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current'); });
    if (reduced) {
      canvas!.classList.remove('is-switching');
      void canvas!.offsetWidth;
      canvas!.classList.add('is-switching');
    }
  }

  // The fixed overlay (plate caption, pause, rail) is shown only while the journey fills the view.
  let overlayActive = false;
  function syncOverlay() {
    const rect = journey!.getBoundingClientRect();
    const active = rect.top < innerHeight * 0.5 && rect.bottom > innerHeight * 0.85;
    if (active !== overlayActive) { overlayActive = active; journey!.classList.toggle('is-active', active); }
  }

  function animating() {
    return (!paused && !reduced)
      || Math.abs(state.progress - targetProgress) > 1e-4
      || Math.abs(state.circuit - circuitTarget) > 1e-3
      || Math.abs(state.ablate - ablateTarget) > 1e-3
      || Math.abs(state.pointerX - pointerTargetX) > 1e-3
      || Math.abs(state.pointerY - pointerTargetY) > 1e-3;
  }

  function tick(now: number) {
    frame = 0;
    // Browsers already pause requestAnimationFrame in background tabs.
    if (!visible || renderer.isContextLost) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    targetProgress = measureTarget();
    if (reduced) {
      state.progress = Math.round(targetProgress);
      state.circuit = circuitTarget;
      state.ablate = ablateTarget;
      state.pointerX = state.pointerY = 0;
    } else {
      if (!paused) { state.time += dt; state.drift += dt; }
      state.progress = Math.abs(targetProgress - state.progress) < 5e-4 ? targetProgress : damp(state.progress, targetProgress, 5.5, dt);
      state.circuit = damp(state.circuit, circuitTarget, 4, dt);
      state.ablate = damp(state.ablate, ablateTarget, 3.2, dt);
      state.pointerX = damp(state.pointerX, pointerTargetX, 2.5, dt);
      state.pointerY = damp(state.pointerY, pointerTargetY, 2.5, dt);
    }
    renderer.render(state);
    updateLabels(Math.round(clamp(state.progress, 0, STAGE_COUNT - 1)));

    // Adaptive quality: if the first seconds are slow, render fewer points at a lower ratio.
    if (!qualityReduced && !paused && !reduced && measuredFrames < 150) {
      measuredFrames++;
      if (measuredFrames > 30 && dt > 1 / 38) slowFrames++;
      if (slowFrames > 45) { qualityReduced = true; renderer.setDrawFraction(0.6); resize(); }
    }
    if (animating()) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function request() {
    if (!frame && visible) frame = requestAnimationFrame(tick);
  }

  function setPaused(value: boolean, persist = true) {
    paused = value;
    // Freezing also means the camera stops easing toward the last pointer position.
    if (value) { pointerTargetX = state.pointerX; pointerTargetY = state.pointerY; }
    if (persist) storage('motion', value ? 'paused' : '');
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(value));
      const label = motionButton.querySelector('[data-label]');
      if (label) label.textContent = value ? strings.resume : strings.pause;
    }
    root.classList.toggle('motion-paused', value);
    request();
  }

  function announce(message: string) { if (status) status.textContent = message; }

  // ---- controls ----------------------------------------------------------------------
  if (motionButton) {
    motionButton.hidden = false;
    motionButton.addEventListener('click', () => setPaused(!paused));
  }
  circuitButton?.addEventListener('click', () => {
    circuitTarget = circuitTarget > 0.5 ? 0 : 1;
    circuitButton.setAttribute('aria-pressed', String(circuitTarget > 0.5));
    announce(circuitTarget > 0.5 ? strings.circuitOn : strings.circuitOff);
    request();
  });
  ablateButton?.addEventListener('click', () => {
    ablateTarget = ablateTarget > 0.5 ? 0 : 1;
    ablateButton.setAttribute('aria-pressed', String(ablateTarget > 0.5));
    if (ablateTarget > 0.5 && circuitTarget < 0.5) {
      circuitTarget = 1;
      circuitButton?.setAttribute('aria-pressed', 'true');
    }
    announce(ablateTarget > 0.5 ? strings.ablateOn : strings.ablateOff);
    request();
  });
  for (const button of [circuitButton, ablateButton]) if (button) button.hidden = false;

  // ---- environment -------------------------------------------------------------------
  reduceQuery.addEventListener('change', () => { reduced = reduceQuery.matches; root.classList.toggle('reduced-motion', reduced); request(); });
  root.classList.toggle('reduced-motion', reduced);
  addEventListener('scroll', () => { syncOverlay(); request(); }, { passive: true });
  addEventListener('resize', resize);
  new ResizeObserver(resize).observe(canvas);
  document.addEventListener('visibilitychange', () => { last = 0; request(); });
  new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (!visible) { cancelAnimationFrame(frame); frame = 0; last = 0; } else request();
  }, { rootMargin: '10% 0px' }).observe(journey);
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
  state.progress = targetProgress = measureTarget();
  root.classList.add('webgl-ready');
  syncOverlay();
  request();
}

// Wait until the page is interactive and idle so the hero text paints first.
const idle = (callback: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(callback, { timeout: 900 }) : setTimeout(callback, 120));
if (document.readyState === 'complete') idle(start);
else addEventListener('load', () => idle(start), { once: true });
