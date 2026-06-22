import { Activity, Award, BarChart3, Gauge, GitCompare, ScanSearch, ShieldAlert, Sparkles, Telescope } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionHeader } from "../components/SectionHeader";
import { DashboardSkeleton } from "../components/Skeleton";
import { getDashboard } from "../services/api";
import type { DashboardMetrics } from "../types";
import { formatDate } from "../utils/format";
import { useDemoData } from "../context/DemoDataContext";
import { demoDashboard } from "../data/demoData";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { demoMode } = useDemoData();

  useEffect(() => {
    if (demoMode) { setDashboard(demoDashboard); setLoading(false); setError(""); return; }
    setLoading(true);
    getDashboard()
      .then(setDashboard)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load dashboard."))
      .finally(() => setLoading(false));
  }, [demoMode]);

  const confidence = dashboard?.averageConfidenceScore ?? 0;
  const opportunity = dashboard?.averageOpportunityScore ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Dashboard"
        title="Your decision intelligence cockpit."
        description="Track analyzed decisions, average confidence, risk concentration, and recent futures."
      />
      {demoMode && <div className="mt-6 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-black text-teal-800">Demo Data — isolated judge showcase; real backend history is unchanged.</div>}

      {loading && <DashboardSkeleton />}

      {error && <p role="alert" className="mt-8 rounded-md bg-rose-50 px-4 py-3 font-semibold text-rose-700">{error}</p>}

      {dashboard && (
        <section className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              { icon: Activity, label: "Total decisions", value: dashboard.totalDecisions },
              { icon: GitCompare, label: "Total comparisons", value: dashboard.totalComparisons },
              { icon: Gauge, label: "Average confidence", value: `${dashboard.averageConfidenceScore}%` },
              { icon: Sparkles, label: "Average opportunity", value: `${dashboard.averageOpportunityScore}%` },
              { icon: ShieldAlert, label: "Most common risk", value: dashboard.mostCommonRiskCategory }
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-teal-200">
                  <item.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 text-sm font-bold text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              { icon: Telescope, label: "Future simulations", value: dashboard.totalFutureSimulations },
              { icon: ScanSearch, label: "Recruiter assessments", value: dashboard.totalRecruiterAssessments },
              { icon: Gauge, label: "Average readiness", value: `${dashboard.averageReadinessScore}%` },
              { icon: Sparkles, label: "Average success", value: `${dashboard.averageSuccessProbability}%` },
              { icon: Award, label: "Most recommended", value: dashboard.mostRecommendedPath }
            ].map((item) => <div key={item.label} className="rounded-md border border-slate-200 bg-slate-950 p-5 text-white"><span className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-teal-300"><item.icon size={19} /></span><p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p><p className="mt-2 text-xl font-black">{item.value}</p></div>)}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { title: "Confidence Trend", values: dashboard.confidenceTrend, color: "#14b8a6", label: "Confidence" },
              { title: "Opportunity Trend", values: dashboard.opportunityTrend, color: "#6366f1", label: "Opportunity" }
            ].map((trend) => <div key={trend.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-4"><h2 className="text-lg font-black text-slate-950">{trend.title}</h2><span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">{trend.values[trend.values.length - 1] ?? 0}%</span></div><p className="mt-1 text-xs font-semibold text-slate-500">Last {trend.values.length} decisions</p>{trend.values.length > 0 ? <ResponsiveContainer width="100%" height={176}><LineChart data={trend.values.map((value, index) => ({ name: `#${index + 1}`, score: value }))} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} /><YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} formatter={(value) => [`${Number(value)}%`, trend.label]} /><Line type="monotone" dataKey="score" stroke={trend.color} strokeWidth={3} dot={{ r: 4, fill: trend.color }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer> : <p className="mt-6 text-sm text-slate-500">Analyze decisions to build this trend.</p>}</div>)}
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black text-slate-950">Confidence and opportunity</h2>
                <div className="mt-5 space-y-5">
                  {[
                    ["Average confidence", confidence, "bg-teal-500"],
                    ["Average opportunity", opportunity, "bg-indigo-500"]
                  ].map(([label, value, color]) => (
                    <div key={label as string}>
                      <div className="mb-2 flex justify-between text-sm font-bold text-slate-700">
                        <span>{label as string}</span>
                        <span>{value as number}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${color as string}`} style={{ width: `${value as number}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <BarChart3 className="text-teal-700" size={20} />
                <h2 className="text-lg font-black text-slate-950">Risk distribution</h2>
              </div>
              {Object.keys(dashboard.riskDistribution).length ? (
                <ResponsiveContainer width="100%" height={176}><BarChart data={Object.entries(dashboard.riskDistribution).map(([risk, count]) => ({ risk, count }))} margin={{ top: 5, right: 5, left: -24, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="risk" tick={{ fontSize: 10, fill: "#64748b" }} /><YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} formatter={(value) => [Number(value), "Decisions"]} /><Bar dataKey="count" radius={[4, 4, 0, 0]}>{Object.keys(dashboard.riskDistribution).map((risk, index) => <Cell key={risk} fill={["#14b8a6", "#6366f1", "#f59e0b", "#ef4444", "#10b981"][index % 5]} />)}</Bar></BarChart></ResponsiveContainer>
              ) : (
                <p className="text-sm leading-6 text-slate-600">Analyze decisions to build risk insights.</p>
              )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Recent analyses</h2>
              <div className="mt-4 space-y-3">
                {dashboard.recentAnalyses.length ? (
                  dashboard.recentAnalyses.map((item) => (
                    <div key={item.id} className="rounded-md border border-slate-100 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-black text-slate-950">{item.decision}</p>
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-700">{item.confidenceScore}%</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{formatDate(item.createdAt)}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md bg-slate-50 p-6 text-center">
                    <p className="font-black text-slate-950">No recent analyses yet.</p>
                    <Link to="/analyze" className="mt-3 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white">
                      Analyze first decision
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Recent comparisons</h2>
            {dashboard.recentComparisons.length ? <div className="mt-4 grid gap-3 md:grid-cols-3">{dashboard.recentComparisons.map((comparison) => <div key={comparison.id} className="rounded-md border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-teal-700">{comparison.betterOption}</p><p className="mt-2 font-black text-slate-950">{comparison.optionA} vs {comparison.optionB}</p><p className="mt-2 text-sm leading-6 text-slate-600">{comparison.explanation}</p></div>)}</div> : <p className="mt-3 text-sm text-slate-600">Comparisons will appear here after you compare two options.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
