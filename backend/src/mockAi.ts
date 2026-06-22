import { nanoid } from "nanoid";
import type {
  AnalysisResult,
  CareerPath,
  CareerPathReplay,
  CareerReplayResult,
  ComparisonResult,
  DecisionScorecard,
  FutureSimulationResult,
  RecruiterViewResult,
  RiskMatrixItem,
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

type Topic = "ai" | "data" | "software" | "government" | "startup" | "finance" | "education" | "general";

function detectTopic(text: string): Topic {
  const lower = text.toLowerCase();
  if (/(ai engineer|machine learning|llm|deep learning|neural)/.test(lower)) return "ai";
  if (/(data scien|analytics|sql|tableau|power bi)/.test(lower)) return "data";
  if (/(software engineer|developer|coding|programming|sde)/.test(lower)) return "software";
  if (/(upsc|ssc|government|civil services|banking|ias|ips)/.test(lower)) return "government";
  if (/(startup|founder|entrepreneur|product launch|business)/.test(lower)) return "startup";
  if (/(mba|loan|finance|investment|salary hike|pay)/.test(lower)) return "finance";
  if (/(ms|masters|phd|higher studies|gre|gate|college)/.test(lower)) return "education";
  return "general";
}

const topicContext: Record<Topic, { upside: string; downside: string; likely: string; proof: string; market: string }> = {
  ai: { upside: "an applied AI portfolio opens product-engineering interviews in Bengaluru and Hyderabad", downside: "tutorial-only learning fails to prove evaluation, retrieval, and deployment skills", likely: "six focused months produce two credible LLM products and junior interview readiness", proof: "deploy an evaluated RAG or automation product with real users", market: "Python, TypeScript, APIs, vector search, evaluation, and system design" },
  data: { upside: "strong SQL, statistics, and business storytelling unlock analyst-to-data-science roles", downside: "notebook projects without business metrics blend into a crowded fresher pool", likely: "an analyst role becomes the practical bridge into modeling work", proof: "publish a SQL case study and forecasting dashboard", market: "SQL, Python, statistics, Power BI, experimentation, and domain knowledge" },
  software: { upside: "production projects plus DSA create broad entry-level options across Indian product and services firms", downside: "framework hopping leaves weak fundamentals and no finished proof", likely: "consistent interview practice and two deployed apps improve placement outcomes", proof: "ship a tested full-stack application used by real people", market: "DSA, TypeScript or Java, React, Node, databases, testing, and deployment" },
  government: { upside: "disciplined preparation converts syllabus mastery and mock performance into a competitive attempt", downside: "a two-to-four-year preparation loop creates severe opportunity cost without a backup skill", likely: "multiple attempts are needed and selection remains uncertain despite steady study", proof: "complete a timed baseline test and a 12-week score-improvement cycle", market: "UPSC, SSC, or banking syllabus depth, current affairs, mocks, revision, and a backup plan" },
  startup: { upside: "customer evidence and early revenue create a credible venture with asymmetric growth", downside: "building before validation consumes savings while demand remains unproven", likely: "the first idea changes after interviews and an MVP pilot", proof: "secure five paying users or a signed pilot before expanding", market: "customer discovery, MVP delivery, sales, pricing, retention, and runway management" },
  finance: { upside: "a quantified return and repayment plan improves income without destabilizing cash flow", downside: "optimistic salary assumptions turn debt into long-term pressure", likely: "the choice works only with conservative EMI, emergency-fund, and placement assumptions", proof: "model best, base, and downside cash flows for 24 months", market: "total cost, interest, placement probability, salary distribution, and liquidity" },
  education: { upside: "a well-chosen program compounds specialization, network, and placement access", downside: "a high-cost degree with weak outcomes delays employment and adds debt", likely: "returns depend more on institution, funding, internships, and target role than the credential alone", proof: "compare alumni outcomes, total cost, curriculum, and target-company hiring", market: "entrance preparation, SOP, funding, research proof, internships, and placement data" },
  general: { upside: "a small reversible experiment reveals fit before a large commitment", downside: "acting on assumptions creates avoidable time and financial cost", likely: "clarity improves after structured evidence and external feedback", proof: "run a 30-day trial with measurable success criteria", market: "constraints, opportunity cost, evidence, support systems, and execution consistency" }
};

export function createMockAnalysis(decision: string): AnalysisResult {
  const category = inferRiskCategory(decision);
  const topic = detectTopic(decision);
  const context = topicContext[topic];
  const baseScore = topic === "government" || topic === "startup" ? 68 : category === "Career" || category === "Learning" ? 78 : 72;
  const confidenceScore = clampScore(baseScore + Math.min(decision.length, 80) / 8);
  const opportunityScore = clampScore(confidenceScore + 6);
  const createdAt = new Date().toISOString();

  return {
    id: nanoid(),
    decision,
    createdAt,
    bestCaseFuture: `Best case: ${context.upside}. You validate the choice through ${context.proof} and build measurable momentum within 6-12 months.`,
    worstCaseFuture: `Worst case: ${context.downside}. The decision then consumes time and money before weak assumptions are discovered.`,
    mostLikelyFuture: `Most likely: ${context.likely}. Progress is uneven, but monthly evidence reviews prevent an open-ended commitment.`,
    confidenceScore,
    confidenceExplanation: `Confidence is ${confidenceScore}/100 because the decision has clear upside, but the final outcome depends on execution quality, market context, mentorship, and how quickly you test assumptions.`,
    careerRisks: [
      `Market expectations span ${context.market}.`,
      `The decision can stall without proof such as: ${context.proof}.`,
      "Entry-level competition rewards visible outcomes, referrals, and interview readiness."
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
      `Create the first proof point: ${context.proof}.`,
      `Audit readiness across ${context.market}.`,
      "Interview three people currently living the likely outcome.",
      "Set 30, 90, and 180-day stop/continue criteria.",
      "Track cost, energy, feedback, and measurable output every week."
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
    explanation: `${betterOption} appears stronger for an MVP recommendation because it offers clearer momentum, stronger proof-building potential, and a better path to visible outcomes within 90 days.`,
    whyRecommendation: [
      `${betterOption} has the clearer 90-day proof-of-work path for the options provided.`,
      "Its entry requirements can be tested before making a long-term commitment.",
      "The recommended route preserves more career optionality if market conditions change.",
      "Execution risk can be reduced through projects, practitioner feedback, and measurable milestones.",
      `The opportunity cost is lower than committing to ${betterOption === optionA ? optionB : optionA} without validation.`
    ]
  };
}

type BaseCareerProfile = Omit<CareerPathReplay, "path" | "scorecard" | "swot" | "riskMatrix" | "marketIntelligence">;

const careerProfiles: Record<string, BaseCareerProfile> = {
  "AI Engineer": {
    careerFitScore: 88,
    jobReadinessScore: 62,
    growthPotential: 91,
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
    careerFitScore: 83,
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
    careerFitScore: 79,
    jobReadinessScore: 85,
    growthPotential: 76,
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
    careerFitScore: 71,
    jobReadinessScore: 45,
    growthPotential: 55,
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
    careerFitScore: 74,
    jobReadinessScore: 38,
    growthPotential: 94,
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
    careerFitScore: 77,
    jobReadinessScore: 72,
    growthPotential: 81,
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

function stableScore(seed: string, offset: number, min: number, max: number): number {
  const hash = seed.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
  return min + (Math.abs(hash + offset) % (max - min + 1));
}

function createGenericCareerProfile(path: string): BaseCareerProfile {
  return {
    careerFitScore: stableScore(path, 11, 64, 86),
    jobReadinessScore: stableScore(path, 29, 48, 79),
    growthPotential: stableScore(path, 47, 62, 90),
    salaryPotential: "Market dependent: validate entry-level demand, location, credentials, and portfolio strength",
    learningCurve: stableScore(path, 5, 0, 2) === 0 ? "Beginner Friendly" : stableScore(path, 5, 0, 2) === 1 ? "Moderate" : "Steep",
    timeRequired: "6-12 months for credible entry-level proof, depending on current transferable skills",
    riskLevel: stableScore(path, 17, 0, 2) === 0 ? "Low" : stableScore(path, 17, 0, 2) === 1 ? "Medium" : "High",
    skillRoadmap: [
      `Map the core skills and entry-level hiring criteria for ${path}`,
      `Build one practical ${path} proof-of-work project with external feedback`,
      "Develop interview, communication, networking, and market-research discipline"
    ],
    plan30: ["Interview three practitioners and map the skill gap", "Complete a focused foundation sprint"],
    plan90: ["Ship a portfolio-quality project", "Collect mentor or recruiter feedback and revise"],
    plan180: ["Apply to realistic entry roles or programs", "Review outcomes and deepen or pivot based on evidence"],
    recommendation: `${path} is viable as a testable path. Validate actual hiring demand and personal fit before making an irreversible commitment.`
  };
}

function createScorecard(path: string, fit: number, readiness: number, growth: number, risk: "Low" | "Medium" | "High"): DecisionScorecard {
  const riskScore = risk === "Low" ? 82 : risk === "Medium" ? 62 : 38;
  const demand = stableScore(path, 13, 58, 94);
  const salary = stableScore(path, 31, 56, 92);
  const stability = stableScore(path, 43, 52, 91);
  const competition = stableScore(path, 59, 35, 78);
  const learning = stableScore(path, 71, 44, 86);
  return {
    marketDemand: demand, learningCurve: learning, risk: riskScore, salaryPotential: salary,
    competition, stability, growthPotential: growth, jobReadiness: readiness,
    overallScore: Math.round((fit + readiness + growth + demand + salary + stability + riskScore) / 7)
  };
}

function createSwot(path: string, skills: string[]): CareerPathReplay["swot"] {
  return {
    strengths: [`Clear skill-building path in ${path}`, "Progress can be demonstrated through measurable proof", skills[0]],
    weaknesses: ["Entry-level credibility takes sustained execution", "Mentorship and feedback access may be uneven", "Early outcomes depend on portfolio quality"],
    opportunities: [`Growing specialization opportunities around ${path}`, "Remote learning and practitioner communities reduce access barriers", "Adjacent roles preserve career optionality"],
    threats: ["Competition from candidates with stronger experience", "Market requirements can change faster than curricula", "Poor financial planning can force an early exit"]
  };
}

function createRiskMatrix(path: string, risk: "Low" | "Medium" | "High"): RiskMatrixItem[] {
  const base = risk === "High" ? 78 : risk === "Medium" ? 58 : 38;
  return [
    { type: "Career", probability: base, impact: 72, mitigation: `Validate ${path} with a 90-day proof-of-work sprint.` },
    { type: "Financial", probability: clampScore(base - 12), impact: 66, mitigation: "Set a learning budget and protect six months of essential expenses." },
    { type: "Learning", probability: clampScore(base + 4), impact: 58, mitigation: "Use weekly milestones, feedback, and a focused curriculum." },
    { type: "Market", probability: clampScore(base + 8), impact: 70, mitigation: "Review real job descriptions and recruiter feedback every month." },
    { type: "Personal", probability: clampScore(base - 8), impact: 54, mitigation: "Track workload, energy, and support constraints before scaling commitment." }
  ];
}

function scoreLevel(score: number): "Low" | "Medium" | "High" {
  return score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";
}

function createMarketIntelligence(path: string, profile: BaseCareerProfile): CareerPathReplay["marketIntelligence"] {
  const scorecard = createScorecard(path, profile.careerFitScore, profile.jobReadinessScore, profile.growthPotential, profile.riskLevel);
  const lower = path.toLowerCase();
  const locationAdvantage = /ai|data|software|developer/.test(lower)
    ? "Bengaluru, Hyderabad, Pune, and NCR offer the strongest concentration of relevant entry-level roles."
    : /government|civil|upsc|ssc|bank/.test(lower)
      ? "Preparation access is location-flexible, while coaching ecosystems are strongest in Delhi, Hyderabad, and major state capitals."
      : /startup|founder/.test(lower)
        ? "Bengaluru, Hyderabad, Mumbai, and NCR provide denser founder, customer, and funding networks."
        : "Location value depends on institution, employer concentration, and access to practitioners in this field.";
  return {
    hiringDemand: scoreLevel(scorecard.marketDemand),
    entryBarrier: profile.learningCurve === "Steep" ? "High" : profile.learningCurve === "Moderate" ? "Medium" : "Low",
    salaryGrowth: scoreLevel(profile.growthPotential),
    competitionLevel: scorecard.competition >= 70 ? "Medium" : "High",
    automationRisk: /data|software|content|support/.test(lower) ? "Medium" : /government|founder|higher/.test(lower) ? "Low" : "Medium",
    locationAdvantage
  };
}

export function createMockCareerReplay(paths: CareerPath[], background = ""): CareerReplayResult {
  const selected: CareerPath[] = paths.length ? paths : ["AI Engineer", "Software Engineer", "Data Scientist"];
  const profiles = selected.map((path) => {
    const base = careerProfiles[path] ?? createGenericCareerProfile(path);
    const backgroundBoost = background.toLowerCase().includes(path.toLowerCase().split(" ")[0]) ? 4 : 0;
    return {
      path,
      ...base,
      careerFitScore: clampScore(base.careerFitScore + backgroundBoost),
      jobReadinessScore: clampScore(base.jobReadinessScore + Math.floor(backgroundBoost / 2)),
      scorecard: createScorecard(path, base.careerFitScore + backgroundBoost, base.jobReadinessScore + Math.floor(backgroundBoost / 2), base.growthPotential, base.riskLevel),
      swot: createSwot(path, base.skillRoadmap),
      riskMatrix: createRiskMatrix(path, base.riskLevel),
      marketIntelligence: createMarketIntelligence(path, base)
    };
  });
  const best = [...profiles].sort((a, b) => b.careerFitScore + b.jobReadinessScore - (a.careerFitScore + a.jobReadinessScore))[0];

  return {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    paths: profiles,
    finalRecommendation: `${best.path} is the strongest near-term path because it balances fit, readiness, and practical execution risk. Use the 30/90/180 day plan to validate it before making a long-term commitment.`,
    whyRecommendation: [
      `${best.path} has the strongest combined fit and readiness score for the supplied profile.`,
      `Its ${best.riskLevel.toLowerCase()} risk level is manageable through the proposed validation plan.`,
      "The skill roadmap creates measurable proof within 90-180 days.",
      "Market demand and growth potential outweigh the competing paths' opportunity costs.",
      "The route preserves adjacent career options if the first hiring cycle is slower than expected."
    ]
  };
}

export function createMockFutureSimulation(scenarios: string[], profile = ""): FutureSimulationResult {
  const results = scenarios.map((name) => {
    const base = careerProfiles[name] ?? createGenericCareerProfile(name);
    const profileBoost = profile.toLowerCase().includes(name.toLowerCase().split(" ")[0]) ? 5 : 0;
    const probability = clampScore(base.careerFitScore - 8 + profileBoost);
    const scorecard = createScorecard(name, base.careerFitScore + profileBoost, base.jobReadinessScore + profileBoost, base.growthPotential, base.riskLevel);
    return {
      name,
      salaryAfterOneYear: base.salaryPotential.includes("High") ? "INR 6-12 LPA with strong proof" : "INR 4-9 LPA or path-dependent stipend",
      salaryAfterThreeYears: base.growthPotential >= 85 ? "INR 14-28 LPA with specialization" : "INR 8-18 LPA depending on outcomes",
      skillsRequired: base.skillRoadmap,
      successProbability: probability,
      hiringDifficulty: base.riskLevel,
      timeInvestment: base.timeRequired,
      financialImpact: base.riskLevel === "High" ? "High runway requirement and delayed income certainty" : "Moderate learning cost with staged earning potential",
      opportunityCost: `Time spent on ${name} delays competing paths; use a 90-day checkpoint before deeper commitment.`,
      careerImpact: base.recommendation,
      riskLevel: base.riskLevel,
      finalOutlook: `${name} is ${probability >= 75 ? "a strong" : "a conditional"} option when its roadmap is validated with external evidence.`,
      scorecard,
      swot: createSwot(name, base.skillRoadmap),
      riskMatrix: createRiskMatrix(name, base.riskLevel),
      marketIntelligence: createMarketIntelligence(name, base)
    };
  });
  const best = [...results].sort((a, b) => b.scorecard.overallScore - a.scorecard.overallScore)[0];
  return {
    id: nanoid(), createdAt: new Date().toISOString(), scenarios: results, bestScenario: best.name,
    reasoning: [
      `${best.name} has the highest overall decision score at ${best.scorecard.overallScore}/100.`,
      `Its success probability of ${best.successProbability}% is strongest for the supplied profile.`,
      "The path supports visible proof-of-work before full commitment.",
      "Its salary-growth potential better compensates for the required learning investment.",
      "Risk can be reduced through the explicit milestones and mitigations in the scorecard."
    ]
  };
}

export function createMockRecruiterView(targetRole: string, profile: string): RecruiterViewResult {
  const profileDepth = Math.min(18, Math.floor(profile.length / 45));
  const readinessScore = clampScore(stableScore(`${targetRole}:${profile}`, 19, 48, 72) + profileDepth);
  return {
    id: nanoid(), createdAt: new Date().toISOString(), targetRole, readinessScore,
    missingSkills: [`Role-specific system design for ${targetRole}`, "Testing and production debugging", "Clear communication of technical trade-offs"],
    missingProjects: [`One deployed ${targetRole} project with measurable users or outcomes`, "A team or open-source contribution showing collaboration", "A case study documenting architecture and decisions"],
    resumeGaps: ["Project impact is not quantified", "Skills are not connected to proof", "Target-role keywords and outcomes need stronger alignment"],
    interviewWeaknesses: ["Likely shallow follow-up answers on project decisions", "Limited evidence for debugging under uncertainty", "Behavioral stories need Situation-Action-Result structure"],
    hiringProbability: { threeMonths: clampScore(readinessScore - 22), sixMonths: clampScore(readinessScore - 4), twelveMonths: clampScore(readinessScore + 16) },
    recruiterVerdict: readinessScore >= 75 ? "Interview-ready for selected entry roles, provided projects are presented with measurable impact." : "Promising profile, but not yet consistently shortlist-ready for the target role.",
    improvementPlan: [
      { action: `Ship one production-style ${targetRole} project with a measurable user or performance outcome.`, impact: "High Impact" },
      { action: "Rewrite project bullets around ownership, architecture decisions, and quantified results.", impact: "High Impact" },
      { action: `Complete six ${targetRole} mock interviews and maintain a recurring-error log.`, impact: "High Impact" },
      { action: "Request targeted feedback from five practitioners and convert two conversations into referrals.", impact: "Medium Impact" },
      { action: "Track application conversion by resume version and role segment each week.", impact: "Low Impact" }
    ],
    personalizedRoadmap: [
      { period: "Week 1-2", skillFocus: `Audit ${targetRole} fundamentals against 20 current job descriptions.`, projectTask: "Define one portfolio project's user, scope, architecture, and success metric.", proofOfWork: "Published project brief, skill-gap matrix, and baseline assessment.", evaluationCheckpoint: "A practitioner confirms the scope demonstrates target-role work." },
      { period: "Week 3-4", skillFocus: "Close the two highest-frequency technical gaps found in the audit.", projectTask: "Build the core workflow with tests, error handling, and version control.", proofOfWork: "Working repository with documented decisions and a demoable core feature.", evaluationCheckpoint: "Core workflow passes a peer code review and realistic test cases." },
      { period: "Month 2", skillFocus: `Production patterns expected from junior ${targetRole} candidates.`, projectTask: "Deploy the project, instrument one outcome metric, and collect user feedback.", proofOfWork: "Live deployment, architecture note, usage evidence, and iteration log.", evaluationCheckpoint: "Five users or two practitioners can verify the project's usefulness." },
      { period: "Month 3", skillFocus: "Role-specific interviews, debugging, and technical communication.", projectTask: "Complete six mock interviews and rewrite resume bullets using project evidence.", proofOfWork: "Interview error log, revised resume, and concise project walkthrough.", evaluationCheckpoint: "Reach 75% accuracy on recurring interview topics and clear mock feedback." },
      { period: "Month 4-6", skillFocus: "Application targeting, referrals, and advanced specialization.", projectTask: "Run weekly application batches while deepening one differentiated project feature.", proofOfWork: "Conversion dashboard, referral pipeline, and one advanced case study.", evaluationCheckpoint: "Review interview conversion monthly and change positioning if it remains below 8%." }
    ]
  };
}
