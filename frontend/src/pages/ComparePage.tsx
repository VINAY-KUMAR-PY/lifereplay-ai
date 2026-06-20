import { CheckCircle2, GitCompare, Loader2, XCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { SectionHeader } from "../components/SectionHeader";
import { compareOptions } from "../services/api";
import type { ComparisonResult } from "../types";

function CompareList({ title, items, positive }: { title: string; items: string[]; positive: boolean }) {
  const Icon = positive ? CheckCircle2 : XCircle;

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-black text-slate-950">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <Icon className={`mt-1 h-4 w-4 flex-none ${positive ? "text-teal-600" : "text-rose-600"}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ComparePage() {
  const [optionA, setOptionA] = useState("Data Science");
  const [optionB, setOptionB] = useState("Software Engineering");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (optionA.trim().length < 2 || optionB.trim().length < 2) {
      setError("Add both options before comparing.");
      return;
    }

    setLoading(true);
    try {
      setResult(await compareOptions(optionA.trim(), optionB.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to compare these options.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Decision Comparison"
        title="Compare two futures side by side."
        description="Enter two paths and get pros, cons, risk comparison, and a direct recommendation grounded in practical trade-offs."
      />

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <div>
          <label htmlFor="optionA" className="text-sm font-black text-slate-800">Option A</label>
          <input
            id="optionA"
            value={optionA}
            onChange={(event) => setOptionA(event.target.value)}
            className="mt-3 w-full rounded-md border border-slate-300 px-4 py-3 text-slate-950 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="optionB" className="text-sm font-black text-slate-800">Option B</label>
          <input
            id="optionB"
            value={optionB}
            onChange={(event) => setOptionB(event.target.value)}
            className="mt-3 w-full rounded-md border border-slate-300 px-4 py-3 text-slate-950 shadow-sm"
          />
        </div>
        <Button type="submit" disabled={loading} className="lg:min-w-44">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <GitCompare size={18} />}
          Compare
        </Button>
        {error && <p className="rounded-md bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 lg:col-span-3">{error}</p>}
      </form>

      {result && (
        <section className="mt-8 space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <CompareList title={`Pros of ${result.optionA}`} items={result.prosA} positive />
            <CompareList title={`Cons of ${result.optionA}`} items={result.consA} positive={false} />
            <CompareList title={`Pros of ${result.optionB}`} items={result.prosB} positive />
            <CompareList title={`Cons of ${result.optionB}`} items={result.consB} positive={false} />
          </div>
          <div className="rounded-md border border-teal-200 bg-teal-50 p-6">
            <p className="text-sm font-black uppercase tracking-wide text-teal-800">Better option</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">{result.betterOption}</h2>
            <p className="mt-4 leading-7 text-slate-700">{result.explanation}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-black text-slate-950">Risk comparison</h3>
              <p className="mt-3 leading-7 text-slate-600">{result.riskComparison}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-black text-slate-950">Final recommendation</h3>
              <p className="mt-3 leading-7 text-slate-600">{result.finalRecommendation}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
