import Link from "next/link";
import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="border-b border-brand/20 bg-brand/[0.06]">
      <div className="flex items-center gap-2 px-4 py-2 text-[12px] text-charcoal sm:px-6">
        <Info className="h-3.5 w-3.5 shrink-0 text-brand" />
        <span className="min-w-0 flex-1 truncate">
          You're viewing A3 Brands in demo mode with deterministic data. Connect a Postgres database to enable real GSC ingestion.
        </span>
        <Link
          href="/docs"
          className="hidden shrink-0 font-display text-[12px] font-semibold text-brand hover:underline sm:inline"
        >
          Setup guide →
        </Link>
      </div>
    </div>
  );
}
