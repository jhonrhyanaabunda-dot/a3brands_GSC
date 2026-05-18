import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight, Building2, MapPin, Target } from "lucide-react";

import { CompetitorBar } from "@/components/dashboard/competitor-bar";
import { PageHeader } from "@/components/dashboard/page-header";
import { DemoActionButton } from "@/components/demo/action-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCompetitorBenchmark,
  getCompetitors,
  getSessionContext,
} from "@/lib/data";
import { formatCompactNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Competitors",
};

export default async function CompetitorsPage() {
  const session = await getSessionContext();
  const [competitors, benchmark] = await Promise.all([
    getCompetitors(session.dealership.id),
    getCompetitorBenchmark(session.dealership.id, session.dealership.localVisibilityScore),
  ]);

  const yourRank =
    benchmark.findIndex((c) => c.you) + 1 || benchmark.length;
  const ahead = competitors.filter(
    (c) => c.visibilityScore > session.dealership.localVisibilityScore,
  ).length;
  const behind = competitors.length - ahead;
  const sharedKeywordsTotal = competitors.reduce((s, c) => s + c.sharedKeywords, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Competitive intelligence"
        title="Who's eating your search share"
        description={`${competitors.length} in-market competitors tracked across ${sharedKeywordsTotal.toLocaleString()} shared keywords. You rank #${yourRank}.`}
        actions={
          <>
            <DemoActionButton
              variant="secondary"
              size="sm"
              toastMessage="Add a competitor."
              toastDescription="Tracked competitors appear in this benchmark after the next sync."
            >
              Add competitor
            </DemoActionButton>
            <DemoActionButton
              variant="default"
              size="sm"
              toastMessage="Head-to-head report queued."
              toastDescription="Generating shared-keyword report for your top 3 competitors."
            >
              Run head-to-head
            </DemoActionButton>
          </>
        }
        meta={
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="success">{behind} below you</Badge>
            <Badge variant="warning">{ahead} ahead of you</Badge>
          </div>
        }
      />

      <CompetitorBar data={benchmark} />

      <section>
        <h2 className="mb-4 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
          Competitor detail
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {competitors.map((c) => {
            const positive = c.delta > 0;
            return (
              <li key={c.id}>
                <article className="rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-charcoal text-white">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-[16px] font-bold text-charcoal">
                        {c.name}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-stone">
                        <span className="font-mono">{c.domain}</span>
                        <span className="inline-flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {c.distanceMiles.toFixed(1)} mi away
                        </span>
                      </div>
                    </div>
                    <Badge variant={positive ? "warning" : "success"}>
                      {positive ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(c.delta).toFixed(1)}pp
                    </Badge>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-end justify-between gap-3">
                      <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                        Visibility score
                      </span>
                      <span className="font-display text-[24px] font-bold tracking-tight text-charcoal">
                        {c.visibilityScore}
                      </span>
                    </div>
                    <span className="mt-2 inline-block h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                      <span
                        className="block h-full rounded-full bg-brand"
                        style={{ width: `${c.visibilityScore}%` }}
                      />
                    </span>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-stone-200 pt-4 text-[14px]">
                    <Stat label="Shared keywords" value={c.sharedKeywords.toLocaleString()} />
                    <Stat label="They outrank you on" value={c.outrankedBy.toLocaleString()} />
                    <Stat label="Avg position" value={c.averagePosition.toFixed(1)} />
                    <Stat label="Est. monthly traffic" value={formatCompactNumber(c.estimatedTraffic)} />
                  </dl>

                  <div className="mt-5 flex gap-2">
                    <DemoActionButton
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      toastMessage={`Gap analysis vs. ${c.name}.`}
                      toastDescription="Surfacing 50 keywords they rank for that you don't."
                    >
                      <Target className="h-3.5 w-3.5" />
                      Gap analysis
                    </DemoActionButton>
                    <DemoActionButton
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      toastMessage={`${c.sharedKeywords} shared keywords.`}
                      toastDescription={`Opening detail view for ${c.name}.`}
                    >
                      Shared keywords
                    </DemoActionButton>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
        {label}
      </dt>
      <dd className="mt-1 font-display text-[14px] font-bold text-charcoal">{value}</dd>
    </div>
  );
}
