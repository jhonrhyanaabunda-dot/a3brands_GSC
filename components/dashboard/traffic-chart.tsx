"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { formatCompactNumber } from "@/lib/utils";
import type { DailyMetric, KpiSnapshot } from "@/lib/data/types";

interface Props {
  series: DailyMetric[];
  metric: "clicks" | "impressions" | "ctr" | "position";
  title: string;
  kpi: KpiSnapshot;
}

const METRIC_FORMAT: Record<Props["metric"], (v: number) => string> = {
  clicks: (v) => formatCompactNumber(v),
  impressions: (v) => formatCompactNumber(v),
  ctr: (v) => `${v.toFixed(2)}%`,
  position: (v) => v.toFixed(2),
};

const METRIC_TYPE: Record<Props["metric"], "area" | "line"> = {
  clicks: "area",
  impressions: "area",
  ctr: "line",
  position: "line",
};

export function TrafficChart({ series, metric, title, kpi }: Props) {
  const formatter = METRIC_FORMAT[metric];
  const chartType = METRIC_TYPE[metric];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            {title} · trailing window
          </p>
          <p className="mt-1.5 font-display text-[28px] font-bold text-charcoal sm:text-[32px]">
            {formatter(Number(kpi.value))}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={kpi.delta >= 0 === !kpi.invertTrend ? "success" : "warning"}>
            {kpi.delta > 0 ? "+" : ""}
            {kpi.format === "percent" || kpi.format === "decimal"
              ? kpi.delta.toFixed(2) + (kpi.format === "percent" ? "pp" : "")
              : kpi.delta.toFixed(1) + "%"}
          </Badge>
          <Badge variant="muted">{kpi.helper}</Badge>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={series} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="brandArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1DB954" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1DB954" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(44,48,56,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                stroke="#8A919C"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#8A919C"
                fontSize={11}
                tickFormatter={formatter}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                cursor={{ stroke: "rgba(29,185,84,0.4)", strokeWidth: 1 }}
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  color: "#2C3038",
                  fontSize: 12,
                  boxShadow: "rgba(0,0,0,0.08) 0px 4px 16px 0px",
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: number) => [formatter(value), title]}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke="#1DB954"
                strokeWidth={2.2}
                fill="url(#brandArea)"
              />
            </AreaChart>
          ) : (
            <LineChart data={series} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(44,48,56,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                stroke="#8A919C"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#8A919C"
                fontSize={11}
                tickFormatter={formatter}
                tickLine={false}
                axisLine={false}
                width={50}
                domain={metric === "position" ? [Math.floor(0), "dataMax + 1"] : undefined}
                reversed={metric === "position"}
              />
              <Tooltip
                cursor={{ stroke: "rgba(29,185,84,0.4)", strokeWidth: 1 }}
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  color: "#2C3038",
                  fontSize: 12,
                  boxShadow: "rgba(0,0,0,0.08) 0px 4px 16px 0px",
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: number) => [formatter(value), title]}
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="#1DB954"
                strokeWidth={2.2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
