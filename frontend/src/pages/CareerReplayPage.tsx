import { BriefcaseBusiness, CheckCircle2, Clock3, FileText, GraduationCap, Loader2, Plus, Route, ShieldAlert, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { MarketIntelligencePanel, RiskMatrixPanel, ScorecardPanel, SwotPanel, WhyRecommendation } from "../components/IntelligencePanels";
import { ScoreRing } from "../components/ScoreRing";
import { SectionHeader } from "../components/SectionHeader";
import { CareerReplaySkeleton } from "../components/Skeleton";
import { replayCareers } from "../services/api";
import type { CareerPath, CareerReplayResult } from "../types";
import { useDemoData } from "../context/DemoDataContext";
import { demoCareerReplay } from "../data/demoData";

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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
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

export default function CareerReplayPage() {
  const [selected, setSelected] = useState<CareerPath[]>(defaultSelected);
  const [background, setBackground] = useState(
    "I am a final-year engineering student with basic web development skills and interest in AI products."
  );
  const [result, setResult] = useState<CareerReplayResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customPath, setCustomPath] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const { demoMode } = useDemoData();
  useEffect(() => {
    if (demoMode) {
      setSelected(["Software Engineer", "Higher Studies"]);
      setBackground("Demo Data: final-year CSE student with full-stack projects deciding between work and higher studies.");
      setResult(demoCareerReplay);
    } else if (result?.id === "demo-career") {
      setResult(null);
    }
  }, [demoMode, result]);

  function togglePath(path: CareerPath) {
    setSelected((current) =>
      current.includes(path) ? current.filter((item) => item !== path) : current.length < 6 ? [...current, path] : current
    );
  }

  function addCustomPath() {
    const trimmed = customPath.trim();
    if (!trimmed || selected.includes(trimmed) || selected.length >= 6) return;
    setSelected((current) => [...current, trimmed]);
    setCustomPath("");
  }

  async function handleResumeUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setExtracting(true);
    setError("");
    try {
      if (file.type === "text/plain") {
        setBackground((await file.text()).slice(0, 1000));
      } else if (file.type === "application/pdf") {
        type TextItem = { str?: string };
        type PdfModule = {
          version: string;
          GlobalWorkerOptions: { workerSrc: string };
          getDocument: (source: { data: ArrayBuffer }) => { promise: Promise<{ numPages: number; getPage: (page: number) => Promise<{ getTextContent: () => Promise<{ items: TextItem[] }> }> }> };
        };
        const moduleUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
        const pdfjs = await import(/* @vite-ignore */ moduleUrl) as PdfModule;
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        let extracted = "";
        for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, 3); pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          extracted += `${content.items.map((item) => item.str ?? "").join(" ")} `;
        }
        setBackground(extracted.trim().slice(0, 1000));
      } else {
        throw new Error("Upload a .txt or .pdf resume.");
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Resume text could not be extracted. Paste it manually instead.");
    } finally {
      setExtracting(false);
      event.target.value = "";
    }
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
      {demoMode && <div className="mt-6 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-black text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200">Demo Data — Software Engineer vs Higher Studies showcase.</div>}

      <form
        onSubmit={handleSubmit}
        className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900"
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
          <div className="mt-4 flex gap-2">
            <input value={customPath} onChange={(event) => setCustomPath(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCustomPath(); } }} placeholder="Add custom path (e.g. Civil Services, UX Designer)" className="min-w-0 flex-1 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300" maxLength={80} />
            <button type="button" onClick={addCustomPath} disabled={!customPath.trim() || selected.length >= 6} title="Add career path" className="grid h-10 w-10 place-items-center rounded-lg bg-teal-300 text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={18} /></button>
          </div>
          {selected.some((path) => !careerPaths.includes(path)) && <div className="mt-3 flex flex-wrap gap-2">{selected.filter((path) => !careerPaths.includes(path)).map((path) => <button key={path} type="button" onClick={() => togglePath(path)} className="inline-flex items-center gap-2 rounded-lg border border-teal-300/50 bg-teal-300/10 px-3 py-2 text-sm font-bold text-teal-100">{path}<X size={14} /></button>)}</div>}
        </div>

        <div className="p-6">
          <label htmlFor="career-background" className="text-sm font-black text-slate-800 dark:text-slate-100">
            Student / fresher background
          </label>
          <textarea
            id="career-background"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            rows={4}
            maxLength={1000}
            className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-950 shadow-sm dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              <input type="file" accept=".txt,.pdf" onChange={handleResumeUpload} className="sr-only" />
              {extracting ? <Loader2 className="animate-spin" size={14} /> : <FileText size={14} />}
              {resumeFile ? resumeFile.name : "Upload resume (.txt or .pdf)"}
            </label>
            {resumeFile && <button type="button" onClick={() => { setResumeFile(null); setBackground(""); }} className="text-xs font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300">Remove</button>}
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{background.length}/1000</span>
          </div>
          {error && <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
          <div className="mt-5">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Route size={18} />}
              {loading ? "Replaying careers" : "Generate CareerReplay"}
            </Button>
          </div>
        </div>
      </form>

      {loading && <CareerReplaySkeleton />}

      {result && (
        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-950/40">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-800 dark:text-teal-200">Final recommendation</p>
            <p className="mt-3 text-lg font-semibold leading-8 text-slate-800 dark:text-slate-100">{result.finalRecommendation}</p>
          </div>
          <WhyRecommendation title={result.paths.slice().sort((a, b) => b.scorecard.overallScore - a.scorecard.overallScore)[0]?.path ?? "Recommended path"} reasons={result.whyRecommendation} />

          <div className="grid gap-6">
            {result.paths.map((path) => (
              <article key={path.path} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white">
                        <BriefcaseBusiness size={20} />
                      </span>
                      <div>
                        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">{path.path}</h2>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{path.timeRequired}</p>
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
                    <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                    <div className="mb-3 flex items-center gap-2">
                      <ShieldAlert size={18} className="text-teal-700 dark:text-teal-400" />
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-700 dark:text-slate-200">Skill roadmap</h3>
                    </div>
                    <ul className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {path.skillRoadmap.map((skill) => (
                        <li key={skill} className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-teal-600" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      {path.recommendation}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
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
                <div className="mt-6 space-y-4"><ScorecardPanel scorecard={path.scorecard} /><MarketIntelligencePanel market={path.marketIntelligence} /><SwotPanel swot={path.swot} /><RiskMatrixPanel risks={path.riskMatrix} /></div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
