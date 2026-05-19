"use client";

import * as React from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import type { InsightPriority, InsightRecord } from "@/lib/data/types";

const PRIORITY_COLOR: Record<InsightPriority, string> = {
  CRITICAL: "#EF4444",
  HIGH: "#F59E0B",
  MEDIUM: "#1DB954",
  LOW: "#94A3B8",
};

const PRIORITY_LABEL: Record<InsightPriority, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

interface Point {
  x: number;
  y: number;
  z: number;
  title: string;
  priority: InsightPriority;
  category: string;
  cph: number;
}

interface TipPayload {
  payload: Point;
}

export function ImpactEffortMatrix({ insights }: { insights: InsightRecord[] }) {
  const open = insights.filter((i) => i.status === "NEW" || i.status === "IN_PROGRESS");

  const grouped = React.useMemo(() => {
    const acc: Record<InsightPriority, Point[]> = {
      CRITICAL: [],
      HIGH: [],
      MEDIUM: [],
      LOW: [],
    };
    for (const i of open) {
      const effort = Math.max(i.effortHours, 0.5);
      const clicks = i.estimatedClicksGain;
      acc[i.priority].push({
        x: effort,
        y: clicks,
        z: Math.max(i.confidence * 100, 30),
        title: i.title,
        priority: i.priority,
        category: i.category,
        cph: Math.round(clicks / effort),
      });
    }
    return acc;
  }, [open]);

  const maxEffort = Math.max(...open.map((i) => i.effortHours), 16);
  const maxClicks = Math.max(...open.map((i) => i.estimatedClicksGain), 100);

  // Define "easy wins" quadrant boundary lines
  const midEffort = maxEffort / 2;
  const midClicks = maxClicks / 2;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-subtle">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Impact vs. effort matrix
          </p>
          <h3 className="mt-1 font-display text-[18px] font-bold tracking-tight text-charcoal">
            Where should we spend the next engineering sprint?
          </h3>
          <p className="mt-1 max-w-2xl text-[12px] leading-[18px] text-stone">
            Each dot is one insight. Top-left = easy wins (low effort, high recovery). Bigger dot = higher AI confidence.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(Object.keys(PRIORITY_COLOR) as InsightPriority[]).map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 text-[11px] text-charcoal">
              <span className="h-2 w-2 rounded-full" style={{ background: PRIORITY_COLOR[p] }} />
              {PRIORITY_LABEL[p]}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-5 h-[340px]">
        {/* Quadrant labels */}
        <div className="pointer-events-none absolute left-12 right-6 top-2 z-10 flex justify-between text-[10px] uppercase tracking-[0.08em] text-stone-400">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 font-display font-bold text-brand">
            ⚡ Easy wins
          </span>
          <span className="font-display font-bold">Strategic bets</span>
        </div>
        <div className="pointer-events-none absolute bottom-10 left-12 right-6 z-10 flex justify-between text-[10px] uppercase tracking-[0.08em] text-stone-400">
          <span className="font-display font-bold">Fill-ins</span>
          <span className="font-display font-bold">Reconsider</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 24, right: 16, left: 16, bottom: 36 }}>
            <CartesianGrid
              stroke="#E5E7EB"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, Math.ceil(maxEffort * 1.1)]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#7A8087", fontFamily: "var(--font-sora)" }}
              label={{
                value: "Engineering effort (hours) →",
                position: "insideBottom",
                offset: -16,
                style: {
                  fontSize: 11,
                  fontFamily: "var(--font-sora)",
                  fontWeight: 600,
                  fill: "#7A8087",
                },
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#7A8087", fontFamily: "var(--font-sora)" }}
              width={56}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
              }
              label={{
                value: "Projected monthly clicks ↑",
                angle: -90,
                position: "insideLeft",
                offset: 12,
                style: {
                  fontSize: 11,
                  fontFamily: "var(--font-sora)",
                  fontWeight: 600,
                  fill: "#7A8087",
                  textAnchor: "middle",
                },
              }}
            />
            <ZAxis type="number" dataKey="z" range={[40, 280]} />

            {/* Quadrant divider lines — subtle */}
            <line
              x1={`${(midEffort / (maxEffort * 1.1)) * 100}%`}
              x2={`${(midEffort / (maxEffort * 1.1)) * 100}%`}
              y1="0%"
              y2="100%"
            />

            <Tooltip
              cursor={{ stroke: "#1DB954", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={<CustomTooltip />}
            />

            {(Object.keys(grouped) as InsightPriority[]).map((p) => (
              <Scatter
                key={p}
                name={PRIORITY_LABEL[p]}
                data={grouped[p]}
                fill={PRIORITY_COLOR[p]}
                fillOpacity={0.78}
                stroke={PRIORITY_COLOR[p]}
                strokeWidth={1.5}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const first = payload[0];
  if (!first) return null;
  const p = first.payload;
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-lg">
      <p className="max-w-[220px] font-display text-[12px] font-bold leading-[16px] text-charcoal">
        {p.title}
      </p>
      <div className="mt-2 space-y-1 text-[11px] text-stone">
        <Row label="Projected clicks" value={`+${p.y.toLocaleString()}/mo`} accent />
        <Row label="Effort" value={`${p.x} hours`} />
        <Row label="Clicks per hour" value={`${p.cph.toLocaleString()}`} />
        <div className="mt-1.5 flex items-center gap-1.5 pt-1.5 border-t border-stone-100">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: PRIORITY_COLOR[p.priority] }}
          />
          <span className="font-display font-semibold text-charcoal">
            {PRIORITY_LABEL[p.priority]}
          </span>
          <span className="text-stone-400">·</span>
          <span>{p.category}</span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span
        className={
          "font-mono font-semibold " +
          (accent ? "text-brand" : "text-charcoal")
        }
      >
        {value}
      </span>
    </div>
  );
}
