import { ArrowUpRight, Brain, Clock, DollarSign, Target, Zap } from "lucide-react";

import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import type { InsightRecord } from "@/lib/data/types";

interface Props {
  insights: InsightRecord[];
  dealershipName: string;
}

export function InsightRecoveryHero({ insights, dealershipName }: Props) {
  const open = insights.filter((i) => i.status === "NEW" || i.status === "IN_PROGRESS");

  const totalClicks = open.reduce((s, i) => s + i.estimatedClicksGain, 0);
  const totalRevenue = open.reduce((s, i) => s + i.estimatedRevenueGainUsd, 0);
  const totalHours = open.reduce((s, i) => s + i.effortHours, 0);
  const avgConfidence = open.length
    ? Math.round((open.reduce((s, i) => s + i.confidence, 0) / open.length) * 100)
    : 0;

  // Priority breakdown — for the inline impact bar
  const criticalClicks = open
    .filter((i) => i.priority === "CRITICAL")
    .reduce((s, i) => s + i.estimatedClicksGain, 0);
  const highClicks = open
    .filter((i) => i.priority === "HIGH")
    .reduce((s, i) => s + i.estimatedClicksGain, 0);
  const mediumClicks = open
    .filter((i) => i.priority === "MEDIUM")
    .reduce((s, i) => s + i.estimatedClicksGain, 0);
  const lowClicks = open
    .filter((i) => i.priority === "LOW")
    .reduce((s, i) => s + i.estimatedClicksGain, 0);

  const total = Math.max(criticalClicks + highClicks + mediumClicks + lowClicks, 1);
  const pct = {
    critical: (criticalClicks / total) * 100,
    high: (highClicks / total) * 100,
    medium: (mediumClicks / total) * 100,
    low: (lowClicks / total) * 100,
  };

  // Easy wins: top 3 by clicks/hour
  const easyWins = [...open]
    .filter((i) => i.effortHours > 0)
    .sort((a, b) => b.estimatedClicksGain / b.effortHours - a.estimatedClicksGain / a.effortHours)
    .slice(0, 3);

  return (
    <section className="ink-section relative overflow-hidden rounded-2xl p-6 sm:p-8">
      {/* Brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative grid gap-8 lg:grid-cols-12">
        {/* Left: headline + recovery numbers */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1">
            <Brain className="h-3.5 w-3.5 text-brand" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
              AI recommendation engine · {avgConfidence}% avg confidence
            </span>
          </div>

          <h2 className="mt-4 font-display text-[28px] font-black leading-[32px] tracking-tight text-white sm:text-[34px] sm:leading-[38px]">
            {dealershipName} can recover
            <br className="hidden sm:block" />
            <span className="text-brand">
              +{formatCompactNumber(totalClicks)} monthly organic clicks
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-[14px] leading-[22px] text-white/75">
            Projected impact across <span className="font-semibold text-white">{open.length}</span>{" "}
            open recommendations, ranked by click recovery per engineering hour.
          </p>

          {/* Three big stats */}
          <div className="mt-7 grid grid-cols-3 gap-4">
            <BigStat
              icon={ArrowUpRight}
              label="Monthly clicks at stake"
              value={`+${formatCompactNumber(totalClicks)}`}
            />
            <BigStat
              icon={DollarSign}
              label="Attributable revenue"
              value={formatCurrency(totalRevenue)}
            />
            <BigStat
              icon={Clock}
              label="Estimated effort"
              value={`${totalHours} hrs`}
            />
          </div>

          {/* Priority impact distribution bar */}
          <div className="mt-7">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-white/60">
              <span className="font-display font-bold">Recovery by priority</span>
              <span>100% of projected clicks</span>
            </div>
            <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-white/10">
              {pct.critical > 0 ? (
                <span
                  className="h-full bg-red-500"
                  style={{ width: `${pct.critical}%` }}
                  title={`Critical: ${formatCompactNumber(criticalClicks)} clicks`}
                />
              ) : null}
              {pct.high > 0 ? (
                <span
                  className="h-full bg-amber-400"
                  style={{ width: `${pct.high}%` }}
                  title={`High: ${formatCompactNumber(highClicks)} clicks`}
                />
              ) : null}
              {pct.medium > 0 ? (
                <span
                  className="h-full bg-brand"
                  style={{ width: `${pct.medium}%` }}
                  title={`Medium: ${formatCompactNumber(mediumClicks)} clicks`}
                />
              ) : null}
              {pct.low > 0 ? (
                <span
                  className="h-full bg-white/40"
                  style={{ width: `${pct.low}%` }}
                  title={`Low: ${formatCompactNumber(lowClicks)} clicks`}
                />
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/70">
              <Legend dot="bg-red-500" label={`Critical · ${formatCompactNumber(criticalClicks)}`} />
              <Legend dot="bg-amber-400" label={`High · ${formatCompactNumber(highClicks)}`} />
              <Legend dot="bg-brand" label={`Medium · ${formatCompactNumber(mediumClicks)}`} />
              <Legend dot="bg-white/40" label={`Low · ${formatCompactNumber(lowClicks)}`} />
            </div>
          </div>
        </div>

        {/* Right: top 3 easy wins */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <p className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
              <Zap className="h-3 w-3" />
              Highest leverage this week
            </p>
            <p className="mt-1 text-[11px] text-white/60">
              Best click recovery per engineering hour
            </p>

            <ul className="mt-4 space-y-3">
              {easyWins.map((i, idx) => {
                const cph = Math.round(i.estimatedClicksGain / Math.max(i.effortHours, 1));
                return (
                  <li
                    key={i.id}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-2 text-[13px] font-semibold leading-[18px] text-white">
                        <span className="mr-1 text-brand">#{idx + 1}</span>
                        {i.title}
                      </p>
                      <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/70">
                      <span className="font-mono text-brand">
                        +{formatCompactNumber(i.estimatedClicksGain)} clicks
                      </span>
                      <span>·</span>
                      <span>{i.effortHours}h effort</span>
                      <span>·</span>
                      <span className="font-display font-semibold text-white">
                        {formatCompactNumber(cph)}/hr
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BigStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/55">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1.5 font-display text-[22px] font-black leading-none tracking-tight text-white sm:text-[28px]">
        {value}
      </p>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
