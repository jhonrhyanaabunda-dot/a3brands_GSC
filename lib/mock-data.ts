/**
 * Realistic, deterministic mock data for the marketing site and demo mode.
 * These power the landing-page "live" dashboard preview without a database.
 */
import type { AIRecommendation, ChartPoint, KPI } from "@/types";

export const HERO_METRICS: KPI[] = [
  {
    id: "clicks",
    label: "Organic Clicks",
    value: 248_412,
    delta: 18.4,
    trend: "up",
    format: "compact",
    helper: "vs. previous 90 days",
  },
  {
    id: "impressions",
    label: "Impressions",
    value: 5_184_023,
    delta: 22.1,
    trend: "up",
    format: "compact",
    helper: "vs. previous 90 days",
  },
  {
    id: "ctr",
    label: "Avg CTR",
    value: 4.79,
    delta: 0.6,
    trend: "up",
    format: "percent",
    helper: "rolling 30 day",
  },
  {
    id: "position",
    label: "Avg Position",
    value: 6.2,
    delta: -1.4,
    trend: "up", // lower position is better
    format: "decimal",
    helper: "lower is better",
  },
  {
    id: "opportunity",
    label: "Lead Opportunity",
    value: 82,
    delta: 4,
    trend: "up",
    format: "number",
    unit: "/100",
    helper: "AI composite score",
  },
  {
    id: "health",
    label: "SEO Health",
    value: 91,
    delta: 6,
    trend: "up",
    format: "number",
    unit: "/100",
    helper: "Crawl + content + schema",
  },
];

/**
 * 30-day organic traffic trend used by the hero dashboard preview.
 */
export const TRAFFIC_TREND: ChartPoint[] = Array.from({ length: 30 }).map(
  (_, i) => {
    const base = 5_200 + i * 110;
    const seasonal = Math.sin(i / 3.2) * 540;
    const clicks = Math.max(0, Math.round(base + seasonal));
    const impressions = clicks * (20 + Math.sin(i / 4) * 2);
    const ctr = (clicks / impressions) * 100;
    const position = 7.4 - i * 0.04 + Math.sin(i / 6) * 0.3;
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().slice(0, 10),
      clicks,
      impressions: Math.round(impressions),
      ctr: Number(ctr.toFixed(2)),
      position: Number(position.toFixed(2)),
    };
  },
);

export const DEVICE_SPLIT = [
  { name: "Mobile", value: 62, color: "#3079ff" },
  { name: "Desktop", value: 31, color: "#8ec2ff" },
  { name: "Tablet", value: 7, color: "#374456" },
];

export const COMPETITOR_BENCHMARK = [
  { name: "Your Group", visibility: 78, color: "#3079ff" },
  { name: "AutoNation", visibility: 84, color: "#a3b0bf" },
  { name: "Group 1", visibility: 71, color: "#a3b0bf" },
  { name: "Sonic", visibility: 64, color: "#a3b0bf" },
  { name: "Lithia", visibility: 58, color: "#a3b0bf" },
  { name: "Penske", visibility: 49, color: "#a3b0bf" },
];

export const TOP_KEYWORDS = [
  { query: "ford f-150 dallas", position: 2.1, delta: -3.2, clicks: 4_812 },
  { query: "toyota dealer near me", position: 3.4, delta: -1.8, clicks: 4_209 },
  { query: "ford lease deals plano", position: 4.0, delta: -2.4, clicks: 2_944 },
  { query: "new bmw houston", position: 5.6, delta: +0.7, clicks: 1_812 },
  { query: "chevy silverado for sale austin", position: 6.2, delta: -1.1, clicks: 1_604 },
  { query: "honda service center frisco", position: 7.4, delta: -0.3, clicks: 1_188 },
];

export const AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: "rec-1",
    title: "Competitors outrank you for Ford lease keywords",
    summary:
      "AutoNation Ford holds positions 1-3 for 14 lease-intent queries across your market. Building monthly-payment schema and city-specific lease pages projects +1,240 clicks/mo.",
    category: "COMPETITIVE",
    priority: "HIGH",
    estimatedClicksGain: 1_240,
    estimatedRevenueGainUsd: 68_000,
    effortHours: 18,
    confidence: 0.82,
  },
  {
    id: "rec-2",
    title: "Improve metadata on 32 service pages",
    summary:
      "Service URLs are missing or have over-length meta descriptions. Auto-rewriting with localized intent could lift CTR by 0.8pp.",
    category: "SERVICE_PAGE",
    priority: "MEDIUM",
    estimatedClicksGain: 380,
    estimatedRevenueGainUsd: 21_000,
    effortHours: 6,
    confidence: 0.91,
  },
  {
    id: "rec-3",
    title: "Add local inventory schema (Vehicle + Offer)",
    summary:
      "Detail pages lack structured data. Competitors with Vehicle schema earn 2.3x more rich-result impressions in your market.",
    category: "SCHEMA",
    priority: "CRITICAL",
    estimatedClicksGain: 2_100,
    estimatedRevenueGainUsd: 142_000,
    effortHours: 14,
    confidence: 0.88,
  },
  {
    id: "rec-4",
    title: "Optimize mobile speed on inventory pages",
    summary:
      "LCP averages 4.1s on mobile (target ≤2.5s). Defer non-critical JS and adopt AVIF for hero photos.",
    category: "PERFORMANCE",
    priority: "HIGH",
    estimatedClicksGain: 620,
    effortHours: 9,
    confidence: 0.93,
  },
  {
    id: "rec-5",
    title: "Create 6 city-specific landing pages",
    summary:
      "You rank for nearby cities without dedicated pages (Frisco, Allen, McKinney, Wylie, Murphy, Lucas). +9.4K monthly impressions projected.",
    category: "LOCAL_SEO",
    priority: "MEDIUM",
    estimatedClicksGain: 940,
    estimatedRevenueGainUsd: 52_000,
    effortHours: 22,
    confidence: 0.79,
  },
];

export const DEALER_LOGOS = [
  "AutoNation",
  "Group 1 Automotive",
  "Sonic Automotive",
  "Lithia Motors",
  "Penske Automotive",
  "Sewell",
  "Asbury Automotive",
  "Hendrick Automotive",
];

export const TESTIMONIALS = [
  {
    quote:
      "We added 38% organic leads in one quarter. A3's AI surfaced opportunities our agency had been missing for years.",
    name: "Charles Rourke",
    title: "Principal Dealer",
    org: "A3 Brands Auto Group",
    rating: 5,
  },
  {
    quote:
      "Executive reporting that GMs actually open. The lead opportunity score has become a board-level KPI for us.",
    name: "Priya Desai",
    title: "Marketing Director",
    org: "Crestwood Automotive",
    rating: 5,
  },
  {
    quote:
      "Map-pack visibility across 22 rooftops jumped 41%. The local SEO module pays for itself before lunch.",
    name: "Marcus Hill",
    title: "General Manager",
    org: "Hill Motor Co.",
    rating: 5,
  },
];

export const CASE_STUDIES = [
  {
    title: "A3 Brands Auto Group",
    metric: "+38%",
    metricLabel: "organic leads",
    summary:
      "5-rooftop Ford & Toyota group restructured around AI insights and lifted lease-intent CTR by 1.4pp.",
    tag: "Multi-rooftop",
  },
  {
    title: "Crestwood Automotive",
    metric: "2.3×",
    metricLabel: "rich result impressions",
    summary:
      "Deployed Vehicle + Offer schema sitewide and rebuilt service pages with localized intent.",
    tag: "Schema overhaul",
  },
  {
    title: "Hill Motor Co.",
    metric: "+41%",
    metricLabel: "map-pack visibility",
    summary:
      "City-specific landing pages and a 6-month review cadence pushed map pack into the top 3 for 27 queries.",
    tag: "Local SEO",
  },
];

export const FAQ_ITEMS = [
  {
    q: "How is A3 Brands different from a typical SEO agency?",
    a: "We're an intelligence platform built specifically for automotive - every workflow assumes inventory turnover, lease cycles, OEM compliance, and rooftop-level reporting. Agencies fit cars into generic SEO playbooks. We didn't.",
  },
  {
    q: "Do I need access to Google Search Console?",
    a: "Yes - read-only API access is enough. Onboarding takes ~10 minutes per rooftop. We never modify your GSC settings.",
  },
  {
    q: "Will this work for a single-store GM?",
    a: "Absolutely. We have a streamlined GM dashboard with the four KPIs that matter at the store level and a weekly executive summary delivered to your inbox.",
  },
  {
    q: "How does the AI recommendation engine work?",
    a: "It ingests GSC data, competitor visibility, Core Web Vitals, schema validation, GBP signals, and review sentiment, then prioritizes recommendations by projected click gain and effort.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Data is stored in isolated tenants, encrypted at rest, and never shared between dealer groups. We are SOC 2 Type II aligned.",
  },
  {
    q: "How long until I see results?",
    a: "Most rooftops see measurable improvements in 14-30 days. Schema and technical fixes can lift impressions within a week; new city pages typically rank within 4-8 weeks.",
  },
];

export const PLATFORM_STATS = [
  { value: "2,400+", label: "rooftops monitored" },
  { value: "84M", label: "monthly impressions tracked" },
  { value: "38%", label: "avg. organic lead growth" },
  { value: "<24h", label: "AI insight refresh" },
];
