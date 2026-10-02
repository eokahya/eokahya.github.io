/** WebGL renderer for the journey scene. No third-party engine: ~one draw call per layer. */
import { lookAt, mix, multiply, perspective, smoothstep } from './math';
import { glowFragment, glowVertex, lineFragment, lineVertex, particleFragment, particleVertex } from './shaders';
import { darkPalette, lightPalette, PALETTE_SIZE, stageGlow, STAGE_COUNT, type SceneData } from './targets';

type GL = WebGLRenderingContext | WebGL2RenderingContext;

export interface FrameState {
  progress: number; // 0 … STAGE_COUNT - 1
  time: number;
  circuit: number; // 0 … 1
  ablate: number; // 0 … 1
  pointerX: number; // -1 … 1
  pointerY: number; // -1 … 1
  drift: number; // slow autonomous camera drift, frozen when paused
}

interface Camera { yaw: number; pitch: number; dist: number; ty: number; ox: number; oy: number }

const desktopCameras: readonly Camera[] = [
  { yaw: 0.0, pitch: 0.66, dist: 4.4, ty: -0.34, ox: 0.2, oy: -0.02 },
  { yaw: 0.0, pitch: 0.1, dist: 5.9, ty: 0.0, ox: 0.36, oy: 0.0 },
  { yaw: -0.5, pitch: 0.64, dist: 5.4, ty: -0.08, ox: -0.4, oy: 0.0 },
  { yaw: 0.2, pitch: 0.06, dist: 6.1, ty: 0.0, ox: 0.3, oy: 0.0 },
  { yaw: 0.0, pitch: 0.0, dist: 5.9, ty: 0.0, ox: -0.4, oy: 0.0 },
];

/** Portrait screens pull the camera back so the scene fits the width; points are compensated. */
const distanceFactor = (aspect: number) => (aspect < 0.85 ? 1.45 : aspect < 1.25 ? 1.18 : 1);

function cameraFor(stage: number, aspect: number): Camera {
  const base = desktopCameras[stage]!;
  // Wide shapes (manifold, network) need a little more room on narrow portrait screens.
  const portraitExtra = [1, 1, 1.18, 1.3, 1.05][stage]!;
  if (aspect < 0.85) return { ...base, ox: 0, oy: 0.3, dist: base.dist * distanceFactor(aspect) * portraitExtra };
  if (aspect < 1.25) return { ...base, ox: base.ox * 0.45, oy: 0.1, dist: base.dist * distanceFactor(aspect) };
  return base;
}

function compile(gl: GL, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

function program(gl: GL, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`Program link failed: ${gl.getProgramInfoLog(p)}`);
  return p;
}

export function createRenderer(canvas: HTMLCanvasElement, scene: SceneData) {
  const options: WebGLContextAttributes = { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance' };
  const gl = (canvas.getContext('webgl2', options) || canvas.getContext('webgl', options)) as GL | null;
  if (!gl) throw new Error('WebGL unavailable');

  const particles = program(gl, particleVertex, particleFragment);
  const lines = program(gl, lineVertex, lineFragment);
  const glow = program(gl, glowVertex, glowFragment);

  const attribute = (prog: WebGLProgram, name: string, data: Float32Array, size: number) => {
    const location = gl.getAttribLocation(prog, name);
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return { location, buffer, size };
  };
  const particleAttributes = [
    attribute(particles, 'aP0', scene.p0, 3),
    attribute(particles, 'aP1', scene.p1, 4),
    attribute(particles, 'aP2', scene.p2, 3),
    attribute(particles, 'aP3', scene.p3, 3),
    attribute(particles, 'aP3b', scene.p3b, 3),
    attribute(particles, 'aP4', scene.p4, 3),
    attribute(particles, 'aRole', scene.role, 4),
    attribute(particles, 'aFlags', scene.flags, 4),
    attribute(particles, 'aSeed', scene.seed, 4),
    attribute(particles, 'aSweep', scene.sweep, 4),
  ];
  const lineAttributes = [attribute(lines, 'aPos', scene.lines, 3), attribute(lines, 'aFlag', scene.lineFlags, 2)];
  const glowAttributes = [attribute(glow, 'aPos', new Float32Array([-1, -1, 3, -1, -1, 3]), 2)];

  const uniforms = (prog: WebGLProgram, names: string[]) =>
    Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(prog, name)])) as Record<string, WebGLUniformLocation | null>;
  const pu = uniforms(particles, ['uViewProj', 'uOffset', 'uTime', 'uSegA', 'uF', 'uPointScale', 'uDensity', 'uCircuit', 'uAblate', 'uLight', 'uPal']);
  const lu = uniforms(lines, ['uViewProj', 'uOffset', 'uVis', 'uCircuit', 'uAblate', 'uEdge', 'uCirc']);
  const gu = uniforms(glow, ['uGlow', 'uCenter', 'uAspect', 'uStrength']);

  let light = false;
  let palette = new Float32Array(PALETTE_SIZE * 3);
  let drawCount = scene.count;
  let width = 1, height = 1, pixelRatio = 1;

  const setTheme = (isLight: boolean) => {
    light = isLight;
    palette = new Float32Array((isLight ? lightPalette : darkPalette).flat());
  };
  setTheme(false);

  const bind = (list: { location: number; buffer: WebGLBuffer; size: number }[]) => {
    for (const a of list) {
      if (a.location < 0) continue;
      gl.bindBuffer(gl.ARRAY_BUFFER, a.buffer);
      gl.enableVertexAttribArray(a.location);
      gl.vertexAttribPointer(a.location, a.size, gl.FLOAT, false, 0, 0);
    }
  };
  const unbind = (list: { location: number }[]) => { for (const a of list) if (a.location >= 0) gl.disableVertexAttribArray(a.location); };

  function resize(cssWidth: number, cssHeight: number, ratio: number) {
    width = Math.max(1, cssWidth);
    height = Math.max(1, cssHeight);
    pixelRatio = ratio;
    const w = Math.round(width * ratio), h = Math.round(height * ratio);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl!.viewport(0, 0, w, h);
  }

  function render(state: FrameState) {
    const aspect = width / height;
    const p = Math.max(0, Math.min(STAGE_COUNT - 1, state.progress));
    const segA = Math.min(STAGE_COUNT - 2, Math.floor(p));
    const f = p - segA;
    const e = smoothstep(0.12, 0.88, f);
    const ca = cameraFor(segA, aspect), cb = cameraFor(segA + 1, aspect);
    const cam = {
      yaw: mix(ca.yaw, cb.yaw, e) + state.pointerX * 0.1 + Math.sin(state.drift * 0.07) * 0.05,
      pitch: mix(ca.pitch, cb.pitch, e) + state.pointerY * 0.05,
      dist: mix(ca.dist, cb.dist, e),
      ty: mix(ca.ty, cb.ty, e),
      ox: mix(ca.ox, cb.ox, e),
      oy: mix(ca.oy, cb.oy, e),
    };
    const eye = [
      cam.dist * Math.cos(cam.pitch) * Math.sin(cam.yaw),
      cam.ty + cam.dist * Math.sin(cam.pitch),
      cam.dist * Math.cos(cam.pitch) * Math.cos(cam.yaw),
    ];
    const viewProj = multiply(perspective((45 * Math.PI) / 180, aspect, 0.1, 60), lookAt(eye, [0, cam.ty, 0], [0, 1, 0]));

    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.disable(gl!.DEPTH_TEST);
    gl!.enable(gl!.BLEND);
    if (light) gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
    else gl!.blendFunc(gl!.ONE, gl!.ONE);

    // Ambient glow, centred on the scene's screen position.
    const ga = stageGlow[segA]!, gb = stageGlow[segA + 1]!;
    gl!.useProgram(glow);
    bind(glowAttributes);
    gl!.uniform3f(gu.uGlow!, mix(ga[0], gb[0], e), mix(ga[1], gb[1], e), mix(ga[2], gb[2], e));
    gl!.uniform2f(gu.uCenter!, 0.5 + cam.ox * 0.5, 0.5 + cam.oy * 0.5);
    gl!.uniform1f(gu.uAspect!, aspect);
    gl!.uniform1f(gu.uStrength!, light ? 0.1 : aspect < 0.85 ? 0.42 : 0.55);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    unbind(glowAttributes);

    // Network edges, visible only around the "mechanisms" stage.
    const lineVisibility = Math.max(0, 1 - Math.abs(p - 3) * 1.7);
    if (lineVisibility > 0.001) {
      gl!.useProgram(lines);
      bind(lineAttributes);
      gl!.uniformMatrix4fv(lu.uViewProj!, false, viewProj);
      gl!.uniform2f(lu.uOffset!, cam.ox, cam.oy);
      gl!.uniform1f(lu.uVis!, lineVisibility * (light ? 1.6 : 1));
      gl!.uniform1f(lu.uCircuit!, state.circuit);
      gl!.uniform1f(lu.uAblate!, state.ablate);
      const pal = light ? lightPalette : darkPalette;
      gl!.uniform3fv(lu.uEdge!, pal[12]!);
      gl!.uniform3fv(lu.uCirc!, pal[13]!);
      gl!.drawArrays(gl!.LINES, 0, scene.lineCount * 2);
      unbind(lineAttributes);
    }

    gl!.useProgram(particles);
    bind(particleAttributes);
    gl!.uniformMatrix4fv(pu.uViewProj!, false, viewProj);
    gl!.uniform2f(pu.uOffset!, cam.ox, cam.oy);
    gl!.uniform1f(pu.uTime!, state.time);
    gl!.uniform1f(pu.uSegA!, segA);
    gl!.uniform1f(pu.uF!, f < 1e-4 ? 0 : f);
    const viewportScale = Math.min(1.25, Math.max(0.9, Math.pow(Math.min(width, height * 1.6) / 900, 0.4)));
    gl!.uniform1f(pu.uPointScale!, pixelRatio * 4.6 * viewportScale * distanceFactor(aspect));
    gl!.uniform1f(pu.uDensity!, Math.min(1.7, Math.max(1, Math.sqrt(22000 / drawCount))));
    gl!.uniform1f(pu.uCircuit!, state.circuit);
    gl!.uniform1f(pu.uAblate!, state.ablate);
    gl!.uniform1f(pu.uLight!, light ? 1 : 0);
    gl!.uniform3fv(pu.uPal!, palette);
    gl!.drawArrays(gl!.POINTS, 0, drawCount);
    unbind(particleAttributes);
  }

  return {
    gl,
    resize,
    render,
    setTheme,
    setDrawFraction(fraction: number) { drawCount = Math.max(1000, Math.floor(scene.count * fraction)); },
    get isContextLost() { return gl.isContextLost(); },
  };
}

export type Renderer = ReturnType<typeof createRenderer>;
