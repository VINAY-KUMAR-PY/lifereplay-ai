import { CheckCircle2, Download, Flag, Loader2, ScanSearch, Target, XCircle } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ScoreRing } from "../components/ScoreRing";
import { SectionHeader } from "../components/SectionHeader";
import { RecruiterViewSkeleton } from "../components/Skeleton";
import { generateRecruiterView } from "../services/api";
import type { RecruiterViewResult } from "../types";
import { useDemoData } from "../context/DemoDataContext";
import { demoRecruiterView } from "../data/demoData";
import { downloadRecruiterIntelligenceReport } from "../utils/pdf";

function GapPanel({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black text-slate-950">{title}</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">{items.map((item) => <li key={item} className="flex gap-2"><XCircle className="mt-1 h-4 w-4 flex-none text-rose-500" />{item}</li>)}</ul></div>;
}

export default function RecruiterViewPage() {
  const [targetRole, setTargetRole] = useState("AI Engineer");
  const [profile, setProfile] = useState("CSE graduate. Basic Python and React. Built two academic projects. No internships. Comfortable with APIs but limited DSA and system design practice.");
  const [result, setResult] = useState<RecruiterViewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { demoMode } = useDemoData();
  useEffect(() => { if (demoMode) { setTargetRole("AI Engineer"); setProfile("Demo Data: CSE graduate with Python, React, two projects, no internships, and basic API experience."); setResult(demoRecruiterView); } else if (result?.id === "demo-recruiter") setResult(null); }, [demoMode]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(""); setResult(null);
    if (profile.trim().length < 20) { setError("Add education, skills, projects, internships, and experience details."); return; }
    setLoading(true);
    try { setResult(await generateRecruiterView(targetRole.trim(), profile.trim())); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to generate recruiter assessment."); }
    finally { setLoading(false); }
  }

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <SectionHeader eyebrow="Recruiter Intelligence Engine" title="See what a recruiter sees in your profile." description="Measure shortlist readiness, evidence gaps, interview risk, hiring probability, and the exact proof needed for a target role." />
    {demoMode && <div className="mt-6 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-black text-teal-800">Demo Data — CSE Graduate targeting AI Engineer.</div>}
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.38fr_1fr]">
      <div><label htmlFor="target-role" className="text-sm font-black text-slate-800">Target role</label><input id="target-role" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} maxLength={100} className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" /></div>
      <div><label htmlFor="recruiter-profile" className="text-sm font-black text-slate-800">Education, skills, projects, internships, and experience</label><textarea id="recruiter-profile" rows={5} maxLength={2000} value={profile} onChange={(event) => setProfile(event.target.value)} className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 leading-7 text-slate-950 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" /></div>
      {error && <p role="alert" className="rounded-md bg-rose-50 p-3 text-sm font-bold text-rose-700 lg:col-span-2">{error}</p>}
      <Button type="submit" disabled={loading} className="lg:col-span-2 lg:justify-self-start">{loading ? <Loader2 className="animate-spin" size={18} /> : <ScanSearch size={18} />}{loading ? "Reviewing profile" : "Generate recruiter assessment"}</Button>
    </form>

    {loading && <RecruiterViewSkeleton />}

    {result && <section className="mt-8 space-y-6"><div className="flex justify-end"><Button type="button" variant="secondary" onClick={() => downloadRecruiterIntelligenceReport(result)}><Download size={17} />Download Recruiter Report</Button></div>
      <div className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]"><ScoreRing score={result.readinessScore} label="Recruiter readiness" /><div className="rounded-md bg-slate-950 p-6 text-white"><div className="flex items-center gap-2 text-teal-300"><Target size={18} /><p className="text-xs font-black uppercase tracking-[0.18em]">Recruiter verdict</p></div><h2 className="mt-3 text-2xl font-black">{result.targetRole}</h2><p className="mt-4 leading-7 text-slate-200">{result.recruiterVerdict}</p></div></div>
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black text-slate-950">Hiring probability</h3><div className="mt-5 grid gap-5 md:grid-cols-3">{[["3 months", result.hiringProbability.threeMonths], ["6 months", result.hiringProbability.sixMonths], ["12 months", result.hiringProbability.twelveMonths]].map(([label, score]) => <div key={label as string}><div className="mb-2 flex justify-between text-sm font-bold"><span>{label as string}</span><span>{score as number}%</span></div><div className="h-3 rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500" style={{ width: `${score as number}%` }} /></div></div>)}</div></div>
      <div className="grid gap-4 md:grid-cols-2"><GapPanel title="Missing skills" items={result.missingSkills} /><GapPanel title="Missing projects" items={result.missingProjects} /><GapPanel title="Resume gaps" items={result.resumeGaps} /><GapPanel title="Interview weaknesses" items={result.interviewWeaknesses} /></div>
      <div className="rounded-md border border-teal-200 bg-teal-50 p-6"><p className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">Top five improvements ranked by impact</p><ol className="mt-4 grid gap-3 md:grid-cols-5">{result.improvementPlan.map((item, index) => <li key={item.action} className="rounded-md bg-white p-4 text-sm leading-6 text-slate-700"><div className="mb-3 flex items-center justify-between gap-2"><CheckCircle2 className="text-teal-600" size={18} /><span className={`rounded px-2 py-1 text-[10px] font-black ${item.impact === "High Impact" ? "bg-rose-100 text-rose-700" : item.impact === "Medium Impact" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{item.impact}</span></div><span className="font-black text-slate-950">{index + 1}. </span>{item.action}</li>)}</ol></div>
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><Flag className="text-teal-700" size={19} /><div><p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Personalized Roadmap</p><h3 className="mt-1 text-xl font-black text-slate-950">From current profile to proof-of-work</h3></div></div><div className="mt-5 grid gap-3 lg:grid-cols-5">{result.personalizedRoadmap.map((step) => <article key={step.period} className="rounded-md border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-black text-slate-950">{step.period}</p><p className="mt-3 text-xs font-black uppercase text-slate-500">Skill focus</p><p className="mt-1 text-sm leading-6 text-slate-700">{step.skillFocus}</p><p className="mt-3 text-xs font-black uppercase text-slate-500">Project / task</p><p className="mt-1 text-sm leading-6 text-slate-700">{step.projectTask}</p><p className="mt-3 text-xs font-black uppercase text-slate-500">Proof of work</p><p className="mt-1 text-sm leading-6 text-slate-700">{step.proofOfWork}</p><p className="mt-3 border-t border-slate-200 pt-3 text-xs font-bold leading-5 text-teal-800">Checkpoint: {step.evaluationCheckpoint}</p></article>)}</div></div>
    </section>}
  </div>;
}
