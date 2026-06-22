import jsPDF from "jspdf";
import type { AnalysisResult, FutureSimulationResult, RecruiterViewResult } from "../types";

export function downloadDecisionReport(result: AnalysisResult) {
  const doc = new jsPDF();
  const margin = 18;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let y = 54;

  function ensureSpace(height: number) {
    if (y + height > 282) { doc.addPage(); y = 20; }
  }

  function sectionHeader(title: string) {
    ensureSpace(16);
    doc.setFillColor(20, 184, 166);
    doc.rect(margin, y, 3, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin + 6, y + 6);
    y += 14;
  }

  function paragraph(text: string, indent = 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    ensureSpace(lines.length * 4.5 + 3);
    doc.text(lines, margin + indent, y);
    y += lines.length * 4.5 + 4;
  }

  function list(items: string[]) {
    items.forEach((item) => paragraph(`- ${item}`, 2));
    y += 2;
  }

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 42, "F");
  doc.setFillColor(20, 184, 166);
  doc.rect(0, 38, pageWidth, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("LifeReplay AI", margin, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Career Decision Intelligence Report", margin, 26);
  doc.text(`Generated: ${new Date(result.createdAt).toLocaleString("en-IN")}`, margin, 34);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y - 4, contentWidth, 22, 3, 3, "F");
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Decision", margin + 4, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(result.decision, contentWidth - 38), margin + 28, y + 4);
  y += 28;

  const scoreBar = (label: string, score: number, x: number, color: [number, number, number]) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(`${label}  ${score}/100`, x, y);
    doc.setFillColor(226, 232, 240); doc.roundedRect(x, y + 3, 78, 5, 2, 2, "F");
    doc.setFillColor(...color); doc.roundedRect(x, y + 3, 78 * score / 100, 5, 2, 2, "F");
  };
  scoreBar("Confidence", result.confidenceScore, margin, [20, 184, 166]);
  scoreBar("Opportunity", result.opportunityScore, margin + 92, [99, 102, 241]);
  y += 18;

  sectionHeader("Executive Decision Scorecard");
  const scorecard = [
    ["Market Demand", result.opportunityScore], ["Decision Confidence", result.confidenceScore],
    ["Risk Resilience", Math.max(25, 100 - result.careerRisks.length * 8)], ["Financial Readiness", Math.max(25, 100 - result.financialRisks.length * 8)],
    ["Personal Readiness", Math.max(25, 100 - result.personalRisks.length * 8)], ["Overall Score", Math.round((result.confidenceScore + result.opportunityScore) / 2)]
  ] as const;
  scorecard.forEach(([label, score], index) => { ensureSpace(12); const x = index % 2 === 0 ? margin : margin + 92; if (index % 2 === 0 && index > 0) y += 13; doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(51, 65, 85); doc.text(`${label} ${score}`, x, y); doc.setFillColor(226, 232, 240); doc.roundedRect(x, y + 2, 78, 4, 2, 2, "F"); doc.setFillColor(20, 184, 166); doc.roundedRect(x, y + 2, 78 * score / 100, 4, 2, 2, "F"); });
  y += 16;

  sectionHeader("Future Scenarios");
  [["Best Case", result.bestCaseFuture], ["Worst Case", result.worstCaseFuture], ["Most Likely", result.mostLikelyFuture]].forEach(([label, text]) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(15, 23, 42); doc.text(label, margin, y); y += 5; paragraph(text);
  });

  sectionHeader("Risk Analysis");
  [["Career risks", result.careerRisks], ["Financial risks", result.financialRisks], ["Personal risks", result.personalRisks]].forEach(([label, items]) => {
    ensureSpace(8); doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(15, 23, 42); doc.text(label as string, margin, y); y += 5; list(items as string[]);
  });

  sectionHeader("Strategic Summary");
  const strategicSections: [string, string[]][] = [
    ["Upside (Best case)", [result.bestCaseFuture]],
    ["Downside (Worst case)", [result.worstCaseFuture]],
    ["Most likely outcome", [result.mostLikelyFuture]],
    ["Career risks to mitigate", result.careerRisks],
    ["Financial risks to manage", result.financialRisks],
    ["Recommended immediate actions", result.recommendedNextSteps.slice(0, 3)]
  ];
  for (const [label, items] of strategicSections) {
    ensureSpace(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(label, margin, y);
    y += 5;
    list(items);
  }

  sectionHeader("Risk Matrix");
  [["Career", 68, 74, result.careerRisks[0]], ["Financial", 56, 70, result.financialRisks[0]], ["Learning", 52, 58, "Use weekly milestones and mentor feedback."], ["Market", 62, 72, "Review live job descriptions and demand monthly."], ["Personal", 48, 55, result.personalRisks[0]]].forEach(([type, probability, impact, mitigation]) => paragraph(`${type}: Probability ${probability}% | Impact ${impact}% | Mitigation: ${mitigation}`));

  sectionHeader("Decision Timeline");
  result.timeline.forEach((item) => {
    ensureSpace(22); doc.setFillColor(248, 250, 252); doc.roundedRect(margin, y - 4, contentWidth, 18, 2, 2, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(20, 184, 166); doc.text(item.period, margin + 3, y + 1);
    doc.setFont("helvetica", "normal"); doc.setTextColor(51, 65, 85); doc.text(doc.splitTextToSize(item.outlook, contentWidth - 40), margin + 30, y + 1);
    doc.setFont("helvetica", "bold"); doc.text(`${item.riskLevel} risk`, pageWidth - margin - 24, y + 9); y += 22;
  });

  sectionHeader("Recommended Next Steps"); list(result.recommendedNextSteps);
  sectionHeader("Why This Recommendation");
  list([result.confidenceExplanation, `Opportunity score is ${result.opportunityScore}/100 for the selected decision.`, `The dominant risk is ${result.dominantRiskCategory}, with explicit mitigation steps.`, result.timeline[0].milestone, result.recommendedNextSteps[0]].slice(0, 5));
  sectionHeader("Action Plan");
  [["Immediate", result.actionPlan.immediate], ["30 Days", result.actionPlan.thirtyDay], ["90 Days", result.actionPlan.ninetyDay], ["Long Term", result.actionPlan.longTerm]].forEach(([label, items]) => {
    ensureSpace(8); doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(15, 23, 42); doc.text(label as string, margin, y); y += 5; list(items as string[]);
  });

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) { doc.setPage(page); doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.text(`LifeReplay AI | Page ${page} of ${pages}`, margin, 292); }
  const safeName = result.decision.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
  doc.save(`lifereplay-report-${safeName || "analysis"}.pdf`);
}

function downloadStructuredReport(title: string, subtitle: string, sections: Array<{ title: string; lines: string[] }>, filename: string) {
  const doc = new jsPDF(); const margin = 18; const width = 174; let y = 50;
  const ensure = (height: number) => { if (y + height > 280) { doc.addPage(); y = 20; } };
  doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 40, "F"); doc.setFillColor(20, 184, 166); doc.rect(0, 37, 210, 3, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(title, margin, 16); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text(subtitle, margin, 25); doc.text(`Generated ${new Date().toLocaleString("en-IN")}`, margin, 33);
  sections.forEach((section) => { ensure(18); doc.setFillColor(20, 184, 166); doc.rect(margin, y, 3, 8, "F"); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(section.title, margin + 6, y + 6); y += 14; section.lines.forEach((line) => { doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(51, 65, 85); const wrapped = doc.splitTextToSize(`- ${line}`, width); ensure(wrapped.length * 4.5 + 3); doc.text(wrapped, margin + 2, y); y += wrapped.length * 4.5 + 3; }); y += 4; });
  const pages = doc.getNumberOfPages(); for (let page = 1; page <= pages; page += 1) { doc.setPage(page); doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.text(`LifeReplay AI | Page ${page} of ${pages}`, margin, 292); }
  doc.save(filename);
}

export function downloadCareerBattleReport(result: FutureSimulationResult) {
  const winner = result.scenarios.find((scenario) => scenario.name === result.bestScenario) ?? result.scenarios[0];
  downloadStructuredReport("LifeReplay AI", "Career Battle Intelligence Report", [
    { title: "Executive Summary", lines: [`Recommended path: ${result.bestScenario}`, `${winner.successProbability}% success probability; overall score ${winner.scorecard.overallScore}/100.`] },
    { title: "Career Battle Summary", lines: result.scenarios.map((scenario) => `${scenario.name}: ${scenario.salaryAfterOneYear} after year one; ${scenario.salaryAfterThreeYears} after year three; ${scenario.riskLevel} risk; ${scenario.finalOutlook}`) },
    { title: "Decision Scorecard", lines: Object.entries(winner.scorecard).map(([metric, value]) => `${metric}: ${value}/100`) },
    { title: "SWOT Analysis", lines: [`Strengths: ${winner.swot.strengths.join("; ")}`, `Weaknesses: ${winner.swot.weaknesses.join("; ")}`, `Opportunities: ${winner.swot.opportunities.join("; ")}`, `Threats: ${winner.swot.threats.join("; ")}`] },
    { title: "Risk Matrix", lines: winner.riskMatrix.map((risk) => `${risk.type}: probability ${risk.probability}%, impact ${risk.impact}%. ${risk.mitigation}`) },
    { title: "Final Recommendation", lines: result.reasoning }
  ], "lifereplay-career-battle-report.pdf");
}

export function downloadRecruiterIntelligenceReport(result: RecruiterViewResult) {
  downloadStructuredReport("LifeReplay AI", "Recruiter Intelligence Report", [
    { title: "Executive Summary", lines: [`Target role: ${result.targetRole}`, `Recruiter readiness: ${result.readinessScore}/100`, result.recruiterVerdict] },
    { title: "Recruiter Assessment", lines: [`Missing skills: ${result.missingSkills.join("; ")}`, `Missing projects: ${result.missingProjects.join("; ")}`, `Resume gaps: ${result.resumeGaps.join("; ")}`, `Interview weaknesses: ${result.interviewWeaknesses.join("; ")}`] },
    { title: "Hiring Probability", lines: [`3 months: ${result.hiringProbability.threeMonths}%`, `6 months: ${result.hiringProbability.sixMonths}%`, `12 months: ${result.hiringProbability.twelveMonths}%`] },
    { title: "Top Improvements", lines: result.improvementPlan.map((item) => `${item.impact}: ${item.action}`) },
    { title: "Personalized Roadmap", lines: result.personalizedRoadmap.map((step) => `${step.period} | Skill: ${step.skillFocus} | Task: ${step.projectTask} | Proof: ${step.proofOfWork} | Checkpoint: ${step.evaluationCheckpoint}`) }
  ], "lifereplay-recruiter-intelligence-report.pdf");
}
