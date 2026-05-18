"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn, formatCompactNumber } from "@/lib/utils";
import type { KeywordIntent, KeywordRecord } from "@/lib/data/types";

type SortKey =
  | "query"
  | "currentPosition"
  | "delta"
  | "clicks"
  | "impressions"
  | "ctr"
  | "searchVolume"
  | "difficulty";

interface SortState {
  key: SortKey;
  dir: "asc" | "desc";
}

const INTENT_LABEL: Record<KeywordIntent, string> = {
  BRAND: "Brand",
  COMMERCIAL: "Commercial",
  TRANSACTIONAL: "Transactional",
  INFORMATIONAL: "Informational",
  LOCAL: "Local",
  INVENTORY: "Inventory",
  SERVICE: "Service",
};

const INTENT_TONE: Record<KeywordIntent, "default" | "muted" | "warning" | "success" | "outline"> = {
  BRAND: "default",
  COMMERCIAL: "default",
  TRANSACTIONAL: "success",
  INFORMATIONAL: "muted",
  LOCAL: "warning",
  INVENTORY: "outline",
  SERVICE: "muted",
};

export function KeywordsTable({ keywords }: { keywords: KeywordRecord[] }) {
  const [search, setSearch] = React.useState("");
  const [intent, setIntent] = React.useState<KeywordIntent | "ALL">("ALL");
  const [brandedness, setBrandedness] = React.useState<"ALL" | "BRAND" | "NONBRAND">("ALL");
  const [sort, setSort] = React.useState<SortState>({ key: "clicks", dir: "desc" });

  const allIntents = React.useMemo(() => {
    const set = new Set(keywords.map((k) => k.intent));
    return Array.from(set);
  }, [keywords]);

  const filtered = React.useMemo(() => {
    let rows = keywords;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.query.toLowerCase().includes(q));
    }
    if (intent !== "ALL") rows = rows.filter((r) => r.intent === intent);
    if (brandedness !== "ALL")
      rows = rows.filter((r) => (brandedness === "BRAND" ? r.isBranded : !r.isBranded));

    return [...rows].sort((a, b) => {
      const mult = sort.dir === "asc" ? 1 : -1;
      switch (sort.key) {
        case "query":
          return a.query.localeCompare(b.query) * mult;
        case "currentPosition":
          return (a.currentPosition - b.currentPosition) * mult;
        case "delta": {
          const da = a.previousPosition - a.currentPosition;
          const db = b.previousPosition - b.currentPosition;
          return (da - db) * mult;
        }
        case "clicks":
          return (a.clicks - b.clicks) * mult;
        case "impressions":
          return (a.impressions - b.impressions) * mult;
        case "ctr":
          return (a.ctr - b.ctr) * mult;
        case "searchVolume":
          return (a.searchVolume - b.searchVolume) * mult;
        case "difficulty":
          return (a.difficulty - b.difficulty) * mult;
      }
    });
  }, [keywords, search, intent, brandedness, sort]);

  const totals = React.useMemo(() => {
    const clicks = filtered.reduce((s, r) => s + r.clicks, 0);
    const impressions = filtered.reduce((s, r) => s + r.impressions, 0);
    const ctr = impressions === 0 ? 0 : (clicks / impressions) * 100;
    const avgPos =
      filtered.reduce((s, r) => s + r.currentPosition, 0) /
      Math.max(filtered.length, 1);
    return { clicks, impressions, ctr, avgPos };
  }, [filtered]);

  const toggleSort = (key: SortKey) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "desc" },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            placeholder="Filter keywords…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-[14px] text-charcoal placeholder:text-stone-400 transition-colors focus:border-brand focus:outline-none focus:shadow-input-focus"
          />
        </label>

        <div className="flex flex-wrap items-center gap-1">
          {(["ALL", "BRAND", "NONBRAND"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrandedness(b)}
              className={cn(
                "rounded-pill border px-3 py-1 font-display text-[12px] transition-colors",
                brandedness === b
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-stone-200 bg-white text-stone hover:border-brand hover:text-brand",
              )}
            >
              {b === "ALL" ? "All" : b === "BRAND" ? "Brand" : "Non-brand"}
            </button>
          ))}
        </div>

        <span className="hidden h-4 w-px bg-stone-200 sm:inline-block" />

        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setIntent("ALL")}
            className={cn(
              "rounded-pill border px-3 py-1 font-display text-[12px] transition-colors",
              intent === "ALL"
                ? "border-brand bg-brand/10 text-brand"
                : "border-stone-200 bg-white text-stone hover:border-brand hover:text-brand",
            )}
          >
            All intents
          </button>
          {allIntents.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIntent(i)}
              className={cn(
                "rounded-pill border px-3 py-1 font-display text-[12px] transition-colors",
                intent === i
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-stone-200 bg-white text-stone hover:border-brand hover:text-brand",
              )}
            >
              {INTENT_LABEL[i]}
            </button>
          ))}
        </div>

        <div className="ml-auto text-[12px] text-stone">
          {filtered.length} of {keywords.length} keywords
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-4">
        <Stat label="Total clicks" value={formatCompactNumber(totals.clicks)} />
        <Stat label="Total impressions" value={formatCompactNumber(totals.impressions)} />
        <Stat label="Blended CTR" value={`${totals.ctr.toFixed(2)}%`} />
        <Stat label="Avg position" value={totals.avgPos.toFixed(2)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[14px]">
            <thead className="bg-stone-50 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              <tr>
                <Th sort={sort} sortKey="query" onSort={toggleSort} align="left">Query</Th>
                <Th sort={sort} sortKey="currentPosition" onSort={toggleSort}>Position</Th>
                <Th sort={sort} sortKey="delta" onSort={toggleSort}>Δ</Th>
                <Th sort={sort} sortKey="clicks" onSort={toggleSort}>Clicks</Th>
                <Th sort={sort} sortKey="impressions" onSort={toggleSort}>Impr.</Th>
                <Th sort={sort} sortKey="ctr" onSort={toggleSort}>CTR</Th>
                <Th sort={sort} sortKey="searchVolume" onSort={toggleSort}>Volume</Th>
                <Th sort={sort} sortKey="difficulty" onSort={toggleSort}>Difficulty</Th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filtered.map((k) => {
                const delta = Number((k.previousPosition - k.currentPosition).toFixed(1));
                return (
                  <tr key={k.id} className="transition-colors hover:bg-stone-50/60">
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-medium text-charcoal">{k.query}</span>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={INTENT_TONE[k.intent]}>
                            {INTENT_LABEL[k.intent]}
                          </Badge>
                          {k.isBranded ? <Badge variant="muted">Brand</Badge> : null}
                          <span className="text-[11px] text-stone truncate">{k.url}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-charcoal">
                      {k.currentPosition.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 font-mono text-[12px]",
                          delta > 0
                            ? "text-brand"
                            : delta < 0
                              ? "text-amber-600"
                              : "text-stone",
                        )}
                      >
                        {delta > 0 ? "↑" : delta < 0 ? "↓" : "→"}
                        {Math.abs(delta).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-charcoal">
                      {k.clicks.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-stone">
                      {formatCompactNumber(k.impressions)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-stone">
                      {k.ctr.toFixed(2)}%
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-stone">
                      {formatCompactNumber(k.searchVolume)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <DifficultyBar value={k.difficulty} />
                    </td>
                    <td className="pr-4 text-stone">
                      <ChevronRight className="h-4 w-4" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({
  children,
  sort,
  sortKey,
  onSort,
  align = "right",
}: {
  children: React.ReactNode;
  sort: SortState;
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const isActive = sort.key === sortKey;
  return (
    <th
      className={
        "px-3 py-3 font-medium " + (align === "left" ? "text-left" : "text-right")
      }
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-charcoal",
          isActive ? "text-charcoal" : "text-stone",
        )}
      >
        {children}
        {!isActive ? (
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        ) : sort.dir === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
      </button>
    </th>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
        {label}
      </div>
      <div className="mt-1 font-display text-[20px] font-bold text-charcoal">
        {value}
      </div>
    </div>
  );
}

function DifficultyBar({ value }: { value: number }) {
  const tone =
    value >= 70
      ? "bg-red-400"
      : value >= 50
        ? "bg-amber-400"
        : "bg-brand";
  return (
    <div className="ml-auto inline-flex items-center gap-2">
      <span className="font-mono text-[12px] text-charcoal">{value}</span>
      <span className="relative inline-block h-1 w-16 overflow-hidden rounded-full bg-stone-100">
        <span
          className={"absolute inset-y-0 left-0 rounded-full " + tone}
          style={{ width: `${value}%` }}
        />
      </span>
    </div>
  );
}
