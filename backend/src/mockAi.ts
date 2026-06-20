import { nanoid } from "nanoid";
import type { AnalysisResult, ComparisonResult, RiskCategory } from "./types.js";

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
