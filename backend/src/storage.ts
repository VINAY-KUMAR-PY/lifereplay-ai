import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lockfile from "proper-lockfile";
import type { AnalysisResult, CareerReplayResult, ComparisonResult, FutureSimulationResult, RecruiterViewResult } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = process.env.DATA_DIR ?? path.resolve(__dirname, "../data");
const historyFile = path.join(dataDir, "history.json");
const comparisonsFile = path.join(dataDir, "comparisons.json");
const careerReplaysFile = path.join(dataDir, "career-replays.json");
const simulationsFile = path.join(dataDir, "future-simulations.json");
const recruiterViewsFile = path.join(dataDir, "recruiter-views.json");

async function readCollection<T>(file: string): Promise<T[]> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  try { await fs.access(file); } catch { await fs.writeFile(file, "[]", "utf-8"); }
  try { return JSON.parse(await fs.readFile(file, "utf-8")) as T[]; }
  catch { await fs.writeFile(file, "[]", "utf-8"); return []; }
}

async function atomicWrite(file: string, data: string): Promise<void> {
  const dir = path.dirname(file);
  await fs.mkdir(dir, { recursive: true });
  const tmpFile = path.join(dir, `.tmp-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  try {
    await fs.writeFile(tmpFile, data, "utf-8");
    try {
      await fs.rename(tmpFile, file);
    } catch (error) {
      const code = error instanceof Error && "code" in error ? error.code : undefined;
      if (process.platform !== "win32" || (code !== "EEXIST" && code !== "EPERM")) throw error;
      await fs.rm(file, { force: true });
      await fs.rename(tmpFile, file);
    }
  } finally {
    await fs.rm(tmpFile, { force: true });
  }
}

async function ensureCollectionFile(file: string): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, "[]", "utf-8");
  }
}

async function saveCollectionItem<T>(file: string, item: T, limit: number): Promise<T> {
  await ensureCollectionFile(file);
  const release = await lockfile.lock(file, {
    realpath: false,
    retries: { retries: 20, factor: 1.4, minTimeout: 10, maxTimeout: 150 }
  });
  try {
    const items = await readCollection<T>(file);
    await atomicWrite(file, JSON.stringify([item, ...items].slice(0, limit), null, 2));
  } finally {
    await release();
  }
  return item;
}

export const readHistory = () => readCollection<AnalysisResult>(historyFile);
export const readComparisons = () => readCollection<ComparisonResult>(comparisonsFile);
export const saveAnalysis = (analysis: AnalysisResult) => saveCollectionItem(historyFile, analysis, 100);
export const saveComparison = (comparison: ComparisonResult) => saveCollectionItem(comparisonsFile, comparison, 50);
export const readCareerReplays = () => readCollection<CareerReplayResult>(careerReplaysFile);
export const saveCareerReplay = (replay: CareerReplayResult) => saveCollectionItem(careerReplaysFile, replay, 50);

export const readFutureSimulations = () => readCollection<FutureSimulationResult>(simulationsFile);
export const saveFutureSimulation = (simulation: FutureSimulationResult) => saveCollectionItem(simulationsFile, simulation, 50);
export const readRecruiterViews = () => readCollection<RecruiterViewResult>(recruiterViewsFile);
export const saveRecruiterView = (assessment: RecruiterViewResult) => saveCollectionItem(recruiterViewsFile, assessment, 50);
