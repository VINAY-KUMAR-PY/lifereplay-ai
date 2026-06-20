import { Activity, BarChart3, Gauge, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { getDashboard } from "../services/api";
import type { DashboardMetrics } from "../types";
import { formatDate } from "../utils/format";

function MiniTrend({ title, values, color }: { title: string; values: number[]; color: string }) {
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
      <svg viewBox="0 0 192 76" className="mt-5 h-28 w-full overflow-visible" role="img" aria-label={title}>
        <path d="M0 72H192" stroke="#e2e8f0" strokeWidth="2" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((value, index) => {
          const x = data.length === 1 ? 96 : (index / (data.length - 1)) * 192;
          const y = 72 - (Math.max(0, Math.min(100, value)) / 100) * 64;
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="4" fill={color} />;
        })}
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const maxRiskValue = Math.max(...Object.values(dashboard?.riskDistribution ?? { none: 1 }));
  const confidence = dashboard?.averageConfidenceScore ?? 0;
  const opportunity = dashboard?.averageOpportunityScore ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Dashboard"
        title="Your decision intelligence cockpit."
        description="Track analyzed decisions, average confidence, risk concentration, and recent futures."
      />

      {loading && (
        <div className="mt-10 flex items-center gap-3 rounded-md border border-slate-200 bg-white p-5 text-slate-600">
          <Loader2 className="animate-spin" size={20} />
          Loading dashboard
        </div>
      )}

      {error && <p className="mt-8 rounded-md bg-rose-50 px-4 py-3 font-semibold text-rose-700">{error}</p>}

      {dashboard && (
        <section className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Activity, label: "Total decisions", value: dashboard.totalDecisions },
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

          <div className="grid gap-6 lg:grid-cols-2">
            <MiniTrend title="Confidence Trend" values={dashboard.confidenceTrend} color="#14b8a6" />
            <MiniTrend title="Opportunity Trend" values={dashboard.opportunityTrend} color="#6366f1" />
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
                <div className="space-y-4">
                  {Object.entries(dashboard.riskDistribution).map(([risk, value]) => (
                    <div key={risk}>
                      <div className="mb-2 flex justify-between text-sm font-bold text-slate-700">
                        <span>{risk}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500"
                          style={{ width: `${Math.max(10, (value / maxRiskValue) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
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
        </section>
      )}
    </div>
  );
}
