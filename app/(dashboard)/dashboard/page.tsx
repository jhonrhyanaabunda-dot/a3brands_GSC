import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Download, FileText } from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { CompetitorBar } from "@/components/dashboard/competitor-bar";
import { ConnectGscCard } from "@/components/dashboard/connect-gsc-card";
import { DeviceCard } from "@/components/dashboard/device-card";
import { InsightsPreview } from "@/components/dashboard/insights-preview";
import { KeywordPreview } from "@/components/dashboard/keyword-preview";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { LocalPreview } from "@/components/dashboard/local-preview";
import { PageHeader } from "@/components/dashboard/page-header";
import { DemoActionButton } from "@/components/demo/action-button";
import { Button } from "@/components/ui/button";
import {
  getActivity,
  getCompetitorBenchmark,
  getDailyMetrics,
  getDeviceBreakdown,
  getInsights,
  getInsightsSummary,
  getKpiSnapshot,
  getMapPackGrid,
  getReviewSnapshot,
  getSessionContext,
  getTopMovers,
  keywordSummary,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Executive dashboard",
};

export default async function DashboardPage() {
  const session = await getSessionContext();
  const dealershipId = session.dealership.id;

  const [
    kpis,
    series,
    devices,
    insights,
    insightSummary,
    topMovers,
    keywordStats,
    competitorBenchmark,
    mapPackGrid,
    reviews,
    activity,
  ] = await Promise.all([
    getKpiSnapshot(dealershipId, "30d"),
    getDailyMetrics(dealershipId, "90d"),
    getDeviceBreakdown(dealershipId, "30d"),
    getInsights(dealershipId).then((rows) =>
      rows
        .filter((r) => r.status === "NEW" || r.status === "IN_PROGRESS")
        .sort((a, b) => {
          const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as const;
          return order[a.priority] - order[b.priority];
        })
        .slice(0, 4),
    ),
    getInsightsSummary(dealershipId),
    getTopMovers(dealershipId, 6),
    keywordSummary(dealershipId),
    getCompetitorBenchmark(dealershipId, session.dealership.localVisibilityScore),
    getMapPackGrid(dealershipId),
    getReviewSnapshot(dealershipId),
    getActivity(dealershipId),
  ]);

  const mapPackQuery = mapPackGrid[0]?.query ?? `${session.dealership.brand.toLowerCase()} dealer near me`;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${session.dealership.tier} · ${session.dealership.brand} · ${session.dealership.marketArea}`}
        title={`${session.dealership.name} - executive dashboard`}
        description={`Real-time GSC intelligence for ${session.dealership.name}. ${keywordStats.top10} of ${keywordStats.total} tracked keywords rank in top 10.`}
        actions={
          <>
            <Button asChild variant="secondary" size="sm">
              <Link href="/reports">
                <FileText className="h-4 w-4" />
                Reports
              </Link>
            </Button>
            <Button variant="secondary" size="sm">
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>
            <DemoActionButton
              variant="default"
              size="sm"
              toastMessage="Export started."
              toastDescription="Your dashboard export will arrive by email shortly."
            >
              <Download className="h-4 w-4" />
              Export
            </DemoActionButton>
          </>
        }
      />

      <ConnectGscCard />

      <KpiGrid kpis={kpis} series={series} />

      <div className="grid gap-4 lg:grid-cols-3">
        <DeviceCard data={devices} />
        <div className="lg:col-span-2">
          <CompetitorBar data={competitorBenchmark} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <InsightsPreview
            insights={insights}
            totalProjectedClicks={insightSummary.totalProjectedClicks}
          />
        </div>
        <div className="lg:col-span-4">
          <LocalPreview grid={mapPackGrid} query={mapPackQuery} reviews={reviews} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <KeywordPreview keywords={topMovers} />
        </div>
        <div className="lg:col-span-4">
          <ActivityFeed items={activity.slice(0, 6)} />
        </div>
      </div>

      <div className="ink-section rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
              Coming up
            </p>
            <h2 className="mt-2 font-display text-[22px] font-bold tracking-tight text-white sm:text-[24px]">
              {insightSummary.critical + insightSummary.high} high-priority
              actions in your queue
            </h2>
            <p className="mt-1 text-[14px] text-white/75">
              Ship them and recover an estimated{" "}
              <span className="text-white font-semibold">{insightSummary.totalProjectedClicks.toLocaleString()}</span>{" "}
              monthly organic clicks.
            </p>
          </div>
          <Button asChild variant="default">
            <Link href="/insights">
              Open queue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
