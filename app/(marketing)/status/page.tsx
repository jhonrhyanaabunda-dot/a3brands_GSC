import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Status",
};

const COMPONENTS = [
  { name: "Dashboard (app.lonestarford.com)", status: "operational", uptime: "99.99%" },
  { name: "Marketing site (lonestarford.com)", status: "operational", uptime: "100.00%" },
  { name: "GSC ingestion worker", status: "operational", uptime: "99.97%" },
  { name: "GBP sync worker", status: "operational", uptime: "99.96%" },
  { name: "AI insights generation", status: "operational", uptime: "99.98%" },
  { name: "PageSpeed Insights fallback", status: "operational", uptime: "99.94%" },
  { name: "PDF report generator", status: "operational", uptime: "99.95%" },
  { name: "Email digests (Postmark)", status: "operational", uptime: "99.99%" },
];

const INCIDENTS = [
  {
    date: "May 12, 2026",
    title: "PSI fallback elevated latency",
    severity: "minor",
    body: "Google PageSpeed Insights API saw elevated latency for ~22 minutes (15:14-15:36 CT). Scans that used the PSI fallback during this window took up to 60s instead of the usual 25-35s. No data loss.",
    resolution: "Resolved upstream by Google. We added a retry-on-timeout to mitigate future incidents.",
  },
  {
    date: "April 28, 2026",
    title: "Dashboard cold-start regression",
    severity: "minor",
    body: "A change to our Postgres connection pooling introduced cold-start latency on the dashboard route. Average TTFB rose from 280ms to 1.2s for ~3 hours.",
    resolution: "Rolled back, then re-deployed with proper connection warming. Added an SLO alert at 500ms TTFB.",
  },
  {
    date: "April 14, 2026",
    title: "Crash on dealership switch",
    severity: "minor",
    body: "Race condition where switching active dealership mid-render would unmount the active query, throwing an exception. ~0.4% of sessions affected over 5 hours.",
    resolution: "Hotfix shipped v1.2.1.",
  },
];

const STATUS_TONE: Record<string, "success" | "warning" | "critical"> = {
  operational: "success",
  degraded: "warning",
  outage: "critical",
};

const SEVERITY_TONE: Record<string, "warning" | "critical" | "muted"> = {
  minor: "muted",
  major: "warning",
  critical: "critical",
};

export default function StatusPage() {
  const allOk = COMPONENTS.every((c) => c.status === "operational");
  return (
    <>
      <InfoHero
        eyebrow="Status"
        title={
          <>
            {allOk ? (
              <>
                All systems <span className="text-brand">operational.</span>
              </>
            ) : (
              <>One or more systems are degraded.</>
            )}
          </>
        }
        description="Live operational status, component-by-component. Subscribe to incident emails at status@lonestarford.com."
      />

      {/* Overall */}
      <section className="container py-8">
        <div
          className={
            "flex items-center gap-3 rounded-2xl border p-5 " +
            (allOk
              ? "border-brand/30 bg-brand/[0.06]"
              : "border-amber-500/30 bg-amber-50")
          }
        >
          <CheckCircle2
            className={"h-5 w-5 " + (allOk ? "text-brand" : "text-amber-600")}
          />
          <div>
            <div className="font-display text-[15px] font-bold text-charcoal">
              {allOk
                ? "All systems are operating normally."
                : "Some systems are experiencing issues."}
            </div>
            <div className="text-[12px] text-stone">
              Last refreshed: {new Date().toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="container py-8">
        <p className="section-label">COMPONENTS</p>
        <h2 className="mt-3 font-display text-[24px] font-black leading-[28px] tracking-tight text-charcoal md:text-[28px] md:leading-[33px]">
          90-day uptime by component
        </h2>

        <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <ul className="divide-y divide-stone-200">
            {COMPONENTS.map((c) => (
              <li
                key={c.name}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "inline-flex h-2.5 w-2.5 rounded-full " +
                      (c.status === "operational"
                        ? "bg-brand"
                        : c.status === "degraded"
                          ? "bg-amber-400"
                          : "bg-red-500")
                    }
                  />
                  <span className="font-display text-[14px] font-medium text-charcoal">
                    {c.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden font-mono text-[12px] text-stone sm:inline">
                    {c.uptime} · 90d
                  </span>
                  <Badge variant={STATUS_TONE[c.status]}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent incidents */}
      <section className="container py-12">
        <p className="section-label">RECENT INCIDENTS</p>
        <h2 className="mt-3 font-display text-[24px] font-black leading-[28px] tracking-tight text-charcoal md:text-[28px] md:leading-[33px]">
          Past 90 days
        </h2>

        <ol className="mt-8 space-y-4">
          {INCIDENTS.map((inc) => (
            <li key={inc.title} className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-stone">
                <Badge variant={SEVERITY_TONE[inc.severity]}>
                  {inc.severity.toUpperCase()}
                </Badge>
                <span className="font-display font-bold uppercase tracking-[0.05em] text-charcoal">
                  {inc.date}
                </span>
              </div>
              <h3 className="mt-2 font-display text-[18px] font-bold text-charcoal">
                {inc.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                {inc.body}
              </p>
              <p className="mt-2 text-[14px] leading-[22px] text-charcoal text-pretty">
                <span className="font-display font-bold">Resolution: </span>
                {inc.resolution}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
