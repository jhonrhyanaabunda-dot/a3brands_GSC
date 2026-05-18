"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { DeviceShare } from "@/lib/data/types";
import { formatCompactNumber } from "@/lib/utils";

const COLORS = ["#1DB954", "#74DA95", "#5A6170"];

export function DeviceCard({ data }: { data: DeviceShare[] }) {
  const mobile = data.find((d) => d.device === "Mobile");
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Device breakdown
          </p>
          <p className="mt-1 text-[14px] text-charcoal">Mobile-led traffic mix</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="share"
                innerRadius={50}
                outerRadius={64}
                paddingAngle={3}
                strokeWidth={0}
                isAnimationActive={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-stone">
              {mobile?.device ?? "Mobile"}
            </span>
            <span className="font-display text-[24px] font-bold text-charcoal">
              {mobile?.share ?? 60}%
            </span>
          </div>
        </div>
        <ul className="flex-1 space-y-2.5">
          {data.map((d, i) => (
            <li key={d.device} className="flex items-center justify-between text-[14px]">
              <span className="flex items-center gap-2 text-stone">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {d.device}
              </span>
              <span className="text-right">
                <span className="block text-charcoal">{d.share}%</span>
                <span className="block text-[11px] text-stone">
                  {formatCompactNumber(d.clicks)} clicks
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
