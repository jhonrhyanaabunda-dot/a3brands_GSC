import type {
  AIInsight,
  Competitor,
  Dealership,
  DealerGroup,
  GSCMetric,
  Keyword,
  Lead,
  LocalRanking,
  Notification,
  ReviewSnapshot,
  Role,
  SEOReport,
  TechnicalIssue,
  User,
} from "@prisma/client";

export type {
  AIInsight,
  Competitor,
  Dealership,
  DealerGroup,
  GSCMetric,
  Keyword,
  Lead,
  LocalRanking,
  Notification,
  ReviewSnapshot,
  Role,
  SEOReport,
  TechnicalIssue,
  User,
};

export type Trend = "up" | "down" | "flat";

export interface KPI {
  id: string;
  label: string;
  value: number | string;
  delta?: number; // percent change
  trend?: Trend;
  format?: "number" | "percent" | "decimal" | "currency" | "compact";
  unit?: string;
  helper?: string;
}

export interface ChartPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  summary: string;
  category:
    | "TECHNICAL"
    | "CONTENT"
    | "LOCAL_SEO"
    | "COMPETITIVE"
    | "KEYWORD"
    | "SCHEMA"
    | "PERFORMANCE"
    | "INVENTORY"
    | "SERVICE_PAGE"
    | "GOOGLE_BUSINESS";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  estimatedClicksGain?: number;
  estimatedRevenueGainUsd?: number;
  effortHours?: number;
  confidence?: number;
}

export interface DealershipSummary {
  id: string;
  name: string;
  brand: string;
  city: string;
  state: string;
  seoHealthScore: number;
  leadOpportunityScore: number;
  localVisibilityScore: number;
}
