import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockRejectedValue(new Error("Gemini API quota exceeded"))
    })
  }))
}));

beforeEach(() => {
  process.env.GEMINI_API_KEY = "AIzaFakeKeyForFallbackTesting12345";
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("analyzeDecision Gemini failure fallback", () => {
  it("returns a valid AnalysisResult when Gemini throws", async () => {
    const { analyzeDecision } = await import("../aiService.js");
    const result = await analyzeDecision("Should I become an AI engineer?");
    expect(result.id).toBeTruthy();
    expect(result.decision).toBe("Should I become an AI engineer?");
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);
    expect(result.timeline).toHaveLength(4);
    expect(result.careerRisks.length).toBeGreaterThanOrEqual(1);
    expect(result.actionPlan.immediate.length).toBeGreaterThanOrEqual(1);
  });

  it("falls back gracefully for government exam decisions", async () => {
    const { analyzeDecision } = await import("../aiService.js");
    const result = await analyzeDecision("Should I prepare for UPSC IAS?");
    expect(result.dominantRiskCategory).toMatch(/Career|Financial|Personal|Learning|Market/);
    expect(result.bestCaseFuture).toBeTruthy();
    expect(result.worstCaseFuture).toBeTruthy();
  });
});

describe("compareOptions Gemini failure fallback", () => {
  it("returns a valid ComparisonResult when Gemini throws", async () => {
    const { compareOptions } = await import("../aiService.js");
    const result = await compareOptions("Data Scientist", "Software Engineer");
    expect(result.optionA).toBe("Data Scientist");
    expect(result.optionB).toBe("Software Engineer");
    expect([result.optionA, result.optionB]).toContain(result.betterOption);
    expect(result.whyRecommendation).toHaveLength(5);
    expect(result.prosA.length).toBeGreaterThanOrEqual(1);
    expect(result.consB.length).toBeGreaterThanOrEqual(1);
  });
});

describe("replayCareers Gemini failure fallback", () => {
  it("returns a valid CareerReplayResult when Gemini throws", async () => {
    const { replayCareers } = await import("../aiService.js");
    const result = await replayCareers(["AI Engineer", "Data Scientist"], "CSE fresher");
    expect(result.paths).toHaveLength(2);
    expect(result.whyRecommendation).toHaveLength(5);
    for (const careerPath of result.paths) {
      expect(careerPath.scorecard.overallScore).toBeGreaterThanOrEqual(0);
      expect(careerPath.scorecard.overallScore).toBeLessThanOrEqual(100);
      expect(careerPath.swot.strengths.length).toBeGreaterThanOrEqual(3);
      expect(careerPath.riskMatrix).toHaveLength(5);
    }
  });
});

describe("simulateFutures Gemini failure fallback", () => {
  it("returns a valid FutureSimulationResult when Gemini throws", async () => {
    const { simulateFutures } = await import("../aiService.js");
    const result = await simulateFutures(["AI Engineer", "Government Exams"], "CSE fresher");
    expect(result.scenarios).toHaveLength(2);
    expect(result.reasoning).toHaveLength(5);
    for (const scenario of result.scenarios) {
      expect(scenario.successProbability).toBeGreaterThanOrEqual(0);
      expect(scenario.successProbability).toBeLessThanOrEqual(100);
    }
  });
});

describe("generateRecruiterView Gemini failure fallback", () => {
  it("returns a valid RecruiterViewResult when Gemini throws", async () => {
    const { generateRecruiterView } = await import("../aiService.js");
    const result = await generateRecruiterView("AI Engineer", "CSE student, Python, no internships");
    expect(result.readinessScore).toBeGreaterThanOrEqual(0);
    expect(result.readinessScore).toBeLessThanOrEqual(100);
    expect(result.missingSkills.length).toBeGreaterThanOrEqual(1);
    expect(result.improvementPlan).toHaveLength(5);
    expect(result.hiringProbability.twelveMonths).toBeGreaterThanOrEqual(result.hiringProbability.threeMonths);
  });
});
