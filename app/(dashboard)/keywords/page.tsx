import type { Metadata } from "next";
import { Download } from "lucide-react";

import { KeywordsTable } from "@/components/dashboard/keywords-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { RankDistribution } from "@/components/dashboard/rank-distribution";
import { TopMoversStrip } from "@/components/dashboard/top-movers-strip";
import { DemoActionButton } from "@/components/demo/action-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getKeywords,
  getSessionContext,
  keywordSummary,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Keywords",
};

export default async function KeywordsPage() {
  const session = await getSessionContext();
  const [keywords, summary] = await Promise.all([
    getKeywords(session.dealership.id),
    keywordSummary(session.dealership.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Keyword tracking"
        title="Where you rank - and how it's moving"
        description={`Tracking ${summary.total} keywords for ${session.dealership.name}. ${summary.top10} rank top 10 (${summary.top3} in top 3).`}
        actions={
          <>
            <DemoActionButton
              variant="secondary"
              size="sm"
              toastMessage="CSV export started."
              toastDescription="Download will begin shortly."
            >
              <Download className="h-4 w-4" />
              Export CSV
            </DemoActionButton>
            <DemoActionButton
              variant="default"
              size="sm"
              toastMessage="Add a keyword to track."
              toastDescription="New keywords appear in this table after the next sync (within 24h)."
            >
              Add keyword
            </DemoActionButton>
          </>
        }
        meta={
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="success">{summary.improved} improved</Badge>
            <Badge variant="warning">{summary.declined} declined</Badge>
            <Badge variant="default">{summary.top10} in top 10</Badge>
            <Badge variant="muted">{summary.top3} in top 3</Badge>
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <RankDistribution keywords={keywords} />
        </div>
        <div className="lg:col-span-7">
          <TopMoversStrip keywords={keywords} />
        </div>
      </div>

      <KeywordsTable keywords={keywords} />
    </div>
  );
}
