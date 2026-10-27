/** The public course plan. Keep policy and provisional teaching choices distinct. */
export interface CourseWeek {
  week: number;
  title: string;
  description: string;
  phase: 'foundations' | 'midterm' | 'presentation' | 'clinic' | 'writing';
}

export interface LectureNote {
  week: number;
  title: string;
  relativePath: string;
  fileSize: number;
}

export interface RubricItem {
  criterion: string;
  points: number;
}

export interface Course {
  code: string;
  title: string;
  term: string;
  language: string;
  instructor: string;
  institution: string;
  email: string;
  timetable: string;
  path: string;
  termPath: string;
  notesPath: string;
  syllabusPath: string;
  printPath: string;
  sourceVersion: string;
  updatedOn: string;
  overview: readonly string[];
  recommendedBackground: string;
  learningOutcomes: readonly string[];
  assessment: {
    midtermPoints: number;
    presentationsTotalPoints: number;
    finalPaperPoints: number;
    minimumMidtermPercent: number;
    requiredPresentations: number;
    finalFormat: string;
    practicePolicy: string;
  };
  planning: {
    status: string;
    presentationSplitProvisional: boolean;
    sameProjectAcrossPresentationsProvisional: boolean;
    rubricsProvisional: boolean;
    presentations: readonly {
      id: 'presentation-1' | 'presentation-2';
      title: string;
      points: number;
      window: string;
      rubric: readonly RubricItem[];
    }[];
    scheduleProvisional: boolean;
    midtermWeek: number;
    paperFormatProvisional: boolean;
    paperMainTextPages: readonly [number, number];
    paperRubric: readonly RubricItem[];
    paperSections: readonly string[];
    finalSubmission: string;
    teamArrangements: string;
  };
  weeks: readonly CourseWeek[];
  supplementaryScope: string;
  project: {
    title: string;
    paragraphs: readonly string[];
    directions: readonly string[];
    supportingMaterial: string;
  };
  integrity: string;
  /** Project reading list: verified links with a one-sentence description, grouped by kind. */
  readingList: {
    intro: string;
    checkedOn: string;
    groups: readonly { id: string; title: string; note?: string; items: readonly ReadingItem[] }[];
  };
  resources: readonly { title: string; description: string; url: string }[];
  announcements: readonly { title: string; text: string; date?: string }[];
}

export interface ReadingItem {
  title: string;
  authors: string;
  year: number;
  venue: string;
  url: string;
  description: string;
  /** Semantic Scholar citation count on readingList.checkedOn; omitted for tools, guides and very recent work. */
  citations?: number;
}

export const course: Course = {
  code: 'MYZ 310E',
  title: 'Machine Learning in Physics',
  term: 'Fall 2026',
  language: 'English',
  instructor: 'Prof. Dr. Emre Onur Kahya',
  institution: 'Istanbul Technical University',
  email: 'eokahya@itu.edu.tr',
  timetable: 'Timetable, room and office hours: to be announced.',
  path: '/teaching/myz-310e/',
  termPath: '/teaching/myz-310e/2026-fall/',
  notesPath: '/teaching/myz-310e/2026-fall/notes/',
  syllabusPath: '/teaching/myz-310e/2026-fall/myz-310e-syllabus.pdf',
  printPath: '/teaching/myz-310e/2026-fall/syllabus/',
  sourceVersion: '2026-fall-v3',
  updatedOn: '2026-10-27',
  overview: [
    'MYZ 310E introduces the foundations of machine learning through mathematical reasoning, implementation, and examples relevant to physics. The first six weeks provide an intensive foundation in statistical learning, supervised and unsupervised methods, and neural networks. The remainder of the semester is organised around a research project in mechanistic interpretability, with two presentations and a final paper.',
    'The foundations component draws inspiration from the publicly available IFT 6390 course outline at Université de Montréal/Mila. It is a selective adaptation for this course, not a claim of equivalent coverage. The mechanistic interpretability project is a distinct component of MYZ 310E.',
  ],
  recommendedBackground: 'Working knowledge of linear algebra, multivariable calculus, elementary probability and statistics, and basic Python programming. These are recommended preparation, not newly imposed official registration prerequisites. Short refresher materials will be identified where appropriate.',
  learningOutcomes: [
    'Formulate learning problems and evaluate models using appropriate data splits, baselines, and metrics.',
    'Implement and compare basic regression, classification, and neural-network methods.',
    'Explain the distinction between predictive performance, representation analysis, and causal evidence about a model’s computation.',
    'Design a focused mechanistic interpretability experiment with suitable interventions and controls.',
    'Analyse uncertainty, limitations, and reproducibility, and communicate findings in a scientific paper.',
  ],
  assessment: {
    midtermPoints: 30,
    presentationsTotalPoints: 30,
    finalPaperPoints: 40,
    minimumMidtermPercent: 40,
    requiredPresentations: 2,
    finalFormat: 'The final assessment is a paper based on the project. There is no additional written final examination specified in this course plan.',
    practicePolicy: 'Practice exercises and project clinics do not introduce additional grading categories.',
  },
  planning: {
    status: 'The assessment weights and final-assessment eligibility rule are instructor-specified. The equal presentation split, use of the same project for both presentations, presentation milestones, indicative weekly schedule, detailed rubrics, and proposed paper length are provisional teaching choices. This plan does not claim institutional syllabus approval.',
    presentationSplitProvisional: true,
    sameProjectAcrossPresentationsProvisional: true,
    rubricsProvisional: true,
    presentations: [
      {
        id: 'presentation-1',
        title: 'Project presentation I',
        points: 15,
        window: 'Weeks 8–9',
        rubric: [
          { criterion: 'Research question and relevant background', points: 4 },
          { criterion: 'Experimental design and controls', points: 5 },
          { criterion: 'Baseline implementation or initial evidence', points: 3 },
          { criterion: 'Clarity and responses to questions', points: 3 },
        ],
      },
      {
        id: 'presentation-2',
        title: 'Project presentation II',
        points: 15,
        window: 'Weeks 12–13',
        rubric: [
          { criterion: 'Experiments and controls', points: 6 },
          { criterion: 'Interpretation, uncertainty, and limitations', points: 5 },
          { criterion: 'Clarity and responses to questions', points: 4 },
        ],
      },
    ],
    scheduleProvisional: true,
    midtermWeek: 7,
    paperFormatProvisional: true,
    paperMainTextPages: [4, 6],
    paperRubric: [
      { criterion: 'Research question and related work', points: 6 },
      { criterion: 'Methodological correctness and controls', points: 10 },
      { criterion: 'Experimental evidence and evaluation', points: 10 },
      { criterion: 'Interpretation, limitations, and safety relevance', points: 6 },
      { criterion: 'Reproducibility documentation', points: 5 },
      { criterion: 'Clarity of writing and figures', points: 3 },
    ],
    paperSections: ['Abstract', 'Introduction', 'Related Work', 'Methods', 'Experimental Setup', 'Results', 'Discussion and Limitations', 'Safety/Relevance', 'Conclusion'],
    finalSubmission: 'The final project paper is submitted in the final assessment period. The submission deadline and submission channel will be announced.',
    teamArrangements: 'Team arrangements and detailed submission instructions will be confirmed in class. No student names, private submissions, or grades are published on this website.',
  },
  weeks: [
    { week: 1, title: 'Statistical learning and scientific data', phase: 'foundations', description: 'Learning tasks, data representation, a probability/likelihood refresher, loss functions, training/validation/test separation, and data leakage. Illustrative physics application: a small, controlled measurement or classification dataset.' },
    { week: 2, title: 'Regression, optimisation, and generalisation', phase: 'foundations', description: 'Linear regression, regularisation, gradient-based optimisation, overfitting, model selection, and uncertainty in evaluation. Core implementation: a transparent regression baseline.' },
    { week: 3, title: 'Classification and decision boundaries', phase: 'foundations', description: 'Nearest neighbours, logistic/softmax classification, probabilistic classification, and evaluation metrics. Introduce the motivation for margins and kernels without requiring a full treatment of every method. Begin provisional project-topic selection.' },
    { week: 4, title: 'Linear models and optimisation', phase: 'foundations', description: 'Generative classifiers (Bayes classifier, LDA/QDA, naive Bayes), gradient-based and stochastic optimisation, linear regression with ridge and lasso, and linear classifiers (perceptron, logistic regression, support vector machines). Beyond linear models: explicit feature maps and the kernel trick, as the bridge to neural networks.' },
    { week: 5, title: 'Neural networks and representations', phase: 'foundations', description: 'Multilayer perceptrons, computational graphs, backpropagation, regularisation, and practical training diagnostics, connected to a small PyTorch implementation. PCA, clustering and representation geometry as tools for examining what a network has learned. Trees and ensemble methods are positioned briefly; deeper treatments may be supplementary.' },
    { week: 6, title: 'From neural computation to mechanistic interpretability', phase: 'foundations', description: 'An introductory account of attention, residual streams, and transformer components. Introduce activation inspection, ablation and patching, the limits of attention visualisation, and the distinction between probes and causal tests. Use one small worked demonstration rather than claiming to cover the whole field.' },
    { week: 7, title: 'Midterm examination and project scoping', phase: 'midterm', description: 'The examination date will be announced. Confirm a research question, a feasible model/task pair, and an initial experimental plan.' },
    { week: 8, title: 'Project presentation I — first round', phase: 'presentation', description: 'The first presentation round is provisionally distributed over weeks 8–9 as needed. Present motivation, related work, a testable hypothesis, baseline results, and planned controls. Every student/project presents once across this round.' },
    { week: 9, title: 'Project presentation I — continued', phase: 'presentation', description: 'Continue the first presentation round and feedback. Every student/project presents once across weeks 8–9; this is one presentation requirement, not two separate presentations.' },
    { week: 10, title: 'Controlled experiments and ablations', phase: 'clinic', description: 'Project clinic: intervention design, comparison conditions, confounding factors, and held-out evaluation.' },
    { week: 11, title: 'Robustness and reproducibility', phase: 'clinic', description: 'Project clinic: uncertainty estimates, repeated runs where feasible, robustness checks, and preparation of a reproducible experiment package.' },
    { week: 12, title: 'Project presentation II — second round', phase: 'presentation', description: 'The second presentation round is provisionally distributed over weeks 12–13 as needed. Present results, causal evidence, limitations, and the structure of the final paper. Every student/project presents once across this round.' },
    { week: 13, title: 'Project presentation II — continued', phase: 'presentation', description: 'Continue the second presentation round and feedback. Every student/project presents once across weeks 12–13; this is the second presentation requirement.' },
    { week: 14, title: 'Paper development and feedback', phase: 'writing', description: 'Scientific writing, figure quality, methodological review, and reproducibility checks. This is not an additional graded presentation.' },
  ],
  supplementaryScope: 'Detailed CNN/RNN architectures, full SVM derivations, probabilistic graphical models, and advanced ensemble methods are supplementary unless explicitly assigned. Their presence in IFT 6390 does not imply that they are all taught in depth within six weeks here.',
  project: {
    title: 'Mechanistic interpretability',
    paragraphs: [
      'Investigate a clearly stated question about the internal operation of a small neural network or language model. Begin with a model/task combination that demonstrably works before interpreting its internal computation. Do not depend on a small language model solving advanced physics problems it cannot reliably solve.',
      'The physics connection should be substantive: for example a controlled dataset, a symmetry or invariance question, a perturbation-response hypothesis, or an experimentally testable constraint. A physics metaphor alone is insufficient.',
      'Include a baseline, an appropriate negative or matched control, a clearly defined evaluation procedure, and an honest discussion of uncertainty and limitations. Where feasible, use repeated seeds and held-out examples. Report the actual computational budget; expensive model training is not a prerequisite.',
      'Small-model results should not be presented as proof that frontier systems are safe. Include a short discussion of the relevance and limits of the work for robustness, reliability, or AI safety.',
      'A carefully executed negative result is acceptable. Assessment rewards scientific quality, not positive results or acceptance at a conference. The aspiration is rigorous research methodology, not guaranteed publication.',
    ],
    directions: [
      'Controlled representation analysis',
      'Counterfactual activation patching',
      'Sensitivity to task-preserving perturbations',
      'Tests distinguishing probe information from causal use',
    ],
    supportingMaterial: 'Provide code and reproducibility instructions as supporting material, not as an additional grading category.',
  },
  integrity: 'Cite sources and borrowed code. Do not fabricate data, results, or references. Disclose substantive AI assistance and verify the resulting text and code. Students remain responsible for their work and should be able to explain their methods and results. Any exam-specific tool rules will be announced separately; this statement does not grant permission to use AI during the midterm.',
  readingList: {
    intro: 'Background reading for the project: an essay on where the field is going, Anthropic\'s interpretability papers, the foundational papers, recent highly cited work, and practical tools. You are not expected to read everything. Start with the first group, then read the papers closest to your project direction.',
    checkedOn: '2026-10-27',
    groups: [
      {
        id: 'start',
        title: 'Start here',
        items: [
          { title: 'Accelerating Interpretability: A Human Genome Project for AI', authors: 'Thomas McGrath and Mathilde Papillon', year: 2026, venue: 'Goodfire blog', url: 'https://www.goodfire.com/blog/accelerating-interpretability', description: 'Argues that interpretability is now limited by how many careful experiments can be run, and proposes a shared, cross-industry effort in which AI agents run rigorous experiments to map a frontier model. Read it for the questions the field cares about now: causal hypothesis testing, the limits of the linear representation hypothesis, and curved (manifold) representations.' },
          { title: 'Open Problems in Mechanistic Interpretability', authors: 'Sharkey, Chughtai, Batson, Lindsey et al.', year: 2025, venue: 'TMLR', url: 'https://arxiv.org/abs/2501.16496', citations: 211, description: 'A multi-lab review of what is still unsolved: better methods, applying them to concrete goals, and the wider challenges of the field. A good map for finding a question where a semester project can still say something new.' },
          { title: 'How To Become A Mechanistic Interpretability Researcher', authors: 'Neel Nanda', year: 2025, venue: 'AI Alignment Forum', url: 'https://www.alignmentforum.org/posts/jP9KDyMkchuv6tHwm/how-to-become-a-mechanistic-interpretability-researcher', description: 'A practical guide: learn the basics, do short mini-projects, then run focused research sprints. Its advice on baselines, ablations and avoiding cherry-picked examples applies directly to your project.' },
          { title: 'The Circuits Research Landscape: Results and Perspectives', authors: 'Lindsey, Ameisen, Nanda, McGrath et al. (Anthropic, Decode, EleutherAI, Goodfire, Google DeepMind)', year: 2025, venue: 'Neuronpedia', url: 'https://www.neuronpedia.org/graph/info', description: 'A cross-lab report on attribution graphs (circuit tracing). It reproduces earlier findings on small open models such as GPT-2 and Llama 3.2 1B, shares practical lessons, and lists the limitations of the method frankly.' },
        ],
      },
      {
        id: 'anthropic',
        title: 'Anthropic\'s interpretability research',
        note: 'Most of these papers are published on Anthropic\'s Transformer Circuits Thread (see Tools and tutorials). Listed in order of publication.',
        items: [
          { title: 'A Mathematical Framework for Transformer Circuits', authors: 'Elhage, Nanda, Olsson et al.', year: 2021, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2021/framework/index.html', description: 'Takes apart attention-only transformers with zero to two layers. It reads the residual stream as a shared communication channel and splits each attention head into a QK circuit (where to look) and an OV circuit (what to move): the vocabulary used for small-model circuits ever since.' },
          { title: 'In-context Learning and Induction Heads', authors: 'Olsson, Elhage, Nanda et al.', year: 2022, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html', citations: 1090, description: 'Argues that induction heads, which continue a pattern seen earlier in the context, may account for much of in-context learning. The authors say openly that much of their evidence is circumstantial, which makes the paper a good model for weighing correlational against causal evidence.' },
          { title: 'Toy Models of Superposition', authors: 'Elhage, Hume, Olsson, Schiefer et al.', year: 2022, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2022/toy_model/index.html', citations: 1123, description: 'Small ReLU networks trained on sparse synthetic features store more features than they have dimensions (superposition), with geometric structure and sharp phase changes. A physics-friendly explanation of why single neurons are often polysemantic, and easy to reproduce on a laptop.' },
          { title: 'Towards Monosemanticity: Decomposing Language Models With Dictionary Learning', authors: 'Bricken, Templeton, Batson, Chen, Jermyn et al.', year: 2023, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2023/monosemantic-features/index.html', description: 'Trains a sparse autoencoder on the 512-neuron MLP layer of a one-layer transformer and recovers thousands of largely interpretable features. It did much to popularise sparse autoencoders (SAEs) as an interpretability tool.' },
          { title: 'Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet', authors: 'Templeton, Conerly et al.', year: 2024, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html', citations: 882, description: 'Scales sparse autoencoders to a production model and finds abstract, multilingual and multimodal features. Steering these features changes the model\'s behaviour, which is evidence that the model actually uses them.' },
          { title: 'Circuit Tracing: Revealing Computational Graphs in Language Models', authors: 'Ameisen, Lindsey, Pearce, Gurnee et al.', year: 2025, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2025/attribution-graphs/methods.html', description: 'Builds a replacement model in which cross-layer transcoders stand in for the MLP layers, then traces the computation on a given prompt as an attribution graph of interpretable features, extending earlier transcoder work. Hypotheses read off a graph are then checked with interventions.' },
          { title: 'On the Biology of a Large Language Model', authors: 'Lindsey, Gurnee, Ameisen, Chen, Pearce et al.', year: 2025, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2025/attribution-graphs/biology.html', description: 'Applies attribution graphs to Claude 3.5 Haiku: multi-step reasoning, planning rhymes in poems, multilingual circuits, addition, hallucinations, refusals, and whether a chain of thought is faithful. Its case studies are good templates for a project write-up.' },
          { title: 'Persona Vectors: Monitoring and Controlling Character Traits in Language Models', authors: 'Chen, Arditi, Sleight, Evans and Lindsey', year: 2025, venue: 'Anthropic Fellows Program; arXiv, to appear at NeurIPS 2026', url: 'https://arxiv.org/abs/2507.21509', citations: 373, description: 'Finds activation directions for traits such as sycophancy or hallucination by contrasting activations with and without the trait, then uses them to monitor and steer the model. The method is simple enough to reproduce on a small open model.' },
          { title: 'When Models Manipulate Manifolds: The Geometry of a Counting Task', authors: 'Gurnee, Ameisen, Kauvar, Tarng, Pearce, Olah and Batson', year: 2025, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2025/linebreaks/index.html', description: 'Shows how Claude 3.5 Haiku counts characters to decide where to break a line: the counts lie on curved, low-dimensional manifolds, and attention heads rotate and compare them. A clear example of representation geometry beyond single directions.' },
          { title: 'Emergent Introspective Awareness in Large Language Models', authors: 'Lindsey', year: 2025, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2025/introspection/index.html', citations: 109, description: 'Injects concept vectors into a model\'s activations and asks whether the model notices. Claude models sometimes do, but unreliably. A neat use of intervention to test a claim about internal states.' },
          { title: 'Emotion Concepts and their Function in a Large Language Model', authors: 'Sofroniew, Kauvar, Saunders, Chen et al.', year: 2026, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2026/emotions/index.html', description: 'Finds emotion-concept directions in Claude Sonnet 4.5, maps their geometry, and shows that steering them changes the model\'s preferences and behaviour: a complete path from probe to causal test.' },
          { title: 'Verbalizable Representations Form a Global Workspace in Language Models', authors: 'Gurnee, Sofroniew, Pearce, Piotrowski et al.', year: 2026, venue: 'Transformer Circuits Thread', url: 'https://transformer-circuits.pub/2026/workspace/index.html', description: 'Introduces a "Jacobian lens" for finding the representations a model is about to put into words, and argues that this set acts like a global workspace used for reporting, reasoning and generalisation.' },
        ],
      },
      {
        id: 'foundations',
        title: 'Foundational papers',
        note: 'The ideas that most project methods build on, in order of publication.',
        items: [
          { title: 'Understanding intermediate layers using linear classifier probes', authors: 'Alain and Bengio', year: 2016, venue: 'arXiv', url: 'https://arxiv.org/abs/1610.01644', citations: 2012, description: 'Introduces linear probes: small classifiers trained on frozen hidden layers to measure what each layer makes linearly available. The baseline method for any representation-analysis project.' },
          { title: 'Designing and Interpreting Probes with Control Tasks', authors: 'Hewitt and Liang', year: 2019, venue: 'EMNLP', url: 'https://arxiv.org/abs/1909.03368', citations: 981, description: 'Shows that a probe can score well by learning the task itself rather than reading it from the representation, and introduces control tasks and selectivity to catch this. The standard control for probing experiments.' },
          { title: 'Zoom In: An Introduction to Circuits', authors: 'Olah, Cammarata, Schubert, Goh, Petrov and Carter', year: 2020, venue: 'Distill', url: 'https://distill.pub/2020/circuits/zoom-in/', citations: 838, description: 'The founding statement of the circuits programme: networks contain meaningful features connected by readable sub-graphs of weights (circuits). It sets out the vocabulary and goals of mechanistic interpretability.' },
          { title: 'Investigating Gender Bias in Language Models Using Causal Mediation Analysis', authors: 'Vig, Gehrmann, Belinkov et al.', year: 2020, venue: 'NeurIPS', url: 'https://proceedings.neurips.cc/paper/2020/hash/92650b2e92217715fe312e6fa7b90d82-Abstract.html', citations: 878, description: 'Brings causal mediation analysis to transformers: intervene on single neurons and attention heads with counterfactual inputs, and measure direct and indirect effects. An early precursor of activation patching.' },
          { title: 'Amnesic Probing: Behavioral Explanation with Amnesic Counterfactuals', authors: 'Elazar, Ravfogel, Jacovi and Goldberg', year: 2021, venue: 'TACL', url: 'https://arxiv.org/abs/2006.00995', citations: 390, description: 'Removes a property from the representations and checks whether the model\'s behaviour changes. It shows that information a probe can decode is not always information the model uses.' },
          { title: 'Causal Abstractions of Neural Networks', authors: 'Geiger, Lu, Icard and Potts', year: 2021, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2106.02997', citations: 544, description: 'Defines when a network implements a high-level causal model and tests it with interchange interventions, which swap activations between inputs. It gives a rigorous meaning to "the model uses this variable".' },
          { title: 'Probing Classifiers: Promises, Shortcomings, and Advances', authors: 'Belinkov', year: 2022, venue: 'Computational Linguistics', url: 'https://arxiv.org/abs/2102.12452', citations: 1212, description: 'A short critical review of probing: what probe accuracy does and does not show, which baselines and controls are needed, and why information that can be decoded is not necessarily used.' },
          { title: 'Locating and Editing Factual Associations in GPT', authors: 'Meng, Bau, Andonian and Belinkov', year: 2022, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2202.05262', citations: 3578, description: 'Introduces causal tracing: corrupt the input, restore one hidden state at a time, and see which states bring back the correct fact. It localises factual recall in middle-layer MLPs and edits facts there.' },
          { title: 'Interpretability in the Wild: a Circuit for Indirect Object Identification in GPT-2 small', authors: 'Wang, Variengien, Conmy, Shlegeris and Steinhardt', year: 2023, venue: 'ICLR', url: 'https://arxiv.org/abs/2211.00593', citations: 1399, description: 'Reverse-engineers a circuit of 26 attention heads in GPT-2 small with path patching, and proposes faithfulness, completeness and minimality as tests of a claimed circuit. The canonical circuit study at a scale students can reproduce.' },
          { title: 'Progress measures for grokking via mechanistic interpretability', authors: 'Nanda, Chan, Lieberum, Smith and Steinhardt', year: 2023, venue: 'ICLR', url: 'https://arxiv.org/abs/2301.05217', citations: 1029, description: 'Fully reverse-engineers a small transformer trained on modular addition, which turns out to use a Fourier-based algorithm, and uses this understanding to explain grokking. A complete mechanistic explanation of a toy model.' },
          { title: 'Emergent World Representations: Exploring a Sequence Model Trained on a Synthetic Task', authors: 'Li, Hopkins, Bau, Viégas, Pfister and Wattenberg', year: 2023, venue: 'ICLR', url: 'https://arxiv.org/abs/2210.13382', citations: 589, description: 'Trains a GPT on Othello moves, finds the board state with (non-linear) probes, then edits that internal state and shows that the predicted moves change. A clean pairing of a probe with a causal test.' },
        ],
      },
      {
        id: 'recent',
        title: 'Recent and highly cited',
        note: 'Influential papers from 2023 onwards, ordered by citation count. Counts change quickly.',
        items: [
          { title: 'Sparse Autoencoders Find Highly Interpretable Features in Language Models', authors: 'Cunningham, Ewart, Riggs, Huben and Sharkey', year: 2024, venue: 'ICLR', url: 'https://arxiv.org/abs/2309.08600', citations: 1733, description: 'Trains sparse autoencoders on a language model\'s activations and finds features that are more interpretable than neurons, then uses them to pinpoint the features behind a known task. Appeared at the same time as Anthropic\'s Towards Monosemanticity.' },
          { title: 'Representation Engineering: A Top-Down Approach to AI Transparency', authors: 'Zou, Phan, Chen, Campbell et al.', year: 2023, venue: 'arXiv', url: 'https://arxiv.org/abs/2310.01405', citations: 1521, description: 'Reads high-level concepts such as honesty from directions in activation space, then steers the model by adding or subtracting those directions. A top-down alternative to circuit analysis.' },
          { title: 'Refusal in Language Models Is Mediated by a Single Direction', authors: 'Arditi, Obeso, Syed, Paleka, Panickssery, Gurnee and Nanda', year: 2024, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2406.11717', citations: 1232, description: 'In 13 open chat models, one residual-stream direction controls refusal: removing it stops refusals and adding it causes them. A compact recipe (difference of means, then ablation and addition) to copy on a small model.' },
          { title: 'Towards Automated Circuit Discovery for Mechanistic Interpretability', authors: 'Conmy, Mavor-Parker, Lynch, Heimersheim and Garriga-Alonso', year: 2023, venue: 'NeurIPS', url: 'https://arxiv.org/abs/2304.14997', citations: 899, description: 'Introduces ACDC, which finds the circuit behind a behaviour by patching edges of the computational graph and pruning the unimportant ones. It rediscovers circuits that were first found by hand.' },
          { title: 'The Geometry of Truth: Emergent Linear Structure in Large Language Model Representations of True/False Datasets', authors: 'Marks and Tegmark', year: 2024, venue: 'COLM', url: 'https://arxiv.org/abs/2310.06824', citations: 824, description: 'Finds that the truth of simple statements is linearly represented, then intervenes along that direction so that the model treats false statements as true and vice versa: probing followed by a causal test.' },
          { title: 'The Linear Representation Hypothesis and the Geometry of Large Language Models', authors: 'Park, Choe and Veitch', year: 2024, venue: 'ICML', url: 'https://arxiv.org/abs/2311.03658', citations: 814, description: 'Makes precise what it means for a concept to be a direction, links one version of the idea to probing and another to steering, and unifies them with a "causal inner product".' },
          { title: 'Scaling and evaluating sparse autoencoders', authors: 'Gao, Dupré la Tour, Tillman, Goh et al. (OpenAI)', year: 2025, venue: 'ICLR', url: 'https://arxiv.org/abs/2406.04093', citations: 660, description: 'Uses TopK sparse autoencoders to set the sparsity directly, finds clean scaling laws, trains a 16-million-latent SAE on GPT-4 activations, and proposes ways to judge feature quality beyond reconstruction error.' },
          { title: 'Mechanistic Interpretability for AI Safety — A Review', authors: 'Bereska and Gavves', year: 2024, venue: 'TMLR', url: 'https://arxiv.org/abs/2404.14082', citations: 565, description: 'A review of the core ideas of the field (features, superposition, circuits) and its causal methods, and of what mechanistic interpretability can and cannot offer for AI safety.' },
          { title: 'Sparse Feature Circuits: Discovering and Editing Interpretable Causal Graphs in Language Models', authors: 'Marks, Rager, Michaud, Belinkov, Bau and Mueller', year: 2025, venue: 'ICLR', url: 'https://arxiv.org/abs/2403.19647', citations: 493, description: 'Builds causal circuits out of SAE features instead of neurons or attention heads, and uses them to improve a classifier by removing features that a human judges irrelevant to the task.' },
          { title: 'Gemma Scope: Open Sparse Autoencoders Everywhere All At Once on Gemma 2', authors: 'Lieberum, Rajamanoharan, Conmy, Smith et al. (Google DeepMind)', year: 2024, venue: 'BlackboxNLP', url: 'https://arxiv.org/abs/2408.05147', citations: 475, description: 'Releases open sparse autoencoders for all layers of Gemma 2 2B and 9B, so that you can study features in a real model without training your own.' },
          { title: 'AxBench: Steering LLMs? Even Simple Baselines Outperform Sparse Autoencoders', authors: 'Wu, Arora, Geiger, Wang, Huang, Jurafsky, Manning and Potts', year: 2025, venue: 'ICML', url: 'https://arxiv.org/abs/2501.17148', citations: 255, description: 'Benchmarks concept detection and steering on Gemma 2: prompting wins for steering, a simple difference of means wins for detection, and SAEs are not competitive on either. A reminder to always compare with simple baselines.' },
        ],
      },
      {
        id: 'methods',
        title: 'Running causal experiments well',
        note: 'Short, practical papers on activation patching and its pitfalls. Read them before you design your interventions.',
        items: [
          { title: 'Towards Best Practices of Activation Patching in Language Models: Metrics and Methods', authors: 'Zhang and Nanda', year: 2024, venue: 'ICLR', url: 'https://arxiv.org/abs/2309.16042', citations: 439, description: 'Shows that patching conclusions can change with the corruption method (Gaussian noise or counterfactual prompts) and with the metric (probability or logit difference), and recommends good defaults.' },
          { title: 'How to use and interpret activation patching', authors: 'Heimersheim and Nanda', year: 2024, venue: 'arXiv', url: 'https://arxiv.org/abs/2404.15255', citations: 242, description: 'A short tutorial: the different ways to patch (noising and denoising), what each one tells you about a circuit, and common mistakes in choosing a metric.' },
          { title: 'Is This the Subspace You Are Looking for? An Interpretability Illusion for Subspace Activation Patching', authors: 'Makelov, Lange, Geiger and Nanda', year: 2024, venue: 'ICLR', url: 'https://arxiv.org/abs/2311.17030', citations: 98, description: 'Shows that patching a subspace can change the output by switching on a dormant pathway, even when the model does not normally use that subspace. An important warning for causal claims.' },
        ],
      },
      {
        id: 'tools',
        title: 'Tools and tutorials',
        note: 'Software and courses for experiments on small models. These tools change quickly, so follow their current documentation rather than old notebooks.',
        items: [
          { title: 'ARENA Chapter 1: Transformer Interpretability', authors: 'ARENA', year: 2026, venue: 'Online course', url: 'https://learn.arena.education/chapter1_transformer_interp', description: 'Hands-on coding exercises: build a transformer, then linear probes, steering, sparse autoencoders, the IOI circuit with activation patching, and toy models such as grokking, Othello-GPT and superposition. The recommended starting point.' },
          { title: 'TransformerLens', authors: 'Nanda et al. (TransformerLensOrg)', year: 2026, venue: 'Python library', url: 'https://transformerlensorg.github.io/TransformerLens/', description: 'Loads small open models such as GPT-2, caches every internal activation, and lets you edit activations with hooks. Its Main Demo covers activation patching and finding induction heads.' },
          { title: 'nnsight and NDIF', authors: 'NDIF team, Northeastern University', year: 2026, venue: 'Python library', url: 'https://nnsight.net/', description: 'Reads and edits the internals of any PyTorch model, with tutorials on activation patching, attribution patching, causal mediation and the logit lens. Through the NSF-funded NDIF service, the same code can also run on larger hosted models.' },
          { title: 'SAELens', authors: 'Bloom, Tigges, Duong and Chanin', year: 2026, venue: 'Python library', url: 'https://decoderesearch.github.io/SAELens/latest/', description: 'Trains sparse autoencoders and loads pretrained ones such as Gemma Scope, with tutorials on analysing features. Works together with TransformerLens.' },
          { title: 'Neuronpedia', authors: 'Neuronpedia', year: 2026, venue: 'Web platform', url: 'https://www.neuronpedia.org/', description: 'Explore SAE and transcoder features in the browser (top activations, explanations, live steering) and build attribution graphs for your own prompts without writing code. Useful for forming hypotheses before causal tests.' },
          { title: 'Gemma Scope and Gemma Scope 2', authors: 'Google DeepMind', year: 2025, venue: 'Model release', url: 'https://deepmind.google/models/gemma/gemma-scope/', description: 'Open sparse autoencoders for Gemma 2, and sparse autoencoders plus transcoders for Gemma 3 models from 270M to 27B parameters, with a Colab notebook and Neuronpedia demos. The small models suit course projects.' },
          { title: 'Transformer Circuits Thread', authors: 'Anthropic interpretability team', year: 2026, venue: 'Research website', url: 'https://transformer-circuits.pub/', description: 'Anthropic\'s interpretability papers and occasional short "Circuits Updates" in one place. Check it during the semester for new work.' },
        ],
      },
    ],
  },
  resources: [
    { title: 'Probabilistic Machine Learning: An Introduction', description: 'Kevin P. Murphy — supplementary reference', url: 'https://probml.github.io/pml-book/book1.html' },
    { title: 'Deep Learning', description: 'Ian Goodfellow, Yoshua Bengio and Aaron Courville — supplementary reference', url: 'https://www.deeplearningbook.org/' },
    { title: 'IFT 6390 public course outline', description: 'Université de Montréal/Mila — foundation-course inspiration; selective adaptation', url: 'https://mitliagkas.github.io/ift6390-ml-class/' },
    { title: 'TransformerLens documentation', description: 'Tools and introductory material for mechanistic interpretability', url: 'https://transformerlensorg.github.io/TransformerLens/' },
  ],
  announcements: [],
};

export function minimumMidtermScore(model: Course = course): number {
  return model.assessment.midtermPoints * model.assessment.minimumMidtermPercent / 100;
}

/** No student grades are stored or collected. This pure predicate verifies policy. */
export function isFinalAssessmentEligible(
  midtermScore: number,
  presentationsCompleted: readonly boolean[],
  model: Course = course,
): boolean {
  return Number.isFinite(midtermScore)
    && midtermScore >= minimumMidtermScore(model)
    && midtermScore <= model.assessment.midtermPoints
    && presentationsCompleted.length === model.assessment.requiredPresentations
    && presentationsCompleted.every((completed) => completed === true);
}

export function assessmentRows(model: Course = course) {
  return [
    { title: 'Midterm examination', points: model.assessment.midtermPoints, provisional: false },
    ...model.planning.presentations.map(({ title, points }) => ({ title, points, provisional: model.planning.presentationSplitProvisional })),
    { title: 'Final project paper', points: model.assessment.finalPaperPoints, provisional: false },
  ];
}

export function totalAssessmentPoints(model: Course = course): number {
  return model.assessment.midtermPoints + model.assessment.presentationsTotalPoints + model.assessment.finalPaperPoints;
}
