import { ArrowRight, BarChart3, BrainCircuit, Clock3, GitCompare, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: BrainCircuit,
    title: "Decision Analyzer",
    text: "Simulate best-case, worst-case, and most-likely futures with risk categories and confidence scoring."
  },
  {
    icon: Clock3,
    title: "Future Timeline",
    text: "See what a decision may look like across 6 months, 1 year, 3 years, and 5 years."
  },
  {
    icon: GitCompare,
    title: "Option Comparison",
    text: "Compare two paths with pros, cons, risk trade-offs, and a final recommendation."
  },
  {
    icon: BarChart3,
    title: "Decision Dashboard",
    text: "Track total decisions, confidence trends, risk patterns, and recent analyses."
  }
];

const signals = [
  "Career switches",
  "Higher studies",
  "Startup ideas",
  "Job offers",
  "Skill investments",
  "Financial trade-offs"
];

export default function LandingPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-[linear-gradient(135deg,#f7f8fb_0%,#eefbf8_45%,#f8fafc_100%)]">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-teal-200 bg-white px-3 py-2 text-sm font-bold text-teal-800 shadow-sm">
              <Sparkles size={16} />
              Bharat Academix CodeQuest 2026 MVP
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
              LifeReplay AI
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-slate-700">
              See possible futures before making important life decisions.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Students, job seekers, professionals, and founders can test a decision before it becomes expensive. LifeReplay AI converts uncertainty into futures, risks, timelines, and action plans.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/analyze"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Analyze a decision <ArrowRight size={18} />
              </Link>
              <Link
                to="/compare"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100"
              >
                Compare two options
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-md p-5 shadow-soft">
            <div className="rounded-md bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-teal-200">Live future simulation</p>
                  <h2 className="mt-2 text-2xl font-black">Data Science vs Software Engineering</h2>
                </div>
                <Layers3 className="h-9 w-9 text-teal-300" />
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  ["Best case", "You build a differentiated AI portfolio and enter a high-growth role."],
                  ["Most likely", "You validate both paths through projects before specializing."],
                  ["Key risk", "Choosing based on hype instead of daily work fit."]
                ].map(([label, text]) => (
                  <div key={label} className="rounded-md bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-teal-200">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-100">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["84", "Confidence"],
                ["91", "Opportunity"],
                ["4", "Timeline points"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-md border border-slate-200 bg-white p-4">
                  <p className="text-3xl font-black text-slate-950">{value}</p>
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-700">Problem</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">High-impact decisions are still made with scattered advice.</h2>
              <p className="mt-4 leading-7 text-slate-600">
                A student choosing a domain, a graduate comparing offers, or a founder deciding whether to launch needs structured scenarios, not vague motivation. LifeReplay AI makes the hidden trade-offs visible.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {signals.map((signal) => (
                <div key={signal} className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  <span className="font-bold text-slate-800">{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-700">Solution</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">A polished AI simulator built for real choices.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <feature.icon className="h-7 w-7 text-teal-700" />
                <h3 className="mt-5 text-lg font-black text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
