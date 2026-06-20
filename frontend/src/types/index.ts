export type RiskLevel = "Low" | "Medium" | "High";

export interface TimelineItem {
  period: "6 months" | "1 year" | "3 years" | "5 years";
  outlook: string;
  milestone: string;
  riskLevel: RiskLevel;
}

export interface ActionPlan {
  immediate: string[];
  thirtyDay: string[];
  ninetyDay: string[];
  longTerm: string[];
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
  dominantRiskCategory: string;
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
}

export interface DashboardMetrics {
  totalDecisions: number;
  averageConfidenceScore: number;
  mostCommonRiskCategory: string;
  recentAnalyses: AnalysisResult[];
  riskDistribution: Record<string, number>;
}
