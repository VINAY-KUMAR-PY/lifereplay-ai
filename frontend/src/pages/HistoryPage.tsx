import { Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ResultPanel } from "../components/ResultPanel";
import { SectionHeader } from "../components/SectionHeader";
import { getHistory } from "../services/api";
import type { AnalysisResult } from "../types";
import { formatDate } from "../utils/format";

export default function HistoryPage() {
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [selected, setSelected] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory()
      .then((history) => {
        setItems(history);
        setSelected(history[0] ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="History"
        title="Review previous decisions."
        description="Review saved career decisions, reopen reports, and compare how confidence, opportunity, and risk evolved over time."
      />

      {loading && (
        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
          <Loader2 className="animate-spin" size={20} />
          Loading history
        </div>
      )}

      {error && <p className="mt-8 rounded-md bg-rose-50 px-4 py-3 font-semibold text-rose-700">{error}</p>}

      {!loading && !items.length && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-lg font-black text-slate-950">No decisions analyzed yet.</p>
          <p className="mt-2 text-slate-600">Run the analyzer once and the result will appear here.</p>
        </div>
      )}

      {!!items.length && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className={`w-full rounded-md border p-4 text-left shadow-sm transition ${
                  selected?.id === item.id
                    ? "border-teal-400 bg-teal-50 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:bg-slate-50 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{item.decision}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{formatDate(item.createdAt)}</p>
                  </div>
                  <Eye className="h-5 w-5 flex-none text-slate-500" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-md bg-slate-950 px-2 py-1 text-xs font-black text-white">{item.confidenceScore}%</span>
                  <span className="text-sm font-semibold text-slate-500">{item.dominantRiskCategory} risk</span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </button>
            ))}
          </div>
          <div>{selected && <ResultPanel result={selected} />}</div>
        </div>
      )}
    </div>
  );
}
