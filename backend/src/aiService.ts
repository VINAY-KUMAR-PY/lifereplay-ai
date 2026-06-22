import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createMockAnalysis, createMockCareerReplay, createMockComparison, createMockFutureSimulation, createMockRecruiterView } from "./mockAi.js";
import type { AnalysisResult, CareerPath, CareerReplayResult, ComparisonResult, FutureSimulationResult, RecruiterViewResult } from "./types.js";

const scorecardSchema = z.object({
  marketDemand: z.number().min(0).max(100), learningCurve: z.number().min(0).max(100), risk: z.number().min(0).max(100),
  salaryPotential: z.number().min(0).max(100), competition: z.number().min(0).max(100), stability: z.number().min(0).max(100),
  growthPotential: z.number().min(0).max(100), jobReadiness: z.number().min(0).max(100), overallScore: z.number().min(0).max(100)
});
const swotSchema = z.object({ strengths: z.array(z.string()).min(3).max(5), weaknesses: z.array(z.string()).min(3).max(5), opportunities: z.array(z.string()).min(3).max(5), threats: z.array(z.string()).min(3).max(5) });
const riskMatrixSchema = z.array(z.object({ type: z.enum(["Career", "Financial", "Learning", "Market", "Personal"]), probability: z.number().min(0).max(100), impact: z.number().min(0).max(100), mitigation: z.string() })).length(5);
const marketIntelligenceSchema = z.object({
  hiringDemand: z.enum(["Low", "Medium", "High"]), entryBarrier: z.enum(["Low", "Medium", "High"]),
  salaryGrowth: z.enum(["Low", "Medium", "High"]), competitionLevel: z.enum(["Low", "Medium", "High"]),
  automationRisk: z.enum(["Low", "Medium", "High"]), locationAdvantage: z.string()
});
const roadmapSchema = z.array(z.object({
  period: z.enum(["Week 1-2", "Week 3-4", "Month 2", "Month 3", "Month 4-6"]), skillFocus: z.string(),
  projectTask: z.string(), proofOfWork: z.string(), evaluationCheckpoint: z.string()
})).length(5);

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
  explanation: z.string(),
  whyRecommendation: z.array(z.string()).length(5)
});

const careerReplaySchema = z.object({
  paths: z.array(
    z.object({
      path: z.string(),
      careerFitScore: z.number().min(0).max(100),
      jobReadinessScore: z.number().min(0).max(100),
      growthPotential: z.number().min(0).max(100),
      salaryPotential: z.string(),
      learningCurve: z.enum(["Beginner Friendly", "Moderate", "Steep"]),
      timeRequired: z.string(),
      riskLevel: z.enum(["Low", "Medium", "High"]),
      skillRoadmap: z.array(z.string()).min(3),
      plan30: z.array(z.string()).min(2),
      plan90: z.array(z.string()).min(2),
      plan180: z.array(z.string()).min(2),
      recommendation: z.string(),
      scorecard: scorecardSchema,
      swot: swotSchema,
      riskMatrix: riskMatrixSchema,
      marketIntelligence: marketIntelligenceSchema
    })
  ).min(1),
  finalRecommendation: z.string(),
  whyRecommendation: z.array(z.string()).length(5)
});

const futureSimulationSchema = z.object({
  scenarios: z.array(z.object({
    name: z.string(), salaryAfterOneYear: z.string(), salaryAfterThreeYears: z.string(), skillsRequired: z.array(z.string()).min(3),
    successProbability: z.number().min(0).max(100), hiringDifficulty: z.enum(["Low", "Medium", "High"]), timeInvestment: z.string(),
    financialImpact: z.string(), opportunityCost: z.string(), careerImpact: z.string(), riskLevel: z.enum(["Low", "Medium", "High"]),
    finalOutlook: z.string(), scorecard: scorecardSchema, swot: swotSchema, riskMatrix: riskMatrixSchema, marketIntelligence: marketIntelligenceSchema
  })).min(2).max(4),
  bestScenario: z.string(), reasoning: z.array(z.string()).length(5)
});

const recruiterViewSchema = z.object({
  readinessScore: z.number().min(0).max(100), missingSkills: z.array(z.string()).min(3), missingProjects: z.array(z.string()).min(2),
  resumeGaps: z.array(z.string()).min(2), interviewWeaknesses: z.array(z.string()).min(2),
  hiringProbability: z.object({ threeMonths: z.number().min(0).max(100), sixMonths: z.number().min(0).max(100), twelveMonths: z.number().min(0).max(100) }),
  recruiterVerdict: z.string(),
  improvementPlan: z.array(z.object({ action: z.string(), impact: z.enum(["High Impact", "Medium Impact", "Low Impact"]) })).length(5),
  personalizedRoadmap: roadmapSchema
});

const apiKey = process.env.GEMINI_API_KEY;
const model = apiKey
  ? new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" })
  : null;

if (!apiKey) {
  console.warn("[LifeReplay AI] GEMINI_API_KEY is missing. Using polished mock AI responses.");
}

export async function analyzeDecision(decision: string): Promise<AnalysisResult> {
  if (!model) {
    return createMockAnalysis(decision);
  }

  try {
    const prompt = `
You are LifeReplay AI, a structured decision simulation engine built for Indian students, freshers, career switchers, and young professionals. You specialize in translating vague career choices into structured, scored, actionable intelligence. You think like a career counselor with 10 years of Indian job market expertise combined with a management consultant's risk framework. Never use motivational filler. Never give generic advice. Every insight must be specific to the decision provided.

Analyze this decision:
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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 2048 }
    });
    const parsed = analysisSchema.parse(JSON.parse(result.response.text()));

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
You are LifeReplay AI, a rigorous option-comparison engine for Indian students and early-career professionals. Evaluate trade-offs like a career strategist and management consultant. Use specific evidence, realistic opportunity costs, and direct recommendations. Never use motivational filler or generic advice.

Compare these two options:
Option A: "${optionA}"
Option B: "${optionB}"

Return only valid JSON with these exact keys:
prosA, consA, prosB, consB, finalRecommendation, riskComparison, betterOption, explanation, whyRecommendation.
whyRecommendation must contain exactly five short, specific reasons referencing market demand, risk, time, evidence, and opportunity cost.
Be practical, specific, and useful for a hackathon demo.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 2048 }
    });
    const parsed = comparisonSchema.parse(JSON.parse(result.response.text()));

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
You are LifeReplay AI CareerReplay, a career decision intelligence engine for Indian students, freshers, career switchers, and young professionals. Think like an Indian hiring manager, career counselor, and workforce analyst. Calibrate every score against actual entry-level barriers, portfolio expectations, compensation, and opportunity cost. Never use motivational filler or generic advice.

Compare these career paths:
${paths.map((path) => `- ${path}`).join("\n")}

User background:
"${background || "No extra background provided"}"

Scoring must be calibrated to Indian fresher market realities in 2025-2026. AI Engineer and Data Scientist paths should reflect actual entry-level hiring conditions in Bengaluru, Hyderabad, and Pune. Government Exams should reflect UPSC/SSC/banking preparation timelines honestly. Startup Founder risk must be scored at 85+ unless the user provides proof of funding or a working product.

Return only valid JSON with:
paths, finalRecommendation, whyRecommendation.

Each item in paths must contain:
path, careerFitScore, jobReadinessScore, growthPotential, salaryPotential, learningCurve, timeRequired,
riskLevel, skillRoadmap, plan30, plan90, plan180, recommendation, scorecard, swot, riskMatrix, marketIntelligence.

scorecard must contain marketDemand, learningCurve, risk, salaryPotential, competition, stability, growthPotential, jobReadiness, overallScore as 0-100 numbers.
swot must contain 3-5 strengths, weaknesses, opportunities, and threats. riskMatrix must contain Career, Financial, Learning, Market, Personal risks with probability, impact, mitigation.
The root whyRecommendation must contain exactly five sharp reasons grounded in the user's background, scores, market, risk, time, and opportunity cost.
marketIntelligence must contain hiringDemand, entryBarrier, salaryGrowth, competitionLevel, automationRisk as Low/Medium/High plus a specific locationAdvantage. These are calibrated estimates, not live data.

Every section must add distinct information. Do not repeat scenario text inside SWOT, risk mitigations, or recommendation reasons. No filler or motivational language.

Use realistic Indian fresher context, skills, timelines, interview readiness, opportunity cost, and risk.
Scores must be 0-100. riskLevel must be Low, Medium, or High.
learningCurve must be Beginner Friendly, Moderate, or Steep.
Be specific, practical, and avoid generic motivational wording.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 4096 }
    });
    const parsed = careerReplaySchema.parse(JSON.parse(result.response.text()));

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

export async function simulateFutures(scenarios: string[], profile = ""): Promise<FutureSimulationResult> {
  if (!model) return createMockFutureSimulation(scenarios, profile);
  try {
    const prompt = `You are LifeReplay AI, an Indian career outcome simulation and management consulting engine. Compare future paths as quantified scenarios, not generic advice. Profile: "${profile || "No profile supplied"}". Scenarios: ${scenarios.join(", ")}.
Return JSON with scenarios and bestScenario and reasoning. Preserve each scenario name. Each scenario requires salaryAfterOneYear, salaryAfterThreeYears, skillsRequired, successProbability, hiringDifficulty, timeInvestment, financialImpact, opportunityCost, careerImpact, riskLevel, finalOutlook, scorecard, swot, riskMatrix, marketIntelligence. scorecard has nine 0-100 fields: marketDemand, learningCurve, risk, salaryPotential, competition, stability, growthPotential, jobReadiness, overallScore. swot has 3-5 distinct items per quadrant. riskMatrix has exactly Career, Financial, Learning, Market, Personal entries with probability, impact, mitigation. marketIntelligence contains hiringDemand, entryBarrier, salaryGrowth, competitionLevel, automationRisk as Low/Medium/High and a locationAdvantage. reasoning must contain exactly five specific reasons for the winner. No filler, motivational fluff, or repeated information across sections.`;
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.6, maxOutputTokens: 4096 } });
    const parsed = futureSimulationSchema.parse(JSON.parse(result.response.text()));
    return { id: nanoid(), createdAt: new Date().toISOString(), ...parsed };
  } catch (error) {
    console.error("[LifeReplay AI] Gemini future simulation failed. Falling back to mock response.", error);
    return createMockFutureSimulation(scenarios, profile);
  }
}

export async function generateRecruiterView(targetRole: string, profile: string): Promise<RecruiterViewResult> {
  if (!model) return createMockRecruiterView(targetRole, profile);
  try {
    const prompt = `You are a senior Indian technology recruiter assessing a candidate for ${targetRole}. Analyze only evidence in this profile: "${profile}". Return structured JSON with readinessScore, missingSkills, missingProjects, resumeGaps, interviewWeaknesses, hiringProbability {threeMonths, sixMonths, twelveMonths}, recruiterVerdict, improvementPlan, personalizedRoadmap. improvementPlan must contain exactly five ranked objects with action and impact (High Impact, Medium Impact, or Low Impact). personalizedRoadmap must contain exactly Week 1-2, Week 3-4, Month 2, Month 3, Month 4-6; each step has skillFocus, projectTask, proofOfWork, evaluationCheckpoint specific to the profile and target role. Be candid and calibrated to 2025-2026 fresher hiring in Bengaluru, Hyderabad, and Pune. No filler, motivational fluff, repeated advice, or unsupported profile claims.`;
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.5, maxOutputTokens: 3072 } });
    const parsed = recruiterViewSchema.parse(JSON.parse(result.response.text()));
    return { id: nanoid(), createdAt: new Date().toISOString(), targetRole, ...parsed };
  } catch (error) {
    console.error("[LifeReplay AI] Gemini recruiter assessment failed. Falling back to mock response.", error);
    return createMockRecruiterView(targetRole, profile);
  }
}
