import "server-only";

import type { ReportRecord } from "./types";
import { hashString, makeRng, range, rangeInt } from "./rng";
import { getKpiSnapshot } from "./metrics";
import { getDealership } from "./dealerships";

const TYPES: Array<{ type: ReportRecord["type"]; title: string }> = [
  { type: "MONTHLY_FULL", title: "Monthly SEO Report" },
  { type: "WEEKLY_EXECUTIVE", title: "Weekly Executive Summary" },
  { type: "GSC_AUDIT", title: "GSC Property Audit" },
  { type: "LOCAL_SEO_AUDIT", title: "Local SEO Audit" },
  { type: "COMPETITOR_BENCHMARK", title: "Competitor Benchmark" },
  { type: "KPI_SNAPSHOT", title: "KPI Snapshot" },
  { type: "ROI_PROJECTION", title: "ROI Projection" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CACHE = new Map<string, ReportRecord[]>();

export async function getReports(dealershipId: string): Promise<ReportRecord[]> {
  let cached = CACHE.get(dealershipId);
  if (cached) return cached;

  const dealership = await getDealership(dealershipId);
  const kpis = await getKpiSnapshot(dealershipId, "30d");
  const rng = makeRng(hashString(dealershipId + ":reports"));
  const now = new Date();

  const reports: ReportRecord[] = [];

  // 12 months of monthly full reports
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(now);
    monthDate.setUTCMonth(now.getUTCMonth() - i - 1);
    const periodStart = new Date(
      Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth(), 1),
    );
    const periodEnd = new Date(
      Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0),
    );
    const monthName = MONTHS[monthDate.getUTCMonth()];
    const created = new Date(
      Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 1, 9),
    );

    const clicks = rangeInt(rng, 8000, 22000);
    const impressions = clicks * rangeInt(rng, 18, 26);
    reports.push({
      id: `rep-${dealershipId}-monthly-${periodStart.getTime()}`,
      dealershipId,
      type: "MONTHLY_FULL",
      status: "READY",
      title: `${monthName} ${periodStart.getUTCFullYear()} - ${dealership.name}`,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      summary: `Clicks ${i % 2 === 0 ? "+" : "-"}${rangeInt(rng, 4, 22)}% MoM; map-pack appearances up ${rangeInt(rng, 5, 18)}%. Top action: deploy Vehicle schema sitewide.`,
      pdfUrl: undefined,
      createdAt: created.toISOString(),
      completedAt: new Date(created.getTime() + 9 * 60 * 1000).toISOString(),
      pageCount: rangeInt(rng, 12, 28),
      kpis: {
        clicks,
        clicksDelta: Number(range(rng, -8, 22).toFixed(1)),
        impressions,
        impressionsDelta: Number(range(rng, -6, 24).toFixed(1)),
        ctr: Number(((clicks / impressions) * 100).toFixed(2)),
        ctrDelta: Number(range(rng, -0.4, 0.8).toFixed(2)),
        avgPosition: Number(range(rng, 4.4, 9.2).toFixed(1)),
        positionDelta: Number(range(rng, -1.4, 1.0).toFixed(2)),
      },
    });
  }

  // Mix in weekly executive summaries (last 8 weeks)
  for (let i = 0; i < 8; i++) {
    const end = new Date(now);
    end.setUTCDate(now.getUTCDate() - i * 7);
    const start = new Date(end);
    start.setUTCDate(end.getUTCDate() - 6);
    const clicks = rangeInt(rng, 1800, 4600);
    const impressions = clicks * rangeInt(rng, 18, 24);
    reports.push({
      id: `rep-${dealershipId}-week-${end.toISOString().slice(0, 10)}`,
      dealershipId,
      type: "WEEKLY_EXECUTIVE",
      status: i === 0 ? "GENERATING" : "READY",
      title: `Weekly Executive Summary - week of ${start.toISOString().slice(5, 10)}`,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      summary:
        i === 0
          ? "Generating - clicks pacing for the strongest week of the quarter."
          : "Weekly snapshot for principals + GM distribution. Sent to 6 stakeholders.",
      createdAt: end.toISOString(),
      completedAt:
        i === 0 ? undefined : new Date(end.getTime() + 12 * 60 * 1000).toISOString(),
      pageCount: 4,
      kpis: {
        clicks,
        clicksDelta: Number(range(rng, -5, 18).toFixed(1)),
        impressions,
        impressionsDelta: Number(range(rng, -4, 20).toFixed(1)),
        ctr: Number(((clicks / impressions) * 100).toFixed(2)),
        ctrDelta: Number(range(rng, -0.3, 0.5).toFixed(2)),
        avgPosition: Number(range(rng, 4.2, 9.4).toFixed(1)),
        positionDelta: Number(range(rng, -1.0, 0.8).toFixed(2)),
      },
    });
  }

  // 1 each of the other types
  for (const t of TYPES.slice(2)) {
    const created = new Date(now);
    created.setUTCDate(now.getUTCDate() - rangeInt(rng, 4, 60));
    const periodEnd = created;
    const periodStart = new Date(periodEnd);
    periodStart.setUTCDate(periodEnd.getUTCDate() - 30);
    const clicks = rangeInt(rng, 6000, 18000);
    const impressions = clicks * 20;
    reports.push({
      id: `rep-${dealershipId}-${t.type}`,
      dealershipId,
      type: t.type,
      status: "READY",
      title: `${t.title} - ${dealership.name}`,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      summary: `Generated audit deliverable. ${rangeInt(rng, 4, 24)} action items surfaced.`,
      createdAt: created.toISOString(),
      completedAt: new Date(created.getTime() + 18 * 60 * 1000).toISOString(),
      pageCount: rangeInt(rng, 6, 22),
      kpis: {
        clicks,
        clicksDelta: Number(range(rng, -8, 22).toFixed(1)),
        impressions,
        impressionsDelta: Number(range(rng, -6, 24).toFixed(1)),
        ctr: Number(((clicks / impressions) * 100).toFixed(2)),
        ctrDelta: Number(range(rng, -0.4, 0.6).toFixed(2)),
        avgPosition: Number(range(rng, 4.4, 9.2).toFixed(1)),
        positionDelta: Number(range(rng, -1.2, 0.6).toFixed(2)),
      },
    });
  }

  // sort newest first
  reports.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  CACHE.set(dealershipId, reports);
  return reports;
}

export async function getReport(
  dealershipId: string,
  id: string,
): Promise<ReportRecord | null> {
  const all = await getReports(dealershipId);
  return all.find((r) => r.id === id) ?? null;
}
