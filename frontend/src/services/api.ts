import type { AnalysisResult, CareerPath, CareerReplayResult, ComparisonResult, DashboardMetrics, FutureSimulationResult, RecruiterViewResult } from "../types";

/** Empty string uses same-origin relative `/api` (Docker/nginx production). Set VITE_API_URL for local dev. */
export const API_URL = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export function analyzeDecision(decision: string) {
  return request<AnalysisResult>("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ decision })
  });
}

export function compareOptions(optionA: string, optionB: string) {
  return request<ComparisonResult>("/api/compare", {
    method: "POST",
    body: JSON.stringify({ optionA, optionB })
  });
}

export function replayCareers(paths: CareerPath[], background: string) {
  return request<CareerReplayResult>("/api/career-replay", {
    method: "POST",
    body: JSON.stringify({ paths, background })
  });
}

export function getHistory() {
  return request<AnalysisResult[]>("/api/history");
}

export function getCareerReplays() {
  return request<CareerReplayResult[]>("/api/career-replays");
}

export function getDashboard() {
  return request<DashboardMetrics>("/api/dashboard");
}

export function getAnalysisById(id: string) {
  return request<AnalysisResult>(`/api/analyze/${encodeURIComponent(id)}`);
}

export function simulateFutures(scenarios: string[], profile: string) {
  return request<FutureSimulationResult>("/api/future-simulation", { method: "POST", body: JSON.stringify({ scenarios, profile }) });
}

export function generateRecruiterView(targetRole: string, profile: string) {
  return request<RecruiterViewResult>("/api/recruiter-view", { method: "POST", body: JSON.stringify({ targetRole, profile }) });
}
