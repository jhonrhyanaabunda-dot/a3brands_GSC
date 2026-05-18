import type { HtmlAuditOutput } from "./html-audit";
import type { ScanRecommendation } from "./types";

/**
 * Industry-baseline impact estimates per recommendation ID. Derived from
 * averages across automotive SEO audits - these are NOT site-specific
 * predictions, and the UI labels them as estimates.
 */
const BASELINE_IMPACT: Record<
  string,
  Pick<
    ScanRecommendation,
    "estimatedClicksGain" | "estimatedRevenueGainUsd" | "effortHours" | "confidence"
  >
> = {
  // Title / meta
  "title-missing": { estimatedClicksGain: 480, estimatedRevenueGainUsd: 22000, effortHours: 1, confidence: 0.96 },
  "title-length": { estimatedClicksGain: 220, estimatedRevenueGainUsd: 10000, effortHours: 1, confidence: 0.92 },
  "meta-desc-missing": { estimatedClicksGain: 380, estimatedRevenueGainUsd: 18000, effortHours: 1, confidence: 0.91 },
  "meta-desc-trunc": { estimatedClicksGain: 140, estimatedRevenueGainUsd: 6500, effortHours: 1, confidence: 0.88 },
  "og-missing": { estimatedClicksGain: 120, estimatedRevenueGainUsd: 5500, effortHours: 2, confidence: 0.85 },
  "alt-text": { estimatedClicksGain: 90, estimatedRevenueGainUsd: 4000, effortHours: 3, confidence: 0.82 },

  // Content
  "h1-missing": { estimatedClicksGain: 320, estimatedRevenueGainUsd: 14000, effortHours: 1, confidence: 0.9 },
  "h1-multiple": { estimatedClicksGain: 180, estimatedRevenueGainUsd: 8000, effortHours: 2, confidence: 0.84 },

  // Technical
  "canonical-missing": { estimatedClicksGain: 360, estimatedRevenueGainUsd: 16000, effortHours: 2, confidence: 0.88 },

  // Performance
  "viewport-missing": { estimatedClicksGain: 1100, estimatedRevenueGainUsd: 52000, effortHours: 1, confidence: 0.96 },
  "perf-payload": { estimatedClicksGain: 540, estimatedRevenueGainUsd: 24000, effortHours: 8, confidence: 0.86 },
  "perf-scripts": { estimatedClicksGain: 380, estimatedRevenueGainUsd: 17000, effortHours: 6, confidence: 0.82 },
  "perf-cls": { estimatedClicksGain: 460, estimatedRevenueGainUsd: 20000, effortHours: 4, confidence: 0.89 },

  // Schema
  "schema-org": { estimatedClicksGain: 520, estimatedRevenueGainUsd: 24000, effortHours: 3, confidence: 0.87 },
  "schema-vehicle": { estimatedClicksGain: 2100, estimatedRevenueGainUsd: 140000, effortHours: 14, confidence: 0.88 },
  "schema-offer": { estimatedClicksGain: 880, estimatedRevenueGainUsd: 46000, effortHours: 8, confidence: 0.83 },
  "schema-review": { estimatedClicksGain: 340, estimatedRevenueGainUsd: 15000, effortHours: 4, confidence: 0.86 },

  // Fallback
  scale: { estimatedClicksGain: 420, estimatedRevenueGainUsd: 18000, effortHours: 8, confidence: 0.7 },
};

function enrich(rec: ScanRecommendation): ScanRecommendation {
  const baseline = BASELINE_IMPACT[rec.id];
  if (!baseline) return rec;
  return { ...rec, ...baseline };
}

export function buildRecommendations(
  audit: HtmlAuditOutput,
  technicalFindings: ReturnType<() => string[]>,
  domain: string,
): ScanRecommendation[] {
  const recs: ScanRecommendation[] = [];
  const s = audit.rawSignals;

  // Title
  if (!s.title) {
    recs.push({
      id: "title-missing",
      category: "Meta",
      title: "Add a <title> tag",
      summary:
        "This page has no title tag. Search engines and social shares will fall back to the URL.",
      priority: "CRITICAL",
    });
  } else if (s.titleLength < 30 || s.titleLength > 65) {
    recs.push({
      id: "title-length",
      category: "Meta",
      title: "Tune title length to 30-65 characters",
      summary: `Current length is ${s.titleLength}. Aim for 50-60 chars so the SERP doesn't truncate it.`,
      priority: "MEDIUM",
    });
  }

  // Meta description
  if (!s.metaDescription) {
    recs.push({
      id: "meta-desc-missing",
      category: "Meta",
      title: "Write a meta description",
      summary:
        "Add a <meta name=\"description\"> in <head>. Google generates a snippet when missing, which hurts CTR.",
      priority: "HIGH",
    });
  } else if (s.metaDescriptionLength > 165) {
    recs.push({
      id: "meta-desc-trunc",
      category: "Meta",
      title: "Shorten meta description (currently truncated in SERPs)",
      summary: `Current length is ${s.metaDescriptionLength}. Keep under 165 chars to avoid truncation.`,
      priority: "LOW",
    });
  }

  // H1
  if (s.h1Count === 0) {
    recs.push({
      id: "h1-missing",
      category: "Content",
      title: "Add an H1 to the page",
      summary:
        "No <h1> detected. Add a clear, keyword-rich H1 (typically your top dealership value prop).",
      priority: "HIGH",
    });
  } else if (s.h1Count > 1) {
    recs.push({
      id: "h1-multiple",
      category: "Content",
      title: `Reduce to a single H1 (found ${s.h1Count})`,
      summary:
        "Multiple H1s dilute topical focus. Demote secondary headings to H2/H3.",
      priority: "MEDIUM",
    });
  }

  // Canonical
  if (!s.canonical) {
    recs.push({
      id: "canonical-missing",
      category: "Technical",
      title: "Add a canonical link",
      summary:
        "Missing <link rel=\"canonical\">. This protects against duplicate-content issues from URL parameters.",
      priority: "HIGH",
    });
  }

  // Viewport
  if (!s.viewportPresent) {
    recs.push({
      id: "viewport-missing",
      category: "Performance",
      title: "Add mobile viewport meta",
      summary:
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> is required for usable mobile rendering.",
      priority: "CRITICAL",
    });
  }

  // OG
  if (!s.ogTitle || !s.ogDescription || !s.ogImage) {
    recs.push({
      id: "og-missing",
      category: "Meta",
      title: "Complete Open Graph metadata",
      summary:
        "Add og:title, og:description, and og:image so shared links render with a preview card.",
      priority: "MEDIUM",
    });
  }

  // Schema
  const types = audit.detectedSchemaTypes.map((t) => t.toLowerCase());
  const hasOrg = types.some((t) => /organization|localbusiness|autodealer/.test(t));
  const hasVehicle = types.some((t) => /vehicle/.test(t));
  const hasOffer = types.some((t) => /offer/.test(t));
  const hasReview = types.some((t) => /review|aggregaterating/.test(t));

  if (!hasOrg) {
    recs.push({
      id: "schema-org",
      category: "Schema",
      title: "Add LocalBusiness or AutoDealer JSON-LD",
      summary:
        "Dealership homepages benefit from AutoDealer schema with NAP, geo, hours, and brand.",
      priority: "HIGH",
    });
  }
  if (!hasVehicle) {
    recs.push({
      id: "schema-vehicle",
      category: "Schema",
      title: "Deploy Vehicle schema on VDPs",
      summary:
        "Add Vehicle JSON-LD on every VDP. Competitors with this earn 2-3× rich-result impressions.",
      priority: "CRITICAL",
    });
  }
  if (!hasOffer) {
    recs.push({
      id: "schema-offer",
      category: "Schema",
      title: "Add Offer schema for pricing & availability",
      summary:
        "Required for monthly payment / lease offer rich results.",
      priority: "HIGH",
    });
  }
  if (!hasReview) {
    recs.push({
      id: "schema-review",
      category: "Schema",
      title: "Add Review / AggregateRating schema",
      summary:
        "Earn review stars in the SERP - typically lifts CTR by 0.4-0.9pp.",
      priority: "MEDIUM",
    });
  }

  // Performance
  if (audit.rawSignals.htmlSizeBytes > 500_000) {
    recs.push({
      id: "perf-payload",
      category: "Performance",
      title: "Shrink HTML payload",
      summary: `HTML is ${Math.round(audit.rawSignals.htmlSizeBytes / 1024)} KB. Remove inline styles/scripts and lazy-render below-fold sections.`,
      priority: "HIGH",
    });
  }
  if (audit.rawSignals.scriptCount > 25) {
    recs.push({
      id: "perf-scripts",
      category: "Performance",
      title: "Reduce external script count",
      summary: `${audit.rawSignals.scriptCount} <script src> tags detected. Each one is a network hop on mobile.`,
      priority: "MEDIUM",
    });
  }
  if (
    audit.rawSignals.imageCount > 0 &&
    audit.rawSignals.imagesMissingDims / audit.rawSignals.imageCount > 0.4
  ) {
    recs.push({
      id: "perf-cls",
      category: "Performance",
      title: "Add width + height to images (CLS)",
      summary: `${audit.rawSignals.imagesMissingDims} of ${audit.rawSignals.imageCount} images don't declare dimensions - guaranteed CLS regression on mobile.`,
      priority: "HIGH",
    });
  }

  // Accessibility-ish
  if (
    audit.rawSignals.imageCount > 0 &&
    audit.rawSignals.imagesMissingAlt / audit.rawSignals.imageCount > 0.2
  ) {
    recs.push({
      id: "alt-text",
      category: "Content",
      title: "Add alt text to images",
      summary: `${audit.rawSignals.imagesMissingAlt} of ${audit.rawSignals.imageCount} images missing alt. Alt text helps image search and accessibility.`,
      priority: "LOW",
    });
  }

  // Ensure at least one positive forward-looking action when site is clean
  if (recs.length === 0) {
    recs.push({
      id: "scale",
      category: "Local SEO",
      title: `${domain} is in good shape - focus on local + competitive plays`,
      summary:
        "Connect Google Search Console to surface keyword opportunities, then map-pack grid scans for surrounding cities.",
      priority: "MEDIUM",
    });
  }

  // Sort by priority
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as const;
  recs.sort((a, b) => order[a.priority] - order[b.priority]);

  return recs.slice(0, 10).map(enrich);
}
