import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createMockAnalysis, createMockCareerReplay, createMockComparison } from "./mockAi.js";
import type { AnalysisResult, CareerPath, CareerReplayResult, ComparisonResult } from "./types.js";

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

const careerPathSchema = z.enum([
  "AI Engineering",
  "Data Science",
  "Software Engineering",
  "Government Exams",
  "Startup",
  "Higher Studies"
]);

const careerReplaySchema = z.object({
  paths: z.array(
    z.object({
      path: careerPathSchema,
      careerFitScore: z.number().min(0).max(100),
      jobReadinessScore: z.number().min(0).max(100),
      timeRequired: z.string(),
      riskLevel: z.enum(["Low", "Medium", "High"]),
      skillRoadmap: z.array(z.string()).min(3),
      plan30: z.array(z.string()).min(2),
      plan90: z.array(z.string()).min(2),
      plan180: z.array(z.string()).min(2),
      recommendation: z.string()
    })
  ).min(1),
  finalRecommendation: z.string()
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

export async function replayCareers(paths: CareerPath[], background = ""): Promise<CareerReplayResult> {
  if (!model) {
    return createMockCareerReplay(paths, background);
  }

  try {
    const prompt = `
You are LifeReplay AI CareerReplay, a career decision intelligence engine for Indian students, freshers, and young professionals.

Compare these career paths:
${paths.map((path) => `- ${path}`).join("\n")}

User background:
"${background || "No extra background provided"}"

Return only valid JSON with:
paths, finalRecommendation.

Each item in paths must contain:
path, careerFitScore, jobReadinessScore, timeRequired, riskLevel, skillRoadmap, plan30, plan90, plan180, recommendation.

Use realistic Indian fresher context, skills, timelines, interview readiness, opportunity cost, and risk.
Scores must be 0-100. riskLevel must be Low, Medium, or High.
Be specific, practical, and avoid generic motivational wording.
`;

    const result = await model.generateContent(prompt);
    const parsed = careerReplaySchema.parse(extractJson(result.response.text()));

    return {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      ...parsed
    };
  } catch (error) {
    console.error("[LifeReplay AI] Gemini career replay failed. Falling back to mock response.", error);
    return createMockCareerReplay(paths, background);
  }
}
