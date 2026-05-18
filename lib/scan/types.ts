/**
 * Real GSC/SEO scan types.
 * Generated from genuine HTTP fetches + HTML parsing - no fabricated data.
 */

export type FindingStatus = "pass" | "warn" | "fail";

export interface Finding {
  label: string;
  status: FindingStatus;
  detail?: string;
}

export type CategoryAvailability = "ok" | "skipped" | "error";

export interface ScanCategory {
  id: string;
  name: string;
  score: number;       // 0-100 if availability === "ok", else 0
  availability: CategoryAvailability;
  summary: string;
  reason?: string;     // why a category is skipped/errored
  findings: Finding[];
}

export interface ScanRecommendation {
  id: string;
  title: string;
  summary: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  /**
   * Industry-baseline estimates. These are derived from typical impact ranges
   * across automotive SEO audits - not site-specific predictions. UI must
   * label them clearly as estimates.
   */
  estimatedClicksGain?: number;
  estimatedRevenueGainUsd?: number;
  effortHours?: number;
  confidence?: number;
}

export type ScanSource = "direct" | "pagespeed";

export interface ScanResult {
  url: string;             // final URL after any redirects
  inputUrl: string;        // exactly what the user typed (normalized)
  domain: string;
  scannedAt: string;
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  shortVerdict: string;
  source: ScanSource;
  sourceNote?: string;     // optional explanation when fallback was used
  categories: ScanCategory[];
  recommendations: ScanRecommendation[];
  meta: {
    fetchMs: number;
    pageSizeBytes: number;
    httpStatus: number;
    contentType: string | null;
    redirected: boolean;
    schemaCount: number;
  };
}

export interface ScanError {
  code:
    | "INVALID_URL"
    | "BLOCKED_HOST"
    | "FETCH_FAILED"
    | "HTTP_ERROR"
    | "NOT_HTML"
    | "TOO_LARGE"
    | "TIMEOUT";
  message: string;
}

export const SCAN_STAGES = [
  "Resolving domain & fetching homepage…",
  "Auditing meta tags, headings, canonicals…",
  "Checking robots.txt, sitemap.xml & status codes…",
  "Falling back to PageSpeed Insights if site blocked us…",
  "Detecting JSON-LD schema (Organization, Vehicle, Offer)…",
  "Measuring page weight, scripts & mobile readiness…",
  "Composing recommendations…",
] as const;
