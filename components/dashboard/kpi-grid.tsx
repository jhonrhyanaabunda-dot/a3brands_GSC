"use client";

import * as React from "react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { TrafficChart } from "@/components/dashboard/traffic-chart";
import type { DailyMetric, KpiSnapshot } from "@/lib/data/types";

const METRIC_FOR_KPI: Record<
  string,
  "clicks" | "impressions" | "ctr" | "position" | null
> = {
  clicks: "clicks",
  impressions: "impressions",
  ctr: "ctr",
  position: "position",
  lead: null,
  health: null,
};

interface Props {
  kpis: KpiSnapshot[];
  series: DailyMetric[];
}

export function KpiGrid({ kpis, series }: Props) {
  const [active, setActive] = React.useState<string>("clicks");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            series={METRIC_FOR_KPI[kpi.id] ? series : undefined}
            metricKey={METRIC_FOR_KPI[kpi.id] ?? undefined}
            selected={active === kpi.id}
            onSelect={() => setActive(kpi.id)}
          />
        ))}
      </div>

      <TrafficChart
        series={series}
        metric={METRIC_FOR_KPI[active] ?? "clicks"}
        title={kpis.find((k) => k.id === active)?.label ?? "Organic clicks"}
        kpi={kpis.find((k) => k.id === active) ?? kpis[0]!}
      />
    </div>
  );
}
