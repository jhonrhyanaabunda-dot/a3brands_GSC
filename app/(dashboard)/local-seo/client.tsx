"use client";

import * as React from "react";
import { CheckCircle2, Star, TriangleAlert } from "lucide-react";

import { MapPackGrid } from "@/components/dashboard/map-pack-grid";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type {
  GbpHealthRecord,
  LocalRankingPoint,
  ReviewSnapshotRecord,
  TechnicalIssueRecord,
} from "@/lib/data/types";

interface Props {
  queries: string[];
  initialQuery: string;
  initialGrid: LocalRankingPoint[];
  reviews: ReviewSnapshotRecord;
  gbp: GbpHealthRecord;
  issues: TechnicalIssueRecord[];
  dealershipName: string;
  city: string;
  state: string;
}

function generateGrid(query: string): LocalRankingPoint[] {
  let state = 2166136261;
  for (let i = 0; i < query.length; i++) {
    state ^= query.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  state = Math.abs(state) >>> 0;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
  const offset = 2;
  const points: LocalRankingPoint[] = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const distance = Math.sqrt((x - offset) ** 2 + (y - offset) ** 2);
      const noise = (next() - 0.5) * 3;
      const position = Math.max(1, Math.round(distance * 2.5 + 1 + noise));
      points.push({
        query,
        city: "",
        state: "",
        gridX: x,
        gridY: y,
        position,
        inMapPack: position <= 3,
      });
    }
  }
  return points;
}

export function LocalSeoClient({
  queries,
  initialQuery,
  initialGrid,
  reviews,
  gbp,
  issues,
  dealershipName,
  city,
  state,
}: Props) {
  const [query, setQuery] = React.useState(initialQuery);
  const grid = React.useMemo(
    () => (query === initialQuery ? initialGrid : generateGrid(query)),
    [query, initialQuery, initialGrid],
  );
  const inPack = grid.filter((g) => g.inMapPack).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Local SEO · ${city}, ${state}`}
        title="Map pack, GBP health & reviews"
        description={`${inPack}/${grid.length} grid cells in top 3 for "${query}" around ${dealershipName}.`}
      />

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MapPackGrid
            grid={grid}
            queries={queries}
            selected={query}
            onSelect={setQuery}
          />
        </div>

        <div className="space-y-5 lg:col-span-5">
          <GbpHealthCard gbp={gbp} />
          <ReviewsCard reviews={reviews} />
        </div>
      </div>

      <TechnicalIssuesCard issues={issues} />
    </div>
  );
}

function GbpHealthCard({ gbp }: { gbp: GbpHealthRecord }) {
  const rows = [
    { label: "Verified profile", value: gbp.verified ? "Yes" : "No", tone: gbp.verified ? "good" : "bad" },
    { label: "Photos last 14d", value: gbp.photosLast14d, tone: gbp.photosLast14d >= 7 ? "good" : gbp.photosLast14d >= 3 ? "warn" : "bad" },
    { label: "Posts last 30d", value: gbp.postsLast30d, tone: gbp.postsLast30d >= 4 ? "good" : gbp.postsLast30d >= 2 ? "warn" : "bad" },
    { label: "Q&A coverage", value: `${gbp.qAndACoverage}%`, tone: gbp.qAndACoverage >= 80 ? "good" : gbp.qAndACoverage >= 60 ? "warn" : "bad" },
    { label: "Hours accuracy", value: `${gbp.hoursAccuracy}%`, tone: gbp.hoursAccuracy >= 95 ? "good" : "warn" },
    { label: "NAP consistency", value: `${gbp.napConsistency}%`, tone: gbp.napConsistency >= 90 ? "good" : "warn" },
  ];
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Google Business Profile
          </p>
          <h3 className="mt-1 font-display text-[16px] font-bold text-charcoal">
            GBP health score
          </h3>
        </div>
        <div className="text-right">
          <div className="font-display text-[28px] font-black leading-none tracking-tight text-charcoal">
            {gbp.score}
          </div>
          <div className="mt-1 font-display text-[10px] font-bold uppercase tracking-wider text-stone">
            / 100
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Progress value={gbp.score} />
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-3 text-[14px] sm:grid-cols-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2"
          >
            <dt className="text-[12px] text-stone">{r.label}</dt>
            <dd
              className={cn(
                "font-mono text-[14px] font-medium",
                r.tone === "good"
                  ? "text-brand"
                  : r.tone === "warn"
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ReviewsCard({ reviews }: { reviews: ReviewSnapshotRecord }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Reviews
          </p>
          <h3 className="mt-1 font-display text-[16px] font-bold text-charcoal">
            Reputation snapshot
          </h3>
        </div>
        <div className="text-right">
          <div className="inline-flex items-baseline gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-display text-[24px] font-bold leading-none tracking-tight text-charcoal">
              {reviews.averageRating.toFixed(2)}
            </span>
          </div>
          <div className="mt-1 font-display text-[10px] font-bold uppercase tracking-wider text-stone">
            {reviews.totalReviews.toLocaleString()} reviews
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Bar label="Positive" value={reviews.sentimentPositive} tone="bg-brand" />
        <Bar label="Neutral" value={reviews.sentimentNeutral} tone="bg-stone-400" />
        <Bar label="Negative" value={reviews.sentimentNegative} tone="bg-red-400" />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-stone-200 pt-4 text-[14px]">
        <div>
          <dt className="font-display text-[10px] font-bold uppercase tracking-wider text-stone">
            New reviews · 30d
          </dt>
          <dd className="mt-1 font-display text-[16px] font-bold text-charcoal">
            +{reviews.newReviews30d}
          </dd>
        </div>
        <div>
          <dt className="font-display text-[10px] font-bold uppercase tracking-wider text-stone">
            Response rate
          </dt>
          <dd className="mt-1 font-display text-[16px] font-bold text-charcoal">
            {reviews.responseRate.toFixed(0)}%
          </dd>
        </div>
      </dl>
    </div>
  );
}

function Bar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-charcoal">{label}</span>
        <span className="text-stone">{Math.round(value * 100)}%</span>
      </div>
      <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
        <span
          className={"block h-full rounded-full " + tone}
          style={{ width: `${value * 100}%` }}
        />
      </span>
    </div>
  );
}

const SEVERITY_VARIANTS = {
  CRITICAL: "critical",
  HIGH: "warning",
  MEDIUM: "default",
  LOW: "muted",
} as const;

function TechnicalIssuesCard({ issues }: { issues: TechnicalIssueRecord[] }) {
  const open = issues.filter((i) => !i.resolved);
  const resolved = issues.filter((i) => i.resolved);
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Technical SEO
          </p>
          <h3 className="mt-1 font-display text-[16px] font-bold text-charcoal">
            {open.length} open issues · {resolved.length} resolved
          </h3>
        </div>
        <Badge variant="muted">
          <TriangleAlert className="h-3 w-3" />
          Crawl results
        </Badge>
      </div>
      <ul className="space-y-2.5">
        {issues.map((issue) => (
          <li
            key={issue.id}
            className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4"
          >
            <span
              className={
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md " +
                (issue.resolved
                  ? "bg-brand/15 text-brand"
                  : issue.severity === "HIGH"
                    ? "bg-amber-500/15 text-amber-600"
                    : "bg-brand/10 text-brand")
              }
            >
              {issue.resolved ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <TriangleAlert className="h-3.5 w-3.5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={SEVERITY_VARIANTS[issue.severity]}>
                  {issue.severity}
                </Badge>
                <Badge variant="muted">{issue.category}</Badge>
                {issue.resolved ? <Badge variant="success">Resolved</Badge> : null}
              </div>
              <p className="mt-1.5 text-[14px] font-medium text-charcoal">{issue.title}</p>
              <p className="mt-0.5 truncate text-[12px] text-stone">
                {issue.description}
              </p>
              <p className="mt-1 font-mono text-[11px] text-stone">
                {issue.url}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
