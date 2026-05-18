import "server-only";

import type { InsightRecord } from "./types";
import { hashString, makeRng, pick, rangeInt } from "./rng";
import { getDealership } from "./dealerships";

interface InsightTemplate {
  title: (brand: string, city: string) => string;
  summary: string;
  rationale: string;
  category: InsightRecord["category"];
  priority: InsightRecord["priority"];
  clicksRange: [number, number];
  revenueRange: [number, number];
  effortRange: [number, number];
  confidenceRange: [number, number];
}

const TEMPLATES: InsightTemplate[] = [
  {
    title: (b) => `Competitors outrank you for ${b} lease keywords`,
    summary:
      "AutoNation holds positions 1-3 for 14 lease-intent queries in your market while you average position 8.4. Lease pages lack monthly-payment schema and city-specific H1 tags.",
    rationale:
      "Page authority gap of 11 points + missing localized H1 tags + no Offer schema on /lease URLs.",
    category: "COMPETITIVE",
    priority: "HIGH",
    clicksRange: [950, 1400],
    revenueRange: [55000, 72000],
    effortRange: [14, 22],
    confidenceRange: [0.78, 0.86],
  },
  {
    title: () => "Deploy Vehicle + Offer schema sitewide",
    summary:
      "Vehicle detail pages are missing JSON-LD Vehicle and Offer markup. Competitors with these schemas earn 2.3× more rich-result impressions in your market.",
    rationale:
      "0/248 VDPs carry Vehicle schema. Rich results for `<brand> <model> price` go to competitors.",
    category: "SCHEMA",
    priority: "CRITICAL",
    clicksRange: [1800, 2300],
    revenueRange: [120000, 160000],
    effortRange: [12, 18],
    confidenceRange: [0.82, 0.92],
  },
  {
    title: () => "Optimize mobile page speed (inventory)",
    summary:
      "Mobile LCP on inventory pages averages 4.1s (target ≤2.5s). Hero images aren't using next-gen formats and render-blocking CSS is shipped above the fold.",
    rationale:
      "Mobile session abandonment correlates with LCP regression > 3.5s. Estimated CTR uplift ~0.6pp.",
    category: "PERFORMANCE",
    priority: "HIGH",
    clicksRange: [480, 720],
    revenueRange: [22000, 35000],
    effortRange: [6, 10],
    confidenceRange: [0.88, 0.95],
  },
  {
    title: (_, c) => `Create 6 city-specific landing pages around ${c}`,
    summary:
      "You rank for nearby cities without dedicated landing pages. Building these can capture ~9,400 additional monthly impressions.",
    rationale:
      "Currently sliding into competitor pages for city-modifier queries. Projection assumes 1.2pp CTR.",
    category: "LOCAL_SEO",
    priority: "MEDIUM",
    clicksRange: [780, 1100],
    revenueRange: [38000, 55000],
    effortRange: [18, 28],
    confidenceRange: [0.75, 0.82],
  },
  {
    title: () => "Auto-rewrite metadata on 32 service pages",
    summary:
      "Service URLs are missing or have over-length meta descriptions. Localized intent rewrites should lift CTR by 0.7-1.0pp.",
    rationale:
      "Descriptions over 165 chars get truncated. Title tags don't include city - hurting SERP localization.",
    category: "SERVICE_PAGE",
    priority: "MEDIUM",
    clicksRange: [290, 440],
    revenueRange: [16000, 24000],
    effortRange: [4, 8],
    confidenceRange: [0.88, 0.94],
  },
  {
    title: () => "Reactivate Google Business Profile photo cadence",
    summary:
      "Last GBP photo upload was 47 days ago. Profiles with weekly photo uploads see ~35% more direction requests and calls.",
    rationale:
      "GBP engagement signals correlate with map-pack visibility - particularly photos with model + facility shots.",
    category: "GOOGLE_BUSINESS",
    priority: "LOW",
    clicksRange: [90, 180],
    revenueRange: [4000, 8000],
    effortRange: [1, 2],
    confidenceRange: [0.93, 0.98],
  },
  {
    title: () => "Resolve broken canonicals on /inventory/*",
    summary:
      "4 self-referential canonical loops detected during the latest crawl. This blocks ~32 inventory URLs from indexing reliably.",
    rationale:
      "Mis-configured canonical chain detected via crawl. Fix: collapse to single canonical per VDP.",
    category: "TECHNICAL",
    priority: "HIGH",
    clicksRange: [380, 560],
    revenueRange: [18000, 28000],
    effortRange: [3, 5],
    confidenceRange: [0.9, 0.96],
  },
  {
    title: (b) => `Build authority for "${b.toLowerCase()} hybrid" queries`,
    summary:
      "Hybrid model search demand grew 31% YoY in your market. You don't rank top-20 for any hybrid-modifier query.",
    rationale:
      "Hybrid intent up 31% YoY. Opportunity window before competitors close gap (currently weak).",
    category: "CONTENT",
    priority: "MEDIUM",
    clicksRange: [340, 560],
    revenueRange: [14000, 26000],
    effortRange: [12, 18],
    confidenceRange: [0.72, 0.84],
  },
];

const CACHE = new Map<string, InsightRecord[]>();

async function buildInsights(dealershipId: string): Promise<InsightRecord[]> {
  const dealership = await getDealership(dealershipId);
  const rng = makeRng(hashString(dealershipId + ":insights"));
  const now = Date.now();
  return TEMPLATES.map((tpl, i) => {
    const status = pick<InsightRecord["status"]>(rng, [
      "NEW",
      "NEW",
      "NEW",
      "IN_PROGRESS",
      "RESOLVED",
    ]);
    const createdDaysAgo = rangeInt(rng, 1, 14);
    return {
      id: `ins-${dealershipId}-${i}`,
      dealershipId,
      title: tpl.title(dealership.brand, dealership.city),
      summary: tpl.summary,
      rationale: tpl.rationale,
      category: tpl.category,
      priority: tpl.priority,
      status,
      estimatedClicksGain: rangeInt(rng, tpl.clicksRange[0], tpl.clicksRange[1]),
      estimatedRevenueGainUsd: rangeInt(
        rng,
        tpl.revenueRange[0],
        tpl.revenueRange[1],
      ),
      effortHours: rangeInt(rng, tpl.effortRange[0], tpl.effortRange[1]),
      confidence: Number(
        (
          tpl.confidenceRange[0] +
          rng() * (tpl.confidenceRange[1] - tpl.confidenceRange[0])
        ).toFixed(2),
      ),
      createdAt: new Date(
        now - createdDaysAgo * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
  });
}

export async function getInsights(
  dealershipId: string,
): Promise<InsightRecord[]> {
  let cached = CACHE.get(dealershipId);
  if (!cached) {
    cached = await buildInsights(dealershipId);
    CACHE.set(dealershipId, cached);
  }
  return cached;
}

export async function getInsightsSummary(dealershipId: string) {
  const insights = await getInsights(dealershipId);
  const open = insights.filter(
    (i) => i.status === "NEW" || i.status === "IN_PROGRESS",
  );
  const critical = open.filter((i) => i.priority === "CRITICAL").length;
  const high = open.filter((i) => i.priority === "HIGH").length;
  const totalProjectedClicks = open.reduce(
    (s, i) => s + i.estimatedClicksGain,
    0,
  );
  const totalProjectedRevenue = open.reduce(
    (s, i) => s + i.estimatedRevenueGainUsd,
    0,
  );
  return {
    total: insights.length,
    open: open.length,
    inProgress: insights.filter((i) => i.status === "IN_PROGRESS").length,
    resolved: insights.filter((i) => i.status === "RESOLVED").length,
    critical,
    high,
    totalProjectedClicks,
    totalProjectedRevenue,
  };
}
