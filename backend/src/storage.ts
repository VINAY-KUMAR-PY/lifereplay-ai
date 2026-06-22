import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AnalysisResult, ComparisonResult, FutureSimulationResult, RecruiterViewResult } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const historyFile = path.join(dataDir, "history.json");
const comparisonsFile = path.join(dataDir, "comparisons.json");
const simulationsFile = path.join(dataDir, "future-simulations.json");
const recruiterViewsFile = path.join(dataDir, "recruiter-views.json");

async function readCollection<T>(file: string): Promise<T[]> {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(file); } catch { await fs.writeFile(file, "[]", "utf-8"); }
  try { return JSON.parse(await fs.readFile(file, "utf-8")) as T[]; }
  catch { await fs.writeFile(file, "[]", "utf-8"); return []; }
}

async function saveCollectionItem<T>(file: string, item: T, limit: number): Promise<T> {
  const items = await readCollection<T>(file);
  await fs.writeFile(file, JSON.stringify([item, ...items].slice(0, limit), null, 2), "utf-8");
  return item;
}

async function ensureHistoryFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(historyFile);
  } catch {
    await fs.writeFile(historyFile, "[]", "utf-8");
  }
}

export async function readHistory(): Promise<AnalysisResult[]> {
  await ensureHistoryFile();
  const raw = await fs.readFile(historyFile, "utf-8");

  try {
    return JSON.parse(raw) as AnalysisResult[];
  } catch {
    await fs.writeFile(historyFile, "[]", "utf-8");
    return [];
  }
}

export async function saveAnalysis(analysis: AnalysisResult): Promise<AnalysisResult> {
  const history = await readHistory();
  const nextHistory = [analysis, ...history].slice(0, 100);
  await fs.writeFile(historyFile, JSON.stringify(nextHistory, null, 2), "utf-8");
  return analysis;
}

async function ensureComparisonsFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(comparisonsFile);
  } catch {
    await fs.writeFile(comparisonsFile, "[]", "utf-8");
  }
}

export async function readComparisons(): Promise<ComparisonResult[]> {
  await ensureComparisonsFile();
  const raw = await fs.readFile(comparisonsFile, "utf-8");
  try {
    return JSON.parse(raw) as ComparisonResult[];
  } catch {
    await fs.writeFile(comparisonsFile, "[]", "utf-8");
    return [];
  }
}

export async function saveComparison(comparison: ComparisonResult): Promise<ComparisonResult> {
  const history = await readComparisons();
  await fs.writeFile(comparisonsFile, JSON.stringify([comparison, ...history].slice(0, 50), null, 2), "utf-8");
  return comparison;
}

export const readFutureSimulations = () => readCollection<FutureSimulationResult>(simulationsFile);
export const saveFutureSimulation = (simulation: FutureSimulationResult) => saveCollectionItem(simulationsFile, simulation, 50);
export const readRecruiterViews = () => readCollection<RecruiterViewResult>(recruiterViewsFile);
export const saveRecruiterView = (assessment: RecruiterViewResult) => saveCollectionItem(recruiterViewsFile, assessment, 50);
