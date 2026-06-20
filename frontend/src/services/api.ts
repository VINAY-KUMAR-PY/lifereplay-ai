import type { AnalysisResult, ComparisonResult, DashboardMetrics } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

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

export function getHistory() {
  return request<AnalysisResult[]>("/api/history");
}

export function getDashboard() {
  return request<DashboardMetrics>("/api/dashboard");
}
