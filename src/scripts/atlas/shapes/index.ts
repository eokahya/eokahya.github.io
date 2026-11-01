/** Stage order of the Projects page: the opening atlas, then the five projects as listed in data/projects.ts. */
import type { ShapeDef } from '../types';
import { atlas } from './atlas';
import { quantumGravity } from './quantum-gravity';
import { conformalScalar } from './conformal-scalar';
import { moeRotation } from './moe-rotation';
import { splitEnrich } from './split-enrich';
import { gpt2Spectral } from './gpt2-spectral';

export const stages: readonly ShapeDef[] = [atlas, quantumGravity, conformalScalar, moeRotation, splitEnrich, gpt2Spectral];
