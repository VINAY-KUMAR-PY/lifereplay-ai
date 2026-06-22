import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

if (!process.env.PORT) console.warn("[LifeReplay AI] PORT not set, defaulting to 5000");
if (!process.env.FRONTEND_URL) console.warn("[LifeReplay AI] FRONTEND_URL not set, defaulting to http://localhost:5173");
const geminiKey = process.env.GEMINI_API_KEY?.trim();
if (!geminiKey) {
  console.warn("[LifeReplay AI] GEMINI_API_KEY not set. Platform will use deterministic mock AI responses.");
} else if (geminiKey.length < 20) {
  console.warn("[LifeReplay AI] GEMINI_API_KEY looks malformed (too short). AI calls will likely fail. Check your .env file.");
} else if (!geminiKey.startsWith("AI")) {
  console.warn("[LifeReplay AI] GEMINI_API_KEY does not start with 'AI' - this may not be a valid Gemini API key.");
} else {
  console.info(`[LifeReplay AI] GEMINI_API_KEY detected (${geminiKey.length} chars). Live AI mode active.`);
}

import cors from "cors";
import express from "express";
import { z } from "zod";

const { analyzeDecision, compareOptions, generateRecruiterView, replayCareers, simulateFutures } = await import("./aiService.js");
import { readCareerReplays, readComparisons, readFutureSimulations, readHistory, readRecruiterViews, saveAnalysis, saveCareerReplay, saveComparison, saveFutureSimulation, saveRecruiterView } from "./storage.js";
import type { DashboardMetrics } from "./types.js";

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

const requestWindows = new Map<string, { count: number; resetAt: number }>();

// Prune expired rate-limit windows every 5 minutes to prevent memory growth.
setInterval(() => {
  const now = Date.now();
  for (const [key, window] of requestWindows) {
    if (window.resetAt <= now) requestWindows.delete(key);
  }
}, 5 * 60 * 1000).unref();
const aiLimiter: express.RequestHandler = (req, res, next) => {
  const now = Date.now();
  const key = `${req.ip ?? "unknown"}:${req.path}`;
  const current = requestWindows.get(key);
  const window = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + 15 * 60 * 1000 }
    : current;
  window.count += 1;
  requestWindows.set(key, window);
  res.setHeader("RateLimit-Limit", "30");
  res.setHeader("RateLimit-Remaining", String(Math.max(0, 30 - window.count)));
  res.setHeader("RateLimit-Reset", String(Math.ceil(window.resetAt / 1000)));
  if (window.count > 30) {
    return res.status(429).json({ message: "Too many requests. Please wait a few minutes and try again." });
  }
  return next();
};

app.use("/api/compare", aiLimiter);
app.use("/api/career-replay", aiLimiter);
app.use("/api/future-simulation", aiLimiter);
app.use("/api/recruiter-view", aiLimiter);

const decisionSchema = z.object({
  decision: z.string().trim().min(8, "Decision must be at least 8 characters.").max(500)
});

const compareSchema = z.object({
  optionA: z.string().trim().min(2, "Option A is required.").max(240),
  optionB: z.string().trim().min(2, "Option B is required.").max(240)
});

const careerReplaySchema = z.object({
  paths: z.array(z.string().trim().min(2).max(80)).min(1, "Select at least one career path.").max(6),
  background: z.string().trim().max(1000).optional()
});

const futureSimulationRequestSchema = z.object({
  scenarios: z.array(z.string().trim().min(2).max(80)).min(2, "Add at least two scenarios.").max(4),
  profile: z.string().trim().max(1500).optional()
});

const recruiterViewRequestSchema = z.object({
  targetRole: z.string().trim().min(2).max(100),
  profile: z.string().trim().min(20, "Add enough profile detail for a recruiter assessment.").max(2000)
});

app.get("/health", (_req, res) => {
  const key = process.env.GEMINI_API_KEY?.trim();
  const mode = !key ? "mock" : key.length < 20 || !key.startsWith("AI") ? "mock-key-malformed" : "live";
  res.json({
    status: "ok",
    app: "LifeReplay AI",
    mode,
    timestamp: new Date().toISOString()
  });
});

app.post("/api/analyze", aiLimiter, async (req, res, next) => {
  try {
    const { decision } = decisionSchema.parse(req.body);
    const analysis = await analyzeDecision(decision);
    await saveAnalysis(analysis);
    res.status(201).json(analysis);
  } catch (error) {
    next(error);
  }
});

app.post("/api/analyze/stream", aiLimiter, async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const { decision } = decisionSchema.parse(req.body);
    send("status", { message: "Simulating best-case future..." });
    const analysis = await analyzeDecision(decision);
    await saveAnalysis(analysis);
    send("status", { message: "Calculating risk categories..." });
    await new Promise((resolve) => setTimeout(resolve, 250));
    send("status", { message: "Building action plan..." });
    await new Promise((resolve) => setTimeout(resolve, 250));
    send("result", analysis);
    send("done", {});
  } catch (error) {
    const message = error instanceof z.ZodError
      ? error.issues.map((issue) => issue.message).join(" ")
      : "Unable to analyze this decision.";
    send("error", { message });
  } finally {
    res.end();
  }
});

app.get("/api/analyze/:id", async (req, res, next) => {
  try {
    const item = (await readHistory()).find((analysis) => analysis.id === req.params.id);
    if (!item) return res.status(404).json({ message: "Decision not found." });
    return res.json(item);
  } catch (error) {
    return next(error);
  }
});

app.post("/api/compare", async (req, res, next) => {
  try {
    const { optionA, optionB } = compareSchema.parse(req.body);
    const comparison = await compareOptions(optionA, optionB);
    await saveComparison(comparison);
    res.status(200).json(comparison);
  } catch (error) {
    next(error);
  }
});

app.post("/api/career-replay", async (req, res, next) => {
  try {
    const { paths, background } = careerReplaySchema.parse(req.body);
    const replay = await replayCareers(paths, background);
    await saveCareerReplay(replay);
    res.status(200).json(replay);
  } catch (error) {
    next(error);
  }
});

app.post("/api/future-simulation", async (req, res, next) => {
  try {
    const { scenarios, profile } = futureSimulationRequestSchema.parse(req.body);
    const simulation = await simulateFutures(scenarios, profile);
    await saveFutureSimulation(simulation);
    res.status(200).json(simulation);
  } catch (error) { next(error); }
});

app.post("/api/recruiter-view", async (req, res, next) => {
  try {
    const { targetRole, profile } = recruiterViewRequestSchema.parse(req.body);
    const assessment = await generateRecruiterView(targetRole, profile);
    await saveRecruiterView(assessment);
    res.status(200).json(assessment);
  } catch (error) { next(error); }
});

app.get("/api/history", async (_req, res, next) => {
  try {
    res.json(await readHistory());
  } catch (error) {
    next(error);
  }
});

app.get("/api/career-replays", async (_req, res, next) => {
  try {
    res.json(await readCareerReplays());
  } catch (error) {
    next(error);
  }
});

app.get("/api/dashboard", async (_req, res, next) => {
  try {
    const history = await readHistory();
    const comparisons = await readComparisons();
    const careerReplays = await readCareerReplays();
    const futureSimulations = await readFutureSimulations();
    const recruiterViews = await readRecruiterViews();
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

    const replayPaths = careerReplays.flatMap((replay) => replay.paths);
    const recommendedPaths = [
      ...futureSimulations.map((item) => item.bestScenario),
      ...careerReplays.map((replay) => [...replay.paths].sort((a, b) => b.careerFitScore - a.careerFitScore)[0]?.path).filter((path): path is string => Boolean(path))
    ];

    const dashboard: DashboardMetrics = {
      totalDecisions,
      totalComparisons: comparisons.length,
      totalCareerReplays: careerReplays.length,
      totalFutureSimulations: futureSimulations.length,
      totalRecruiterAssessments: recruiterViews.length,
      averageCareerFitScore: replayPaths.length ? Math.round(replayPaths.reduce((sum, item) => sum + item.careerFitScore, 0) / replayPaths.length) : 0,
      averageReadinessScore: recruiterViews.length ? Math.round(recruiterViews.reduce((sum, item) => sum + item.readinessScore, 0) / recruiterViews.length) : 0,
      averageSuccessProbability: futureSimulations.length ? Math.round(futureSimulations.reduce((sum, item) => sum + item.scenarios.reduce((scenarioSum, scenario) => scenarioSum + scenario.successProbability, 0) / item.scenarios.length, 0) / futureSimulations.length) : 0,
      mostRecommendedPath: Object.entries(recommendedPaths.reduce<Record<string, number>>((acc, path) => { acc[path] = (acc[path] ?? 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Not enough data",
      averageConfidenceScore,
      averageOpportunityScore,
      mostCommonRiskCategory: mostCommonRiskCategory as DashboardMetrics["mostCommonRiskCategory"],
      recentAnalyses: history.slice(0, 5),
      recentComparisons: comparisons.slice(0, 3),
      recentCareerReplays: careerReplays.slice(0, 3),
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

export { app };

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`[LifeReplay AI] Backend running on http://localhost:${port}`);
  });
}
