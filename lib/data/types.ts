/**
 * Shared types for the dashboard data layer.
 * Server-callable functions return these - Prisma can be swapped in later
 * without touching the consumers.
 */

export type Trend = "up" | "down" | "flat";

export interface DealershipRecord {
  id: string;
  slug: string;
  name: string;
  brand:
    | "FORD"
    | "TOYOTA"
    | "HONDA"
    | "CHEVROLET"
    | "BMW"
    | "JEEP"
    | "MERCEDES"
    | "LEXUS";
  tier: "FLAGSHIP" | "STANDARD" | "SATELLITE";
  city: string;
  state: string;
  websiteUrl: string;
  gbpUrl: string;
  marketArea: string;
  seoHealthScore: number;
  leadOpportunityScore: number;
  localVisibilityScore: number;
  competitorRank: number;
  competitorCount: number;
  lastScannedAt: string;
}

export interface KpiSnapshot {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  delta: number;
  trend: Trend;
  format: "number" | "percent" | "decimal" | "compact";
  unit?: string;
  helper?: string;
  invertTrend?: boolean;
}

export interface DailyMetric {
  date: string; // ISO date
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface DeviceShare {
  device: "Mobile" | "Desktop" | "Tablet";
  share: number;
  clicks: number;
  delta: number;
}

export interface GeographicCity {
  city: string;
  state: string;
  clicks: number;
  share: number;
  mapPackRank: number;
}

export type InsightCategory =
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

export type InsightPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type InsightStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";

export interface InsightRecord {
  id: string;
  dealershipId: string;
  title: string;
  summary: string;
  rationale: string;
  category: InsightCategory;
  priority: InsightPriority;
  status: InsightStatus;
  estimatedClicksGain: number;
  estimatedRevenueGainUsd: number;
  effortHours: number;
  confidence: number;
  createdAt: string;
}

export type KeywordIntent =
  | "BRAND"
  | "COMMERCIAL"
  | "TRANSACTIONAL"
  | "INFORMATIONAL"
  | "LOCAL"
  | "INVENTORY"
  | "SERVICE";

export interface KeywordRecord {
  id: string;
  query: string;
  intent: KeywordIntent;
  isBranded: boolean;
  searchVolume: number;
  difficulty: number;
  cpcCents: number;
  currentPosition: number;
  previousPosition: number;
  bestPosition: number;
  clicks: number;
  impressions: number;
  ctr: number;
  url: string;
}

export interface CompetitorRecord {
  id: string;
  name: string;
  domain: string;
  brand: string;
  distanceMiles: number;
  visibilityScore: number;
  sharedKeywords: number;
  outrankedBy: number;
  averagePosition: number;
  estimatedTraffic: number;
  delta: number;
}

export interface LocalRankingPoint {
  query: string;
  city: string;
  state: string;
  position: number;
  inMapPack: boolean;
  gridX: number;
  gridY: number;
}

export interface ReviewSnapshotRecord {
  totalReviews: number;
  averageRating: number;
  newReviews30d: number;
  responseRate: number;
  sentimentPositive: number;
  sentimentNeutral: number;
  sentimentNegative: number;
}

export interface GbpHealthRecord {
  verified: boolean;
  photosLast14d: number;
  postsLast30d: number;
  qAndACoverage: number;
  hoursAccuracy: number;
  napConsistency: number;
  score: number;
}

export interface TechnicalIssueRecord {
  id: string;
  title: string;
  description: string;
  url: string;
  category: InsightCategory;
  severity: InsightPriority;
  resolved: boolean;
  detectedAt: string;
}

export interface ReportRecord {
  id: string;
  dealershipId: string;
  type:
    | "WEEKLY_EXECUTIVE"
    | "MONTHLY_FULL"
    | "GSC_AUDIT"
    | "LOCAL_SEO_AUDIT"
    | "COMPETITOR_BENCHMARK"
    | "KPI_SNAPSHOT"
    | "ROI_PROJECTION";
  status: "READY" | "GENERATING" | "FAILED";
  title: string;
  periodStart: string;
  periodEnd: string;
  summary: string;
  pdfUrl?: string;
  createdAt: string;
  completedAt?: string;
  pageCount: number;
  kpis: {
    clicks: number;
    clicksDelta: number;
    impressions: number;
    impressionsDelta: number;
    ctr: number;
    ctrDelta: number;
    avgPosition: number;
    positionDelta: number;
  };
}

export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "CRITICAL"
  | "REPORT_READY"
  | "AI_INSIGHT"
  | "COMPETITOR_ALERT"
  | "RANKING_DROP"
  | "RANKING_GAIN";

export interface NotificationRecord {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
}

export type ActivityKind =
  | "ranking_gain"
  | "ranking_drop"
  | "report_generated"
  | "insight_resolved"
  | "insight_created"
  | "scan_completed"
  | "competitor_move"
  | "review_received";

export interface ActivityRecord {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  amount?: string;
  at: string; // ISO timestamp
  href?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DEALER_GROUP" | "MARKETING_DIRECTOR" | "GENERAL_MANAGER";
  title: string;
  dealerships: string[]; // dealership IDs
  active: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface SessionContext {
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "DEALER_GROUP" | "MARKETING_DIRECTOR" | "GENERAL_MANAGER";
    title: string;
    avatarInitials: string;
  };
  dealership: DealershipRecord;
  isDemo: boolean;
}

export type DateRange = "7d" | "30d" | "90d";
