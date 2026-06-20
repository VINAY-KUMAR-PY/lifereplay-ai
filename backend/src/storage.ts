import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AnalysisResult } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const historyFile = path.join(dataDir, "history.json");

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
