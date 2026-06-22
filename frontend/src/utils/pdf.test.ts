import { describe, expect, it } from "vitest";
import type { AnalysisResult } from "../types";
import { createDecisionReportModel } from "./pdf";

function makeAnalysis(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    id: "analysis-1",
    decision: "Should I move from support engineering into data science?",
    createdAt: "2026-06-22T10:00:00.000Z",
    bestCaseFuture: "A focused portfolio creates a strong analyst-to-data-science transition.",
    mostLikelyFuture: "The transition begins through an analytics role and compounds with experience.",
    worstCaseFuture: "An unfocused learning plan delays income without producing interview evidence.",
    confidenceScore: 72,
    confidenceExplanation: "The current evidence supports a measured transition.",
    careerRisks: ["The portfolio may not prove production modeling skills."],
    financialRisks: ["A six-month learning runway may reduce savings."],
    personalRisks: ["Evening study may create burnout."],
    opportunityScore: 81,
    recommendedNextSteps: ["Interview three working data scientists.", "Review current entry-level job descriptions.", "Set a ninety-day evidence checkpoint."],
    timeline: [
      { period: "6 months", outlook: "Build evidence.", milestone: "Publish two case studies.", riskLevel: "High" },
      { period: "1 year", outlook: "Target bridge roles.", milestone: "Reach five interviews.", riskLevel: "Medium" },
      { period: "3 years", outlook: "Specialize.", milestone: "Own a modeling workflow.", riskLevel: "Medium" },
      { period: "5 years", outlook: "Lead projects.", milestone: "Mentor an analytics team.", riskLevel: "Low" }
    ],
    actionPlan: {
      immediate: ["Audit current SQL and statistics skills."],
      thirtyDay: ["Protect a defined monthly learning budget."],
      ninetyDay: ["Deploy a forecasting project with evaluation."],
      longTerm: ["Review workload and recovery every month."]
    },
    summary: "A staged transition protects income while validating fit.",
    dominantRiskCategory: "Learning",
    ...overrides
  };
}

describe("decision PDF report model", () => {
  it("derives matrix values and mitigations from each analysis", () => {
    const first = createDecisionReportModel(makeAnalysis());
    const second = createDecisionReportModel(makeAnalysis({
      decision: "Should I bootstrap a startup after graduation?",
      confidenceScore: 48,
      opportunityScore: 63,
      financialRisks: ["Runway may end before product-market fit.", "Revenue timing is uncertain."],
      dominantRiskCategory: "Financial"
    }));

    expect(first.riskMatrix).not.toEqual(second.riskMatrix);
    expect(first.riskMatrix.find((risk) => risk.type === "Career")?.mitigation).toBe("Audit current SQL and statistics skills.");
    expect(first.riskMatrix.find((risk) => risk.type === "Market")?.mitigation).toBe("Review current entry-level job descriptions.");
    expect(second.riskMatrix.find((risk) => risk.type === "Financial")?.probability)
      .toBeGreaterThan(first.riskMatrix.find((risk) => risk.type === "Financial")?.probability ?? 0);
  });

  it("contains each future section once without repeating risk lists", () => {
    const model = createDecisionReportModel(makeAnalysis());
    expect(model.futureSections.map((section) => section.title)).toEqual([
      "Best Case Future",
      "Most Likely Future",
      "Worst Case Future"
    ]);
    expect(new Set(model.futureSections.map((section) => section.text)).size).toBe(3);
  });
});
