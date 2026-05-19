import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Download,
  FileText,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCompactNumber } from "@/lib/utils";
import type { ReportRecord } from "@/lib/data/types";

const TYPE_LABEL: Record<ReportRecord["type"], string> = {
  WEEKLY_EXECUTIVE: "Weekly executive",
  MONTHLY_FULL: "Monthly full",
  GSC_AUDIT: "GSC audit",
  LOCAL_SEO_AUDIT: "Local SEO audit",
  COMPETITOR_BENCHMARK: "Competitor benchmark",
  KPI_SNAPSHOT: "KPI snapshot",
  ROI_PROJECTION: "ROI projection",
};

const TYPE_ACCENT: Record<ReportRecord["type"], string> = {
  WEEKLY_EXECUTIVE: "bg-brand/10 text-brand",
  MONTHLY_FULL: "bg-indigo-100 text-indigo-700",
  GSC_AUDIT: "bg-sky-100 text-sky-700",
  LOCAL_SEO_AUDIT: "bg-emerald-100 text-emerald-700",
  COMPETITOR_BENCHMARK: "bg-rose-100 text-rose-700",
  KPI_SNAPSHOT: "bg-amber-100 text-amber-700",
  ROI_PROJECTION: "bg-violet-100 text-violet-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameYear = s.getFullYear() === e.getFullYear();
  const sFmt = formatDate(start);
  const eFmt = formatDate(end);
  return sameYear ? `${sFmt} – ${eFmt}, ${e.getFullYear()}` : `${sFmt} – ${eFmt}`;
}

export function ReportCard({ report }: { report: ReportRecord }) {
  const k = report.kpis;
  const isReady = report.status === "READY";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-subtle transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-stone-100 p-5">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg " +
              TYPE_ACCENT[report.type]
            }
          >
            <FileText className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.1em] text-stone">
              {TYPE_LABEL[report.type]}
            </p>
            <h3 className="mt-0.5 line-clamp-2 font-display text-[15px] font-bold leading-[20px] text-charcoal">
              {report.title}
            </h3>
            <p className="mt-1 text-[11px] text-stone">
              {formatRange(report.periodStart, report.periodEnd)} · {report.pageCount} pages
            </p>
          </div>
        </div>
        {isReady ? (
          <Badge variant="success">Ready</Badge>
        ) : report.status === "GENERATING" ? (
          <Badge variant="default">
            <Loader2 className="h-3 w-3 animate-spin" />
            Building
          </Badge>
        ) : (
          <Badge variant="destructive">Failed</Badge>
        )}
      </div>

      {/* KPI preview */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-5">
        <KpiBlock
          label="Clicks"
          value={formatCompactNumber(k.clicks)}
          delta={k.clicksDelta}
        />
        <KpiBlock
          label="Impressions"
          value={formatCompactNumber(k.impressions)}
          delta={k.impressionsDelta}
        />
        <KpiBlock
          label="CTR"
          value={`${(k.ctr * 100).toFixed(1)}%`}
          delta={k.ctrDelta * 100}
          suffix="pp"
        />
        <KpiBlock
          label="Avg position"
          value={k.avgPosition.toFixed(1)}
          delta={-k.positionDelta}
          invert
        />
      </div>

      {/* Summary */}
      {report.summary ? (
        <p className="line-clamp-2 px-5 pb-4 text-[12px] leading-[18px] text-stone">
          {report.summary}
        </p>
      ) : null}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-stone-100 bg-stone-50/40 px-5 py-3">
        <Link
          href={`/reports/${encodeURIComponent(report.id)}`}
          className="inline-flex items-center gap-1 font-display text-[12px] font-semibold text-charcoal transition-colors hover:text-brand"
        >
          Open report
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {isReady ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.05em] text-stone hover:border-brand hover:text-brand"
          >
            <Download className="h-3 w-3" />
            PDF
          </button>
        ) : null}
      </div>
    </article>
  );
}

function KpiBlock({
  label,
  value,
  delta,
  suffix = "%",
  invert = false,
}: {
  label: string;
  value: string;
  delta: number;
  suffix?: string;
  invert?: boolean;
}) {
  const positive = invert ? delta < 0 : delta > 0;
  const isFlat = Math.abs(delta) < 0.05;
  const sign = delta > 0 ? "+" : "";
  const absDelta = Math.abs(delta);
  const formatted =
    suffix === "pp" ? `${sign}${delta.toFixed(1)}pp` : `${sign}${absDelta.toFixed(1)}${suffix}`;

  return (
    <div>
      <p className="font-display text-[10px] font-bold uppercase tracking-[0.1em] text-stone">
        {label}
      </p>
      <p className="mt-0.5 font-display text-[20px] font-black leading-none text-charcoal">
        {value}
      </p>
      {!isFlat ? (
        <p
          className={
            "mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold " +
            (positive ? "text-brand" : "text-red-500")
          }
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {formatted}
        </p>
      ) : (
        <p className="mt-1 text-[11px] text-stone">flat</p>
      )}
    </div>
  );
}
