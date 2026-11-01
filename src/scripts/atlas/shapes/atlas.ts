/**
 * Opening plate of the Projects page: an "atlas" of five research questions.
 * Five small orbiting clusters, one per project in its own colour, sit on a gentle arc joined by
 * dotted paths; faint dust fills the field. Schematic only.
 */
import { SLOT, type ShapeDef } from '../types';

const NODES: ReadonlyArray<{ x: number; y: number; color: number }> = [
  { x: -1.25, y: 0.38, color: SLOT.gold },
  { x: -0.62, y: -0.22, color: SLOT.violet },
  { x: 0.02, y: 0.3, color: SLOT.cyan },
  { x: 0.66, y: -0.28, color: SLOT.green },
  { x: 1.26, y: 0.26, color: SLOT.coral },
];

export const atlas: ShapeDef = {
  id: 'atlas',
  restTime: 3,
  create(count, random) {
    const role = new Uint8Array(count); // 0 dust, 1 cluster, 2 path
    const a = new Float32Array(count), b = new Float32Array(count), c = new Float32Array(count), d = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = random();
      a[i] = random(); b[i] = random(); c[i] = random(); d[i] = random();
      role[i] = r < 0.2 ? 0 : r < 0.74 ? 1 : 2;
    }
    return (i, t, _focus, out) => {
      if (role[i] === 0) {
        // dust: slow drift on a wide ellipse
        const angle = a[i]! * Math.PI * 2 + t * 0.012 * (b[i]! - 0.5);
        const radius = 0.35 + 1.45 * Math.sqrt(c[i]!);
        out.x = Math.cos(angle) * radius * 1.15;
        out.y = Math.sin(angle) * radius * 0.62;
        out.z = (d[i]! - 0.5) * 1.1;
        out.size = 0.7 + 0.7 * b[i]!;
        out.color = b[i]! > 0.85 ? SLOT.pale : SLOT.dim;
        out.alpha = 0.5 + 0.3 * Math.sin(t * 0.8 + a[i]! * 40);
        return;
      }
      if (role[i] === 1) {
        // cluster: particles on a tilted ring around a node, slowly orbiting
        const node = NODES[Math.floor(a[i]! * NODES.length)]!;
        const k = Math.floor(a[i]! * NODES.length);
        const ring = 0.05 + 0.27 * Math.pow(b[i]!, 1.35);
        const angle = c[i]! * Math.PI * 2 + t * (0.35 + 0.25 * (1 - b[i]!)) * (k % 2 ? -1 : 1);
        const tilt = 0.45 + 0.1 * k;
        out.x = node.x + Math.cos(angle) * ring;
        out.y = node.y + Math.sin(angle) * ring * tilt;
        out.z = Math.sin(angle) * ring * 0.9;
        out.size = ring < 0.09 ? 2.4 : 1.2 + 0.8 * (1 - b[i]!);
        out.color = node.color;
        out.alpha = ring < 0.09 ? 1 : 0.6 + 0.4 * (1 - b[i]!);
        return;
      }
      // dotted paths between consecutive nodes, with a soft pulse travelling along them
      const segment = Math.min(NODES.length - 2, Math.floor(a[i]! * (NODES.length - 1)));
      const p = NODES[segment]!, q = NODES[segment + 1]!;
      const s = b[i]!;
      const bow = Math.sin(Math.PI * s) * 0.16 * (segment % 2 ? 1 : -1);
      out.x = p.x + (q.x - p.x) * s;
      out.y = p.y + (q.y - p.y) * s + bow;
      out.z = (c[i]! - 0.5) * 0.06;
      const pulse = Math.exp(-Math.pow(((s - ((t * 0.18 + segment * 0.2) % 1)) * 9), 2));
      out.size = 0.9 + 1.1 * pulse;
      out.color = pulse > 0.5 ? SLOT.pale : SLOT.ink;
      out.alpha = 0.55 + 0.45 * pulse;
    };
  },
};
