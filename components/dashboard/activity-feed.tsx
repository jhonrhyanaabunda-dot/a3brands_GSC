import Link from "next/link";
import {
  Brain,
  FileText,
  Scan,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import type { ActivityRecord } from "@/lib/data/types";

const ICONS: Record<ActivityRecord["kind"], { Icon: LucideIcon; tone: string }> = {
  ranking_gain: { Icon: TrendingUp, tone: "bg-brand/15 text-brand" },
  ranking_drop: { Icon: TrendingDown, tone: "bg-red-500/15 text-red-600" },
  report_generated: { Icon: FileText, tone: "bg-brand/15 text-brand" },
  insight_created: { Icon: Brain, tone: "bg-brand/15 text-brand" },
  insight_resolved: { Icon: Brain, tone: "bg-brand/15 text-brand" },
  scan_completed: { Icon: Scan, tone: "bg-brand/15 text-brand" },
  competitor_move: { Icon: Target, tone: "bg-amber-500/15 text-amber-600" },
  review_received: { Icon: Star, tone: "bg-amber-500/15 text-amber-600" },
};

function timeAgo(iso: string) {
  const t = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(t / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ items }: { items: ActivityRecord[] }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Recent activity
          </p>
          <p className="mt-1 text-[14px] text-charcoal">What changed lately</p>
        </div>
      </div>
      <ol className="space-y-3">
        {items.map((a) => {
          const { Icon, tone } = ICONS[a.kind];
          const body = (
            <article className="flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-stone-200 hover:bg-stone-50">
              <span
                className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-md " + tone}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-charcoal">{a.title}</p>
                <p className="mt-0.5 truncate text-[12px] text-stone">
                  {a.detail}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {a.amount ? (
                  <span className="block font-display text-[12px] font-bold text-brand">
                    {a.amount}
                  </span>
                ) : null}
                <span className="block text-[11px] text-stone">
                  {timeAgo(a.at)}
                </span>
              </div>
            </article>
          );
          return (
            <li key={a.id}>
              {a.href ? (
                <Link href={a.href} className="block">
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
