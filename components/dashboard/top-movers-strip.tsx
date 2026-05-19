import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react";

import type { KeywordRecord } from "@/lib/data/types";

export function TopMoversStrip({ keywords }: { keywords: KeywordRecord[] }) {
  const movers = [...keywords]
    .filter((k) => k.previousPosition !== k.currentPosition)
    .sort(
      (a, b) =>
        Math.abs(b.previousPosition - b.currentPosition) -
        Math.abs(a.previousPosition - a.currentPosition),
    )
    .slice(0, 4);

  const gainers = movers.filter((k) => k.currentPosition < k.previousPosition).slice(0, 2);
  const losers = movers.filter((k) => k.currentPosition > k.previousPosition).slice(0, 2);
  const displayed = [...gainers, ...losers].slice(0, 4);

  if (displayed.length === 0) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-subtle">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Movers this week
          </p>
          <h3 className="mt-1 font-display text-[18px] font-bold tracking-tight text-charcoal">
            Biggest rank changes vs. last 7 days
          </h3>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Legend dot="bg-brand" label={`${gainers.length} up`} />
          <Legend dot="bg-red-500" label={`${losers.length} down`} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {displayed.map((k) => {
          const delta = k.previousPosition - k.currentPosition;
          const isUp = delta > 0;
          return (
            <div
              key={k.id}
              className="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50/40 p-4 transition-all hover:border-brand/40 hover:shadow-subtle"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 min-h-[34px] text-[13px] font-semibold leading-[17px] text-charcoal">
                  {k.query}
                </p>
                {isUp ? (
                  <TrendingUp className="h-4 w-4 shrink-0 text-brand" />
                ) : (
                  <TrendingDown className="h-4 w-4 shrink-0 text-red-500" />
                )}
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-[26px] font-black text-charcoal">
                  #{k.currentPosition}
                </span>
                <span
                  className={
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-display text-[11px] font-bold " +
                    (isUp
                      ? "bg-brand/15 text-brand"
                      : "bg-red-100 text-red-600")
                  }
                >
                  {isUp ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(delta)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-stone">
                <span className="rounded-full bg-white px-2 py-0.5 font-display font-semibold uppercase tracking-[0.05em] text-stone-600 border border-stone-200">
                  {k.intent}
                </span>
                <span className="font-mono">
                  {k.clicks.toLocaleString()} clicks
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
