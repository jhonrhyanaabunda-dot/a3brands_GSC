import type { Metadata } from "next";

import { ImpactEffortMatrix } from "@/components/dashboard/impact-effort-matrix";
import { InsightRecoveryHero } from "@/components/dashboard/insight-recovery-hero";
import { InsightsBoard } from "@/components/dashboard/insights-board";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import {
  getInsights,
  getInsightsSummary,
  getSessionContext,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "AI Insights",
};

export default async function InsightsPage() {
  const session = await getSessionContext();
  const [insights, summary] = await Promise.all([
    getInsights(session.dealership.id),
    getInsightsSummary(session.dealership.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AI recommendation engine"
        title="Your action queue"
        description={`Generated for ${session.dealership.name} from your latest GSC, GBP, and PageSpeed data. Ranked by projected click recovery per engineering hour.`}
        meta={
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="critical">{summary.critical} critical</Badge>
            <Badge variant="warning">{summary.high} high</Badge>
            <Badge variant="default">{summary.inProgress} in progress</Badge>
            <Badge variant="success">{summary.resolved} resolved</Badge>
          </div>
        }
      />

      <InsightRecoveryHero
        insights={insights}
        dealershipName={session.dealership.name}
      />

      <ImpactEffortMatrix insights={insights} />

      <InsightsBoard insights={insights} />
    </div>
  );
}
