import { nanoid } from "nanoid";
import type {
  AnalysisResult,
  CareerPath,
  CareerPathReplay,
  CareerReplayResult,
  ComparisonResult,
  RiskCategory
} from "./types.js";

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function inferRiskCategory(text: string): RiskCategory {
  const lower = text.toLowerCase();
  if (/(salary|money|loan|fund|income|cost|finance|business|startup)/.test(lower)) return "Financial";
  if (/(career|job|role|promotion|interview|engineering|science|data)/.test(lower)) return "Career";
  if (/(health|family|city|relationship|stress|personal)/.test(lower)) return "Personal";
  if (/(course|degree|learn|skill|college|study)/.test(lower)) return "Learning";
  return "Market";
}

export function createMockAnalysis(decision: string): AnalysisResult {
  const category = inferRiskCategory(decision);
  const baseScore = category === "Career" || category === "Learning" ? 78 : 72;
  const confidenceScore = clampScore(baseScore + Math.min(decision.length, 80) / 8);
  const opportunityScore = clampScore(confidenceScore + 6);
  const createdAt = new Date().toISOString();

  return {
    id: nanoid(),
    decision,
    createdAt,
    bestCaseFuture: `You make a focused, well-researched version of this decision and turn "${decision}" into a compounding advantage. You validate assumptions early, build proof through projects or milestones, and create stronger career optionality within the next year.`,
    worstCaseFuture: "The decision is made too quickly, without testing constraints, cost, or emotional fit. Progress slows because the path demands skills, capital, or support systems that were not planned in advance.",
    mostLikelyFuture: "The most realistic path is positive but uneven. You gain clarity after the first few months, face a few trade-offs, and succeed if you review progress every 30 days instead of treating the choice as permanent.",
    confidenceScore,
    confidenceExplanation: `Confidence is ${confidenceScore}/100 because the decision has clear upside, but the final outcome depends on execution quality, market context, mentorship, and how quickly you test assumptions.`,
    careerRisks: [
      "Choosing a path based on trend popularity instead of day-to-day work fit.",
      "Underestimating the portfolio, networking, or interview preparation required.",
      "Delaying feedback from mentors, recruiters, customers, or domain experts."
    ],
    financialRisks: [
      "Possible short-term income dip while building skills or switching direction.",
      "Training, certification, relocation, or tooling costs may be higher than expected.",
      "Opportunity cost if the chosen path takes longer to produce measurable returns."
    ],
    personalRisks: [
      "Decision fatigue if too many goals are pursued at once.",
      "Stress from comparing progress with peers on different timelines.",
      "Loss of motivation if early results are treated as final judgment."
    ],
    opportunityScore,
    recommendedNextSteps: [
      "Define success metrics for the next 30, 90, and 180 days.",
      "Speak to three people already living each likely outcome.",
      "Run a small experiment before making an irreversible commitment.",
      "Track energy, learning speed, and external feedback every week."
    ],
    timeline: [
      {
        period: "6 months",
        outlook: "You should have enough evidence from experiments, projects, interviews, or market feedback to know whether the path deserves deeper commitment.",
        milestone: "Complete one proof-of-work project and collect external feedback.",
        riskLevel: "Medium"
      },
      {
        period: "1 year",
        outlook: "The decision begins to show practical returns if you have built consistency and a visible track record.",
        milestone: "Convert the decision into a role, offer, launch, certification, or measurable portfolio result.",
        riskLevel: "Medium"
      },
      {
        period: "3 years",
        outlook: "Skill compounding becomes visible. You may have stronger bargaining power, better clarity, and a more differentiated profile.",
        milestone: "Reach an advanced specialization or leadership-ready stage.",
        riskLevel: "Low"
      },
      {
        period: "5 years",
        outlook: "The decision can become a major identity and income anchor if you continue adapting to market changes.",
        milestone: "Own a niche, business line, senior role, or strong professional brand.",
        riskLevel: "Low"
      }
    ],
    actionPlan: {
      immediate: [
        "Write down the decision criteria and non-negotiables.",
        "List the top three assumptions that must be true.",
        "Schedule one conversation with someone experienced in this path."
      ],
      thirtyDay: [
        "Run a structured trial project or shadowing sprint.",
        "Compare time, cost, energy, and learning curve data.",
        "Create a simple scorecard and review it weekly."
      ],
      ninetyDay: [
        "Build a portfolio artifact or measurable proof point.",
        "Ask for feedback from mentors and target users or employers.",
        "Decide whether to deepen, pivot, or pause the path."
      ],
      longTerm: [
        "Invest in advanced skills and credibility signals.",
        "Build a network around the chosen domain.",
        "Review the decision every six months as markets and priorities shift."
      ]
    },
    summary: `A promising decision with manageable risk if you test assumptions early and build proof before fully committing.`,
    dominantRiskCategory: category
  };
}

export function createMockComparison(optionA: string, optionB: string): ComparisonResult {
  const aLower = optionA.toLowerCase();
  const bLower = optionB.toLowerCase();
  const betterOption = /data|ai|science|business|startup/.test(aLower) && !/data|ai|science|business|startup/.test(bLower)
    ? optionA
    : bLower.length > aLower.length
      ? optionB
      : optionA;

  return {
    id: nanoid(),
    optionA,
    optionB,
    createdAt: new Date().toISOString(),
    prosA: [
      `${optionA} may create a clear specialization and faster identity building.`,
      "It can be easier to validate with a short trial project.",
      "The path may provide strong learning momentum if it matches your strengths."
    ],
    consA: [
      "It may narrow optionality if chosen without enough market testing.",
      "The early learning curve could be steeper than expected.",
      "Results may depend heavily on mentorship and execution consistency."
    ],
    prosB: [
      `${optionB} may provide a broader safety net and different growth routes.`,
      "It can reduce regret if it aligns with your current constraints.",
      "The option may be easier to explain to family, employers, or collaborators."
    ],
    consB: [
      "It may feel safer while offering less differentiation.",
      "Delayed experimentation could hide whether the option is truly satisfying.",
      "It may require extra effort to stand out from similar candidates or competitors."
    ],
    finalRecommendation: `Choose ${betterOption} if your 90-day test confirms energy, demand, and measurable progress. Keep the other option as a backup experiment until you have stronger evidence.`,
    riskComparison: `${optionA} carries higher execution risk, while ${optionB} carries higher regret risk if it is chosen mainly for comfort. The better choice is the one you can validate fastest with real-world feedback.`,
    betterOption,
    explanation: `${betterOption} appears stronger for an MVP recommendation because it offers clearer momentum, stronger proof-building potential, and a better path to visible outcomes within 90 days.`
  };
}

const careerProfiles: Record<CareerPath, Omit<CareerPathReplay, "path">> = {
  "AI Engineer": {
    careerFitScore: 88,
    jobReadinessScore: 74,
    growthPotential: 92,
    salaryPotential: "High: strong upside in product AI, automation, and applied LLM roles",
    learningCurve: "Steep",
    timeRequired: "6-9 months for entry-level readiness with a strong project portfolio",
    riskLevel: "Medium",
    skillRoadmap: [
      "Python, data structures, APIs, and Git fundamentals",
      "Machine learning basics, prompt engineering, embeddings, and LLM app patterns",
      "Build 3 deployed AI products with evaluation, guardrails, and clear documentation"
    ],
    plan30: [
      "Finish Python/TypeScript fundamentals and ship one AI utility project",
      "Study LLM APIs, prompt design, JSON validation, and fallback handling"
    ],
    plan90: [
      "Build a portfolio app using Gemini or OpenAI with authentication-ready architecture",
      "Practice system design, model evaluation, and production debugging"
    ],
    plan180: [
      "Apply for AI engineering internships or junior roles with 3 polished demos",
      "Contribute to an open-source AI tool or publish technical case studies"
    ],
    recommendation:
      "Strong option if you enjoy building products, APIs, and applied AI systems more than pure theory."
  },
  "Data Scientist": {
    careerFitScore: 82,
    jobReadinessScore: 68,
    growthPotential: 86,
    salaryPotential: "Medium to High: strongest when paired with domain expertise and analytics storytelling",
    learningCurve: "Moderate",
    timeRequired: "7-10 months for solid analyst-to-junior data science readiness",
    riskLevel: "Medium",
    skillRoadmap: [
      "Statistics, SQL, Python, pandas, visualization, and experiment thinking",
      "Regression, classification, forecasting, model validation, and storytelling",
      "Domain projects with dashboards, notebooks, and business recommendations"
    ],
    plan30: ["Complete SQL and pandas practice", "Analyze two public datasets with clear business insights"],
    plan90: ["Build a forecasting or recommendation project", "Create a portfolio with notebooks and dashboards"],
    plan180: ["Apply for data analyst/data science internships", "Practice case studies and metric interpretation"],
    recommendation:
      "Best if you enjoy analysis, evidence, business questions, and explaining patterns to decision makers."
  },
  "Software Engineer": {
    careerFitScore: 86,
    jobReadinessScore: 78,
    growthPotential: 88,
    salaryPotential: "High: broad fresher demand with strong long-term senior engineering upside",
    learningCurve: "Moderate",
    timeRequired: "5-8 months for fresher-level readiness with disciplined DSA and projects",
    riskLevel: "Low",
    skillRoadmap: [
      "Data structures, algorithms, JavaScript/TypeScript, React, Node.js, and databases",
      "Testing, Git workflows, deployment, API design, and clean code",
      "Two full-stack projects with real users or measurable usage"
    ],
    plan30: ["Set a daily DSA routine", "Build one polished full-stack feature end to end"],
    plan90: ["Ship a production-style app with auth-ready APIs", "Practice interviews and code reviews"],
    plan180: ["Apply broadly to fresher roles", "Refine resume around deployed projects and impact metrics"],
    recommendation:
      "Most stable choice if you want broad job options and can sustain project-building plus interview prep."
  },
  "Government Exams": {
    careerFitScore: 70,
    jobReadinessScore: 55,
    growthPotential: 72,
    salaryPotential: "Stable: predictable benefits if selected, but high opportunity cost during preparation",
    learningCurve: "Steep",
    timeRequired: "12-24 months depending on exam level, consistency, and competition",
    riskLevel: "High",
    skillRoadmap: [
      "Syllabus mastery, current affairs, quantitative aptitude, reasoning, and writing practice",
      "Mock tests, mistake logs, revision cycles, and time management",
      "Backup employability plan to protect opportunity cost"
    ],
    plan30: ["Pick one target exam and map the syllabus", "Take a baseline mock test and identify weak areas"],
    plan90: ["Complete first syllabus pass", "Build weekly mock-test and revision discipline"],
    plan180: ["Reach timed-test consistency", "Create a backup plan for internships, skills, or alternate exams"],
    recommendation:
      "Choose this only if you have strong discipline, family support, and a clear backup path."
  },
  "Startup Founder": {
    careerFitScore: 76,
    jobReadinessScore: 62,
    growthPotential: 90,
    salaryPotential: "Variable: low early certainty with very high upside if traction compounds",
    learningCurve: "Steep",
    timeRequired: "3-6 months to validate; 12+ months to build a credible venture path",
    riskLevel: "High",
    skillRoadmap: [
      "Customer discovery, MVP building, sales, pricing, product analytics, and storytelling",
      "Lean experiments, landing pages, user interviews, and retention metrics",
      "Basic finance, legal awareness, and founder resilience"
    ],
    plan30: ["Interview 20 potential users", "Launch a landing page or no-code MVP"],
    plan90: ["Ship a usable MVP and measure retention", "Test pricing or pilot partnerships"],
    plan180: ["Decide to continue, pivot, or pause based on traction", "Build a financial runway plan"],
    recommendation:
      "High-upside path if you can tolerate uncertainty and validate demand before overbuilding."
  },
  "Higher Studies": {
    careerFitScore: 79,
    jobReadinessScore: 60,
    growthPotential: 80,
    salaryPotential: "Medium to High: depends on institution, specialization, funding, and post-degree placement",
    learningCurve: "Moderate",
    timeRequired: "9-18 months for exam prep, applications, funding, and transition",
    riskLevel: "Medium",
    skillRoadmap: [
      "Entrance exams, academic projects, SOP/profile building, and recommendation planning",
      "Scholarship research, financial planning, and specialization selection",
      "Research or internship proof aligned with the target program"
    ],
    plan30: ["Shortlist programs and exam requirements", "Estimate cost, funding, and expected career return"],
    plan90: ["Start test prep and strengthen academic projects", "Connect with alumni from target programs"],
    plan180: ["Finalize applications and funding strategy", "Build a transition plan for skills and internships"],
    recommendation:
      "Good choice if the degree directly compounds your target career and the financial plan is realistic."
  }
};

export function createMockCareerReplay(paths: CareerPath[], background = ""): CareerReplayResult {
  const selected: CareerPath[] = paths.length ? paths : ["AI Engineer", "Software Engineer", "Data Scientist"];
  const profiles = selected.map((path) => {
    const base = careerProfiles[path];
    const backgroundBoost = background.toLowerCase().includes(path.toLowerCase().split(" ")[0]) ? 4 : 0;
    return {
      path,
      ...base,
      careerFitScore: clampScore(base.careerFitScore + backgroundBoost),
      jobReadinessScore: clampScore(base.jobReadinessScore + Math.floor(backgroundBoost / 2))
    };
  });
  const best = [...profiles].sort((a, b) => b.careerFitScore + b.jobReadinessScore - (a.careerFitScore + a.jobReadinessScore))[0];

  return {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    paths: profiles,
    finalRecommendation: `${best.path} is the strongest near-term path because it balances fit, readiness, and practical execution risk. Use the 30/90/180 day plan to validate it before making a long-term commitment.`
  };
}
