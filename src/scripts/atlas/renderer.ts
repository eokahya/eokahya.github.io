/**
 * Minimal WebGL point renderer for the Projects page: one dynamic buffer, one draw call.
 * Positions are already projected on the CPU (see index.ts); the GPU only draws soft dots,
 * additive on the dark theme and opaque-ish ink dots on the light one, like the home page.
 */
type GL = WebGLRenderingContext | WebGL2RenderingContext;

/** Floats per particle in the upload buffer: x, y (clip space), size (px), r, g, b, alpha. */
export const STRIDE = 7;

const vertex = `
attribute vec2 aPos;
attribute float aSize;
attribute vec3 aColor;
attribute float aAlpha;
uniform mediump float uLight;
varying vec3 vColor;
varying float vAlpha;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
  gl_PointSize = max(1.0, aSize);
  vColor = aColor;
  vAlpha = aAlpha * mix(1.0, 1.2, uLight);
}`;

const fragment = `
precision mediump float;
uniform mediump float uLight;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord * 2.0 - 1.0);
  if (d > 1.0) discard;
  float shape = uLight > 0.5 ? (1.0 - smoothstep(0.35, 1.0, d)) : exp(-d * 3.0) * (1.0 - d * 0.6);
  float a = clamp(vAlpha * shape, 0.0, 1.0);
  gl_FragColor = vec4(vColor * a, a);
}`;

function compile(gl: GL, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`Shader compile failed: ${gl.getShaderInfoLog(shader)}`);
  return shader;
}

export function createRenderer(canvas: HTMLCanvasElement, capacity: number) {
  const options: WebGLContextAttributes = { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'default' };
  const gl = (canvas.getContext('webgl2', options) || canvas.getContext('webgl', options)) as GL | null;
  if (!gl) throw new Error('WebGL unavailable');

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
  gl.useProgram(program);

  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, capacity * STRIDE * 4, gl.DYNAMIC_DRAW);
  const bytes = STRIDE * 4;
  const layout: [string, number, number][] = [['aPos', 2, 0], ['aSize', 1, 2], ['aColor', 3, 3], ['aAlpha', 1, 6]];
  for (const [name, size, offset] of layout) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, bytes, offset * 4);
  }
  const uLight = gl.getUniformLocation(program, 'uLight');
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  let light = false;
  return {
    get isContextLost() { return gl.isContextLost(); },
    setTheme(isLight: boolean) {
      light = isLight;
      gl.uniform1f(uLight, light ? 1 : 0);
      if (light) gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      else gl.blendFunc(gl.ONE, gl.ONE);
    },
    resize(cssWidth: number, cssHeight: number, ratio: number) {
      const w = Math.max(1, Math.round(cssWidth * ratio)), h = Math.max(1, Math.round(cssHeight * ratio));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
    },
    draw(data: Float32Array, count: number) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data.subarray(0, count * STRIDE));
      gl.drawArrays(gl.POINTS, 0, count);
    },
  };
}

export type Renderer = ReturnType<typeof createRenderer>;
