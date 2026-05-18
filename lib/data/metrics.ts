import "server-only";

import type {
  DailyMetric,
  DateRange,
  DeviceShare,
  GeographicCity,
  KpiSnapshot,
} from "./types";
import { hashString, makeRng, range } from "./rng";

const TODAY = new Date();
TODAY.setUTCHours(0, 0, 0, 0);

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function buildSeries(dealershipId: string): DailyMetric[] {
  const rng = makeRng(hashString(dealershipId + ":metrics"));
  const series: DailyMetric[] = [];
  // 180 days so we can compare current vs previous windows
  for (let daysAgo = 179; daysAgo >= 0; daysAgo--) {
    const date = new Date(TODAY);
    date.setUTCDate(TODAY.getUTCDate() - daysAgo);

    const dow = date.getUTCDay(); // 0 = Sun
    const weekdayBoost = dow >= 1 && dow <= 5 ? 1 : 0.78;
    const seasonal = 1 + Math.sin(daysAgo / 18) * 0.18;
    const growth = 1 + (179 - daysAgo) * 0.0014; // slow uptrend
    const base = 240 * seasonal * weekdayBoost * growth;
    const noise = 0.85 + rng() * 0.3;
    const clicks = Math.max(60, Math.round(base * noise));
    const impressions = Math.round(clicks * (19 + rng() * 6));
    const ctr = Number(((clicks / impressions) * 100).toFixed(2));
    const position = Number((7.8 - (179 - daysAgo) * 0.012 + (rng() - 0.5) * 0.6).toFixed(2));
    series.push({ date: isoDate(date), clicks, impressions, ctr, position });
  }
  return series;
}

const CACHE = new Map<string, DailyMetric[]>();
function seriesFor(dealershipId: string): DailyMetric[] {
  let s = CACHE.get(dealershipId);
  if (!s) {
    s = buildSeries(dealershipId);
    CACHE.set(dealershipId, s);
  }
  return s;
}

export function rangeToDays(r: DateRange): number {
  return r === "7d" ? 7 : r === "30d" ? 30 : 90;
}

export async function getDailyMetrics(
  dealershipId: string,
  range: DateRange = "30d",
): Promise<DailyMetric[]> {
  const days = rangeToDays(range);
  const all = seriesFor(dealershipId);
  return all.slice(all.length - days);
}

interface KpiWindow {
  clicks: number;
  impressions: number;
  avgCtr: number;
  avgPosition: number;
}

function window(series: DailyMetric[]): KpiWindow {
  const clicks = series.reduce((s, d) => s + d.clicks, 0);
  const impressions = series.reduce((s, d) => s + d.impressions, 0);
  const avgCtr = impressions === 0 ? 0 : (clicks / impressions) * 100;
  const avgPosition =
    series.reduce((s, d) => s + d.position, 0) / Math.max(series.length, 1);
  return { clicks, impressions, avgCtr, avgPosition };
}

export async function getKpiSnapshot(
  dealershipId: string,
  range: DateRange = "30d",
): Promise<KpiSnapshot[]> {
  const days = rangeToDays(range);
  const all = seriesFor(dealershipId);
  const current = all.slice(all.length - days);
  const prior = all.slice(all.length - days * 2, all.length - days);

  const cur = window(current);
  const prev = window(prior);

  const rng = makeRng(hashString(dealershipId + ":kpi"));
  const leadScore = Math.round(range === "7d" ? 78 + rng() * 8 : 82 + rng() * 6);
  const leadPrev = leadScore - Math.round(rng() * 6 + 1);
  const healthScore = Math.round(85 + rng() * 8);
  const healthPrev = healthScore - Math.round(rng() * 4 + 1);

  function delta(c: number, p: number) {
    if (p === 0) return c === 0 ? 0 : 100;
    return ((c - p) / p) * 100;
  }

  return [
    {
      id: "clicks",
      label: "Organic clicks",
      value: cur.clicks,
      previousValue: prev.clicks,
      delta: delta(cur.clicks, prev.clicks),
      trend: cur.clicks >= prev.clicks ? "up" : "down",
      format: "compact",
      helper: `vs. prior ${days}-day window`,
    },
    {
      id: "impressions",
      label: "Impressions",
      value: cur.impressions,
      previousValue: prev.impressions,
      delta: delta(cur.impressions, prev.impressions),
      trend: cur.impressions >= prev.impressions ? "up" : "down",
      format: "compact",
      helper: `vs. prior ${days}-day window`,
    },
    {
      id: "ctr",
      label: "Avg CTR",
      value: Number(cur.avgCtr.toFixed(2)),
      previousValue: Number(prev.avgCtr.toFixed(2)),
      delta: cur.avgCtr - prev.avgCtr,
      trend: cur.avgCtr >= prev.avgCtr ? "up" : "down",
      format: "percent",
      helper: `vs. prior ${days}d`,
    },
    {
      id: "position",
      label: "Avg position",
      value: Number(cur.avgPosition.toFixed(2)),
      previousValue: Number(prev.avgPosition.toFixed(2)),
      delta: cur.avgPosition - prev.avgPosition,
      trend: cur.avgPosition <= prev.avgPosition ? "up" : "down",
      format: "decimal",
      invertTrend: true,
      helper: "lower is better",
    },
    {
      id: "lead",
      label: "Lead opportunity",
      value: leadScore,
      previousValue: leadPrev,
      delta: leadScore - leadPrev,
      trend: leadScore >= leadPrev ? "up" : "down",
      format: "number",
      unit: "/100",
      helper: "AI composite score",
    },
    {
      id: "health",
      label: "SEO health",
      value: healthScore,
      previousValue: healthPrev,
      delta: healthScore - healthPrev,
      trend: healthScore >= healthPrev ? "up" : "down",
      format: "number",
      unit: "/100",
      helper: "Crawl + content + schema",
    },
  ];
}

export async function getDeviceBreakdown(
  dealershipId: string,
  range: DateRange = "30d",
): Promise<DeviceShare[]> {
  const rng = makeRng(hashString(dealershipId + ":devices"));
  const series = await getDailyMetrics(dealershipId, range);
  const totalClicks = series.reduce((s, d) => s + d.clicks, 0);
  const mobile = 0.58 + rng() * 0.08;
  const desktop = 0.3 + rng() * 0.05;
  const tablet = 1 - mobile - desktop;
  return [
    {
      device: "Mobile",
      share: Math.round(mobile * 100),
      clicks: Math.round(totalClicks * mobile),
      delta: 2.4,
    },
    {
      device: "Desktop",
      share: Math.round(desktop * 100),
      clicks: Math.round(totalClicks * desktop),
      delta: -1.1,
    },
    {
      device: "Tablet",
      share: Math.round(tablet * 100),
      clicks: Math.round(totalClicks * tablet),
      delta: -1.3,
    },
  ];
}

export async function getGeographicSplit(
  dealershipId: string,
  range: DateRange = "30d",
): Promise<GeographicCity[]> {
  const rng = makeRng(hashString(dealershipId + ":geo"));
  const series = await getDailyMetrics(dealershipId, range);
  const totalClicks = series.reduce((s, d) => s + d.clicks, 0);
  const cities = [
    { city: "Plano", state: "TX", weight: 0.34 + rng() * 0.06 },
    { city: "Frisco", state: "TX", weight: 0.18 + rng() * 0.04 },
    { city: "Allen", state: "TX", weight: 0.12 + rng() * 0.03 },
    { city: "McKinney", state: "TX", weight: 0.1 + rng() * 0.02 },
    { city: "Dallas", state: "TX", weight: 0.08 + rng() * 0.02 },
    { city: "Richardson", state: "TX", weight: 0.06 + rng() * 0.02 },
    { city: "Carrollton", state: "TX", weight: 0.04 + rng() * 0.02 },
  ];
  const total = cities.reduce((s, c) => s + c.weight, 0);
  return cities.map((c) => ({
    city: c.city,
    state: c.state,
    clicks: Math.round((c.weight / total) * totalClicks),
    share: Number(((c.weight / total) * 100).toFixed(1)),
    mapPackRank: Math.max(1, Math.round(range_rand(rng, 1, 14))),
  }));
}

// helper local
function range_rand(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}
