import { describe, expect, it } from "vitest";
import { createMockAnalysis, createMockCareerReplay, createMockComparison, createMockFutureSimulation, createMockRecruiterView } from "../mockAi.js";

describe("createMockAnalysis", () => {
  it("returns a valid AnalysisResult shape for an AI decision", () => {
    const result = createMockAnalysis("Should I become an AI engineer?");
    expect(result.id).toBeTruthy(); expect(result.decision).toBe("Should I become an AI engineer?");
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0); expect(result.confidenceScore).toBeLessThanOrEqual(100);
    expect(result.opportunityScore).toBeGreaterThanOrEqual(0); expect(result.opportunityScore).toBeLessThanOrEqual(100);
    expect(result.careerRisks.length).toBeGreaterThanOrEqual(1); expect(result.financialRisks.length).toBeGreaterThanOrEqual(1); expect(result.personalRisks.length).toBeGreaterThanOrEqual(1);
    expect(result.timeline).toHaveLength(4); expect(result.actionPlan.immediate.length).toBeGreaterThanOrEqual(1); expect(result.actionPlan.thirtyDay.length).toBeGreaterThanOrEqual(1); expect(result.actionPlan.ninetyDay.length).toBeGreaterThanOrEqual(1); expect(result.actionPlan.longTerm.length).toBeGreaterThanOrEqual(1);
    expect(result.dominantRiskCategory).toMatch(/Career|Financial|Personal|Learning|Market/);
  });
  it("detects government exam topic and sets higher risk", () => { expect(createMockAnalysis("Should I prepare for UPSC civil services?").confidenceScore).toBeLessThan(80); });
  it("detects startup topic", () => { expect(createMockAnalysis("Should I launch my startup idea this year?").dominantRiskCategory).toMatch(/Financial|Career|Market/); });
  it("produces different scores for different topics", () => { expect(createMockAnalysis("Should I become an AI engineer?").confidenceScore).not.toBe(createMockAnalysis("Should I prepare for UPSC IAS exam?").confidenceScore); });
  it("always produces a valid createdAt ISO string", () => { const result = createMockAnalysis("test decision"); expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt); });
});

describe("createMockCareerReplay", () => {
  it("returns paths for all selected careers", () => { const result = createMockCareerReplay(["AI Engineer", "Software Engineer", "Data Scientist"]); expect(result.paths.map((path) => path.path)).toEqual(["AI Engineer", "Software Engineer", "Data Scientist"]); });
  it("scores AI Engineer higher than Government Exams on jobReadiness", () => { const result = createMockCareerReplay(["AI Engineer", "Government Exams"]); expect(result.paths[0].jobReadinessScore).toBeGreaterThan(result.paths[1].jobReadinessScore); });
  it("each path has a valid scorecard with all 9 fields", () => { const scorecard = createMockCareerReplay(["Software Engineer"]).paths[0].scorecard; for (const field of ["marketDemand", "learningCurve", "risk", "salaryPotential", "competition", "stability", "growthPotential", "jobReadiness", "overallScore"] as const) { expect(scorecard[field]).toBeGreaterThanOrEqual(0); expect(scorecard[field]).toBeLessThanOrEqual(100); } });
  it("each path has a SWOT with all 4 quadrants", () => { const swot = createMockCareerReplay(["Higher Studies"]).paths[0].swot; expect(swot.strengths.length).toBeGreaterThanOrEqual(3); expect(swot.weaknesses.length).toBeGreaterThanOrEqual(3); expect(swot.opportunities.length).toBeGreaterThanOrEqual(3); expect(swot.threats.length).toBeGreaterThanOrEqual(3); });
  it("each path has a riskMatrix with exactly 5 entries", () => { expect(createMockCareerReplay(["Startup Founder"]).paths[0].riskMatrix).toHaveLength(5); });
  it("includes labeled market intelligence", () => { const market = createMockCareerReplay(["AI Engineer"]).paths[0].marketIntelligence; expect(["Low", "Medium", "High"]).toContain(market.hiringDemand); expect(market.locationAdvantage).toBeTruthy(); });
  it("handles a custom career path not in presets", () => { const path = createMockCareerReplay(["UX Designer"]).paths[0]; expect(path.path).toBe("UX Designer"); expect(path.careerFitScore).toBeGreaterThanOrEqual(0); expect(path.careerFitScore).toBeLessThanOrEqual(100); });
  it("produces stable scores for the same input", () => { const first = createMockCareerReplay(["Civil Services"]); const second = createMockCareerReplay(["Civil Services"]); expect(first.paths[0].careerFitScore).toBe(second.paths[0].careerFitScore); expect(first.paths[0].jobReadinessScore).toBe(second.paths[0].jobReadinessScore); });
  it("whyRecommendation has exactly 5 reasons", () => { expect(createMockCareerReplay(["AI Engineer", "Data Scientist"]).whyRecommendation).toHaveLength(5); });
});

describe("createMockComparison", () => {
  it("returns a valid ComparisonResult", () => { const result = createMockComparison("Data Scientist", "Software Engineer"); expect(result.optionA).toBe("Data Scientist"); expect(result.optionB).toBe("Software Engineer"); expect(result.prosA.length).toBeGreaterThanOrEqual(1); expect(result.consA.length).toBeGreaterThanOrEqual(1); expect(result.prosB.length).toBeGreaterThanOrEqual(1); expect(result.consB.length).toBeGreaterThanOrEqual(1); expect(result.whyRecommendation).toHaveLength(5); expect([result.optionA, result.optionB]).toContain(result.betterOption); });
});

describe("createMockFutureSimulation", () => {
  it("returns all requested scenarios", () => { expect(createMockFutureSimulation(["AI Engineer", "Government Exams", "Higher Studies"]).scenarios).toHaveLength(3); });
  it("bestScenario matches one scenario", () => { const scenarios = ["Software Engineer", "Startup Founder"]; expect(scenarios).toContain(createMockFutureSimulation(scenarios).bestScenario); });
  it("reasoning has exactly 5 items", () => { expect(createMockFutureSimulation(["AI Engineer", "Data Scientist"]).reasoning).toHaveLength(5); });
  it("each successProbability is valid", () => { for (const scenario of createMockFutureSimulation(["AI Engineer", "Government Exams"]).scenarios) { expect(scenario.successProbability).toBeGreaterThanOrEqual(0); expect(scenario.successProbability).toBeLessThanOrEqual(100); } });
});

describe("createMockRecruiterView", () => {
  it("returns a valid RecruiterViewResult", () => { const result = createMockRecruiterView("AI Engineer", "CSE student with Python and React. No internships."); expect(result.targetRole).toBe("AI Engineer"); expect(result.readinessScore).toBeGreaterThanOrEqual(0); expect(result.readinessScore).toBeLessThanOrEqual(100); expect(result.missingSkills.length).toBeGreaterThanOrEqual(1); expect(result.missingProjects.length).toBeGreaterThanOrEqual(1); expect(result.resumeGaps.length).toBeGreaterThanOrEqual(1); expect(result.interviewWeaknesses.length).toBeGreaterThanOrEqual(1); expect(result.improvementPlan.length).toBeGreaterThanOrEqual(4); });
  it("hiring probability increases over time", () => { const { threeMonths, sixMonths, twelveMonths } = createMockRecruiterView("Data Scientist", "Graduate with SQL and Python knowledge.").hiringProbability; expect(twelveMonths).toBeGreaterThan(threeMonths); expect(sixMonths).toBeGreaterThanOrEqual(threeMonths); });
  it("returns a five-stage personalized roadmap", () => { const roadmap = createMockRecruiterView("AI Engineer", "Graduate with Python projects.").personalizedRoadmap; expect(roadmap).toHaveLength(5); expect(roadmap.map((step) => step.period)).toEqual(["Week 1-2", "Week 3-4", "Month 2", "Month 3", "Month 4-6"]); });
});
