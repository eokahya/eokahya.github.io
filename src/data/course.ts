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
  resources: readonly { title: string; description: string; url: string }[];
  announcements: readonly { title: string; text: string; date?: string }[];
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
  sourceVersion: '2026-fall-v1',
  updatedOn: '2026-10-02',
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
    { week: 4, title: 'Neural networks', phase: 'foundations', description: 'Multilayer perceptrons, computational graphs, backpropagation, stochastic optimisation, regularisation, and practical training diagnostics. Connect the mathematical description to a small PyTorch implementation.' },
    { week: 5, title: 'Unsupervised learning and representations', phase: 'foundations', description: 'PCA, clustering, representation geometry, and interpretable low-dimensional examples. Briefly position trees and ensemble methods within the broader ML landscape. Deeper treatments may be supplementary.' },
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
