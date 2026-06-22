import { promises as fs } from "node:fs";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../aiService.js", async () => {
  const mock = await import("../mockAi.js");
  return {
    analyzeDecision: async (decision: string) => mock.createMockAnalysis(decision),
    compareOptions: async (optionA: string, optionB: string) => mock.createMockComparison(optionA, optionB),
    replayCareers: async (paths: string[], background = "") => mock.createMockCareerReplay(paths, background),
    simulateFutures: async (scenarios: string[], profile = "") => mock.createMockFutureSimulation(scenarios, profile),
    generateRecruiterView: async (targetRole: string, profile: string) => mock.createMockRecruiterView(targetRole, profile)
  };
});

const collectionFiles = ["history.json", "comparisons.json", "career-replays.json", "future-simulations.json", "recruiter-views.json"];
let tmpDir: string;
let server: Server;
let baseUrl: string;
let originalDataDir: string | undefined;

async function request(pathname: string, body?: unknown) {
  return fetch(`${baseUrl}${pathname}`, body === undefined ? undefined : {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

beforeAll(async () => {
  originalDataDir = process.env.DATA_DIR;
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "lifereplay-server-"));
  process.env.DATA_DIR = tmpDir;
  process.env.NODE_ENV = "test";
  vi.resetModules();
  const { app } = await import("../server.js");
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not bind to a TCP port.");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

beforeEach(async () => {
  await Promise.all(collectionFiles.map((file) => fs.writeFile(path.join(tmpDir, file), "[]", "utf-8")));
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  if (originalDataDir === undefined) delete process.env.DATA_DIR;
  else process.env.DATA_DIR = originalDataDir;
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe("LifeReplay API persistence and aggregation", () => {
  it("persists CareerReplay and returns it through history", async () => {
    const response = await request("/api/career-replay", {
      paths: ["AI Engineer", "Higher Studies"],
      background: "Final-year CSE student with two full-stack projects."
    });
    expect(response.status).toBe(200);
    const created = await response.json() as { id: string };

    const historyResponse = await request("/api/career-replays");
    expect(historyResponse.status).toBe(200);
    const history = await historyResponse.json() as Array<{ id: string; paths: Array<{ path: string }> }>;
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe(created.id);
    expect(history[0].paths.map((item) => item.path)).toEqual(["AI Engineer", "Higher Studies"]);
  });

  it("aggregates analysis, comparison, CareerReplay, and future simulation activity", async () => {
    await request("/api/analyze", { decision: "Should I become an AI engineer after graduation?" });
    await request("/api/compare", { optionA: "AI Engineer", optionB: "Software Engineer" });
    const replayResponse = await request("/api/career-replay", { paths: ["AI Engineer", "Higher Studies"], background: "CSE fresher" });
    await request("/api/future-simulation", { scenarios: ["AI Engineer", "Government Exams"], profile: "CSE fresher" });
    const replay = await replayResponse.json() as { paths: Array<{ careerFitScore: number }> };

    const response = await request("/api/dashboard");
    expect(response.status).toBe(200);
    const dashboard = await response.json() as Record<string, unknown>;
    expect(dashboard).toMatchObject({
      totalDecisions: 1,
      totalComparisons: 1,
      totalCareerReplays: 1,
      totalFutureSimulations: 1,
      totalRecruiterAssessments: 0
    });
    const expectedFit = Math.round(replay.paths.reduce((sum, item) => sum + item.careerFitScore, 0) / replay.paths.length);
    expect(dashboard.averageCareerFitScore).toBe(expectedFit);
    expect(dashboard.recentCareerReplays).toHaveLength(1);
    expect(dashboard.recentAnalyses).toHaveLength(1);
    expect(dashboard.recentComparisons).toHaveLength(1);
  });
});

describe("stream rate limiting", () => {
  it("protects /api/analyze/stream with the AI request limit", async () => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const response = await request("/api/analyze/stream", { decision: "short" });
      expect(response.status).toBe(200);
      await response.text();
    }

    const blocked = await request("/api/analyze/stream", { decision: "short" });
    expect(blocked.status).toBe(429);
    await expect(blocked.json()).resolves.toMatchObject({ message: expect.stringContaining("Too many requests") });
  });
});
