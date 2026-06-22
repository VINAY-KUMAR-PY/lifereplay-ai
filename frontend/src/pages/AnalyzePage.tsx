import { Loader2, WandSparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { ResultPanel } from "../components/ResultPanel";
import { SectionHeader } from "../components/SectionHeader";
import { AnalysisSkeleton } from "../components/Skeleton";
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
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    setStatusMessage("");

    if (decision.trim().length < 8) {
      setError("Enter a specific decision with at least 8 characters.");
      return;
    }

    setLoading(true);
    setStatusMessage("Connecting to AI engine...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/analyze/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: decision.trim() })
      });
      if (!response.ok || !response.body) throw new Error("Unable to connect to the analysis stream.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split("\n\n");
        buffer = messages.pop() ?? "";
        for (const message of messages) {
          const event = message.split("\n").find((line) => line.startsWith("event: "))?.slice(7);
          const dataLine = message.split("\n").find((line) => line.startsWith("data: "));
          if (!dataLine) continue;
          const payload = JSON.parse(dataLine.slice(6)) as { message?: string; id?: string };
          if (event === "status" && payload.message) setStatusMessage(payload.message);
          if (event === "result" && payload.id) setResult(payload as AnalysisResult);
          if (event === "error") throw new Error(payload.message ?? "Unable to analyze this decision.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze this decision.");
    } finally {
      setLoading(false);
      setStatusMessage("");
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
        {loading && <div className="mt-4 flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3"><Loader2 className="animate-spin text-teal-600" size={18} /><span className="text-sm font-semibold text-teal-800">{statusMessage || "Initializing AI engine..."}</span></div>}
      </form>

      {loading && <AnalysisSkeleton />}

      {result && (
        <div className="mt-8">
          <ResultPanel result={result} />
        </div>
      )}
    </div>
  );
}
