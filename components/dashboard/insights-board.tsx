"use client";

import * as React from "react";
import { Brain, CircleDot, CheckCircle2, X, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCompactNumber, formatCurrency } from "@/lib/utils";
import type {
  InsightCategory,
  InsightPriority,
  InsightRecord,
  InsightStatus,
} from "@/lib/data/types";

const PRIORITY_VARIANTS: Record<
  InsightPriority,
  "critical" | "warning" | "default" | "muted"
> = {
  CRITICAL: "critical",
  HIGH: "warning",
  MEDIUM: "default",
  LOW: "muted",
};

const CATEGORY_LABELS: Record<InsightCategory, string> = {
  TECHNICAL: "Technical",
  CONTENT: "Content",
  LOCAL_SEO: "Local SEO",
  COMPETITIVE: "Competitive",
  KEYWORD: "Keywords",
  SCHEMA: "Schema",
  PERFORMANCE: "Performance",
  INVENTORY: "Inventory",
  SERVICE_PAGE: "Service pages",
  GOOGLE_BUSINESS: "GBP",
};

const STATUS_LABELS: Record<InsightStatus, string> = {
  NEW: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
};

const STATUSES: InsightStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "DISMISSED"];
const PRIORITIES: InsightPriority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export function InsightsBoard({ insights: initial }: { insights: InsightRecord[] }) {
  const [statusFilter, setStatusFilter] = React.useState<InsightStatus | "ALL">("NEW");
  const [priorityFilter, setPriorityFilter] = React.useState<InsightPriority | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState<InsightCategory | "ALL">("ALL");
  const [items, setItems] = React.useState<InsightRecord[]>(initial);

  const allCategories = React.useMemo(() => {
    const set = new Set(initial.map((i) => i.category));
    return Array.from(set);
  }, [initial]);

  const filtered = items.filter((i) => {
    if (statusFilter !== "ALL" && i.status !== statusFilter) return false;
    if (priorityFilter !== "ALL" && i.priority !== priorityFilter) return false;
    if (categoryFilter !== "ALL" && i.category !== categoryFilter) return false;
    return true;
  });

  const counts = STATUSES.reduce<Record<InsightStatus, number>>(
    (acc, s) => {
      acc[s] = items.filter((i) => i.status === s).length;
      return acc;
    },
    { NEW: 0, IN_PROGRESS: 0, RESOLVED: 0, DISMISSED: 0 },
  );

  const update = (id: string, status: InsightStatus) => {
    setItems((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-stone-200 bg-white p-1">
        {(["NEW", "IN_PROGRESS", "RESOLVED", "ALL"] as const).map((s) => {
          const isActive = statusFilter === s;
          const label = s === "ALL" ? "All" : STATUS_LABELS[s];
          const count = s === "ALL" ? items.length : counts[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-display text-[14px] font-medium transition-colors",
                isActive
                  ? "bg-brand/15 text-charcoal"
                  : "text-stone hover:bg-stone-50 hover:text-charcoal",
              )}
            >
              {label}
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-display text-[10px] font-bold",
                  isActive
                    ? "bg-brand text-charcoal"
                    : "bg-stone-100 text-stone",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-stone">
          Priority
        </span>
        {(["ALL", ...PRIORITIES] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriorityFilter(p)}
            className={cn(
              "rounded-pill border px-3 py-1 font-display text-[12px] transition-colors",
              priorityFilter === p
                ? "border-brand bg-brand/10 text-brand"
                : "border-stone-200 bg-white text-stone hover:border-brand hover:text-brand",
            )}
          >
            {p === "ALL" ? "All" : p}
          </button>
        ))}
        <span className="mx-2 hidden h-4 w-px bg-stone-200 sm:inline-block" />
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-stone">
          Category
        </span>
        <button
          type="button"
          onClick={() => setCategoryFilter("ALL")}
          className={cn(
            "rounded-pill border px-3 py-1 font-display text-[12px] transition-colors",
            categoryFilter === "ALL"
              ? "border-brand bg-brand/10 text-brand"
              : "border-stone-200 bg-white text-stone hover:border-brand hover:text-brand",
          )}
        >
          All
        </button>
        {allCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoryFilter(c)}
            className={cn(
              "rounded-pill border px-3 py-1 font-display text-[12px] transition-colors",
              categoryFilter === c
                ? "border-brand bg-brand/10 text-brand"
                : "border-stone-200 bg-white text-stone hover:border-brand hover:text-brand",
            )}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white py-12 text-center">
          <p className="text-[14px] text-stone">No insights match these filters.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((rec) => (
            <li key={rec.id}>
              <article className="group relative rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Brain className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={PRIORITY_VARIANTS[rec.priority]}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="muted">{CATEGORY_LABELS[rec.category]}</Badge>
                      <Badge variant="outline">
                        {Math.round(rec.confidence * 100)}% confidence
                      </Badge>
                      <span className="text-[11px] text-stone">
                        {STATUS_LABELS[rec.status]}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-[16px] font-bold text-charcoal sm:text-[18px]">
                      {rec.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-[22px] text-stone text-pretty">
                      {rec.summary}
                    </p>
                    <p className="mt-2 text-[12px] leading-[18px] text-stone text-pretty">
                      <span className="font-display font-bold uppercase tracking-wider text-charcoal">Why: </span>
                      {rec.rationale}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
                        <Target className="h-3 w-3" />
                        +{formatCompactNumber(rec.estimatedClicksGain)} clicks/mo
                      </span>
                      <span className="font-semibold text-charcoal">
                        {formatCurrency(rec.estimatedRevenueGainUsd)} projected
                      </span>
                      <span className="text-stone">
                        {rec.effortHours}h effort
                      </span>
                    </div>
                  </div>

                  <div className="hidden shrink-0 flex-col gap-2 sm:flex">
                    {rec.status !== "RESOLVED" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant={rec.status === "IN_PROGRESS" ? "default" : "secondary"}
                        onClick={() =>
                          update(
                            rec.id,
                            rec.status === "IN_PROGRESS" ? "RESOLVED" : "IN_PROGRESS",
                          )
                        }
                      >
                        {rec.status === "IN_PROGRESS" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark resolved
                          </>
                        ) : (
                          <>
                            <CircleDot className="h-3.5 w-3.5" />
                            Start
                          </>
                        )}
                      </Button>
                    ) : null}
                    {rec.status !== "DISMISSED" && rec.status !== "RESOLVED" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => update(rec.id, "DISMISSED")}
                      >
                        <X className="h-3.5 w-3.5" />
                        Dismiss
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
