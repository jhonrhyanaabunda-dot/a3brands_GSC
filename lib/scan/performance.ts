import "server-only";

import { scoreFromFindings } from "./html-audit";
import type { Finding, ScanCategory } from "./types";

export interface PerformanceInput {
  pageSizeBytes: number;
  fetchMs: number;
  scriptCount: number;
  inlineScriptCount: number;
  stylesheetCount: number;
  imageCount: number;
  imagesMissingDims: number;
  viewportPresent: boolean;
}

function pickStatus(pass: boolean, warn?: boolean): "pass" | "warn" | "fail" {
  if (pass) return "pass";
  return warn ? "warn" : "fail";
}

export function auditPerformance(input: PerformanceInput): ScanCategory {
  const kb = Math.round(input.pageSizeBytes / 1024);

  const findings: Finding[] = [
    {
      label: "Homepage TTFB-ish under 2 seconds (server-side fetch)",
      status: pickStatus(input.fetchMs < 1500, input.fetchMs < 3000),
      detail: `Our server fetched the HTML in ${input.fetchMs} ms. (Real browser timing varies.)`,
    },
    {
      label: "HTML payload under 200 KB",
      status: pickStatus(kb < 200, kb < 500),
      detail: `HTML is ${kb.toLocaleString()} KB (${input.pageSizeBytes.toLocaleString()} bytes).`,
    },
    {
      label: "External scripts under 20",
      status: pickStatus(input.scriptCount < 20, input.scriptCount < 40),
      detail: `${input.scriptCount} <script src> tags detected.`,
    },
    {
      label: "Inline scripts under 10",
      status: pickStatus(input.inlineScriptCount < 10, input.inlineScriptCount < 25),
      detail: `${input.inlineScriptCount} inline <script> blocks detected.`,
    },
    {
      label: "Stylesheets under 10",
      status: pickStatus(input.stylesheetCount < 10, input.stylesheetCount < 25),
      detail: `${input.stylesheetCount} <link rel="stylesheet"> tags detected.`,
    },
    {
      label: "Mobile viewport meta tag present",
      status: pickStatus(input.viewportPresent),
      detail: input.viewportPresent
        ? "viewport=device-width detected."
        : "Missing - page will not render correctly on mobile.",
    },
  ];

  if (input.imageCount > 0) {
    findings.push({
      label: "Images declare width + height (CLS prevention)",
      status: pickStatus(
        input.imagesMissingDims === 0,
        input.imagesMissingDims / input.imageCount < 0.4,
      ),
      detail:
        input.imagesMissingDims === 0
          ? `All ${input.imageCount} images include dimensions.`
          : `${input.imagesMissingDims} of ${input.imageCount} images missing width/height.`,
    });
  }

  return {
    id: "performance",
    name: "Performance & Mobile",
    availability: "ok",
    score: scoreFromFindings(findings),
    summary:
      "Page weight, request count, mobile readiness, and CLS-safe images measured from our server-side fetch.",
    findings,
  };
}
