"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  Gauge,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Counter } from "@/components/animations/counter";
import {
  COMPETITOR_BENCHMARK,
  DEVICE_SPLIT,
  TRAFFIC_TREND,
  TOP_KEYWORDS,
} from "@/lib/mock-data";

const A3_DEVICE_PALETTE = ["#1DB954", "#74DA95", "#5A6170"];
const A3_COMPETITOR_PALETTE = (name: string) =>
  name === "Your Group" ? "#1DB954" : "#8A919C";

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className="relative mx-auto w-full max-w-6xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-12 opacity-60"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 50%, rgba(29,185,84,0.16) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-deep">
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand/80" />
          </div>
          <div className="hidden items-center gap-2 font-mono text-[11px] text-stone sm:flex">
            <Gauge className="h-3.5 w-3.5" />
            app.a3brands.com / dashboard
          </div>
          <Badge variant="status">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand animate-pulse-soft" />
            LIVE
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-4 md:p-6">
          <KpiTile
            label="ORGANIC CLICKS"
            value={248_412}
            delta={18.4}
            format="compact"
            icon={<TrendingUp className="h-3.5 w-3.5" />}
          />
          <KpiTile
            label="IMPRESSIONS"
            value={5_184_023}
            delta={22.1}
            format="compact"
            icon={<Sparkles className="h-3.5 w-3.5" />}
          />
          <KpiTile
            label="AVG CTR"
            value={4.79}
            delta={0.6}
            format="percent"
            icon={<ArrowUpRight className="h-3.5 w-3.5" />}
          />
          <KpiTile
            label="AVG POSITION"
            value={6.2}
            delta={-1.4}
            format="decimal"
            invertDelta
            icon={<ArrowDownRight className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="grid gap-4 px-5 pb-5 md:grid-cols-3 md:px-6 md:pb-6">
          <div className="md:col-span-2 rounded-xl border border-stone-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
                  ORGANIC TRAFFIC - 30 DAYS
                </div>
                <div className="mt-1 font-display text-[22px] leading-[28px] font-bold text-charcoal">
                  <Counter to={248412} format="compact" /> clicks
                </div>
              </div>
              <Badge variant="status">+18.4%</Badge>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TRAFFIC_TREND}>
                  <defs>
                    <linearGradient id="emeraldFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1DB954" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#1DB954" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(44,48,56,0.06)" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
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
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#1DB954"
                    strokeWidth={2}
                    fill="url(#emeraldFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="mb-3">
              <div className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
                DEVICES
              </div>
              <div className="mt-1 text-[14px] font-semibold text-charcoal">
                Mobile leads
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-32 w-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEVICE_SPLIT}
                      dataKey="value"
                      innerRadius={42}
                      outerRadius={58}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {DEVICE_SPLIT.map((d, i) => (
                        <Cell key={d.name} fill={A3_DEVICE_PALETTE[i % A3_DEVICE_PALETTE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-stone">
                    Mobile
                  </span>
                  <span className="font-display text-[22px] font-bold text-charcoal">62%</span>
                </div>
              </div>
              <ul className="flex-1 space-y-2 text-[12px]">
                {DEVICE_SPLIT.map((d, i) => (
                  <li key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-stone">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            A3_DEVICE_PALETTE[i % A3_DEVICE_PALETTE.length],
                        }}
                      />
                      {d.name}
                    </span>
                    <span className="text-charcoal">{d.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4 md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
                  COMPETITOR VISIBILITY - DFW METROPLEX
                </div>
                <div className="mt-1 text-[14px] text-charcoal">
                  Your group ranked{" "}
                  <span className="font-bold">#2 of 6</span>
                </div>
              </div>
              <Badge variant="muted">SOV</Badge>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={COMPETITOR_BENCHMARK}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 12, bottom: 0 }}
                >
                  <CartesianGrid stroke="rgba(44,48,56,0.06)" horizontal={false} />
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={86}
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
                  <Bar dataKey="visibility" radius={[0, 6, 6, 0]}>
                    {COMPETITOR_BENCHMARK.map((c) => (
                      <Cell key={c.name} fill={A3_COMPETITOR_PALETTE(c.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.08em] text-brand">
              <Brain className="h-3.5 w-3.5" />
              AI INSIGHT
            </div>
            <p className="text-[14px] leading-[22px] text-charcoal">
              Competitors outrank you for{" "}
              <span className="text-brand font-semibold">
                14 Ford lease queries
              </span>
              . City pages + payment schema projects{" "}
              <span className="font-bold text-charcoal">+1,240 clicks/mo</span>.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="warning">High priority</Badge>
              <Badge variant="muted">18h effort</Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 bg-stone-50 px-5 py-4 md:px-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
              TOP-MOVING KEYWORDS
            </div>
            <Badge variant="muted">
              <MapPin className="h-3 w-3" />
              Dallas-Fort Worth
            </Badge>
          </div>
          <div className="hidden md:block">
            <table className="w-full text-[12px]">
              <thead className="font-display text-[10px] uppercase tracking-[0.08em] text-stone">
                <tr>
                  <th className="py-2 text-left font-bold">Query</th>
                  <th className="py-2 text-right font-bold">Position</th>
                  <th className="py-2 text-right font-bold">Δ</th>
                  <th className="py-2 text-right font-bold">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {TOP_KEYWORDS.map((k) => (
                  <tr key={k.query}>
                    <td className="py-2 text-charcoal">{k.query}</td>
                    <td className="py-2 text-right font-mono text-charcoal">
                      {k.position.toFixed(1)}
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className={
                          k.delta < 0 ? "text-brand" : "text-amber-600"
                        }
                      >
                        {k.delta > 0 ? "+" : ""}
                        {k.delta.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono text-charcoal">
                      {k.clicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2 md:hidden">
            {TOP_KEYWORDS.slice(0, 4).map((k) => (
              <li
                key={k.query}
                className="flex items-center justify-between text-[12px]"
              >
                <span className="text-charcoal">{k.query}</span>
                <span className="font-mono text-stone">
                  #{k.position.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function KpiTile({
  label,
  value,
  delta,
  format,
  unit,
  invertDelta,
  icon,
}: {
  label: string;
  value: number;
  delta: number;
  format: "number" | "percent" | "decimal" | "compact";
  unit?: string;
  invertDelta?: boolean;
  icon?: React.ReactNode;
}) {
  const positive = invertDelta ? delta < 0 : delta > 0;
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 transition-colors hover:border-brand/30">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
          {label}
        </span>
        <span className="text-stone">{icon}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-[24px] font-bold text-charcoal tracking-tight">
          <Counter to={value} format={format} unit={unit} />
        </span>
      </div>
      <div
        className={
          "mt-1 inline-flex items-center gap-0.5 text-[12px] font-semibold " +
          (positive ? "text-brand" : "text-amber-600")
        }
      >
        {positive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        {Math.abs(delta).toFixed(1)}%
      </div>
    </div>
  );
}
