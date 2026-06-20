import { Loader2, WandSparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { ResultPanel } from "../components/ResultPanel";
import { SectionHeader } from "../components/SectionHeader";
import { analyzeDecision } from "../services/api";
import type { AnalysisResult } from "../types";

const examples = [
  "Should I choose Data Scientist or Software Engineer?",
  "Should I accept a startup job or prepare for government exams?",
  "Should I launch my AI tutoring product this year?"
];

export default function AnalyzePage() {
  const [decision, setDecision] = useState(examples[0]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (decision.trim().length < 8) {
      setError("Enter a specific decision with at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      setResult(await analyzeDecision(decision.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze this decision.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Decision Analyzer"
        title="Replay a decision before you live it."
        description="Enter a real choice and LifeReplay AI will generate futures, confidence, risks, timeline, opportunity score, and a practical action plan."
      />

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
      >
        <label htmlFor="decision" className="text-sm font-black text-slate-800">
          Decision to analyze
        </label>
        <textarea
          id="decision"
          value={decision}
          onChange={(event) => setDecision(event.target.value)}
          rows={4}
          className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-base leading-7 text-slate-950 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          placeholder="Example: Should I choose Data Scientist or Software Engineer?"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setDecision(example)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
            >
              {example}
            </button>
          ))}
        </div>
        {error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
        <div className="mt-5">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <WandSparkles size={18} />}
            {loading ? "Simulating futures" : "Generate future replay"}
          </Button>
        </div>
      </form>

      {result && (
        <div className="mt-8">
          <ResultPanel result={result} />
        </div>
      )}
    </div>
  );
}
