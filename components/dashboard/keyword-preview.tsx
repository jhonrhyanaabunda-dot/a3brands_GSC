import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { KeywordRecord } from "@/lib/data/types";

export function KeywordPreview({ keywords }: { keywords: KeywordRecord[] }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            Top-moving keywords
          </p>
          <p className="mt-1 text-[14px] text-charcoal">
            Biggest position swings this window
          </p>
        </div>
        <Link
          href="/keywords"
          className="inline-flex items-center gap-1 rounded-pill border border-stone-200 px-3 py-1 font-display text-[12px] font-medium text-charcoal transition-colors hover:border-brand hover:text-brand"
        >
          All keywords <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <table className="w-full text-[14px]">
        <thead className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
          <tr>
            <th className="py-2 text-left">Query</th>
            <th className="py-2 text-right">Position</th>
            <th className="py-2 text-right">Δ</th>
            <th className="hidden py-2 text-right sm:table-cell">Clicks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {keywords.map((k) => {
            const delta = Number((k.previousPosition - k.currentPosition).toFixed(1));
            const positive = delta > 0;
            return (
              <tr key={k.id}>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={k.isBranded ? "default" : "muted"}>
                      {k.isBranded ? "Brand" : "Non-brand"}
                    </Badge>
                    <span className="truncate text-charcoal">{k.query}</span>
                  </div>
                </td>
                <td className="py-2.5 text-right font-mono text-charcoal">
                  {k.currentPosition.toFixed(1)}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={
                      positive
                        ? "text-brand"
                        : delta < 0
                          ? "text-amber-600"
                          : "text-stone"
                    }
                  >
                    {delta > 0 ? "↑" : delta < 0 ? "↓" : "→"}
                    {Math.abs(delta).toFixed(1)}
                  </span>
                </td>
                <td className="hidden py-2.5 text-right font-mono text-charcoal sm:table-cell">
                  {k.clicks.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
