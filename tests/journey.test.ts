import assert from 'node:assert/strict';
import test from 'node:test';
import { buildScene, darkPalette, lightPalette, PALETTE_SIZE } from '../src/scripts/journey/targets';
import { plateNames, plateSvg } from '../src/lib/plates';

test('the journey scene is deterministic, finite and complete', () => {
  const a = buildScene(9000), b = buildScene(9000);
  assert.equal(a.count, 9000);
  for (const key of ['p0', 'p2', 'p3', 'p3b', 'p4'] as const) assert.equal(a[key].length, a.count * 3);
  for (const key of ['p1', 'role', 'flags', 'seed', 'sweep'] as const) assert.equal(a[key].length, a.count * 4);
  for (const key of ['p0', 'p1', 'p2', 'p3', 'p3b', 'p4', 'role', 'flags', 'seed', 'sweep'] as const) {
    assert.ok(a[key].every(Number.isFinite), key);
    assert.deepEqual(a[key], b[key], `${key} must be deterministic`);
  }
  assert.ok(a.sweep.every((value) => value >= 0 && value <= 1));
  assert.ok(a.lineCount > 100 && a.lines.length === a.lineCount * 6);
  assert.equal(darkPalette.length, PALETTE_SIZE);
  assert.equal(lightPalette.length, PALETTE_SIZE);
});

test('background stars stay put in every stage, and the circuit exists', () => {
  const scene = buildScene(6000);
  let stars = 0, circuit = 0, downstream = 0;
  for (let i = 0; i < scene.count; i++) {
    if (scene.role[i * 4] === 3) {
      stars++;
      const p0 = Array.from(scene.p0.subarray(i * 3, i * 3 + 3));
      assert.deepEqual(Array.from(scene.p4.subarray(i * 3, i * 3 + 3)), p0);
      assert.deepEqual(Array.from(scene.p2.subarray(i * 3, i * 3 + 3)), p0);
    }
    if (scene.flags[i * 4] === 1) circuit++;
    if (scene.flags[i * 4 + 1] === 1) downstream++;
  }
  assert.ok(stars > 100);
  assert.ok(circuit > 200 && downstream > 50);
});

test('static plates are deterministic SVG documents', () => {
  for (const name of plateNames) {
    for (const mode of ['vars', 'dark', 'light'] as const) {
      const svg = plateSvg(name, mode);
      assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `${name} ${mode}`);
      assert.equal(svg, plateSvg(name, mode));
      assert.ok(!/NaN|undefined|Infinity/.test(svg), `${name} ${mode} contains invalid numbers`);
    }
  }
});
