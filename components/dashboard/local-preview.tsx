import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

import type { LocalRankingPoint, ReviewSnapshotRecord } from "@/lib/data/types";

function cellTone(pos: number) {
  if (pos <= 3) return "bg-brand text-white";
  if (pos <= 7) return "bg-brand/40 text-charcoal";
  if (pos <= 12) return "bg-amber-400/50 text-charcoal";
  return "bg-stone-200 text-stone";
}

export function LocalPreview({
  grid,
  query,
  reviews,
}: {
  grid: LocalRankingPoint[];
  query: string;
  reviews: ReviewSnapshotRecord;
}) {
  const inPack = grid.filter((g) => g.inMapPack).length;
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Local map-pack visibility
          </p>
          <p className="mt-1 text-[14px] text-charcoal">
            <span className="font-bold">{inPack}/{grid.length}</span> grid cells in top 3 - "{query}"
          </p>
        </div>
        <Link
          href="/local-seo"
          className="inline-flex items-center gap-1 rounded-pill border border-stone-200 px-3 py-1 font-display text-[12px] font-medium text-charcoal transition-colors hover:border-brand hover:text-brand"
        >
          Open <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {grid.map((g) => (
          <div
            key={`${g.gridX}-${g.gridY}`}
            className={
              "flex aspect-square items-center justify-center rounded-md font-mono text-[10px] font-bold border border-stone-200/60 " +
              cellTone(g.position)
            }
          >
            #{g.position}
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-stone-200 pt-4 text-[14px]">
        <div>
          <div className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            <MapPin className="h-3 w-3" />
            Map pack
          </div>
          <div className="mt-1 font-display text-[18px] font-bold text-charcoal">
            {inPack}/{grid.length}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            <Star className="h-3 w-3" />
            Reviews
          </div>
          <div className="mt-1 font-display text-[18px] font-bold text-charcoal">
            {reviews.averageRating.toFixed(1)}<span className="text-[12px] text-stone">★</span>
          </div>
          <div className="text-[11px] text-stone">{reviews.totalReviews.toLocaleString()} total</div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Response rate
          </div>
          <div className="mt-1 font-display text-[18px] font-bold text-charcoal">
            {reviews.responseRate.toFixed(0)}%
          </div>
          <div className="text-[11px] text-stone">
            +{reviews.newReviews30d} this month
          </div>
        </div>
      </div>
    </div>
  );
}
