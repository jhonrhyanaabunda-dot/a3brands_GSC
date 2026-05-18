import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  Clock,
  Download,
  FileText,
  Printer,
  Share2,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { DemoActionButton } from "@/components/demo/action-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReport, getSessionContext } from "@/lib/data";
import { formatCompactNumber } from "@/lib/utils";
import type { ReportRecord } from "@/lib/data/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const session = await getSessionContext();
  const report = await getReport(session.dealership.id, decodeURIComponent(id));
  return {
    title: report ? report.title : "Report",
  };
}

const TYPE_LABEL: Record<ReportRecord["type"], string> = {
  WEEKLY_EXECUTIVE: "Weekly executive",
  MONTHLY_FULL: "Monthly full",
  GSC_AUDIT: "GSC audit",
  LOCAL_SEO_AUDIT: "Local SEO audit",
  COMPETITOR_BENCHMARK: "Competitor benchmark",
  KPI_SNAPSHOT: "KPI snapshot",
  ROI_PROJECTION: "ROI projection",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getSessionContext();
  const report = await getReport(session.dealership.id, decodeURIComponent(id));
  if (!report) notFound();

  const KPIS: Array<{ label: string; value: string; delta: number; helper: string; invert?: boolean }> = [
    {
      label: "Organic clicks",
      value: formatCompactNumber(report.kpis.clicks),
      delta: report.kpis.clicksDelta,
      helper: "vs. prior period",
    },
    {
      label: "Impressions",
      value: formatCompactNumber(report.kpis.impressions),
      delta: report.kpis.impressionsDelta,
      helper: "vs. prior period",
    },
    {
      label: "CTR",
      value: `${report.kpis.ctr.toFixed(2)}%`,
      delta: report.kpis.ctrDelta,
      helper: "percentage points",
    },
    {
      label: "Avg position",
      value: report.kpis.avgPosition.toFixed(2),
      delta: report.kpis.positionDelta,
      helper: "lower is better",
      invert: true,
    },
  ];

  return (
    <div className="space-y-8">
      <Link
        href="/reports"
        className="inline-flex items-center gap-1 font-display text-[12px] font-medium text-stone transition-colors hover:text-charcoal"
      >
        <ChevronLeft className="h-3 w-3" />
        All reports
      </Link>

      <PageHeader
        eyebrow={TYPE_LABEL[report.type]}
        title={report.title}
        description={`Period: ${formatDate(report.periodStart)} → ${formatDate(report.periodEnd)} · ${report.pageCount} pages · ${report.status === "GENERATING" ? "currently generating" : "ready"}`}
        actions={
          <>
            <DemoActionButton
              variant="secondary"
              size="sm"
              toastMessage="Share link copied."
              toastDescription="Anyone with the link + workspace access can view this report."
            >
              <Share2 className="h-4 w-4" />
              Share
            </DemoActionButton>
            <DemoActionButton
              variant="secondary"
              size="sm"
              toastMessage="Opening print preview."
              toastDescription="Use Cmd+P / Ctrl+P to print in production."
            >
              <Printer className="h-4 w-4" />
              Print
            </DemoActionButton>
            <DemoActionButton
              variant="default"
              size="sm"
              disabled={report.status === "GENERATING"}
              toastMessage="PDF download started."
              toastDescription="The full branded report will save to your downloads folder."
            >
              <Download className="h-4 w-4" />
              Download PDF
            </DemoActionButton>
          </>
        }
      />

      <section className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-stone">
          <Badge variant="default">
            <FileText className="h-3 w-3" />
            Executive summary
          </Badge>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Generated{" "}
            {report.completedAt
              ? new Date(report.completedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "-"}
          </span>
        </div>
        <p className="mt-4 max-w-3xl text-[15px] leading-[24px] text-charcoal text-pretty">
          {report.summary}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => {
          const positive = k.invert ? k.delta < 0 : k.delta > 0;
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                {k.label}
              </p>
              <p className="mt-1 font-display text-[24px] font-bold tracking-tight text-charcoal">
                {k.value}
              </p>
              <p
                className={
                  "mt-1 inline-flex items-center gap-0.5 text-[12px] " +
                  (positive ? "text-brand" : "text-amber-600")
                }
              >
                {positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {k.delta > 0 ? "+" : ""}
                {k.delta.toFixed(1)}{" "}
                <span className="text-stone">{k.helper}</span>
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 lg:col-span-2">
          <h2 className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            What changed
          </h2>
          <ul className="mt-3 space-y-2.5 text-[14px] leading-[22px] text-charcoal">
            <li>
              Clicks{" "}
              <span
                className={
                  report.kpis.clicksDelta >= 0 ? "text-brand font-semibold" : "text-amber-600 font-semibold"
                }
              >
                {report.kpis.clicksDelta > 0 ? "+" : ""}
                {report.kpis.clicksDelta.toFixed(1)}%
              </span>{" "}
              vs. the prior period - total {formatCompactNumber(report.kpis.clicks)}.
            </li>
            <li>
              CTR shifted{" "}
              <span
                className={
                  report.kpis.ctrDelta >= 0 ? "text-brand font-semibold" : "text-amber-600 font-semibold"
                }
              >
                {report.kpis.ctrDelta > 0 ? "+" : ""}
                {report.kpis.ctrDelta.toFixed(2)}pp
              </span>{" "}
              to {report.kpis.ctr.toFixed(2)}% on{" "}
              {formatCompactNumber(report.kpis.impressions)} impressions.
            </li>
            <li>
              Average position {report.kpis.positionDelta <= 0 ? "improved" : "regressed"} by{" "}
              <span
                className={
                  report.kpis.positionDelta <= 0 ? "text-brand font-semibold" : "text-amber-600 font-semibold"
                }
              >
                {Math.abs(report.kpis.positionDelta).toFixed(2)}
              </span>{" "}
              to {report.kpis.avgPosition.toFixed(2)}.
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Distribution
          </h2>
          <ul className="mt-3 space-y-2 text-[14px]">
            <li className="flex justify-between text-charcoal">
              <span>Principal Dealer</span>
              <span className="text-stone">Email</span>
            </li>
            <li className="flex justify-between text-charcoal">
              <span>VP of Operations</span>
              <span className="text-stone">Email</span>
            </li>
            <li className="flex justify-between text-charcoal">
              <span>General Managers (3)</span>
              <span className="text-stone">Email</span>
            </li>
            <li className="flex justify-between text-charcoal">
              <span>Marketing Director</span>
              <span className="text-stone">Slack</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
