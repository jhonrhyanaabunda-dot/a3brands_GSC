"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Counter } from "@/components/animations/counter";
import { cn } from "@/lib/utils";
import type { DailyMetric, KpiSnapshot } from "@/lib/data/types";

interface Props {
  kpi: KpiSnapshot;
  series?: DailyMetric[];
  metricKey?: "clicks" | "impressions" | "ctr" | "position";
  selected?: boolean;
  onSelect?: () => void;
}

export function KpiCard({ kpi, series, metricKey, selected, onSelect }: Props) {
  const positive = kpi.invertTrend ? kpi.delta < 0 : kpi.delta > 0;
  const flat = Math.abs(kpi.delta) < 0.05;
  const deltaTone = flat
    ? "text-stone"
    : positive
      ? "text-brand"
      : "text-amber-600";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full text-left rounded-2xl border bg-white p-5 transition-all duration-200",
        selected
          ? "border-brand shadow-card-hover"
          : "border-stone-200 hover:border-brand hover:shadow-subtle",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
          {kpi.label}
        </span>
        {selected ? (
          <span className="h-2 w-2 rounded-full bg-brand shadow-floating" />
        ) : null}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-[28px] font-black tracking-tight text-charcoal">
          <Counter
            to={typeof kpi.value === "number" ? kpi.value : Number(kpi.value)}
            format={kpi.format}
            unit={kpi.unit}
          />
        </span>
      </div>
      <div className={cn("mt-1.5 inline-flex items-center gap-1 text-[12px]", deltaTone)}>
        {flat ? (
          <Minus className="h-3 w-3" />
        ) : positive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        {kpi.format === "percent" || kpi.format === "decimal"
          ? `${kpi.delta > 0 ? "+" : ""}${kpi.delta.toFixed(2)}${kpi.format === "percent" ? "pp" : ""}`
          : `${kpi.delta > 0 ? "+" : ""}${kpi.delta.toFixed(1)}%`}
        <span className="text-stone"> · {kpi.helper}</span>
      </div>
      {series && metricKey ? (
        <div className="mt-4 h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1DB954" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#1DB954" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={metricKey}
                stroke="#1DB954"
                strokeWidth={1.5}
                fill={`url(#spark-${kpi.id})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </button>
  );
}
