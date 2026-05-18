import Link from "next/link";
import { ArrowRight, Brain, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import type { InsightRecord } from "@/lib/data/types";

const PRIORITY_VARIANTS: Record<
  InsightRecord["priority"],
  "critical" | "warning" | "default" | "muted"
> = {
  CRITICAL: "critical",
  HIGH: "warning",
  MEDIUM: "default",
  LOW: "muted",
};

const CATEGORY_LABELS: Record<InsightRecord["category"], string> = {
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

export function InsightsPreview({
  insights,
  totalProjectedClicks,
}: {
  insights: InsightRecord[];
  totalProjectedClicks: number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            AI insight queue
          </p>
          <p className="mt-1 text-[14px] text-charcoal">
            <span className="font-bold">+{formatCompactNumber(totalProjectedClicks)}</span>{" "}
            clicks/mo projected if you ship all open insights
          </p>
        </div>
        <Link
          href="/insights"
          className="inline-flex items-center gap-1 rounded-pill border border-stone-200 px-3 py-1 font-display text-[12px] font-medium text-charcoal transition-colors hover:border-brand hover:text-brand"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <ul className="space-y-2.5">
        {insights.map((rec) => (
          <li key={rec.id}>
            <Link
              href="/insights"
              className="group flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-all duration-200 hover:border-brand hover:shadow-card-hover"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <Brain className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={PRIORITY_VARIANTS[rec.priority]}>
                    {rec.priority}
                  </Badge>
                  <Badge variant="muted">{CATEGORY_LABELS[rec.category]}</Badge>
                </div>
                <h3 className="mt-1.5 font-display text-[14px] font-bold text-charcoal">
                  {rec.title}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                  <span className="inline-flex items-center gap-1 font-semibold text-brand">
                    <Target className="h-3 w-3" />
                    +{formatCompactNumber(rec.estimatedClicksGain)} clicks/mo
                  </span>
                  <span className="text-stone">
                    {formatCurrency(rec.estimatedRevenueGainUsd)} projected
                  </span>
                  <span className="text-stone">
                    {rec.effortHours}h effort
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
