import { MonthlySummary } from "../../summary/summary.service";

export interface SummaryReport {
  title: string;
  period: string;
  highlights: string[];
  topBusLine: string | null;
  resolutionRate: string;
  rawData: MonthlySummary;
}

export function generateSummaryReport(data: MonthlySummary): SummaryReport {
  const topBusLine =
    Object.entries(data.byBusLine).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const resolutionRate =
    data.totalComplaints > 0
      ? `${Math.round((data.resolvedComplaints / data.totalComplaints) * 100)}%`
      : "N/A";

  const highlights: string[] = [
    `Total complaints: ${data.totalComplaints}`,
    `Resolved: ${data.resolvedComplaints} (${resolutionRate})`,
    `Pending: ${data.pendingComplaints}`,
  ];

  if (topBusLine) {
    highlights.push(
      `Most complained line: ${topBusLine} (${data.byBusLine[topBusLine]} complaints)`,
    );
  }

  const topCategory = Object.entries(data.byCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];
  if (topCategory) {
    highlights.push(
      `Most common issue: ${topCategory[0]} (${topCategory[1]} cases)`,
    );
  }

  return {
    title: `Monthly Complaints Summary`,
    period: `${data.year}-${String(data.month).padStart(2, "0")}`,
    highlights,
    topBusLine,
    resolutionRate,
    rawData: data,
  };
}
