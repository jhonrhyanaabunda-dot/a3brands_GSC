import "server-only";

import * as cheerio from "cheerio";

import type { Finding, ScanCategory } from "./types";

export interface HtmlAuditOutput {
  meta: ScanCategory;
  performance: Pick<ScanCategory, "findings"> & { stats: PerfStats };
  schema: ScanCategory;
  detectedSchemaTypes: string[];
  rawSignals: {
    title: string | null;
    titleLength: number;
    metaDescription: string | null;
    metaDescriptionLength: number;
    h1Count: number;
    h1Texts: string[];
    canonical: string | null;
    viewportPresent: boolean;
    langPresent: boolean;
    ogTitle: boolean;
    ogDescription: boolean;
    ogImage: boolean;
    twitterCard: boolean;
    robotsMeta: string | null;
    hreflangCount: number;
    imageCount: number;
    imagesMissingAlt: number;
    imagesMissingDims: number;
    scriptCount: number;
    inlineScriptCount: number;
    stylesheetCount: number;
    htmlSizeBytes: number;
    textLength: number;
    schemas: SchemaBlock[];
  };
}

export interface PerfStats {
  pageSizeBytes: number;
  fetchMs: number;
  scriptCount: number;
  inlineScriptCount: number;
  stylesheetCount: number;
  imageCount: number;
  imagesMissingDims: number;
}

export interface SchemaBlock {
  type: string;
  valid: boolean;
  raw: string;
}

function pickStatus(pass: boolean, warn?: boolean): "pass" | "warn" | "fail" {
  if (pass) return "pass";
  return warn ? "warn" : "fail";
}

function scoreFromFindings(findings: Finding[]): number {
  if (findings.length === 0) return 0;
  const weights = { pass: 1, warn: 0.55, fail: 0.1 };
  const total = findings.reduce((s, f) => s + weights[f.status], 0);
  return Math.round((total / findings.length) * 100);
}

function listSchemaTypes(parsed: unknown): string[] {
  const types: string[] = [];
  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    const obj = node as Record<string, unknown>;
    const t = obj["@type"];
    if (typeof t === "string") types.push(t);
    else if (Array.isArray(t)) for (const x of t) if (typeof x === "string") types.push(x);
    if (Array.isArray(obj["@graph"])) for (const g of obj["@graph"] as unknown[]) visit(g);
  };
  visit(parsed);
  return types;
}

export function auditHtml(html: string, pageBytes: number, fetchMs: number): HtmlAuditOutput {
  const $ = cheerio.load(html);
  const title = ($("head title").first().text() || null)?.trim() || null;
  const metaDescription = ($('head meta[name="description"]').attr("content") || "").trim() || null;
  const h1Texts = $("h1")
    .toArray()
    .map((el) => $(el).text().trim())
    .filter(Boolean);
  const canonical = ($('head link[rel="canonical"]').attr("href") || "").trim() || null;
  const viewportPresent = $('head meta[name="viewport"]').length > 0;
  const langPresent = ($("html").attr("lang") || "").trim() !== "";
  const ogTitle = $('head meta[property="og:title"]').length > 0;
  const ogDescription = $('head meta[property="og:description"]').length > 0;
  const ogImage = $('head meta[property="og:image"]').length > 0;
  const twitterCard = $('head meta[name="twitter:card"]').length > 0;
  const robotsMeta = ($('head meta[name="robots"]').attr("content") || "").trim() || null;
  const hreflangCount = $('head link[rel="alternate"][hreflang]').length;

  const allImages = $("img").toArray();
  const imageCount = allImages.length;
  let imagesMissingAlt = 0;
  let imagesMissingDims = 0;
  for (const img of allImages) {
    const $img = $(img);
    if (($img.attr("alt") ?? "").trim() === "") imagesMissingAlt++;
    if (!$img.attr("width") || !$img.attr("height")) imagesMissingDims++;
  }

  const scriptCount = $("script[src]").length;
  const inlineScriptCount = $("script:not([src])").length;
  const stylesheetCount = $('link[rel="stylesheet"]').length;
  const textLength = $("body").text().replace(/\s+/g, " ").trim().length;

  // ---- Schema (JSON-LD) ----
  const schemas: SchemaBlock[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    try {
      const parsed = JSON.parse(raw);
      const types = listSchemaTypes(parsed);
      if (types.length === 0) {
        schemas.push({ type: "Unknown", valid: true, raw });
      } else {
        for (const t of types) schemas.push({ type: t, valid: true, raw });
      }
    } catch {
      schemas.push({ type: "InvalidJSON", valid: false, raw });
    }
  });

  const detectedSchemaTypes = Array.from(new Set(schemas.map((s) => s.type)));

  // ---- Meta & Content findings ----
  const metaFindings: Finding[] = [
    {
      label: "Title tag present",
      status: pickStatus(!!title),
      detail: title ? `"${title.slice(0, 80)}${title.length > 80 ? "…" : ""}"` : "Page has no <title> tag.",
    },
    {
      label: "Title length between 30 and 65 characters",
      status: pickStatus(
        !!title && title.length >= 30 && title.length <= 65,
        !!title && (title.length < 30 ? title.length >= 15 : title.length <= 75),
      ),
      detail: title ? `${title.length} chars` : "-",
    },
    {
      label: "Meta description present",
      status: pickStatus(!!metaDescription),
      detail: metaDescription
        ? `${metaDescription.length} chars`
        : "No <meta name=\"description\"> in <head>.",
    },
    {
      label: "Meta description length between 70 and 165 characters",
      status: pickStatus(
        !!metaDescription && metaDescription.length >= 70 && metaDescription.length <= 165,
        !!metaDescription && metaDescription.length >= 50 && metaDescription.length <= 200,
      ),
      detail: metaDescription ? `${metaDescription.length} chars` : "-",
    },
    {
      label: "Exactly one H1 on the page",
      status: pickStatus(h1Texts.length === 1, h1Texts.length === 0 || h1Texts.length === 2),
      detail:
        h1Texts.length === 0
          ? "No H1 found."
          : h1Texts.length === 1
            ? `"${h1Texts[0]?.slice(0, 80)}${(h1Texts[0]?.length ?? 0) > 80 ? "…" : ""}"`
            : `${h1Texts.length} H1 tags detected (recommended: 1).`,
    },
    {
      label: "Canonical link present",
      status: pickStatus(!!canonical),
      detail: canonical ?? "No <link rel=\"canonical\"> in <head>.",
    },
    {
      label: "Open Graph tags (og:title, og:description, og:image)",
      status: pickStatus(
        ogTitle && ogDescription && ogImage,
        ogTitle || ogDescription || ogImage,
      ),
      detail: [
        ogTitle ? "og:title ✓" : "og:title ✗",
        ogDescription ? "og:description ✓" : "og:description ✗",
        ogImage ? "og:image ✓" : "og:image ✗",
      ].join(" · "),
    },
    {
      label: "Twitter card meta tag",
      status: pickStatus(twitterCard),
      detail: twitterCard ? "twitter:card present" : "No twitter:card.",
    },
    {
      label: "Mobile viewport meta",
      status: pickStatus(viewportPresent),
      detail: viewportPresent ? "viewport=device-width detected" : "Missing - mobile rendering will break.",
    },
    {
      label: "HTML lang attribute set",
      status: pickStatus(langPresent),
      detail: langPresent ? "<html lang=…> present" : "No lang attribute - hurts i18n + accessibility.",
    },
  ];

  if (imageCount > 0) {
    metaFindings.push({
      label: "Images have alt text",
      status: pickStatus(imagesMissingAlt === 0, imagesMissingAlt / imageCount < 0.25),
      detail:
        imagesMissingAlt === 0
          ? `All ${imageCount} images have alt text.`
          : `${imagesMissingAlt} of ${imageCount} images missing alt.`,
    });
  }

  const meta: ScanCategory = {
    id: "meta",
    name: "Meta & Content",
    availability: "ok",
    score: scoreFromFindings(metaFindings),
    summary: "Title tags, descriptions, headings, canonicals, social previews, and accessibility basics.",
    findings: metaFindings,
  };

  // ---- Schema findings ----
  const hasOrganization = detectedSchemaTypes.some(
    (t) => /organization/i.test(t) || /localbusiness/i.test(t) || /autodealer/i.test(t),
  );
  const hasLocalBusiness = detectedSchemaTypes.some(
    (t) => /localbusiness/i.test(t) || /autodealer/i.test(t),
  );
  const hasVehicle = detectedSchemaTypes.some((t) => /vehicle/i.test(t));
  const hasOffer = detectedSchemaTypes.some((t) => /offer/i.test(t));
  const hasReview = detectedSchemaTypes.some(
    (t) => /review/i.test(t) || /aggregaterating/i.test(t),
  );
  const hasInvalid = schemas.some((s) => !s.valid);

  const schemaFindings: Finding[] = [
    {
      label: "Structured data present",
      status: pickStatus(detectedSchemaTypes.length > 0),
      detail:
        detectedSchemaTypes.length === 0
          ? "No JSON-LD blocks detected."
          : `${schemas.length} JSON-LD block(s) · types: ${detectedSchemaTypes.join(", ")}`,
    },
    {
      label: "Organization or LocalBusiness schema",
      status: pickStatus(hasOrganization),
      detail: hasOrganization ? "Detected on page." : "Recommended for dealership homepages.",
    },
    {
      label: "LocalBusiness / AutoDealer schema",
      status: pickStatus(hasLocalBusiness),
      detail: hasLocalBusiness
        ? "Detected."
        : "Add AutoDealer JSON-LD with NAP for stronger local signals.",
    },
    {
      label: "Vehicle schema (on this page)",
      status: pickStatus(hasVehicle, false),
      detail: hasVehicle
        ? "Detected - eligible for vehicle rich results."
        : "Not detected. Add Vehicle JSON-LD on VDPs to earn rich results.",
    },
    {
      label: "Offer / pricing schema",
      status: pickStatus(hasOffer, false),
      detail: hasOffer ? "Detected." : "Missing. Add Offer with price/availability to VDPs.",
    },
    {
      label: "Review or AggregateRating schema",
      status: pickStatus(hasReview, false),
      detail: hasReview ? "Detected." : "Missing - review stars in SERP unlock CTR lifts.",
    },
    {
      label: "All JSON-LD parses as valid JSON",
      status: pickStatus(!hasInvalid),
      detail: hasInvalid
        ? "Some JSON-LD blocks are malformed - Google may ignore them."
        : "All schema blocks parse cleanly.",
    },
  ];

  const schema: ScanCategory = {
    id: "schema",
    name: "Schema & Structured Data",
    availability: "ok",
    score: scoreFromFindings(schemaFindings),
    summary:
      "JSON-LD coverage for AutoDealer, Vehicle, Offer, LocalBusiness, and Review markup.",
    findings: schemaFindings,
  };

  // ---- Performance signals (extracted, scored in performance.ts) ----
  const perfStats: PerfStats = {
    pageSizeBytes: pageBytes,
    fetchMs,
    scriptCount,
    inlineScriptCount,
    stylesheetCount,
    imageCount,
    imagesMissingDims,
  };

  return {
    meta,
    schema,
    performance: { findings: [], stats: perfStats },
    detectedSchemaTypes,
    rawSignals: {
      title,
      titleLength: title?.length ?? 0,
      metaDescription,
      metaDescriptionLength: metaDescription?.length ?? 0,
      h1Count: h1Texts.length,
      h1Texts,
      canonical,
      viewportPresent,
      langPresent,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      robotsMeta,
      hreflangCount,
      imageCount,
      imagesMissingAlt,
      imagesMissingDims,
      scriptCount,
      inlineScriptCount,
      stylesheetCount,
      htmlSizeBytes: pageBytes,
      textLength,
      schemas,
    },
  };
}

export { scoreFromFindings };
