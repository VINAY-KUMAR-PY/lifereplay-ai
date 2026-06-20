import jsPDF from "jspdf";
import type { AnalysisResult } from "../types";

function writeList(doc: jsPDF, title: string, items: string[], x: number, y: number, width = 170) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, x, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let cursor = y + 7;
  for (const item of items) {
    const lines = doc.splitTextToSize(`- ${item}`, width);
    if (cursor + lines.length * 5 > 282) {
      doc.addPage();
      cursor = 20;
    }
    doc.text(lines, x, cursor);
    cursor += lines.length * 5 + 2;
  }
  return cursor + 4;
}

export function downloadDecisionReport(result: AnalysisResult) {
  const doc = new jsPDF();
  const margin = 18;
  let y = 20;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("LifeReplay AI Decision Report", margin, 17);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date(result.createdAt).toLocaleString()}`, margin, 28);

  doc.setTextColor(15, 23, 42);
  y = 50;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Decision", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(result.decision, 170), margin, y + 7);

  y += 25;
  doc.setFont("helvetica", "bold");
  doc.text(`Confidence Score: ${result.confidenceScore}/100`, margin, y);
  doc.text(`Opportunity Score: ${result.opportunityScore}/100`, 110, y);

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("Future Scenarios", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y += 7;
  for (const [label, text] of [
    ["Best case", result.bestCaseFuture],
    ["Worst case", result.worstCaseFuture],
    ["Most likely", result.mostLikelyFuture]
  ] as const) {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, 168);
    doc.text(lines, margin + 28, y);
    y += Math.max(10, lines.length * 5 + 4);
  }

  y = writeList(doc, "Career Risks", result.careerRisks, margin, y);
  y = writeList(doc, "Financial Risks", result.financialRisks, margin, y);
  y = writeList(doc, "Personal Risks", result.personalRisks, margin, y);
  y = writeList(doc, "Recommended Next Steps", result.recommendedNextSteps, margin, y);

  if (y > 220) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Timeline", margin, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const item of result.timeline) {
    const lines = doc.splitTextToSize(
      `${item.period}: ${item.outlook} Milestone: ${item.milestone} Risk: ${item.riskLevel}`,
      170
    );
    if (y + lines.length * 5 > 282) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  }

  y = writeList(doc, "Immediate Action Plan", result.actionPlan.immediate, margin, y);
  y = writeList(doc, "30 Day Action Plan", result.actionPlan.thirtyDay, margin, y);
  y = writeList(doc, "90 Day Action Plan", result.actionPlan.ninetyDay, margin, y);
  writeList(doc, "Long-Term Action Plan", result.actionPlan.longTerm, margin, y);

  const safeName = result.decision.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
  doc.save(`lifereplay-decision-report-${safeName || "analysis"}.pdf`);
}
