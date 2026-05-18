"use client";

import * as React from "react";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LocalRankingPoint } from "@/lib/data/types";

function cellTone(pos: number) {
  if (pos <= 3) return "bg-brand text-white";
  if (pos <= 7) return "bg-brand/40 text-charcoal";
  if (pos <= 12) return "bg-amber-400/50 text-charcoal";
  return "bg-stone-200 text-stone";
}

export function MapPackGrid({
  grid,
  queries,
  selected,
  onSelect,
}: {
  grid: LocalRankingPoint[];
  queries: string[];
  selected: string;
  onSelect: (q: string) => void;
}) {
  const inPack = grid.filter((g) => g.inMapPack).length;
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Map pack grid scan
          </p>
          <p className="mt-1 text-[14px] text-charcoal">
            <span className="font-bold">{inPack}/{grid.length}</span> cells in top 3 for "{selected}"
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {queries.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className={cn(
              "rounded-pill border px-3 py-1 font-display text-[12px] transition-colors",
              q === selected
                ? "border-brand bg-brand/10 text-brand"
                : "border-stone-200 bg-white text-stone hover:border-brand hover:text-brand",
            )}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="relative mt-5 aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-4 mx-auto">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundSize: "32px 32px",
            backgroundImage:
              "linear-gradient(to right, rgba(44,48,56,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(44,48,56,0.05) 1px, transparent 1px)",
          }}
        />
        <div className="relative grid h-full w-full grid-cols-5 gap-2">
          {grid.map((g) => (
            <div
              key={`${g.gridX}-${g.gridY}`}
              className={
                "flex items-center justify-center rounded-lg border border-stone-200/60 font-mono text-[11px] font-bold " +
                cellTone(g.position)
              }
            >
              #{g.position}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="relative flex h-6 w-6">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/70" />
            <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand ring-2 ring-white shadow-floating">
              <MapPin className="h-3.5 w-3.5 text-charcoal" />
            </span>
          </span>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-3 gap-2 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-stone">
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-brand" />
          Map pack (1-3)
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-amber-400/60" />
          Page 1 (4-12)
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-stone-300" />
          Off page 1 (13+)
        </li>
      </ul>
    </div>
  );
}
