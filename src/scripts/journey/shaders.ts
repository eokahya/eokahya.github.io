/**
 * GLSL ES 1.00 sources (valid in WebGL 1 and WebGL 2 contexts).
 * Stage functions mirror the configurations described in targets.ts.
 */
export const particleVertex = /* glsl */ `
precision highp float;
attribute vec3 aP0;
attribute vec4 aP1;
attribute vec3 aP2;
attribute vec3 aP3;
attribute vec3 aP3b;
attribute vec3 aP4;
attribute vec4 aRole;
attribute vec4 aFlags;
attribute vec4 aSeed;
attribute vec4 aSweep;

uniform mat4 uViewProj;
uniform vec2 uOffset;
uniform float uTime;
uniform float uSegA;
uniform float uF;
uniform float uPointScale;
uniform float uDensity;
uniform float uCircuit;
uniform float uAblate;
uniform mediump float uLight;
uniform vec3 uPal[18];

varying vec3 vColor;
varying float vAlpha;

const float PI = 3.14159265;
const float OMEGA = 0.8;
const float CW = 0.22;
const float RMAX = 2.3;

vec3 rotY(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotX(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
float well(vec2 p) { return -0.9 / pow(1.0 + dot(p, p) / 0.28, 0.8); }

vec3 classColor(float c) {
  if (c < 0.5) return uPal[5];
  if (c < 1.5) return uPal[6];
  if (c < 2.5) return uPal[7];
  if (c < 3.5) return uPal[8];
  return uPal[9];
}

// 0 — spacetime fabric curved by a binary source that radiates a two-armed ripple
void stage0(out vec3 pos, out vec3 col, out float alpha, out float size) {
  float t = uTime;
  if (aRole.x > 0.5) {
    float ang = OMEGA * t + (aRole.x > 1.5 ? PI : 0.0);
    vec3 c = vec3(cos(ang) * 0.19, well(vec2(0.0)) + 0.07, sin(ang) * 0.19);
    float core = 1.0 - smoothstep(0.0, 0.05, length(aP0));
    pos = c + aP0;
    col = uPal[1];
    alpha = mix(0.06, 1.0, core);
    size = mix(10.0, 2.3, core);
    return;
  }
  vec2 q = aP0.xz;
  float r = length(q);
  float ph = atan(q.y, q.x);
  float env = smoothstep(0.16, 0.6, r) * exp(-r * 0.42);
  float wave = cos(2.0 * ph - 2.0 * OMEGA * t + 2.0 * OMEGA * r / CW);
  pos = vec3(q.x, well(q) + 0.08 * env * wave, q.y);
  float edge = (1.0 - smoothstep(1.5, 2.6, max(abs(q.x), abs(q.y))));
  col = mix(uPal[0], uPal[1], (1.0 - smoothstep(0.0, 0.6, r)) * 0.6);
  alpha = 0.6 * edge * (0.8 + 0.75 * env * max(wave, 0.0));
  size = 1.55;
}

// 1 — the fabric wrapped into a slowly turning sphere with a mottled "temperature"
void stage1(out vec3 pos, out vec3 col, out float alpha, out float size) {
  vec3 p = rotX(rotY(aP1.xyz, uTime * 0.05 + 0.6), 0.32);
  pos = p * (1.0 + 0.012 * sin(uTime * 0.6));
  float T = clamp(aP1.w * 1.35, -1.0, 1.0);
  col = T < 0.0 ? mix(uPal[3], uPal[2], -T) : mix(uPal[3], uPal[4], T);
  // The near hemisphere dominates so the mottled pattern stays legible.
  float front = smoothstep(-0.55, 0.75, p.z / 1.25);
  alpha = (0.36 + 0.46 * abs(T)) * mix(0.08, 1.0, front);
  size = 2.0 + 0.9 * front;
}

// 2 — clusters on a curved representation manifold
void stage2(out vec3 pos, out vec3 col, out float alpha, out float size) {
  float t = uTime;
  vec3 p = aP2;
  if (aFlags.w < 1.5) p += 0.014 * vec3(sin(t * 0.7 + aSeed.y * 6.28), sin(t * 0.9 + aSeed.z * 6.28), cos(t * 0.8 + aSeed.w * 6.28));
  pos = rotY(p, 0.22 * sin(t * 0.11));
  if (aFlags.w > 1.5) { col = uPal[10]; alpha = 0.42; size = 1.15; }
  else { col = classColor(aRole.w); alpha = aFlags.w > 0.5 ? 0.36 : 0.66; size = aFlags.w > 0.5 ? 1.45 : 1.9; }
}

// 3 — a layered network; activations flow along edges; a circuit can be traced or ablated
void stage3(out vec3 pos, out vec3 col, out float alpha, out float size) {
  float t = uTime;
  float circ = aFlags.x;
  float cut = aFlags.y * uAblate;
  float abl = aFlags.z * uAblate;
  if (aRole.y < 0.5) {
    float core = 1.0 - smoothstep(0.0, 0.04, length(aP3 - aP3b));
    pos = aP3;
    col = mix(uPal[11], uPal[13], circ * uCircuit);
    col = mix(col, uPal[17], abl);
    alpha = mix(0.18, 0.95, core) * (1.0 - abl * 0.55) * mix(1.0, 0.45, uCircuit * (1.0 - circ));
    size = mix(3.6, 2.5, core) + circ * uCircuit * 0.9;
  } else if (aRole.y < 1.5) {
    float speed = mix(0.13, 0.21, circ) * (1.0 - cut);
    float s = fract(aSeed.y + t * speed);
    pos = mix(aP3, aP3b, s);
    pos.y += 0.01 * sin(s * PI * 2.0 + aSeed.z * 6.28);
    col = mix(uPal[12], uPal[13], circ * mix(0.3, 1.0, uCircuit));
    alpha = 0.52 * smoothstep(0.0, 0.08, s) * (1.0 - smoothstep(0.92, 1.0, s));
    alpha *= mix(1.0, 0.24, uCircuit * (1.0 - circ));
    alpha *= 1.0 + circ * uCircuit * 0.8;
    alpha *= 1.0 - cut * 0.93;
    size = 1.6 + circ * uCircuit * 0.7;
  } else {
    pos = aP3 + 0.04 * vec3(sin(t * 0.3 + aSeed.y * 6.28), cos(t * 0.27 + aSeed.z * 6.28), 0.0);
    col = uPal[12];
    alpha = 0.15;
    size = 1.1;
  }
}

// 4 — wavefronts spreading from a source through a field of listeners
float ringR(float k) { return fract(k / 6.0 + uTime * 0.05) * RMAX; }
float ringFade(float r) { return smoothstep(0.0, 0.25, r) * pow(max(0.0, 1.0 - r / RMAX), 1.2); }

void stage4(out vec3 pos, out vec3 col, out float alpha, out float size) {
  vec3 p;
  if (aRole.z > 1.5) {
    float core = 1.0 - smoothstep(0.0, 0.06, length(aP4));
    p = aP4 * (1.0 + 0.18 * sin(uTime * 2.4));
    col = uPal[1];
    alpha = mix(0.06, 1.0, core);
    size = mix(10.0, 2.4, core);
  } else if (aRole.z > 0.5) {
    float r = ringR(aP4.y);
    p = vec3(cos(aP4.x) * r, sin(aP4.x) * r, aP4.z * 0.05);
    col = uPal[14];
    alpha = 0.72 * ringFade(r);
    size = 1.9;
  } else {
    p = aP4;
    float r = length(p.xy);
    float lit = 0.0;
    for (int k = 0; k < 6; k++) {
      float rk = ringR(float(k));
      float d = (r - rk) / 0.085;
      lit += exp(-d * d) * ringFade(rk);
    }
    lit = min(lit, 1.0);
    p.z += lit * 0.06;
    col = mix(uPal[15], uPal[14], lit);
    alpha = 0.55 + 0.45 * lit;
    size = 2.0 + 1.6 * lit;
  }
  pos = rotX(rotY(p, -0.28), 0.12);
}

void evalStage(float s, out vec3 pos, out vec3 col, out float alpha, out float size) {
  if (s < 0.5) stage0(pos, col, alpha, size);
  else if (s < 1.5) stage1(pos, col, alpha, size);
  else if (s < 2.5) stage2(pos, col, alpha, size);
  else if (s < 3.5) stage3(pos, col, alpha, size);
  else stage4(pos, col, alpha, size);
}

void main() {
  vec3 pos;
  vec3 col;
  float alpha;
  float size;
  if (aRole.x > 2.5) {
    pos = aP0;
    col = uPal[16];
    alpha = 0.3 + 0.22 * sin(uTime * 0.6 + aSeed.y * 40.0);
    size = 1.1 + aSeed.z * 0.9;
  } else {
    vec3 posA; vec3 colA; float aA; float sA;
    vec3 posB; vec3 colB; float aB; float sB;
    evalStage(uSegA, posA, colA, aA, sA);
    float m = 0.0;
    if (uF > 0.0) {
      evalStage(uSegA + 1.0, posB, colB, aB, sB);
      float order = uSegA < 0.5 ? aSweep.x : (uSegA < 1.5 ? aSweep.y : (uSegA < 2.5 ? aSweep.z : aSweep.w));
      m = clamp((uF - 0.12 - order * 0.42) / 0.34, 0.0, 1.0);
      m = m * m * (3.0 - 2.0 * m);
    } else {
      posB = posA; colB = colA; aB = aA; sB = sA;
    }
    float swirl = sin(m * PI);
    pos = mix(posA, posB, m);
    // A coherent flow field plus a little individual jitter: particles stream, not scatter.
    vec3 mid = (posA + posB) * 0.5;
    vec3 flow = vec3(sin(mid.y * 2.3 + uTime * 0.35), sin(mid.z * 2.1 - uTime * 0.3), sin(mid.x * 1.9 + uTime * 0.4));
    vec3 jitter = vec3(sin(aSeed.y * 43.0), sin(aSeed.z * 37.0), sin(aSeed.w * 29.0));
    pos += swirl * (0.16 * flow + 0.05 * jitter);
    col = mix(colA, colB, m);
    alpha = mix(aA, aB, m) * (1.0 - 0.25 * swirl);
    size = mix(sA, sB, m);
  }
  vec4 clip = uViewProj * vec4(pos, 1.0);
  clip.xy += uOffset * clip.w;
  gl_Position = clip;
  gl_PointSize = max(1.0, size * uPointScale / clip.w);
  vAlpha = min(1.0, alpha * uDensity) * (1.0 - smoothstep(2.0, 22.0, clip.w)) * mix(1.0, 1.3, uLight);
  vColor = col;
}
`;

export const particleFragment = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
uniform float uLight;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float shape = uLight > 0.5 ? (1.0 - smoothstep(0.3, 1.0, d)) : exp(-d * 3.0) * (1.0 - d * 0.6);
  float a = vAlpha * shape;
  gl_FragColor = vec4(vColor * a, a);
}
`;

export const lineVertex = /* glsl */ `
precision highp float;
attribute vec3 aPos;
attribute vec2 aFlag;
uniform mat4 uViewProj;
uniform vec2 uOffset;
uniform float uVis;
uniform float uCircuit;
uniform float uAblate;
uniform vec3 uEdge;
uniform vec3 uCirc;
varying vec4 vCol;
void main() {
  vec4 clip = uViewProj * vec4(aPos, 1.0);
  clip.xy += uOffset * clip.w;
  gl_Position = clip;
  float a = uVis * 0.2;
  a *= mix(1.0, 0.35, uCircuit * (1.0 - aFlag.x));
  a *= 1.0 + aFlag.x * uCircuit * 1.8;
  a *= 1.0 - aFlag.y * uAblate * 0.85;
  vec3 c = mix(uEdge, uCirc, aFlag.x * uCircuit);
  vCol = vec4(c * a, a);
}
`;

export const lineFragment = /* glsl */ `
precision mediump float;
varying vec4 vCol;
void main() { gl_FragColor = vCol; }
`;

export const glowVertex = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const glowFragment = /* glsl */ `
precision mediump float;
varying vec2 vUv;
uniform vec3 uGlow;
uniform vec2 uCenter;
uniform float uAspect;
uniform float uStrength;
void main() {
  vec2 d = vUv - uCenter;
  d.x *= uAspect;
  float g = exp(-dot(d, d) * 2.6) * uStrength;
  gl_FragColor = vec4(uGlow * g, g);
}
`;
