import { Eye, GraduationCap, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ResultPanel } from "../components/ResultPanel";
import { SectionHeader } from "../components/SectionHeader";
import { getCareerReplays, getHistory } from "../services/api";
import type { AnalysisResult, CareerReplayResult } from "../types";
import { formatDate } from "../utils/format";
import { useDemoData } from "../context/DemoDataContext";
import { demoCareerReplay, demoHistory } from "../data/demoData";

const PAGE_SIZE = 15;

export default function HistoryPage() {
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [careerReplays, setCareerReplays] = useState<CareerReplayResult[]>([]);
  const [selected, setSelected] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [page, setPage] = useState(1);
  const { demoMode } = useDemoData();
  const riskCategories = ["All", "Career", "Financial", "Personal", "Learning", "Market"];
  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();
    return (item.decision.toLowerCase().includes(query) || item.summary.toLowerCase().includes(query))
      && (filterRisk === "All" || item.dominantRiskCategory === filterRisk);
  });
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, filterRisk]);

  useEffect(() => {
    setPage(1);
    if (demoMode) { setItems(demoHistory); setCareerReplays([demoCareerReplay]); setSelected(demoHistory[0]); setLoading(false); setError(""); return; }
    setLoading(true);
    Promise.all([getHistory(), getCareerReplays()])
      .then(([history, replays]) => {
        setItems(history);
        setCareerReplays(replays);
        setSelected(history[0] ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load history."))
      .finally(() => setLoading(false));
  }, [demoMode]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="History"
        title="Review previous decisions."
        description="Review saved career decisions, reopen reports, and compare how confidence, opportunity, and risk evolved over time."
      />
      {demoMode && <div className="mt-6 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-black text-teal-800">Demo Data — these examples are not mixed with saved decisions.</div>}

      {loading && (
        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
          <Loader2 className="animate-spin" size={20} />
          Loading history
        </div>
      )}

      {error && <p role="alert" className="mt-8 rounded-md bg-rose-50 px-4 py-3 font-semibold text-rose-700">{error}</p>}

      {!!careerReplays.length && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-teal-200 dark:bg-slate-800"><GraduationCap size={19} /></span>
            <div>
              <h2 className="font-black text-slate-950 dark:text-slate-50">CareerReplay history</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Saved career path simulations remain available after restart.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {careerReplays.map((replay) => (
              <article key={replay.id} className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{formatDate(replay.createdAt)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {replay.paths.map((path) => <span key={path.path} className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">{path.path} {path.careerFitScore}%</span>)}
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{replay.finalRecommendation}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {!!items.length && <div className="mt-6 flex flex-wrap gap-3"><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search decisions..." className="min-w-48 flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" /><div className="flex flex-wrap gap-2">{riskCategories.map((category) => <button key={category} type="button" onClick={() => setFilterRisk(category)} className={`rounded-lg px-3 py-2 text-xs font-black transition ${filterRisk === category ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{category}</button>)}</div></div>}

      {!loading && !items.length && !careerReplays.length && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-lg font-black text-slate-950">No decisions analyzed yet.</p>
          <p className="mt-2 text-slate-600">Run the analyzer once and the result will appear here.</p>
        </div>
      )}

      {!!items.length && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            {paginatedItems.map((item) => (
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
            {!filteredItems.length && <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-600">No decisions match this search and risk filter.</div>}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm font-bold text-slate-600">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <div>{selected && <ResultPanel result={selected} />}</div>
        </div>
      )}
    </div>
  );
}
