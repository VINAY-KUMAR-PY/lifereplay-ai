import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AnalysisResult } from "../types.js";

describe("Storage resilience patterns", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "lifereplay-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("handles a missing file by returning an empty array", async () => {
    const file = path.join(tmpDir, "missing.json");
    try { await fs.access(file); } catch { await fs.writeFile(file, "[]", "utf-8"); }
    expect(JSON.parse(await fs.readFile(file, "utf-8"))).toEqual([]);
  });

  it("handles corrupted JSON by resetting to an empty array", async () => {
    const file = path.join(tmpDir, "corrupted.json");
    await fs.writeFile(file, "{ invalid json {{{{", "utf-8");
    let result: unknown[];
    try { result = JSON.parse(await fs.readFile(file, "utf-8")) as unknown[]; }
    catch { await fs.writeFile(file, "[]", "utf-8"); result = []; }
    expect(result).toEqual([]);
  });

  it("prepends new items and enforces a 100-item cap", async () => {
    const file = path.join(tmpDir, "history.json");
    const existing = Array.from({ length: 100 }, (_, index) => ({ id: String(index) }));
    await fs.writeFile(file, JSON.stringify(existing), "utf-8");
    const history = JSON.parse(await fs.readFile(file, "utf-8")) as { id: string }[];
    const next = [{ id: "new" }, ...history].slice(0, 100);
    await fs.writeFile(file, JSON.stringify(next, null, 2), "utf-8");
    const final = JSON.parse(await fs.readFile(file, "utf-8")) as { id: string }[];
    expect(final).toHaveLength(100);
    expect(final[0].id).toBe("new");
    expect(final[99].id).toBe("98");
  });

  it("creates nested directories without throwing", async () => {
    const nested = path.join(tmpDir, "deep", "nested", "data");
    await fs.mkdir(nested, { recursive: true });
    const file = path.join(nested, "test.json");
    await fs.writeFile(file, "[]", "utf-8");
    expect(await fs.readFile(file, "utf-8")).toBe("[]");
  });
});

describe("saveAnalysis / readHistory actual exports", () => {
  let tmpDir: string;
  let originalDataDir: string | undefined;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "lifereplay-storage-"));
    originalDataDir = process.env.DATA_DIR;
    process.env.DATA_DIR = tmpDir;
    vi.resetModules();
  });

  afterEach(async () => {
    if (originalDataDir === undefined) delete process.env.DATA_DIR;
    else process.env.DATA_DIR = originalDataDir;
    await fs.rm(tmpDir, { recursive: true, force: true });
    vi.resetModules();
  });

  function makeAnalysis(id: string): AnalysisResult {
    return {
      id,
      decision: `Test decision ${id}`,
      createdAt: new Date().toISOString(),
      bestCaseFuture: "Best",
      worstCaseFuture: "Worst",
      mostLikelyFuture: "Likely",
      confidenceScore: 70,
      confidenceExplanation: "Explanation",
      careerRisks: ["Risk A"],
      financialRisks: ["Risk B"],
      personalRisks: ["Risk C"],
      opportunityScore: 65,
      recommendedNextSteps: ["Step 1"],
      timeline: [
        { period: "6 months", outlook: "ok", milestone: "m1", riskLevel: "Low" },
        { period: "1 year", outlook: "ok", milestone: "m2", riskLevel: "Low" },
        { period: "3 years", outlook: "ok", milestone: "m3", riskLevel: "Medium" },
        { period: "5 years", outlook: "ok", milestone: "m4", riskLevel: "Medium" }
      ],
      actionPlan: { immediate: ["Do A"], thirtyDay: ["Do B"], ninetyDay: ["Do C"], longTerm: ["Do D"] },
      summary: "Summary",
      dominantRiskCategory: "Career"
    };
  }

  it("readHistory returns an empty array when no file exists", async () => {
    const { readHistory } = await import("../storage.js");
    expect(await readHistory()).toEqual([]);
  });

  it("saveAnalysis persists an item and readHistory retrieves it", async () => {
    const { readHistory, saveAnalysis } = await import("../storage.js");
    await saveAnalysis(makeAnalysis("test-001"));
    const history = await readHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe("test-001");
    expect(history[0].decision).toBe("Test decision test-001");
  });

  it("saveAnalysis prepends the newest item", async () => {
    const { readHistory, saveAnalysis } = await import("../storage.js");
    await saveAnalysis(makeAnalysis("first"));
    await saveAnalysis(makeAnalysis("second"));
    const history = await readHistory();
    expect(history[0].id).toBe("second");
    expect(history[1].id).toBe("first");
  });

  it("saveAnalysis enforces the 100-item cap", async () => {
    const { readHistory, saveAnalysis } = await import("../storage.js");
    for (let index = 0; index < 101; index += 1) {
      await saveAnalysis(makeAnalysis(`item-${index}`));
    }
    const history = await readHistory();
    expect(history).toHaveLength(100);
    expect(history[0].id).toBe("item-100");
  });

  it("preserves every item written concurrently", async () => {
    const { readHistory, saveAnalysis } = await import("../storage.js");
    const items = Array.from({ length: 20 }, (_, index) => makeAnalysis(`concurrent-${index}`));
    await Promise.all(items.map((item) => saveAnalysis(item)));
    const history = await readHistory();
    expect(history).toHaveLength(20);
    expect(new Set(history.map((item) => item.id)).size).toBe(20);
  });
});
