import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Clock3,
  FileText,
  GitCompare,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Sparkles,
  ScanSearch,
  Telescope
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDemoData } from "../context/DemoDataContext";

const features = [
  {
    icon: Telescope,
    title: "Career Battle Simulator",
    text: "Compare salaries, success probability, hiring difficulty, opportunity cost, SWOT, and risk across multiple futures."
  },
  {
    icon: ScanSearch,
    title: "Recruiter Intelligence Engine",
    text: "See shortlist readiness, missing evidence, interview weaknesses, and hiring probability through a recruiter's lens."
  },
  {
    icon: BrainCircuit,
    title: "Future Outcome Simulation",
    text: "Model best-case, worst-case, and most-likely outcomes before committing time, money, or momentum."
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    text: "Review transparent AI-calibrated estimates for demand, barriers, competition, salary growth, and location advantage."
  },
  {
    icon: Layers3,
    title: "Decision Scorecards",
    text: "Compare nine structured metrics with strongest, weakest, risk, readiness, and overall score signals."
  },
  {
    icon: GraduationCap,
    title: "Personalized Roadmaps",
    text: "Convert recommendations into staged skills, projects, proof-of-work, and measurable checkpoints."
  },
  {
    icon: FileText,
    title: "PDF Decision Report",
    text: "Export a clean decision report with scores, future scenarios, risks, timeline, and next steps."
  }
];

const metrics = [
  ["6", "career paths"],
  ["30/90/180", "day plans"],
  ["100", "readiness scale"]
];

const useCases = [
  "Career Selection",
  "Job Offers",
  "Startup Decisions",
  "Higher Studies",
  "Certification Choices"
];

const workflow = [
  ["Describe your goal", "Add your profile, constraints, target role, or competing choices."],
  ["Simulate multiple futures", "Model salary, probability, time, risk, and opportunity cost."],
  ["Compare outcomes", "Use structured scorecards, SWOT, and market estimates."],
  ["Receive recruiter assessment", "See readiness, evidence gaps, and hiring probability."],
  ["Get action roadmap", "Follow skills, projects, proof-of-work, and checkpoints."],
  ["Download intelligence report", "Export a consulting-style decision deliverable."]
];

const demoItems = [
  { label: "CareerReplay preview", title: "AI Engineer vs Government Exams", insights: [["Career fit", "AI Engineer scores 88/100 with portfolio-driven hiring."], ["Risk lens", "Government Exams require a 2-4 year runway with high competition."], ["Recommendation", "Run a 90-day AI portfolio sprint before fully committing."]] },
  { label: "Decision Analyzer", title: "Should I accept a startup offer?", insights: [["Best case", "Fast growth, ESOP upside, and leadership exposure within 12 months."], ["Risk", "Verify startup runway before accepting the financial uncertainty."], ["Next step", "Request six-month finances and validate the founding team."]] },
  { label: "Option Compare", title: "Data Science vs Software Engineering", insights: [["Data Science", "Strong salary ceiling when statistics meets domain expertise."], ["Software Engineering", "Broader fresher demand and faster portfolio validation."], ["Winner", "Software Engineering offers better near-term job readiness."]] }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { loadDemoData } = useDemoData();
  const [demoIndex, setDemoIndex] = useState(0);
  useEffect(() => {
    const interval = window.setInterval(() => setDemoIndex((index) => (index + 1) % demoItems.length), 4000);
    return () => window.clearInterval(interval);
  }, []);
  const activeDemo = demoItems[demoIndex];

  return (
    <div className="bg-slate-950 text-white">
      <section className="landing-hero-shell relative overflow-hidden border-b border-white/10">
        <div className="landing-hero-backdrop absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.96)_46%,rgba(20,184,166,0.18))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-white/10 px-4 py-2 text-sm font-black text-teal-100 backdrop-blur">
              <Sparkles size={16} />
              Bharat Academix CodeQuest-ready MVP
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              LifeReplay AI
            </h1>
            <p className="mt-5 max-w-2xl text-2xl font-bold leading-9 text-teal-100">
              Career Decision Intelligence Platform
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Replay your future before making life-changing career decisions. Built for students, freshers, career
              switchers, and young professionals who need clarity before committing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/career-replay"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-teal-200"
              >
                Try CareerReplay <ArrowRight size={18} />
              </Link>
              <Link
                to="/analyze"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Analyze a decision
              </Link>
              <button
                type="button"
                onClick={() => { loadDemoData(); navigate("/future-simulation"); }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
              >
                <Sparkles size={18} /> Try with demo data
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="rounded-2xl bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-teal-200">{activeDemo.label}</p>
                  <h2 className="mt-2 text-2xl font-black">{activeDemo.title}</h2>
                </div>
                <Layers3 className="h-10 w-10 text-teal-300" />
              </div>
              <div className="mt-6 grid gap-3">
                {activeDemo.insights.map(([label, text]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-teal-200">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-100">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-2">{demoItems.map((item, index) => <button key={item.label} type="button" aria-label={`Show ${item.label}`} onClick={() => setDemoIndex(index)} className={`h-2 rounded-full transition-all ${index === demoIndex ? "w-6 bg-teal-300" : "w-2 bg-white/30"}`} />)}</div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {metrics.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-sm font-semibold text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-700">Problem</p>
              <h2 className="mt-3 text-3xl font-black">Young people make high-stakes career choices with low-quality signals.</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Advice is scattered across family opinions, social media, peers, and incomplete market information.
                LifeReplay AI gives students a structured way to test paths before time, money, and momentum are spent.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {useCases.map((useCase) => (
                <div key={useCase} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  <span className="font-bold text-slate-800">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-700">Why LifeReplay AI is Different</p>
            <h2 className="mt-3 text-3xl font-black">A decision intelligence system, not a generic chatbot.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-950 text-teal-200">
                  <feature.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-700">How It Works</p>
            <h2 className="mt-3 text-3xl font-black">Six steps from uncertainty to evidence-backed action.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {workflow.map(([title, text], index) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-black text-teal-200">
                  {index + 1}
                </span>
                <h3 className="mt-5 font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            [Clock3, "Timeline intelligence", "Understand what a decision could mean at 6 months, 1 year, 3 years, and 5 years."],
            [BarChart3, "Analytics dashboard", "Track decisions, confidence, opportunity, risk distribution, and recent analyses."],
            [BrainCircuit, "Gemini with fallback", "Use Gemini when configured, while mock intelligence keeps demos reliable offline."]
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <Icon className="h-7 w-7 text-teal-700" />
              <h3 className="mt-5 text-xl font-black">{title as string}</h3>
              <p className="mt-3 leading-7 text-slate-600">{text as string}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
