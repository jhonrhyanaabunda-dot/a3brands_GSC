import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Download, FileText, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { DemoActionButton } from "@/components/demo/action-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReports, getSessionContext } from "@/lib/data";
import { formatCompactNumber } from "@/lib/utils";
import type { ReportRecord } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Reports",
};

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

export default async function ReportsPage() {
  const session = await getSessionContext();
  const reports = await getReports(session.dealership.id);
  const monthly = reports.filter((r) => r.type === "MONTHLY_FULL").length;
  const weekly = reports.filter((r) => r.type === "WEEKLY_EXECUTIVE").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reporting"
        title="Branded reports & exports"
        description={`${reports.length} reports for ${session.dealership.name} (${monthly} monthly, ${weekly} weekly executive summaries).`}
        actions={
          <>
            <DemoActionButton
              variant="secondary"
              size="sm"
              toastMessage="Bulk download started."
              toastDescription="A ZIP of every report will arrive by email within a minute."
            >
              <Download className="h-4 w-4" />
              Bulk download
            </DemoActionButton>
            <DemoActionButton
              variant="default"
              size="sm"
              toastMessage="Report generation queued."
              toastDescription="Your new report will appear in this list within ~45 seconds."
            >
              Generate new report
              <ArrowRight className="h-4 w-4" />
            </DemoActionButton>
          </>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[14px]">
            <thead className="bg-stone-50 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              <tr>
                <th className="px-4 py-3 text-left">Report</th>
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">Pages</th>
                <th className="px-4 py-3 text-right">Status</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {reports.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-stone-50/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/reports/${encodeURIComponent(r.id)}`}
                      className="flex items-center gap-3 text-charcoal"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{r.title}</span>
                        <span className="block text-[11px] text-stone">
                          {TYPE_LABEL[r.type]}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-stone">
                    {formatDate(r.periodStart)} → {formatDate(r.periodEnd)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-charcoal">
                    {formatCompactNumber(r.kpis.clicks)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-stone">
                    {r.pageCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "READY" ? (
                      <Badge variant="success">Ready</Badge>
                    ) : r.status === "GENERATING" ? (
                      <Badge variant="default">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Generating
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/reports/${encodeURIComponent(r.id)}`}
                      className="inline-flex items-center text-stone hover:text-brand"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
