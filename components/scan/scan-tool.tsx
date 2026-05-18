"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Calendar,
  Check,
  ChevronRight,
  Download,
  Globe,
  Info,
  Loader2,
  Lock,
  RotateCw,
  ShieldAlert,
  Sparkles,
  Target,
  TriangleAlert,
  X,
} from "lucide-react";

import { performScanAction } from "@/actions/scan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadCapture } from "@/components/scan/lead-capture";
import { PdfDownloadButton } from "@/components/scan/pdf-download-button";
import { ScoreRing } from "@/components/scan/score-ring";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Counter } from "@/components/animations/counter";
import type { FindingStatus, ScanResult } from "@/lib/scan/types";
import { SCAN_STAGES } from "@/lib/scan/types";

type Phase = "idle" | "scanning" | "results" | "error";

const STAGE_MS = 600;

const STATUS_STYLES: Record<
  FindingStatus,
  { icon: React.ReactNode; ring: string }
> = {
  pass: {
    icon: <Check className="h-3 w-3" />,
    ring: "bg-brand text-white",
  },
  warn: {
    icon: <TriangleAlert className="h-3 w-3" />,
    ring: "bg-amber-400 text-charcoal",
  },
  fail: {
    icon: <X className="h-3 w-3" />,
    ring: "bg-red-500 text-white",
  },
};

const PRIORITY_VARIANTS: Record<
  ScanResult["recommendations"][number]["priority"],
  "critical" | "warning" | "default" | "muted"
> = {
  CRITICAL: "critical",
  HIGH: "warning",
  MEDIUM: "default",
  LOW: "muted",
};

export function ScanTool() {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [url, setUrl] = React.useState("");
  const [stageIdx, setStageIdx] = React.useState(0);
  const [result, setResult] = React.useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const pendingRef = React.useRef(false);
  const [, startTransition] = React.useTransition();

  const handleScan = (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg(null);
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPhase("scanning");
    setStageIdx(0);

    startTransition(async () => {
      const response = await performScanAction(url);
      pendingRef.current = false;
      if (!response.ok) {
        setErrorMsg(response.error.message);
        setPhase("idle");
        setStageIdx(0);
        return;
      }
      setResult(response.result);
      setStageIdx(SCAN_STAGES.length);
      setTimeout(() => {
        setPhase("results");
        requestAnimationFrame(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }, 280);
    });
  };

  const reset = () => {
    setPhase("idle");
    setResult(null);
    setStageIdx(0);
    setErrorMsg(null);
  };

  React.useEffect(() => {
    if (phase !== "scanning") return;
    if (stageIdx >= SCAN_STAGES.length - 1) return;
    const t = setTimeout(() => setStageIdx((i) => i + 1), STAGE_MS);
    return () => clearTimeout(t);
  }, [phase, stageIdx]);

  return (
    <div className="w-full">
      <FormPanel
        url={url}
        setUrl={setUrl}
        onSubmit={handleScan}
        disabled={phase === "scanning"}
        error={errorMsg}
      />

      <AnimatePresence mode="wait">
        {phase === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 max-w-2xl"
          >
            <ScanningPanel
              domain={extractDomain(url)}
              stageIdx={stageIdx}
              onCancel={reset}
            />
          </motion.div>
        )}

        {phase === "results" && result && (
          <motion.div
            key="results"
            ref={resultsRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <ResultsPanel result={result} onRescan={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function extractDomain(url: string): string {
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function FormPanel({
  url,
  setUrl,
  onSubmit,
  disabled,
  error,
}: {
  url: string;
  setUrl: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  disabled: boolean;
  error: string | null;
}) {
  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl">
      <div
        className={
          "flex flex-col gap-2 rounded-2xl border-2 bg-white p-2 transition-all sm:flex-row sm:items-center sm:rounded-pill sm:gap-0 " +
          (error
            ? "border-red-400 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
            : "border-stone-200 shadow-subtle focus-within:border-brand focus-within:shadow-input-focus")
        }
      >
        <label htmlFor="scan-url" className="sr-only">
          Dealership website URL
        </label>
        <div className="flex flex-1 items-center gap-3 pl-4">
          <Globe className="h-4 w-4 shrink-0 text-stone-400" aria-hidden />
          <input
            id="scan-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            placeholder="a3brands.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled}
            className="h-12 w-full bg-transparent font-display text-[15px] text-charcoal placeholder:text-stone-400 focus:outline-none disabled:opacity-50"
          />
        </div>
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={disabled || url.trim().length === 0}
          className="shrink-0"
        >
          {disabled ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              SCANNING
            </>
          ) : (
            <>
              RUN FREE GSC SCAN
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {error ? (
        <p className="mt-3 text-center text-[13px] font-semibold text-red-600">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-center text-[12px] text-stone">
          We fetch the homepage, parse meta + schema, and check robots.txt + sitemap - typically 3-8 seconds.
        </p>
      )}
    </form>
  );
}

function ScanningPanel({
  domain,
  stageIdx,
  onCancel,
}: {
  domain?: string;
  stageIdx: number;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
            <Loader2 className="h-4 w-4 animate-spin text-brand" />
          </span>
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
              SCANNING
            </p>
            <p className="font-display text-[15px] font-bold text-charcoal">
              {domain ?? "dealership.com"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-stone hover:text-charcoal"
        >
          Cancel
        </button>
      </div>

      <ol className="mt-6 space-y-3">
        {SCAN_STAGES.map((stage, i) => {
          const state =
            i < stageIdx ? "done" : i === stageIdx ? "active" : "pending";
          return (
            <li key={stage} className="flex items-center gap-3">
              <span
                className={
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors " +
                  (state === "done"
                    ? "bg-brand text-white"
                    : state === "active"
                      ? "border-2 border-brand bg-white text-brand"
                      : "border border-stone-200 bg-white text-stone-300")
                }
              >
                {state === "done" ? (
                  <Check className="h-3 w-3" />
                ) : state === "active" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={
                  "text-[13px] transition-colors " +
                  (state === "pending"
                    ? "text-stone-400"
                    : "text-charcoal font-medium")
                }
              >
                {stage}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ResultsPanel({
  result,
  onRescan,
}: {
  result: ScanResult;
  onRescan: () => void;
}) {
  const okCategories = result.categories.filter((c) => c.availability === "ok");
  const skippedCategories = result.categories.filter((c) => c.availability === "skipped");
  const criticalCount = result.recommendations.filter(
    (r) => r.priority === "CRITICAL" || r.priority === "HIGH",
  ).length;
  const kb = Math.round(result.meta.pageSizeBytes / 1024);

  return (
    <div className="space-y-10">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-subtle">
        <div className="grid gap-8 p-7 md:grid-cols-12 md:gap-10 md:p-10">
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
            <ScoreRing score={result.overallScore} grade={result.grade} />
            <p className="mt-4 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-stone">
              {okCategories.length}-CATEGORY SEO SCORE
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="status">
                <Sparkles className="h-3 w-3" />
                Scan complete
              </Badge>
              <Badge variant="muted">
                <Globe className="h-3 w-3" />
                {result.domain}
              </Badge>
              {result.source === "pagespeed" ? (
                <Badge variant="warning">Audited via PageSpeed Insights</Badge>
              ) : null}
              {result.meta.redirected ? (
                <Badge variant="warning">Redirected on fetch</Badge>
              ) : null}
            </div>
            <h2 className="mt-4 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
              {result.shortVerdict}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatTile
                label="HTTP STATUS"
                value={String(result.meta.httpStatus)}
                helper={`${result.meta.fetchMs} ms fetch`}
              />
              <StatTile
                label="PAGE WEIGHT"
                value={`${kb.toLocaleString()} KB`}
                helper={`${result.meta.schemaCount} schema block(s)`}
              />
              <StatTile
                label="PRIORITY ACTIONS"
                value={String(criticalCount)}
                helper="critical + high"
              />
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <PdfDownloadButton url={result.inputUrl} />
              <Button variant="secondary" size="default" asChild>
                <Link href="/book-demo">
                  <Calendar className="h-4 w-4" />
                  BOOK A STRATEGY CALL
                </Link>
              </Button>
              <Button variant="secondary" size="default" onClick={onRescan}>
                <RotateCw className="h-4 w-4" />
                RUN ANOTHER SCAN
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-200 bg-stone-50 px-7 py-3 text-[11px] text-stone md:px-10">
          <Info className="mr-1.5 inline h-3 w-3 align-[-1px] text-brand" />
          {result.source === "pagespeed" ? (
            <>
              <span className="font-display font-semibold text-charcoal">PageSpeed Insights fallback used</span>{" "}
              - {result.sourceNote ?? "Direct fetch was blocked."}
            </>
          ) : (
            <>
              Scan fetched <span className="font-mono text-charcoal">{result.url}</span>{" "}
              at {new Date(result.scannedAt).toLocaleTimeString()} ·{" "}
              {result.meta.contentType ?? "unknown content-type"}
            </>
          )}
        </div>
      </div>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">CATEGORY BREAKDOWN</p>
            <h3 className="mt-2 font-display text-[22px] font-black tracking-tight text-charcoal md:text-[28px]">
              What we actually checked on {result.domain}
            </h3>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {okCategories.map((cat, i) => (
            <ScrollReveal
              key={cat.id}
              delay={Math.min(i * 0.04, 0.25)}
            >
              <CategoryCard category={cat} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {skippedCategories.length > 0 ? (
        <section>
          <div className="mb-6">
            <Badge variant="muted">Requires connection</Badge>
            <h3 className="mt-2 font-display text-[22px] font-black tracking-tight text-charcoal md:text-[28px]">
              Skipped - not auditable from a public scan
            </h3>
            <p className="mt-1.5 text-[14px] leading-[22px] text-stone">
              These categories need an authenticated connection. Sign up to
              connect your GSC + GBP and unlock them.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {skippedCategories.map((cat) => (
              <article
                key={cat.id}
                className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                      {cat.id}
                    </p>
                    <h4 className="mt-1 font-display text-[18px] font-bold text-charcoal">
                      {cat.name}
                    </h4>
                  </div>
                  <Badge variant="muted">
                    <Lock className="h-3 w-3" />
                    Locked
                  </Badge>
                </div>
                <p className="mt-3 text-[14px] leading-[22px] text-stone text-pretty">
                  {cat.summary}
                </p>
                {cat.reason ? (
                  <p className="mt-4 rounded-lg border border-stone-200 bg-white p-3 text-[12px] leading-[18px] text-charcoal text-pretty">
                    {cat.reason}
                  </p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild variant="default" size="sm">
                    <Link href="/book-demo">
                      Connect to unlock
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {result.recommendations.length > 0 ? (
        <section>
          <div className="mb-6">
            <p className="section-label inline-flex items-center gap-1.5">
              <Brain className="h-3 w-3" />
              RECOMMENDATIONS
            </p>
            <h3 className="mt-2 font-display text-[22px] font-black tracking-tight text-charcoal md:text-[28px]">
              Ship these to lift {result.domain}
            </h3>
            <p className="mt-1.5 text-[14px] leading-[22px] text-stone">
              Every recommendation is derived from a finding above. Impact
              numbers are{" "}
              <span className="font-display font-semibold text-charcoal">
                industry-baseline estimates
              </span>{" "}
              from automotive audits - not site-specific predictions.
            </p>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <ScrollReveal key={rec.id} delay={Math.min(i * 0.04, 0.25)}>
                <article className="group relative flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Brain className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={PRIORITY_VARIANTS[rec.priority]}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="muted">{rec.category}</Badge>
                      {typeof rec.confidence === "number" ? (
                        <span className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-stone">
                          {Math.round(rec.confidence * 100)}% confidence
                        </span>
                      ) : null}
                    </div>
                    <h4 className="mt-2 font-display text-[16px] font-bold text-charcoal sm:text-[17px]">
                      {rec.title}
                    </h4>
                    <p className="mt-1 text-[14px] leading-[22px] text-stone text-pretty">
                      {rec.summary}
                    </p>
                    {rec.estimatedClicksGain ||
                    rec.estimatedRevenueGainUsd ||
                    rec.effortHours ? (
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
                        {rec.estimatedClicksGain ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
                            <Target className="h-3 w-3" />+
                            {rec.estimatedClicksGain.toLocaleString()} clicks/mo
                            <span className="font-normal text-stone">(est)</span>
                          </span>
                        ) : null}
                        {rec.estimatedRevenueGainUsd ? (
                          <span className="font-semibold text-charcoal">
                            ${rec.estimatedRevenueGainUsd.toLocaleString()}{" "}
                            projected revenue
                          </span>
                        ) : null}
                        {rec.effortHours ? (
                          <span className="text-stone">
                            {rec.effortHours}h effort
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <ChevronRight className="hidden h-4 w-4 self-center text-stone-300 transition-colors group-hover:text-brand sm:block" />
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
      ) : null}

      <LeadCapture
        scanDomain={result.domain}
        scanScore={result.overallScore}
      />

      <p className="text-center text-[11px] text-stone">
        Real scan. Findings derived from a live fetch of{" "}
        <span className="font-mono">{result.url}</span>. Keyword + GBP categories
        require connecting Google Search Console and Google Business Profile.
      </p>
    </div>
  );
}

function StatTile({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <p className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
        {label}
      </p>
      <p className="mt-1.5 font-display text-[26px] font-black leading-none tracking-tight text-charcoal">
        {value}
      </p>
      {helper ? (
        <p className="mt-1 text-[11px] text-stone">{helper}</p>
      ) : null}
    </div>
  );
}

function CategoryCard({ category }: { category: ScanResult["categories"][number] }) {
  const failCount = category.findings.filter((f) => f.status === "fail").length;
  const warnCount = category.findings.filter((f) => f.status === "warn").length;

  const accent =
    category.score >= 80
      ? "bg-brand"
      : category.score >= 60
        ? "bg-amber-400"
        : "bg-red-500";

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
            {category.id}
          </p>
          <h4 className="mt-1 font-display text-[18px] font-bold text-charcoal">
            {category.name}
          </h4>
        </div>
        <div className="text-right">
          <div className="font-display text-[32px] font-black leading-none tracking-tight text-charcoal">
            <Counter to={category.score} />
          </div>
          <div className="mt-1 inline-flex items-center gap-1 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-stone">
            <span className={"h-1.5 w-1.5 rounded-full " + accent} />
            / 100
          </div>
        </div>
      </div>

      <p className="mt-3 text-[14px] leading-[22px] text-stone text-pretty">
        {category.summary}
      </p>

      {(failCount > 0 || warnCount > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {failCount > 0 && (
            <Badge variant="critical">
              <ShieldAlert className="h-3 w-3" />
              {failCount} failing
            </Badge>
          )}
          {warnCount > 0 && (
            <Badge variant="warning">
              <TriangleAlert className="h-3 w-3" />
              {warnCount} warnings
            </Badge>
          )}
        </div>
      )}

      <ul className="mt-5 space-y-2.5 border-t border-stone-200 pt-5">
        {category.findings.map((f) => (
          <li key={f.label} className="flex items-start gap-3">
            <span
              className={
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
                STATUS_STYLES[f.status].ring
              }
            >
              {STATUS_STYLES[f.status].icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-charcoal">{f.label}</p>
              {f.detail ? (
                <p className="mt-0.5 text-[12px] text-stone break-words">
                  {f.detail}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
