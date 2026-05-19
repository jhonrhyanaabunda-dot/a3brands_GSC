import type { Metadata } from "next";
import { ArrowRight, Download } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { ReportCard } from "@/components/dashboard/report-card";
import { DemoActionButton } from "@/components/demo/action-button";
import { getReports, getSessionContext } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reports",
};

export default async function ReportsPage() {
  const session = await getSessionContext();
  const reports = await getReports(session.dealership.id);
  const monthly = reports.filter((r) => r.type === "MONTHLY_FULL").length;
  const weekly = reports.filter((r) => r.type === "WEEKLY_EXECUTIVE").length;
  const ready = reports.filter((r) => r.status === "READY").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reporting"
        title="Branded reports & exports"
        description={`${reports.length} reports for ${session.dealership.name} · ${ready} ready to download · ${monthly} monthly, ${weekly} weekly executive summaries.`}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}
