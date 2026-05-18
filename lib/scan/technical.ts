import "server-only";

import { fetchText } from "./fetch";
import { scoreFromFindings } from "./html-audit";
import type { Finding, ScanCategory } from "./types";

export interface TechnicalContext {
  /** Final URL after the homepage fetch (may differ from input due to redirect) */
  finalUrl: string;
  /** Whether the page is served over HTTPS */
  isHttps: boolean;
  /** Whether the fetch was redirected at all (e.g., http → https) */
  redirected: boolean;
  /** Headers from the page response */
  headers: Headers;
}

function pickStatus(pass: boolean, warn?: boolean): "pass" | "warn" | "fail" {
  if (pass) return "pass";
  return warn ? "warn" : "fail";
}

export async function auditTechnical(ctx: TechnicalContext): Promise<ScanCategory> {
  const u = new URL(ctx.finalUrl);
  const origin = `${u.protocol}//${u.host}`;

  const [robots, sitemap] = await Promise.all([
    fetchText(`${origin}/robots.txt`),
    fetchText(`${origin}/sitemap.xml`),
  ]);

  const sitemapFromRobots =
    /^sitemap:\s*(\S+)/im.exec(robots.text)?.[1]?.trim() ?? null;

  // If /sitemap.xml is 404 but robots.txt names a sitemap, fetch that one.
  let resolvedSitemapStatus = sitemap.status;
  let resolvedSitemapText = sitemap.text;
  if (!sitemap.ok && sitemapFromRobots) {
    const alt = await fetchText(sitemapFromRobots);
    resolvedSitemapStatus = alt.status;
    resolvedSitemapText = alt.text;
  }

  const robotsHeader = ctx.headers.get("x-robots-tag");
  const blockedByXRobots =
    !!robotsHeader && /noindex/i.test(robotsHeader);

  const hsts = ctx.headers.get("strict-transport-security");
  const contentEncoding =
    ctx.headers.get("content-encoding")?.toLowerCase() ?? "";
  const isCompressed = /gzip|br|zstd|deflate/.test(contentEncoding);

  const findings: Finding[] = [
    {
      label: "HTTPS enforced",
      status: pickStatus(ctx.isHttps),
      detail: ctx.isHttps
        ? "Page served over HTTPS."
        : "Page is served over plain HTTP. Migrate to HTTPS.",
    },
    {
      label: "robots.txt present and reachable",
      status: pickStatus(robots.ok && robots.text.length > 0),
      detail: robots.ok
        ? `${robots.text.split("\n").length} lines · ${robots.text.length} bytes`
        : `HTTP ${robots.status} from /robots.txt`,
    },
    {
      label: "Sitemap discoverable",
      status: pickStatus(
        resolvedSitemapStatus === 200 && resolvedSitemapText.length > 0,
        !!sitemapFromRobots,
      ),
      detail:
        resolvedSitemapStatus === 200
          ? `Sitemap responded 200 (${resolvedSitemapText.length} bytes)`
          : sitemapFromRobots
            ? `Referenced in robots.txt but ${resolvedSitemapStatus} on fetch.`
            : "No /sitemap.xml and no Sitemap: directive in robots.txt.",
    },
    {
      label: "Sitemap referenced in robots.txt",
      status: pickStatus(!!sitemapFromRobots, false),
      detail: sitemapFromRobots
        ? `Sitemap: ${sitemapFromRobots}`
        : "Adding a Sitemap: directive helps crawlers discover URLs.",
    },
    {
      label: "Robots meta or X-Robots-Tag not blocking indexing",
      status: pickStatus(!blockedByXRobots),
      detail: blockedByXRobots
        ? `Header X-Robots-Tag: ${robotsHeader}`
        : "No noindex header on response.",
    },
    {
      label: "Compression enabled (gzip / brotli)",
      status: pickStatus(isCompressed),
      detail: isCompressed
        ? `Content-Encoding: ${contentEncoding}`
        : "No compression detected - enable gzip or brotli at the edge.",
    },
    {
      label: "HSTS enabled",
      status: pickStatus(!!hsts, ctx.isHttps),
      detail: hsts
        ? `Strict-Transport-Security: ${hsts}`
        : "Add HSTS to enforce HTTPS for repeat visitors.",
    },
    {
      label: "No redirect chain on the homepage",
      status: pickStatus(!ctx.redirected, true),
      detail: ctx.redirected
        ? "Homepage redirected at least once on initial load."
        : "Homepage served directly with no redirect.",
    },
  ];

  return {
    id: "technical",
    name: "Technical SEO",
    availability: "ok",
    score: scoreFromFindings(findings),
    summary:
      "Crawlability, indexability, HTTPS, robots.txt, sitemap, compression, and HSTS.",
    findings,
  };
}
