"use client";

import * as React from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { KeywordRecord } from "@/lib/data/types";

interface Bucket {
  label: string;
  range: string;
  count: number;
  color: string;
  fillFrom: number;
  fillTo: number;
}

function bucketize(keywords: KeywordRecord[]): Bucket[] {
  const at = (lo: number, hi: number) =>
    keywords.filter((k) => k.currentPosition >= lo && k.currentPosition <= hi).length;
  return [
    { label: "Top 3", range: "Pos 1-3", count: at(1, 3), color: "#1DB954", fillFrom: 1, fillTo: 3 },
    { label: "Top 10", range: "Pos 4-10", count: at(4, 10), color: "#34D77F", fillFrom: 4, fillTo: 10 },
    { label: "Page 2", range: "Pos 11-20", count: at(11, 20), color: "#FFCC4D", fillFrom: 11, fillTo: 20 },
    { label: "Page 3-5", range: "Pos 21-50", count: at(21, 50), color: "#FF8A4D", fillFrom: 21, fillTo: 50 },
    { label: "Beyond", range: "Pos 51+", count: at(51, 1000), color: "#9CA3AF", fillFrom: 51, fillTo: 1000 },
  ];
}

export function RankDistribution({ keywords }: { keywords: KeywordRecord[] }) {
  const buckets = React.useMemo(() => bucketize(keywords), [keywords]);
  const total = keywords.length;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-subtle">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Rank distribution
          </p>
          <h3 className="mt-1 font-display text-[18px] font-bold tracking-tight text-charcoal">
            How your {total} keywords stack up on Google
          </h3>
        </div>
        <p className="text-[12px] text-stone">Last sync · 24h ago</p>
      </div>

      <div className="mt-5 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#7A8087", fontFamily: "var(--font-sora)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#7A8087", fontFamily: "var(--font-sora)" }}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 12,
                fontFamily: "var(--font-sora)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              formatter={(value: number, _name, item) => [
                `${value} keywords`,
                item.payload.range,
              ]}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={64}>
              {buckets.map((b) => (
                <Cell key={b.label} fill={b.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-5 gap-2">
        {buckets.map((b) => {
          const pct = total > 0 ? Math.round((b.count / total) * 100) : 0;
          return (
            <div key={b.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                <span className="font-display text-[14px] font-black text-charcoal">{b.count}</span>
              </div>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.06em] text-stone">{pct}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
