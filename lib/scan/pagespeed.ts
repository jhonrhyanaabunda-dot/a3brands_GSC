import "server-only";

import type {
  Finding,
  FindingStatus,
  ScanCategory,
  ScanError,
  ScanRecommendation,
} from "./types";

/**
 * Google PageSpeed Insights API fallback.
 *
 * Used when our direct fetch is blocked (403 from Cloudflare/Akamai/WAFs).
 * PSI fetches from Google's own IPs, which most CDNs allowlist by default,
 * so this lets us audit otherwise-unreachable dealership sites.
 *
 * No API key required for low-volume use. Set PAGESPEED_API_KEY for higher
 * quota (25k req/day per key).
 */

const PSI_ENDPOINT =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
// PSI typically returns in 15-45s, but heavy automotive sites (large JS bundles,
// many ads, Cloudflare's bot-challenge JS) can push it past 60s.
const PSI_TIMEOUT_MS = 90_000;

interface PSIAudit {
  id?: string;
  title: string;
  description?: string;
  score: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  numericValue?: number;
  details?: {
    items?: Array<Record<string, unknown>>;
  };
}

interface PSILighthouseResult {
  requestedUrl: string;
  finalUrl: string;
  fetchTime: string;
  audits: Record<string, PSIAudit>;
  categories?: Record<
    string,
    { id: string; title: string; score: number | null }
  >;
}

interface PSIResponse {
  lighthouseResult?: PSILighthouseResult;
  loadingExperience?: {
    metrics?: Record<string, { percentile: number; category: string }>;
  };
  originLoadingExperience?: {
    metrics?: Record<string, { percentile: number; category: string }>;
  };
  error?: { code?: number; message?: string };
}

export interface PSIAuditOutput {
  source: "pagespeed";
  finalUrl: string;
  fetchTime: string;
  categories: ScanCategory[];
  recommendations: ScanRecommendation[];
  meta: {
    fetchMs: number;
    pageSizeBytes: number;
    httpStatus: number;
    redirected: boolean;
    contentType: string | null;
    schemaCount: number;
  };
  overallScore: number;
  fieldMetrics: FieldMetrics | null;
}

interface FieldMetrics {
  lcpMs: number | null;
  clsScore: number | null;
  inpMs: number | null;
  fcpMs: number | null;
}

export async function fetchPagespeed(
  url: string,
  strategy: "mobile" | "desktop" = "mobile",
): Promise<{ ok: true; result: PSIAuditOutput } | { ok: false; error: ScanError }> {
  const apiKey = process.env.PAGESPEED_API_KEY;

  const params = new URLSearchParams();
  params.set("url", url);
  params.set("strategy", strategy);
  params.append("category", "performance");
  params.append("category", "seo");
  params.append("category", "accessibility");
  params.append("category", "best-practices");
  if (apiKey) params.set("key", apiKey);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PSI_TIMEOUT_MS);
  const t0 = Date.now();

  let res: Response;
  try {
    res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
  } catch (err) {
    clearTimeout(timer);
    const isTimeout = (err as Error)?.name === "AbortError";
    return {
      ok: false,
      error: {
        code: isTimeout ? "TIMEOUT" : "FETCH_FAILED",
        message: isTimeout
          ? "PageSpeed Insights timed out after 50 seconds."
          : "Could not reach PageSpeed Insights.",
      },
    };
  }
  clearTimeout(timer);
  const fetchMs = Date.now() - t0;

  if (!res.ok) {
    let upstream = "";
    try {
      const j = await res.json();
      upstream = j?.error?.message ?? "";
    } catch {}
    return {
      ok: false,
      error: {
        code: "HTTP_ERROR",
        message: `PageSpeed Insights returned ${res.status}${upstream ? ` - ${upstream}` : ""}.`,
      },
    };
  }

  const data = (await res.json()) as PSIResponse;
  if (data.error) {
    return {
      ok: false,
      error: {
        code: "FETCH_FAILED",
        message: data.error.message ?? "PageSpeed Insights rejected this URL.",
      },
    };
  }

  const lh = data.lighthouseResult;
  if (!lh) {
    return {
      ok: false,
      error: {
        code: "FETCH_FAILED",
        message: "PageSpeed Insights returned no Lighthouse data.",
      },
    };
  }

  const fieldMetrics: FieldMetrics = {
    lcpMs: data.originLoadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
    clsScore:
      typeof data.originLoadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile === "number"
        ? data.originLoadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100
        : null,
    inpMs: data.originLoadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
    fcpMs: data.originLoadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile ?? null,
  };

  const categories = buildCategoriesFromPSI(lh, fieldMetrics);
  const recommendations = buildRecommendationsFromPSI(lh);

  const overallScore = Math.round(
    categories.reduce((s, c) => s + c.score, 0) /
      Math.max(categories.filter((c) => c.availability === "ok").length, 1),
  );

  const totalByteWeight = lh.audits["total-byte-weight"]?.numericValue ?? 0;

  return {
    ok: true,
    result: {
      source: "pagespeed",
      finalUrl: lh.finalUrl ?? url,
      fetchTime: lh.fetchTime,
      categories,
      recommendations,
      overallScore,
      fieldMetrics,
      meta: {
        fetchMs,
        pageSizeBytes: Math.round(totalByteWeight),
        httpStatus: 200, // PSI succeeded, even if we couldn't directly
        redirected: lh.finalUrl !== lh.requestedUrl,
        contentType: "text/html (via PSI)",
        schemaCount: 0, // PSI doesn't expose schema parsing
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Mapping: Lighthouse audit → our Finding shape
// ---------------------------------------------------------------------------

function scoreToStatus(score: number | null | undefined): FindingStatus {
  if (score === null || score === undefined) return "warn";
  if (score >= 0.9) return "pass";
  if (score >= 0.5) return "warn";
  return "fail";
}

function scoreFromFindings(findings: Finding[]): number {
  if (findings.length === 0) return 0;
  const weights = { pass: 1, warn: 0.55, fail: 0.1 };
  const total = findings.reduce((s, f) => s + weights[f.status], 0);
  return Math.round((total / findings.length) * 100);
}

function audit(
  audits: Record<string, PSIAudit>,
  key: string,
  label: string,
): Finding {
  const a = audits[key];
  if (!a) {
    return { label, status: "warn", detail: "Not reported by PageSpeed Insights." };
  }
  return {
    label,
    status: scoreToStatus(a.score),
    detail: a.displayValue || a.title || a.description || undefined,
  };
}

function fmtMs(ms: number | null): string {
  if (ms === null) return "-";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function buildCategoriesFromPSI(
  lh: PSILighthouseResult,
  field: FieldMetrics,
): ScanCategory[] {
  const a = lh.audits;

  // ---- Meta & Content ----
  const metaFindings: Finding[] = [
    audit(a, "document-title", "Title tag present"),
    audit(a, "meta-description", "Meta description present"),
    audit(a, "html-has-lang", "HTML lang attribute"),
    audit(a, "viewport", "Mobile viewport configured"),
    audit(a, "canonical", "Canonical tag present"),
    audit(a, "heading-order", "Heading order is correct"),
    audit(a, "image-alt", "Images have alt text"),
    audit(a, "link-text", "Links have descriptive text"),
  ];

  // ---- Technical SEO ----
  const technicalFindings: Finding[] = [
    audit(a, "is-crawlable", "Page is indexable"),
    audit(a, "robots-txt", "robots.txt is valid"),
    audit(a, "hreflang", "hreflang configuration valid"),
    audit(a, "http-status-code", "Returns successful HTTP status"),
    audit(a, "crawlable-anchors", "Links are crawlable"),
    audit(a, "plugins", "Avoids plugins (Flash, Silverlight)"),
    audit(a, "redirects", "Avoids redirect chains"),
    audit(a, "uses-http2", "Uses HTTP/2 for resources"),
  ];

  // ---- Performance (this is where PSI really shines) ----
  const lcpAudit = a["largest-contentful-paint"];
  const clsAudit = a["cumulative-layout-shift"];
  const fcpAudit = a["first-contentful-paint"];
  const tbtAudit = a["total-blocking-time"];
  const siAudit = a["speed-index"];
  const ttiAudit = a["interactive"];

  const performanceFindings: Finding[] = [
    {
      label: "LCP (lab) under 2.5s",
      status: scoreToStatus(lcpAudit?.score),
      detail: lcpAudit?.displayValue ?? fmtMs(lcpAudit?.numericValue ?? null),
    },
    {
      label: "CLS (lab) under 0.1",
      status: scoreToStatus(clsAudit?.score),
      detail: clsAudit?.displayValue ?? String(clsAudit?.numericValue ?? "-"),
    },
    {
      label: "FCP (lab) under 1.8s",
      status: scoreToStatus(fcpAudit?.score),
      detail: fcpAudit?.displayValue ?? fmtMs(fcpAudit?.numericValue ?? null),
    },
    {
      label: "Total blocking time under 200ms",
      status: scoreToStatus(tbtAudit?.score),
      detail: tbtAudit?.displayValue ?? fmtMs(tbtAudit?.numericValue ?? null),
    },
    {
      label: "Speed Index reasonable",
      status: scoreToStatus(siAudit?.score),
      detail: siAudit?.displayValue ?? fmtMs(siAudit?.numericValue ?? null),
    },
    audit(a, "total-byte-weight", "Page weight under threshold"),
    audit(a, "render-blocking-resources", "No render-blocking CSS/JS"),
    audit(a, "uses-optimized-images", "Images optimized"),
    audit(a, "modern-image-formats", "Modern image formats served"),
    audit(a, "uses-text-compression", "Text compression enabled"),
    audit(a, "unused-css-rules", "No unused CSS"),
    audit(a, "unused-javascript", "No unused JavaScript"),
  ];

  // Field data (CrUX) - origin-level real user metrics
  if (field.lcpMs !== null) {
    performanceFindings.push({
      label: "LCP (real users / origin)",
      status:
        field.lcpMs <= 2500 ? "pass" : field.lcpMs <= 4000 ? "warn" : "fail",
      detail: `${fmtMs(field.lcpMs)} (75th percentile across this origin from CrUX)`,
    });
  }
  if (field.inpMs !== null) {
    performanceFindings.push({
      label: "INP (real users / origin)",
      status:
        field.inpMs <= 200 ? "pass" : field.inpMs <= 500 ? "warn" : "fail",
      detail: `${fmtMs(field.inpMs)} (75th percentile across this origin from CrUX)`,
    });
  }
  if (field.clsScore !== null) {
    performanceFindings.push({
      label: "CLS (real users / origin)",
      status:
        field.clsScore <= 0.1
          ? "pass"
          : field.clsScore <= 0.25
            ? "warn"
            : "fail",
      detail: `${field.clsScore.toFixed(3)} (75th percentile across this origin from CrUX)`,
    });
  }

  // ---- Schema - PSI doesn't expose HTML; flag as skipped ----
  const schemaCategory: ScanCategory = {
    id: "schema",
    name: "Schema & Structured Data",
    availability: "skipped",
    score: 0,
    summary:
      "JSON-LD coverage for AutoDealer, Vehicle, Offer, LocalBusiness, and Review markup.",
    reason:
      "We fell back to PageSpeed Insights to bypass site bot-protection, and PSI doesn't expose raw HTML for schema parsing. Connect this dealership's GSC to unlock schema auditing.",
    findings: [],
  };

  return [
    {
      id: "meta",
      name: "Meta & Content",
      availability: "ok",
      score: scoreFromFindings(metaFindings),
      summary:
        "Title tags, descriptions, headings, canonicals, accessibility - audited via Lighthouse.",
      findings: metaFindings,
    },
    {
      id: "technical",
      name: "Technical SEO",
      availability: "ok",
      score: scoreFromFindings(technicalFindings),
      summary:
        "Indexability, robots.txt, redirects, HTTP/2 - audited via Lighthouse.",
      findings: technicalFindings,
    },
    {
      id: "performance",
      name: "Performance & Mobile",
      availability: "ok",
      score: scoreFromFindings(performanceFindings),
      summary:
        "Lighthouse lab metrics + Chrome UX Report field data from real users.",
      findings: performanceFindings,
    },
    schemaCategory,
    {
      id: "local",
      name: "Local SEO & GBP",
      availability: "skipped",
      score: 0,
      summary:
        "Google Business Profile health, map-pack visibility, NAP consistency, and reviews.",
      reason:
        "Requires Google Business Profile API access. Connect GBP inside the dashboard to surface map-pack rankings and review data.",
      findings: [],
    },
    {
      id: "visibility",
      name: "Keyword Visibility",
      availability: "skipped",
      score: 0,
      summary:
        "Branded vs. non-branded distribution, intent coverage, and CTR vs. market.",
      reason:
        "Requires a connected Google Search Console property. Connect GSC inside the dashboard to unlock real ranking data for this domain.",
      findings: [],
    },
  ];
}

// Industry-baseline impact estimates per PSI recommendation ID. Same caveat
// as the direct-path enrichment in recommendations.ts: NOT site-specific.
const PSI_BASELINE_IMPACT: Record<
  string,
  Pick<
    ScanRecommendation,
    "estimatedClicksGain" | "estimatedRevenueGainUsd" | "effortHours" | "confidence"
  >
> = {
  lcp: { estimatedClicksGain: 820, estimatedRevenueGainUsd: 38000, effortHours: 9, confidence: 0.93 },
  cls: { estimatedClicksGain: 460, estimatedRevenueGainUsd: 20000, effortHours: 4, confidence: 0.89 },
  tbt: { estimatedClicksGain: 320, estimatedRevenueGainUsd: 14000, effortHours: 6, confidence: 0.82 },
  "render-blocking": { estimatedClicksGain: 620, estimatedRevenueGainUsd: 28000, effortHours: 5, confidence: 0.88 },
  "modern-images": { estimatedClicksGain: 360, estimatedRevenueGainUsd: 16000, effortHours: 4, confidence: 0.86 },
  "image-alt": { estimatedClicksGain: 140, estimatedRevenueGainUsd: 6000, effortHours: 3, confidence: 0.82 },
  title: { estimatedClicksGain: 480, estimatedRevenueGainUsd: 22000, effortHours: 1, confidence: 0.96 },
  description: { estimatedClicksGain: 380, estimatedRevenueGainUsd: 18000, effortHours: 1, confidence: 0.91 },
  viewport: { estimatedClicksGain: 1100, estimatedRevenueGainUsd: 52000, effortHours: 1, confidence: 0.96 },
  canonical: { estimatedClicksGain: 360, estimatedRevenueGainUsd: 16000, effortHours: 2, confidence: 0.88 },
  robots: { estimatedClicksGain: 540, estimatedRevenueGainUsd: 24000, effortHours: 2, confidence: 0.9 },
  compression: { estimatedClicksGain: 220, estimatedRevenueGainUsd: 10000, effortHours: 2, confidence: 0.86 },
};

function buildRecommendationsFromPSI(
  lh: PSILighthouseResult,
): ScanRecommendation[] {
  const recs: ScanRecommendation[] = [];
  const a = lh.audits;

  const rec = (
    id: string,
    auditKey: string,
    title: string,
    summary: string,
    priority: ScanRecommendation["priority"],
    category: string,
  ) => {
    const audit = a[auditKey];
    if (!audit) return;
    if (audit.score === null || audit.score >= 0.9) return;
    recs.push({
      id,
      title,
      summary: audit.displayValue
        ? `${summary} Current: ${audit.displayValue}.`
        : summary,
      priority: audit.score < 0.5 ? priority : "MEDIUM",
      category,
    });
  };

  rec(
    "lcp",
    "largest-contentful-paint",
    "Cut Largest Contentful Paint",
    "Mobile LCP is the single biggest ranking signal in your performance score. Defer non-critical JS, serve hero images as AVIF/WebP, and preload above-the-fold images.",
    "HIGH",
    "Performance",
  );
  rec(
    "cls",
    "cumulative-layout-shift",
    "Eliminate layout shift",
    "CLS regression destroys CTR. Declare width + height on every image, reserve space for ad slots, and avoid late-injected DOM.",
    "HIGH",
    "Performance",
  );
  rec(
    "tbt",
    "total-blocking-time",
    "Reduce main-thread blocking time",
    "Heavy JS execution blocks the main thread. Split bundles, defer analytics, and lazy-load below-the-fold widgets.",
    "MEDIUM",
    "Performance",
  );
  rec(
    "render-blocking",
    "render-blocking-resources",
    "Inline critical CSS, defer the rest",
    "Render-blocking CSS/JS delays first paint. Inline above-the-fold CSS and defer the rest of your stylesheets.",
    "HIGH",
    "Performance",
  );
  rec(
    "modern-images",
    "modern-image-formats",
    "Serve images as AVIF or WebP",
    "Modern formats are 25-50% smaller than JPEG/PNG. Inventory images especially benefit.",
    "MEDIUM",
    "Performance",
  );
  rec(
    "image-alt",
    "image-alt",
    "Add alt text to inventory and service images",
    "Alt text is required for image search, accessibility, and ranking signals.",
    "MEDIUM",
    "Content",
  );
  rec(
    "title",
    "document-title",
    "Fix page title",
    "Pages without a clear, keyword-rich <title> get a generic SERP listing - directly hurts CTR.",
    "CRITICAL",
    "Meta",
  );
  rec(
    "description",
    "meta-description",
    "Add or rewrite meta description",
    "Without a meta description, Google generates a snippet which often misses the dealership's primary value prop.",
    "HIGH",
    "Meta",
  );
  rec(
    "viewport",
    "viewport",
    "Add mobile viewport meta",
    "Mandatory for mobile ranking. Without it, mobile users see a desktop layout zoomed out - guaranteed CLS + bounce.",
    "CRITICAL",
    "Performance",
  );
  rec(
    "canonical",
    "canonical",
    "Fix canonical configuration",
    "Broken canonicals cause duplicate-content penalties on inventory pages especially.",
    "HIGH",
    "Technical",
  );
  rec(
    "robots",
    "robots-txt",
    "Repair robots.txt",
    "A misconfigured robots.txt can de-index entire sections of the site without warning.",
    "HIGH",
    "Technical",
  );
  rec(
    "compression",
    "uses-text-compression",
    "Enable text compression",
    "Enable gzip or brotli at the edge. Typical HTML/CSS/JS savings of 60-80%.",
    "MEDIUM",
    "Performance",
  );

  // Order by priority + enrich with baseline impact
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as const;
  recs.sort((x, y) => order[x.priority] - order[y.priority]);
  return recs.slice(0, 10).map((r) => ({
    ...r,
    ...(PSI_BASELINE_IMPACT[r.id] ?? {}),
  }));
}
