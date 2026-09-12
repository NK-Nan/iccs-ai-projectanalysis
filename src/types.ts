export type ProgramId = 
  | 'prog-1' 
  | 'prog-3' 
  | 'prog-4' 
  | 'prog-6' 
  | 'prog-7' 
  | 'prog-8' 
  | 'prog-9' 
  | 'prog-11';

export interface ProgramInfo {
  id: ProgramId;
  name: string;
  code: string;
  shortName: string;
  description: string;
  driveFolderId: string;
  iconName: string;
}

export type DecisionStatus = 'อนุมัติ' | 'อนุมัติแบบมีเงื่อนไข' | 'ควรปรับปรุงแก้ไขเชิงลึก';

export type RatingLevel = 'สูงมาก (ดีเลิศ)' | 'สูง' | 'ปานกลาง' | 'ต้องพัฒนา';

export interface CriterionScore {
  id: string;
  name: string;
  score: number; // 0 - 20
  maxScore: number; // 20
  benchmarkAvg: number; // e.g. 15.4
  justification: string;
}

export interface SDGItem {
  id: number;
  code: string;
  nameTh: string;
  color: string;
  relevance: string;
}

export interface StrategicAlignment {
  philosophyVision: {
    rating: RatingLevel;
    score: number; // 0 - 20
    details: string;
    keywordsMatched: string[];
  };
  sdgs: SDGItem[];
  nanProvincialPlan: {
    rating: RatingLevel;
    score: number; // 0 - 20
    matchedStrategies: string[];
    details: string;
  };
  excellencePlan: {
    rating: RatingLevel;
    score: number; // 0 - 20
    benchmarkComparison: string;
    details: string;
    pillarsMatched: string[];
  };
  identityFocus: {
    rating: RatingLevel;
    score: number; // 0 - 20
    matchedAreas: string[];
    details: string;
  };
}

export interface ProposalSummary {
  executiveSummary: string;
  strengths: string[];
  improvementPoints: string[];
  recommendations: string[];
  decision: DecisionStatus;
  decisionRationale: string;
  evaluatorNote?: string;
  evaluatedAt: string;
}

export interface RadarDataPoint {
  criterion: string;
  fullMark: number;
  score: number;
  benchmark: number;
}

export interface ResearchProposal {
  id: string;
  programId: ProgramId;
  programName: string;
  code: string;
  title: string;
  leader: string;
  department: string;
  budget: number;
  durationMonths: number;
  isContinuousProject: boolean;
  abstract: string;
  objectives: string[];
  targetAreas: string[];
  targetBeneficiaries: string;
  expectedOutputs: string[];
  fileName?: string;
  driveFileId?: string;
  
  // Evaluation Data
  isEvaluated: boolean;
  criteriaScores: CriterionScore[];
  totalScore: number; // sum out of 120
  averageScore: number; // avg out of 20
  alignment: StrategicAlignment;
  summary: ProposalSummary;
}

export interface EvaluationFilter {
  programId: string;
  decision: string;
  searchQuery: string;
  minScore: number;
}

export interface BenchmarkStats {
  totalProposals: number;
  evaluatedProposals: number;
  avgScoreOutOf20: number;
  avgTotalOutOf120: number;
  approvedCount: number;
  conditionalCount: number;
  revisionCount: number;
  criteriaAverages: {
    identity_alignment: number;
    clarity_objectives: number;
    continuity_development: number;
    empirical_outcomes: number;
    feasibility: number;
    community_collaboration: number;
  };
}
