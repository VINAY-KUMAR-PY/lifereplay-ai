import { BriefcaseBusiness, CheckCircle2, Clock3, GraduationCap, Loader2, Route, ShieldAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { ScoreRing } from "../components/ScoreRing";
import { SectionHeader } from "../components/SectionHeader";
import { replayCareers } from "../services/api";
import type { CareerPath, CareerReplayResult } from "../types";

const careerPaths: CareerPath[] = [
  "AI Engineer",
  "Data Scientist",
  "Software Engineer",
  "Government Exams",
  "Startup Founder",
  "Higher Studies"
];

const defaultSelected: CareerPath[] = ["AI Engineer", "Data Scientist", "Software Engineer"];

function PlanBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-teal-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CareerReplayPage() {
  const [selected, setSelected] = useState<CareerPath[]>(defaultSelected);
  const [background, setBackground] = useState(
    "I am a final-year engineering student with basic web development skills and interest in AI products."
  );
  const [result, setResult] = useState<CareerReplayResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function togglePath(path: CareerPath) {
    setSelected((current) =>
      current.includes(path) ? current.filter((item) => item !== path) : [...current, path]
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!selected.length) {
      setError("Select at least one career path to replay.");
      return;
    }

    setLoading(true);
    try {
      setResult(await replayCareers(selected, background.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate CareerReplay.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="CareerReplay Mode"
        title="Compare career paths with AI decision intelligence."
        description="Replay AI Engineer, Data Scientist, Software Engineer, Government Exams, Startup Founder, and Higher Studies with fit, growth, salary, risk, readiness, and 30/90/180-day action plans."
      />

      <form
        onSubmit={handleSubmit}
        className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
      >
        <div className="border-b border-slate-100 bg-slate-950 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-300">Career paths</p>
              <h2 className="mt-2 text-2xl font-black">Select paths to compare</h2>
            </div>
            <GraduationCap className="h-10 w-10 text-teal-300" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {careerPaths.map((path) => {
              const active = selected.includes(path);
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => togglePath(path)}
                  className={`rounded-lg border px-3 py-2 text-sm font-black transition ${
                    active
                      ? "border-teal-300 bg-teal-300 text-slate-950"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {path}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <label htmlFor="career-background" className="text-sm font-black text-slate-800">
            Student / fresher background
          </label>
          <textarea
            id="career-background"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            rows={4}
            className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-base leading-7 text-slate-950 shadow-sm"
          />
          {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
          <div className="mt-5">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Route size={18} />}
              {loading ? "Replaying careers" : "Generate CareerReplay"}
            </Button>
          </div>
        </div>
      </form>

      {result && (
        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-800">Final recommendation</p>
            <p className="mt-3 text-lg font-semibold leading-8 text-slate-800">{result.finalRecommendation}</p>
          </div>

          <div className="grid gap-6">
            {result.paths.map((path) => (
              <article key={path.path} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white">
                        <BriefcaseBusiness size={20} />
                      </span>
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">{path.path}</h2>
                        <p className="text-sm font-semibold text-slate-500">{path.timeRequired}</p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide ${
                      path.riskLevel === "High"
                        ? "bg-rose-100 text-rose-800"
                        : path.riskLevel === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {path.riskLevel} risk
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <ScoreRing score={path.careerFitScore} label="Career fit" />
                  <ScoreRing score={path.jobReadinessScore} label="Job readiness" />
                  <ScoreRing score={path.growthPotential} label="Growth potential" />
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    ["Time investment", path.timeRequired],
                    ["Salary potential", path.salaryPotential],
                    ["Learning curve", path.learningCurve]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-lg border border-slate-200 bg-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <ShieldAlert size={18} className="text-teal-700" />
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Skill roadmap</h3>
                    </div>
                    <ul className="space-y-3 text-sm leading-6 text-slate-600">
                      {path.skillRoadmap.map((skill) => (
                        <li key={skill} className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-teal-600" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                      {path.recommendation}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock3 size={18} className="text-teal-700" />
                      <h3 className="text-sm font-black uppercase tracking-wide">30 / 90 / 180 day plan</h3>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <PlanBlock title="30 days" items={path.plan30} />
                      <PlanBlock title="90 days" items={path.plan90} />
                      <PlanBlock title="180 days" items={path.plan180} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
