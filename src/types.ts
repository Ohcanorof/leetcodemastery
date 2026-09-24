export type PhaseNumber = 1 | 2 | 3;

export interface MethodComparisonDetail {
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  bottleneck?: string;
  advantage?: string;
}

export interface MethodComparison {
  bruteForce: MethodComparisonDetail;
  optimized: MethodComparisonDetail;
}

export interface Phase2Question {
  id: string;
  question: string;
  focus: string;
  whyItMatters: string;
}

export interface Phase1Data {
  problemName: string;
  corePattern: string;
  requiredDataStructure: string;
  secondaryPatterns?: string[];
  theLogic: string;
  methodComparison: MethodComparison;
  eli5: string;
  youtubeUrl: string;
  coachNote?: string;
  phase2Questions: Phase2Question[];
}

export interface QuestionReview {
  questionId: string;
  score: number;
  verdict: string;
  critique: string;
  socraticHint?: string;
}

export interface SimilarProblem {
  title: string;
  difficulty: string;
  description: string;
  relationToOriginal: string;
  startingBoilerplate?: string;
}

export interface Phase2Evaluation {
  overallScore: number;
  passed: boolean;
  bluntVerdict: string;
  reviews: QuestionReview[];
  similarProblem?: SimilarProblem;
}

export interface EfficiencyCritique {
  timeComplexity: string;
  spaceComplexity: string;
  isOptimal: boolean;
  tleRisk: string;
  bluntReview: string;
}

export interface LineCritique {
  lineOrSection: string;
  feedback: string;
}

export interface CommunicationCritique {
  commentDensityScore: number;
  isHandWavy: boolean;
  bluntReview: string;
  lineCritiques: LineCritique[];
}

export interface LogicCritique {
  hasBugs: boolean;
  identifiedBugs: string[];
  handledEdgeCases: string[];
  missedEdgeCases: string[];
  bluntReview: string;
}

export interface Phase3Critique {
  verdict: 'ACCEPTED' | 'REVISE' | 'REJECTED';
  overallScore: number;
  summaryVerdict: string;
  efficiencyCritique: EfficiencyCritique;
  communicationCritique: CommunicationCritique;
  logicCritique: LogicCritique;
  architectAdvice: string;
}

export interface PresetProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
}
