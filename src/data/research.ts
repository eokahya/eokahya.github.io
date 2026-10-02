/** Original summaries of verified work; the final direction is instructor supplied. */
export interface ResearchArea {
  id: string;
  title: string;
  short: string;
  description: string[];
  evidence: string[];
  status: 'Published work' | 'Current research direction';
}

export const researchAreas: ResearchArea[] = [
  {
    id: 'quantum-fields',
    title: 'Quantum Fields and Gravitation',
    short: 'Quantum fields in curved spacetime, gravitational quantum corrections and the structure of non-Lorentzian theories.',
    description: [
      'How does a quantum field evolve when spacetime itself is dynamical? My published work examines quantum corrections to scalar fields during inflation, including scalar self-mass calculations and corrected mode equations on de Sitter backgrounds.',
      'Related work studies the graviton propagator and, more recently, the quantization of Carrollian fermions. These problems use quantum field theory to investigate how geometry, symmetry and interactions constrain physical descriptions.',
    ],
    evidence: ['inspire-1614630', 'inspire-1319289', 'inspire-1082014', 'inspire-2878317'],
    status: 'Published work',
  },
  {
    id: 'cosmology',
    title: 'Cosmology and Modified Gravity',
    short: 'Inflation, cosmological models and observational tests of gravitational theories beyond general relativity.',
    description: [
      'My work connects cosmological model building with tests that distinguish competing gravitational descriptions. Published studies include inflationary potentials, modified f(R) theories and differential Shapiro-delay constraints using multimessenger observations.',
      'The GW170817 study tests a specific class of dark-matter-emulating theories. Work on holographic boundary conformal field theory investigates Horndeski gravity; recent preprints examine reconstruction and parametrization choices in late-universe cosmology. The papers specify the assumptions and scope of each result.',
    ],
    evidence: ['inspire-1768430', 'inspire-1631136', 'inspire-1682331', 'inspire-2842587', 'inspire-3144795'],
    status: 'Published work',
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning for Physics',
    short: 'Learning from physical data: astronomical time series, electron identification and physically grounded prediction tasks.',
    description: [
      'Machine learning is useful in physics when the data, baseline and evaluation reflect the scientific question. My published light-curve study investigates classification and feature relevance using neural networks and tree-based methods on multiband astronomical data.',
      'My computer-science master’s thesis applies deep learning to signal-electron identification in ATLAS data and investigates generalization. A recent public preprint explores a hybrid temporal convolutional network and transformer for satellite conjunction-risk prediction. These are distinct applications, each with its own evidence and limitations.',
    ],
    evidence: ['light-curves-2021', 'electron-identification-2020', 'satellite-collision-2026'],
    status: 'Published work',
  },
  {
    id: 'interpretability',
    title: 'Mechanistic Interpretability and Reliable AI',
    short: 'A current direction: learned representations, causal interventions and testable explanations of model behavior.',
    description: [
      'My current research direction concerns the internal computations of learned models: how representations support behavior, and what controlled interventions can reveal about those mechanisms. Activation analysis, ablation and patching offer ways to move from descriptive patterns toward testable causal hypotheses.',
      'The emphasis is on careful baselines, matched controls, uncertainty and reproducibility. This is an ongoing research direction, rather than a claim of established interpretability results. Its connection to physics is methodological: controlled experiments and explicit assumptions, without asserting an equivalence between a physical theory and a neural network.',
    ],
    evidence: [],
    status: 'Current research direction',
  },
];

export const research = researchAreas;
