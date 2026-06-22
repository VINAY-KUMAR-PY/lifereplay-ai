import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { DecisionScorecard, RiskMatrixItem, SwotAnalysis } from "../types";

const scoreLabels: Array<[keyof DecisionScorecard, string]> = [
  ["marketDemand", "Market demand"], ["learningCurve", "Learning curve"], ["risk", "Risk resilience"],
  ["salaryPotential", "Salary potential"], ["competition", "Competition advantage"], ["stability", "Stability"],
  ["growthPotential", "Growth potential"], ["jobReadiness", "Job readiness"], ["overallScore", "Overall score"]
];

export function ScorecardPanel({ scorecard, compact = false }: { scorecard: DecisionScorecard; compact?: boolean }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between"><h3 className="font-black text-slate-950">Decision Scorecard</h3><span className="rounded-md bg-slate-950 px-3 py-1 text-sm font-black text-white">{scorecard.overallScore}/100</span></div>
      <div className={`mt-5 grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
        {scoreLabels.map(([key, label]) => <div key={key} className={key === "overallScore" ? "md:col-span-2" : ""}><div className="mb-1 flex justify-between text-xs font-bold text-slate-600"><span>{label}</span><span>{scorecard[key]}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${key === "overallScore" ? "bg-slate-950" : "bg-teal-500"}`} style={{ width: `${scorecard[key]}%` }} /></div></div>)}
      </div>
    </div>
  );
}

export function SwotPanel({ swot }: { swot: SwotAnalysis }) {
  const quadrants = [["Strengths", swot.strengths, "bg-emerald-50 text-emerald-950"], ["Weaknesses", swot.weaknesses, "bg-amber-50 text-amber-950"], ["Opportunities", swot.opportunities, "bg-sky-50 text-sky-950"], ["Threats", swot.threats, "bg-rose-50 text-rose-950"]] as const;
  return <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black text-slate-950">SWOT Analysis</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{quadrants.map(([title, items, classes]) => <div key={title} className={`rounded-md p-4 ${classes}`}><p className="text-xs font-black uppercase tracking-wide">{title}</p><ul className="mt-3 space-y-2 text-sm leading-6">{items.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-none" />{item}</li>)}</ul></div>)}</div></div>;
}

export function RiskMatrixPanel({ risks }: { risks: RiskMatrixItem[] }) {
  return <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black text-slate-950">Risk Matrix</h3><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{risks.map((risk) => { const exposure = Math.round(risk.probability * risk.impact / 100); return <div key={risk.type} className={`rounded-md border p-4 ${exposure >= 60 ? "border-rose-200 bg-rose-50" : exposure >= 35 ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}><div className="flex items-center justify-between gap-2"><span className="font-black text-slate-950">{risk.type}</span><AlertTriangle size={16} /></div><p className="mt-3 text-xs font-bold text-slate-600">Probability {risk.probability}%</p><p className="text-xs font-bold text-slate-600">Impact {risk.impact}%</p><p className="mt-3 text-xs leading-5 text-slate-700">{risk.mitigation}</p></div>; })}</div></div>;
}

export function WhyRecommendation({ title, reasons }: { title: string; reasons: string[] }) {
  return <div className="rounded-md border border-teal-200 bg-teal-50 p-6"><p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">Why this recommendation?</p><h3 className="mt-2 text-2xl font-black text-slate-950">{title}</h3><ol className="mt-4 grid gap-3 md:grid-cols-5">{reasons.map((reason, index) => <li key={reason} className="rounded-md border border-teal-100 bg-white p-4 text-sm leading-6 text-slate-700"><span className="mb-2 block text-lg font-black text-teal-700">{index + 1}</span>{reason}</li>)}</ol></div>;
}
