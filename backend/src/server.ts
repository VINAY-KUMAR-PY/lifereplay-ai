import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

import cors from "cors";
import express from "express";
import { z } from "zod";

const { analyzeDecision, compareOptions, replayCareers } = await import("./aiService.js");
import { readHistory, saveAnalysis } from "./storage.js";
import type { DashboardMetrics } from "./types.js";

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

const decisionSchema = z.object({
  decision: z.string().trim().min(8, "Decision must be at least 8 characters.").max(500)
});

const compareSchema = z.object({
  optionA: z.string().trim().min(2, "Option A is required.").max(240),
  optionB: z.string().trim().min(2, "Option B is required.").max(240)
});

const careerPathSchema = z.enum([
  "AI Engineer",
  "Data Scientist",
  "Software Engineer",
  "Government Exams",
  "Startup Founder",
  "Higher Studies"
]);

const careerReplaySchema = z.object({
  paths: z.array(careerPathSchema).min(1, "Select at least one career path.").max(6),
  background: z.string().trim().max(500).optional()
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "LifeReplay AI",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/analyze", async (req, res, next) => {
  try {
    const { decision } = decisionSchema.parse(req.body);
    const analysis = await analyzeDecision(decision);
    await saveAnalysis(analysis);
    res.status(201).json(analysis);
  } catch (error) {
    next(error);
  }
});

app.post("/api/compare", async (req, res, next) => {
  try {
    const { optionA, optionB } = compareSchema.parse(req.body);
    const comparison = await compareOptions(optionA, optionB);
    res.status(200).json(comparison);
  } catch (error) {
    next(error);
  }
});

app.post("/api/career-replay", async (req, res, next) => {
  try {
    const { paths, background } = careerReplaySchema.parse(req.body);
    const replay = await replayCareers(paths, background);
    res.status(200).json(replay);
  } catch (error) {
    next(error);
  }
});

app.get("/api/history", async (_req, res, next) => {
  try {
    res.json(await readHistory());
  } catch (error) {
    next(error);
  }
});

app.get("/api/dashboard", async (_req, res, next) => {
  try {
    const history = await readHistory();
    const totalDecisions = history.length;

    const averageConfidenceScore = totalDecisions
      ? Math.round(history.reduce((sum, item) => sum + item.confidenceScore, 0) / totalDecisions)
      : 0;
    const averageOpportunityScore = totalDecisions
      ? Math.round(history.reduce((sum, item) => sum + item.opportunityScore, 0) / totalDecisions)
      : 0;

    const riskDistribution = history.reduce<Record<string, number>>((acc, item) => {
      acc[item.dominantRiskCategory] = (acc[item.dominantRiskCategory] ?? 0) + 1;
      return acc;
    }, {});

    const mostCommonRiskCategory =
      Object.entries(riskDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Not enough data";

    const dashboard: DashboardMetrics = {
      totalDecisions,
      averageConfidenceScore,
      averageOpportunityScore,
      mostCommonRiskCategory: mostCommonRiskCategory as DashboardMetrics["mostCommonRiskCategory"],
      recentAnalyses: history.slice(0, 5),
      riskDistribution,
      confidenceTrend: history.slice(0, 8).reverse().map((item) => item.confidenceScore),
      opportunityTrend: history.slice(0, 8).reverse().map((item) => item.opportunityScore)
    };

    res.json(dashboard);
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: error.issues.map((issue) => issue.message)
    });
  }

  console.error("[LifeReplay AI] API error", error);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(port, () => {
  console.log(`[LifeReplay AI] Backend running on http://localhost:${port}`);
});
