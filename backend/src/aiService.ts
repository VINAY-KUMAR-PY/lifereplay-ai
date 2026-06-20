import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createMockAnalysis, createMockComparison } from "./mockAi.js";
import type { AnalysisResult, ComparisonResult } from "./types.js";

const analysisSchema = z.object({
  bestCaseFuture: z.string(),
  worstCaseFuture: z.string(),
  mostLikelyFuture: z.string(),
  confidenceScore: z.number().min(0).max(100),
  confidenceExplanation: z.string(),
  careerRisks: z.array(z.string()).min(1),
  financialRisks: z.array(z.string()).min(1),
  personalRisks: z.array(z.string()).min(1),
  opportunityScore: z.number().min(0).max(100),
  recommendedNextSteps: z.array(z.string()).min(1),
  timeline: z.array(z.object({
    period: z.enum(["6 months", "1 year", "3 years", "5 years"]),
    outlook: z.string(),
    milestone: z.string(),
    riskLevel: z.enum(["Low", "Medium", "High"])
  })).length(4),
  actionPlan: z.object({
    immediate: z.array(z.string()).min(1),
    thirtyDay: z.array(z.string()).min(1),
    ninetyDay: z.array(z.string()).min(1),
    longTerm: z.array(z.string()).min(1)
  }),
  summary: z.string(),
  dominantRiskCategory: z.enum(["Career", "Financial", "Personal", "Learning", "Market"])
});

const comparisonSchema = z.object({
  prosA: z.array(z.string()).min(1),
  consA: z.array(z.string()).min(1),
  prosB: z.array(z.string()).min(1),
  consB: z.array(z.string()).min(1),
  finalRecommendation: z.string(),
  riskComparison: z.string(),
  betterOption: z.string(),
  explanation: z.string()
});

const apiKey = process.env.GEMINI_API_KEY;
const model = apiKey
  ? new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" })
  : null;

if (!apiKey) {
  console.warn("[LifeReplay AI] GEMINI_API_KEY is missing. Using polished mock AI responses.");
}

function extractJson(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI response did not contain JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function analyzeDecision(decision: string): Promise<AnalysisResult> {
  if (!model) {
    return createMockAnalysis(decision);
  }

  try {
    const prompt = `
You are LifeReplay AI, a decision simulation engine. Analyze this decision for a student, job seeker, professional, or entrepreneur:
"${decision}"

Return only valid JSON with these exact keys:
bestCaseFuture, worstCaseFuture, mostLikelyFuture, confidenceScore, confidenceExplanation,
careerRisks, financialRisks, personalRisks, opportunityScore, recommendedNextSteps,
timeline, actionPlan, summary, dominantRiskCategory.

timeline must contain exactly four objects for periods: "6 months", "1 year", "3 years", "5 years".
actionPlan must contain arrays: immediate, thirtyDay, ninetyDay, longTerm.
dominantRiskCategory must be one of: Career, Financial, Personal, Learning, Market.
Be practical, specific, and avoid generic chatbot wording.
`;

    const result = await model.generateContent(prompt);
    const parsed = analysisSchema.parse(extractJson(result.response.text()));

    return {
      id: nanoid(),
      decision,
      createdAt: new Date().toISOString(),
      ...parsed
    };
  } catch (error) {
    console.error("[LifeReplay AI] Gemini analyze failed. Falling back to mock response.", error);
    return createMockAnalysis(decision);
  }
}

export async function compareOptions(optionA: string, optionB: string): Promise<ComparisonResult> {
  if (!model) {
    return createMockComparison(optionA, optionB);
  }

  try {
    const prompt = `
You are LifeReplay AI, a decision comparison engine. Compare these two options:
Option A: "${optionA}"
Option B: "${optionB}"

Return only valid JSON with these exact keys:
prosA, consA, prosB, consB, finalRecommendation, riskComparison, betterOption, explanation.
Be practical, specific, and useful for a hackathon demo.
`;

    const result = await model.generateContent(prompt);
    const parsed = comparisonSchema.parse(extractJson(result.response.text()));

    return {
      id: nanoid(),
      optionA,
      optionB,
      createdAt: new Date().toISOString(),
      ...parsed
    };
  } catch (error) {
    console.error("[LifeReplay AI] Gemini compare failed. Falling back to mock response.", error);
    return createMockComparison(optionA, optionB);
  }
}
