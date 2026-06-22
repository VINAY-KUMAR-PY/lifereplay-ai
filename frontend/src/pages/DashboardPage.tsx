import { Activity, Award, BarChart3, Gauge, GitCompare, ScanSearch, ShieldAlert, Sparkles, Telescope } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { DashboardSkeleton } from "../components/Skeleton";
import { getDashboard } from "../services/api";
import type { DashboardMetrics } from "../types";
import { formatDate } from "../utils/format";
import { useDemoData } from "../context/DemoDataContext";
import { demoDashboard } from "../data/demoData";

function TrendChart({ title, values, color }: { title: string; values: number[]; color: string }) {
  const data = values.length ? values : [0];
  const points = data
    .map((value, index) => {
      const x = data.length === 1 ? 96 : (index / (data.length - 1)) * 192;
      const y = 72 - (Math.max(0, Math.min(100, value)) / 100) * 64;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">
          {data[data.length - 1]}%
        </span>
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-500">Last {values.length} decisions</p>
      <svg viewBox="0 0 210 96" className="mt-3 h-44 w-full overflow-visible" role="img" aria-label={title}>
        {[8, 40, 72].map((y) => <path key={y} d={`M16 ${y}H208`} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />)}
        <text x="0" y="12" fontSize="7" fill="#64748b">100</text><text x="5" y="76" fontSize="7" fill="#64748b">0</text>
        <polyline points={points} transform="translate(16 0)" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((value, index) => {
          const x = data.length === 1 ? 96 : (index / (data.length - 1)) * 192;
          const y = 72 - (Math.max(0, Math.min(100, value)) / 100) * 64;
          return <g key={`${value}-${index}`} className="group"><circle cx={x + 16} cy={y} r="5" fill={color}><title>{`Decision #${index + 1}: ${value}%`}</title></circle><text x={x + 16} y="91" textAnchor="middle" fontSize="6" fill="#64748b">#{index + 1}</text></g>;
        })}
      </svg>
    </div>
  );
}

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

      {error && <p className="mt-8 rounded-md bg-rose-50 px-4 py-3 font-semibold text-rose-700">{error}</p>}

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
            <TrendChart title="Confidence Trend" values={dashboard.confidenceTrend} color="#14b8a6" />
            <TrendChart title="Opportunity Trend" values={dashboard.opportunityTrend} color="#6366f1" />
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
                <div className="flex h-44 items-end gap-3 border-b border-slate-200 px-2 pb-7">
                  {Object.entries(dashboard.riskDistribution).map(([risk, value], index) => {
                    const maximum = Math.max(...Object.values(dashboard.riskDistribution), 1);
                    const colors = ["#14b8a6", "#6366f1", "#f59e0b", "#ef4444", "#10b981"];
                    return <div key={risk} className="relative flex h-full flex-1 items-end justify-center"><div title={`${risk}: ${value}`} className="w-full max-w-12 rounded-t transition hover:opacity-80" style={{ height: `${Math.max(10, (value / maximum) * 100)}%`, backgroundColor: colors[index % colors.length] }} /><span className="absolute -bottom-6 text-[10px] font-bold text-slate-600">{risk}</span><span className="absolute text-xs font-black text-slate-700" style={{ bottom: `${Math.max(10, (value / maximum) * 100)}%` }}>{value}</span></div>;
                  })}
                </div>
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
