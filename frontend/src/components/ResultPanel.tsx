import { ArrowRight, Check, CheckCircle2, Clock3, Copy, Download, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import type { AnalysisResult } from "../types";
import { downloadDecisionReport } from "../utils/pdf";
import { Button } from "./Button";
import { ScoreRing } from "./ScoreRing";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700 dark:text-slate-200">{title}</h3>
      <ul className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-teal-600 dark:text-teal-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultPanel({ result }: { result: AnalysisResult }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/decision/${result.id}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Decision report</p>
          <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-slate-50">Export this replay for review</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={copyLink}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? "Copied" : "Copy link"}</Button>
          <Button type="button" onClick={() => downloadDecisionReport(result)}><Download size={18} />Download Decision Report</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScoreRing score={result.confidenceScore} label="Confidence" />
        <ScoreRing score={result.opportunityScore} label="Opportunity" />
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 text-teal-700 dark:text-teal-300">
          <Sparkles size={18} />
          <h2 className="text-xl font-black text-slate-950 dark:text-slate-50">Future Simulation</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-md bg-emerald-50 p-4 dark:bg-emerald-950/40">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-200">Best case</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-950 dark:text-emerald-100">{result.bestCaseFuture}</p>
          </div>
          <div className="rounded-md bg-rose-50 p-4 dark:bg-rose-950/40">
            <h3 className="font-bold text-rose-900 dark:text-rose-200">Worst case</h3>
            <p className="mt-2 text-sm leading-6 text-rose-950 dark:text-rose-100">{result.worstCaseFuture}</p>
          </div>
          <div className="rounded-md bg-sky-50 p-4 dark:bg-sky-950/40">
            <h3 className="font-bold text-sky-900 dark:text-sky-200">Most likely</h3>
            <p className="mt-2 text-sm leading-6 text-sky-950 dark:text-sky-100">{result.mostLikelyFuture}</p>
          </div>
        </div>
        <p className="mt-5 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-300">{result.confidenceExplanation}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ListBlock title="Career risks" items={result.careerRisks} />
        <ListBlock title="Financial risks" items={result.financialRisks} />
        <ListBlock title="Personal risks" items={result.personalRisks} />
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-2">
          <Clock3 className="text-indigo-600 dark:text-indigo-400" size={18} />
          <h2 className="text-xl font-black text-slate-950 dark:text-slate-50">Future Timeline</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {result.timeline.map((item) => (
            <div key={item.period} className="rounded-md border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm font-black text-slate-950 dark:text-slate-50">{item.period}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.outlook}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.milestone}</p>
              <span className="mt-3 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {item.riskLevel} risk
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ListBlock title="Recommended next steps" items={result.recommendedNextSteps} />
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="text-teal-600 dark:text-teal-400" size={18} />
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-700 dark:text-slate-200">Action plan</h3>
          </div>
          {[
            ["Immediate", result.actionPlan.immediate],
            ["30 days", result.actionPlan.thirtyDay],
            ["90 days", result.actionPlan.ninetyDay],
            ["Long term", result.actionPlan.longTerm]
          ].map(([title, items]) => (
            <div key={title as string} className="border-t border-slate-100 py-3 first:border-t-0 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-950 dark:text-slate-50">{title as string}</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {(items as string[]).map((item) => (
                  <li key={item} className="flex gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 flex-none text-slate-400 dark:text-slate-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
        <div className="flex gap-3">
          <ShieldAlert className="mt-1 h-5 w-5 flex-none text-amber-700 dark:text-amber-300" />
          <p className="text-sm leading-6 text-amber-950 dark:text-amber-100">{result.summary}</p>
        </div>
      </div>
    </section>
  );
}
