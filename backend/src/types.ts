export type RiskCategory = "Career" | "Financial" | "Personal" | "Learning" | "Market";

export interface TimelineItem {
  period: "6 months" | "1 year" | "3 years" | "5 years";
  outlook: string;
  milestone: string;
  riskLevel: "Low" | "Medium" | "High";
}

export interface ActionPlan {
  immediate: string[];
  thirtyDay: string[];
  ninetyDay: string[];
  longTerm: string[];
}

export interface DecisionScorecard {
  marketDemand: number;
  learningCurve: number;
  risk: number;
  salaryPotential: number;
  competition: number;
  stability: number;
  growthPotential: number;
  jobReadiness: number;
  overallScore: number;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RiskMatrixItem {
  type: "Career" | "Financial" | "Learning" | "Market" | "Personal";
  probability: number;
  impact: number;
  mitigation: string;
}

export interface MarketIntelligence {
  hiringDemand: "Low" | "Medium" | "High";
  entryBarrier: "Low" | "Medium" | "High";
  salaryGrowth: "Low" | "Medium" | "High";
  competitionLevel: "Low" | "Medium" | "High";
  automationRisk: "Low" | "Medium" | "High";
  locationAdvantage: string;
}

export interface RoadmapStep {
  period: "Week 1-2" | "Week 3-4" | "Month 2" | "Month 3" | "Month 4-6";
  skillFocus: string;
  projectTask: string;
  proofOfWork: string;
  evaluationCheckpoint: string;
}

export interface RecruiterImprovement {
  action: string;
  impact: "High Impact" | "Medium Impact" | "Low Impact";
}

export interface AnalysisResult {
  id: string;
  decision: string;
  createdAt: string;
  bestCaseFuture: string;
  worstCaseFuture: string;
  mostLikelyFuture: string;
  confidenceScore: number;
  confidenceExplanation: string;
  careerRisks: string[];
  financialRisks: string[];
  personalRisks: string[];
  opportunityScore: number;
  recommendedNextSteps: string[];
  timeline: TimelineItem[];
  actionPlan: ActionPlan;
  summary: string;
  dominantRiskCategory: RiskCategory;
}

export interface ComparisonResult {
  id: string;
  optionA: string;
  optionB: string;
  createdAt: string;
  prosA: string[];
  consA: string[];
  prosB: string[];
  consB: string[];
  finalRecommendation: string;
  riskComparison: string;
  betterOption: string;
  explanation: string;
  whyRecommendation: string[];
}

export type CareerPath = string;

export interface CareerReplayRequest {
  paths: CareerPath[];
  background?: string;
}

export interface CareerPathReplay {
  path: CareerPath;
  careerFitScore: number;
  jobReadinessScore: number;
  growthPotential: number;
  salaryPotential: string;
  learningCurve: "Beginner Friendly" | "Moderate" | "Steep";
  timeRequired: string;
  riskLevel: "Low" | "Medium" | "High";
  skillRoadmap: string[];
  plan30: string[];
  plan90: string[];
  plan180: string[];
  recommendation: string;
  scorecard: DecisionScorecard;
  swot: SwotAnalysis;
  riskMatrix: RiskMatrixItem[];
  marketIntelligence: MarketIntelligence;
}

export interface CareerReplayResult {
  id: string;
  createdAt: string;
  paths: CareerPathReplay[];
  finalRecommendation: string;
  whyRecommendation: string[];
}

export interface FutureScenario {
  name: string;
  salaryAfterOneYear: string;
  salaryAfterThreeYears: string;
  skillsRequired: string[];
  successProbability: number;
  hiringDifficulty: "Low" | "Medium" | "High";
  timeInvestment: string;
  financialImpact: string;
  opportunityCost: string;
  careerImpact: string;
  riskLevel: "Low" | "Medium" | "High";
  finalOutlook: string;
  scorecard: DecisionScorecard;
  swot: SwotAnalysis;
  riskMatrix: RiskMatrixItem[];
  marketIntelligence: MarketIntelligence;
}

export interface FutureSimulationResult {
  id: string;
  createdAt: string;
  scenarios: FutureScenario[];
  bestScenario: string;
  reasoning: string[];
}

export interface RecruiterViewResult {
  id: string;
  createdAt: string;
  targetRole: string;
  readinessScore: number;
  missingSkills: string[];
  missingProjects: string[];
  resumeGaps: string[];
  interviewWeaknesses: string[];
  hiringProbability: { threeMonths: number; sixMonths: number; twelveMonths: number };
  recruiterVerdict: string;
  improvementPlan: RecruiterImprovement[];
  personalizedRoadmap: RoadmapStep[];
}

export interface DashboardMetrics {
  totalDecisions: number;
  totalComparisons: number;
  totalCareerReplays: number;
  totalFutureSimulations: number;
  totalRecruiterAssessments: number;
  averageCareerFitScore: number;
  averageReadinessScore: number;
  averageSuccessProbability: number;
  mostRecommendedPath: string;
  averageConfidenceScore: number;
  averageOpportunityScore: number;
  mostCommonRiskCategory: RiskCategory | "Not enough data";
  recentAnalyses: AnalysisResult[];
  recentComparisons: ComparisonResult[];
  recentCareerReplays: CareerReplayResult[];
  riskDistribution: Record<string, number>;
  confidenceTrend: number[];
  opportunityTrend: number[];
}
