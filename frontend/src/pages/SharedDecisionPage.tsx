import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ResultPanel } from "../components/ResultPanel";
import { AnalysisSkeleton } from "../components/Skeleton";
import { getAnalysisById } from "../services/api";
import type { AnalysisResult } from "../types";

export default function SharedDecisionPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) { setError("Decision not found."); setLoading(false); return; }
    getAnalysisById(id).then(setResult).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Decision not found.");
    }).finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"><ArrowLeft size={16} /> Back to LifeReplay AI</Link>
      {loading && <AnalysisSkeleton />}
      {error && <p role="alert" className="rounded-md bg-rose-50 px-4 py-3 font-semibold text-rose-700">{error}</p>}
      {result && <><div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50 p-5"><p className="text-sm font-black uppercase tracking-wide text-teal-800">Shared Decision Replay</p><h1 className="mt-2 text-2xl font-black text-slate-950">{result.decision}</h1></div><ResultPanel result={result} /></>}
    </div>
  );
}
