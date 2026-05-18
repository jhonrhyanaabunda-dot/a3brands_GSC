import "server-only";

import { fetchPage, normalizeUrl } from "./fetch";
import { auditHtml } from "./html-audit";
import { auditPerformance } from "./performance";
import { fetchPagespeed } from "./pagespeed";
import { buildRecommendations } from "./recommendations";
import { auditTechnical } from "./technical";
import type { ScanCategory, ScanError, ScanResult } from "./types";

export { SCAN_STAGES } from "./types";
export type { ScanError, ScanResult } from "./types";

function grade(score: number): ScanResult["grade"] {
  if (score >= 92) return "A+";
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 55) return "D";
  return "F";
}

function verdict(score: number, domain: string, redirected: boolean): string {
  if (score >= 90)
    return `${domain} is in elite technical shape. Focus next on local + content depth.`;
  if (score >= 80)
    return `${domain} performs well on fundamentals. Schema and metadata gaps are the biggest upside.`;
  if (score >= 70)
    return `${domain} has a solid foundation but is leaving rich-result and CTR upside on the table.`;
  if (score >= 60)
    return `${domain} is underperforming for its market. Several technical fixes are blocking growth.`;
  if (redirected && score < 60)
    return `${domain} returned a redirected page with multiple structural gaps. Address now.`;
  return `${domain} has urgent technical and content gaps that are blocking organic performance.`;
}

function gscRequiredCategory(): ScanCategory {
  return {
    id: "visibility",
    name: "Keyword Visibility",
    score: 0,
    availability: "skipped",
    summary:
      "Branded vs. non-branded distribution, intent coverage, and CTR vs. market.",
    reason:
      "Requires a connected Google Search Console property. Connect GSC inside the dashboard to unlock real ranking data for this domain.",
    findings: [],
  };
}

function gbpRequiredCategory(): ScanCategory {
  return {
    id: "local",
    name: "Local SEO & GBP",
    score: 0,
    availability: "skipped",
    summary:
      "Google Business Profile health, map-pack visibility, NAP consistency, and reviews.",
    reason:
      "Requires Google Business Profile API access. Connect GBP inside the dashboard to surface map-pack rankings and review data.",
    findings: [],
  };
}

const FALLBACK_CODES = new Set<ScanError["code"]>([
  "HTTP_ERROR",
  "FETCH_FAILED",
  "TIMEOUT",
  "NOT_HTML",
]);

export async function runScan(
  input: string,
): Promise<{ ok: true; result: ScanResult } | { ok: false; error: ScanError }> {
  const norm = normalizeUrl(input);
  if (!norm) {
    return {
      ok: false,
      error: {
        code: "INVALID_URL",
        message:
          "Enter a valid URL - e.g. lonestarford.com or https://your-dealership.com",
      },
    };
  }

  const fetched = await fetchPage(norm.url);

  // Happy path - direct fetch worked
  if (fetched.ok) {
    const page = fetched.page;
    const html = auditHtml(page.html, page.byteSize, page.fetchMs);

    const [technical, performance] = await Promise.all([
      auditTechnical({
        finalUrl: page.finalUrl,
        isHttps: new URL(page.finalUrl).protocol === "https:",
        redirected: page.redirected,
        headers: page.headers,
      }),
      Promise.resolve(
        auditPerformance({
          pageSizeBytes: page.byteSize,
          fetchMs: page.fetchMs,
          scriptCount: html.rawSignals.scriptCount,
          inlineScriptCount: html.rawSignals.inlineScriptCount,
          stylesheetCount: html.rawSignals.stylesheetCount,
          imageCount: html.rawSignals.imageCount,
          imagesMissingDims: html.rawSignals.imagesMissingDims,
          viewportPresent: html.rawSignals.viewportPresent,
        }),
      ),
    ]);

    const categories: ScanCategory[] = [
      html.meta,
      technical,
      performance,
      html.schema,
      gbpRequiredCategory(),
      gscRequiredCategory(),
    ];

    const scoredCategories = categories.filter((c) => c.availability === "ok");
    const overallScore =
      scoredCategories.length > 0
        ? Math.round(
            scoredCategories.reduce((s, c) => s + c.score, 0) /
              scoredCategories.length,
          )
        : 0;

    const recs = buildRecommendations(html, [], norm.domain);

    return {
      ok: true,
      result: {
        url: page.finalUrl,
        inputUrl: norm.url,
        domain: norm.domain,
        scannedAt: new Date().toISOString(),
        overallScore,
        grade: grade(overallScore),
        shortVerdict: verdict(overallScore, norm.domain, page.redirected),
        source: "direct",
        categories,
        recommendations: recs,
        meta: {
          fetchMs: page.fetchMs,
          pageSizeBytes: page.byteSize,
          httpStatus: page.status,
          contentType: page.contentType,
          redirected: page.redirected,
          schemaCount: html.rawSignals.schemas.length,
        },
      },
    };
  }

  // Direct fetch failed - try PageSpeed Insights fallback for fetchable errors
  if (!FALLBACK_CODES.has(fetched.error.code)) {
    return fetched;
  }

  // Try mobile first. If Lighthouse times out OR returns PAGE_HUNG (page
  // stopped responding mid-audit, common on JS-heavy dealership sites behind
  // bot-challenge JS), retry on the desktop pipeline. Desktop has lighter
  // throttling and a separate render budget, so it often succeeds.
  let psi = await fetchPagespeed(norm.url, "mobile");
  const isLighthouseRecoverable = (msg: string) =>
    /PAGE_HUNG|ERRORED_DOCUMENT_REQUEST|FAILED_DOCUMENT_REQUEST|NO_FCP|NO_LCP|TIMEOUT/i.test(
      msg,
    );
  const shouldRetryDesktop =
    !psi.ok &&
    (psi.error.code === "TIMEOUT" || isLighthouseRecoverable(psi.error.message));
  if (shouldRetryDesktop) {
    psi = await fetchPagespeed(norm.url, "desktop");
  }

  // Last-resort retry: if desktop also failed in a recoverable way, try a
  // lightweight inner page. Dealer-site homepages are JS-bloated with sliders,
  // chat widgets, and ad pixels that hang Lighthouse; inner pages often render
  // cleanly even on the same bot-protected origin.
  if (!psi.ok && (psi.error.code === "TIMEOUT" || isLighthouseRecoverable(psi.error.message))) {
    const innerCandidates = ["/about-us", "/contact-us", "/about", "/contact"];
    const origin = `${new URL(norm.url).protocol}//${new URL(norm.url).hostname}`;
    for (const path of innerCandidates) {
      const innerUrl = `${origin}${path}`;
      const innerPsi = await fetchPagespeed(innerUrl, "desktop");
      if (innerPsi.ok) {
        psi = innerPsi;
        break;
      }
    }
  }
  if (!psi.ok) {
    const isQuota = /quota|429/i.test(psi.error.message);
    const isPageHung = /PAGE_HUNG/i.test(psi.error.message);
    const isLighthouseFailure =
      /ERRORED_DOCUMENT_REQUEST|FAILED_DOCUMENT_REQUEST|NO_FCP|NO_LCP/i.test(
        psi.error.message,
      );
    const isTimeout = psi.error.code === "TIMEOUT";

    // Friendly, structured message - no wall of upstream error codes.
    let userMessage: string;
    if (isQuota) {
      userMessage = `${norm.domain} is bot-protected (Cloudflare or WAF), so we relayed through Google's PageSpeed Insights - but our PSI quota is exhausted. Add a free PAGESPEED_API_KEY (console.cloud.google.com → enable "PageSpeed Insights API" → create key) to scan ~25k URLs per day.`;
    } else if (isPageHung || isLighthouseFailure) {
      userMessage = `${norm.domain} is bot-protected (Cloudflare or WAF) and the page is JS-heavy enough that Google's PageSpeed Insights couldn't fully render it on mobile or desktop. Try a lighter inner page on the same site - e.g. ${norm.url.replace(/\/?$/, "")}/about or ${norm.url.replace(/\/?$/, "")}/contact - which typically render faster. Sites like lonestarford.com or a3brands.com will scan in 3-8 seconds.`;
    } else if (isTimeout) {
      userMessage = `${norm.domain} took too long for our scanner (>90s). The site may be temporarily slow. Try again in a minute, or scan a smaller inner page like ${norm.url.replace(/\/?$/, "")}/about.`;
    } else {
      userMessage = `We couldn't audit ${norm.domain}. ${fetched.error.message} Google's PageSpeed Insights fallback also failed: ${psi.error.message}`;
    }

    return {
      ok: false,
      error: {
        code: fetched.error.code,
        message: userMessage,
      },
    };
  }

  const overallScore = psi.result.overallScore;
  return {
    ok: true,
    result: {
      url: psi.result.finalUrl,
      inputUrl: norm.url,
      domain: norm.domain,
      scannedAt: psi.result.fetchTime ?? new Date().toISOString(),
      overallScore,
      grade: grade(overallScore),
      shortVerdict: verdict(overallScore, norm.domain, psi.result.meta.redirected),
      source: "pagespeed",
      sourceNote:
        "Direct fetch was blocked (likely Cloudflare or a WAF). We audited this site through Google's PageSpeed Insights API, which fetches from Google's allowlisted IPs.",
      categories: psi.result.categories,
      recommendations: psi.result.recommendations,
      meta: psi.result.meta,
    },
  };
}
