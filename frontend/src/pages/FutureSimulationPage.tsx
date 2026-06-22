import { ArrowRight, Loader2, Plus, Telescope, Trash2, Trophy } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { RiskMatrixPanel, ScorecardPanel, SwotPanel, WhyRecommendation } from "../components/IntelligencePanels";
import { SectionHeader } from "../components/SectionHeader";
import { simulateFutures } from "../services/api";
import type { FutureSimulationResult } from "../types";

export default function FutureSimulationPage() {
  const [scenarios, setScenarios] = useState(["AI Engineer", "Government Exams", "Higher Studies"]);
  const [profile, setProfile] = useState("Final-year CSE student with Python, React, two academic projects, and no internship experience.");
  const [result, setResult] = useState<FutureSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateScenario(index: number, value: string) { setScenarios((items) => items.map((item, itemIndex) => itemIndex === index ? value : item)); }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(""); setResult(null);
    if (scenarios.filter((item) => item.trim().length >= 2).length < 2) { setError("Add at least two valid scenarios."); return; }
    setLoading(true);
    try { setResult(await simulateFutures(scenarios.map((item) => item.trim()).filter(Boolean), profile.trim())); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to simulate these futures."); }
    finally { setLoading(false); }
  }

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <SectionHeader eyebrow="Future Outcome Simulation" title="Compare the futures behind each career choice." description="Model salary, success probability, hiring difficulty, opportunity cost, scorecards, SWOT, and risk in one intelligence view." />
    <form onSubmit={handleSubmit} className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="bg-slate-950 p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-sm font-black uppercase tracking-[0.2em] text-teal-300">Scenario lab</p><h2 className="mt-2 text-2xl font-black">Build the comparison set</h2></div><Telescope className="h-9 w-9 text-teal-300" /></div><div className="mt-5 grid gap-3 md:grid-cols-3">{scenarios.map((scenario, index) => <div key={index} className="flex gap-2"><input aria-label={`Scenario ${index + 1}`} value={scenario} onChange={(event) => updateScenario(index, event.target.value)} className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-teal-300" maxLength={80} />{scenarios.length > 2 && <button type="button" title="Remove scenario" onClick={() => setScenarios((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 text-slate-300 hover:bg-white/10"><Trash2 size={16} /></button>}</div>)}</div>{scenarios.length < 4 && <button type="button" onClick={() => setScenarios((items) => [...items, ""])} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-teal-200"><Plus size={16} /> Add scenario</button>}</div>
      <div className="p-6"><label htmlFor="simulation-profile" className="text-sm font-black text-slate-800">Profile and constraints</label><textarea id="simulation-profile" rows={4} maxLength={1500} value={profile} onChange={(event) => setProfile(event.target.value)} className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 leading-7 text-slate-950 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" />{error && <p className="mt-3 rounded-md bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}<Button type="submit" disabled={loading} className="mt-5">{loading ? <Loader2 className="animate-spin" size={18} /> : <Telescope size={18} />}{loading ? "Simulating outcomes" : "Simulate future paths"}</Button></div>
    </form>

    {result && <section className="mt-8 space-y-6"><WhyRecommendation title={`${result.bestScenario} is the strongest scenario`} reasons={result.reasoning} />
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-950 text-white"><tr><th className="p-4">Scenario</th><th className="p-4">1-year salary</th><th className="p-4">3-year salary</th><th className="p-4">Success</th><th className="p-4">Hiring</th><th className="p-4">Risk</th><th className="p-4">Overall</th></tr></thead><tbody>{result.scenarios.map((scenario) => <tr key={scenario.name} className="border-t border-slate-100"><td className="p-4 font-black text-slate-950">{scenario.name}{scenario.name === result.bestScenario && <Trophy className="ml-2 inline text-teal-600" size={16} />}</td><td className="p-4 text-slate-600">{scenario.salaryAfterOneYear}</td><td className="p-4 text-slate-600">{scenario.salaryAfterThreeYears}</td><td className="p-4 font-black text-teal-700">{scenario.successProbability}%</td><td className="p-4">{scenario.hiringDifficulty}</td><td className="p-4">{scenario.riskLevel}</td><td className="p-4 font-black">{scenario.scorecard.overallScore}</td></tr>)}</tbody></table></div>
      {result.scenarios.map((scenario) => <article key={scenario.name} className="space-y-5 border-t border-slate-200 pt-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Scenario intelligence</p><h2 className="mt-2 text-3xl font-black text-slate-950">{scenario.name}</h2></div><span className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">{scenario.successProbability}% success probability</span></div><div className="grid gap-4 lg:grid-cols-3"><div className="rounded-md border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase text-slate-500">Time and financial impact</p><p className="mt-3 font-bold text-slate-950">{scenario.timeInvestment}</p><p className="mt-2 text-sm leading-6 text-slate-600">{scenario.financialImpact}</p></div><div className="rounded-md border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase text-slate-500">Opportunity cost</p><p className="mt-3 text-sm leading-6 text-slate-700">{scenario.opportunityCost}</p></div><div className="rounded-md border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase text-slate-500">Final outlook</p><p className="mt-3 text-sm leading-6 text-slate-700">{scenario.finalOutlook}</p></div></div><ScorecardPanel scorecard={scenario.scorecard} /><SwotPanel swot={scenario.swot} /><RiskMatrixPanel risks={scenario.riskMatrix} /><div className="rounded-md bg-slate-950 p-5 text-white"><p className="text-xs font-black uppercase tracking-wide text-teal-300">Career impact</p><p className="mt-3 leading-7 text-slate-200">{scenario.careerImpact}</p><ul className="mt-4 grid gap-2 md:grid-cols-3">{scenario.skillsRequired.map((skill) => <li key={skill} className="flex gap-2 text-sm text-slate-300"><ArrowRight className="mt-1 h-4 w-4 flex-none text-teal-300" />{skill}</li>)}</ul></div></article>)}
    </section>}
  </div>;
}
