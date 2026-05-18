"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";

interface Item {
  name: string;
  visibility: number;
  you: boolean;
}

export function CompetitorBar({ data }: { data: Item[] }) {
  const you = data.find((d) => d.you);
  const rank = you ? data.findIndex((d) => d.you) + 1 : 0;
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Competitor visibility
          </p>
          <p className="mt-1 text-[14px] text-charcoal">
            You ranked <span className="font-bold">#{rank} of {data.length}</span> in this market
          </p>
        </div>
        <Badge variant="muted">SOV</Badge>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(44,48,56,0.06)" horizontal={false} />
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="name"
              width={108}
              stroke="#5A6170"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(29,185,84,0.06)" }}
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                color: "#2C3038",
                fontSize: 12,
                boxShadow: "rgba(0,0,0,0.08) 0px 4px 16px 0px",
              }}
            />
            <Bar dataKey="visibility" radius={[0, 6, 6, 0]} isAnimationActive={false}>
              {data.map((c) => (
                <Cell key={c.name} fill={c.you ? "#1DB954" : "#8A919C"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
