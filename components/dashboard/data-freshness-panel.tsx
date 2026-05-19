import { Activity, Clock, RefreshCw } from "lucide-react";

const FEEDS = [
  {
    label: "Search Console performance",
    status: "Sample data",
    cadence: "Will refresh every 24h",
    tone: "amber" as const,
  },
  {
    label: "Google Business Profile",
    status: "Live · 5 locations",
    cadence: "Refreshes hourly",
    tone: "green" as const,
  },
  {
    label: "Google Analytics 4",
    status: "Live · 5 properties",
    cadence: "Refreshes every 6h",
    tone: "green" as const,
  },
  {
    label: "PageSpeed Insights",
    status: "On-demand",
    cadence: "Runs per /scan request",
    tone: "blue" as const,
  },
];

const TONE_STYLES = {
  green: "bg-brand/12 text-brand",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-sky-100 text-sky-700",
};

export function DataFreshnessPanel() {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            <Activity className="h-3 w-3" />
            Connection health
          </p>
          <h2 className="mt-1 font-display text-[18px] font-bold tracking-tight text-charcoal">
            Data freshness across your sources
          </h2>
        </div>
        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.06em] text-stone transition-colors hover:border-brand hover:text-brand sm:inline-flex"
        >
          <RefreshCw className="h-3 w-3" />
          Resync all
        </button>
      </div>

      <div className="mt-5 divide-y divide-stone-100">
        {FEEDS.map((f) => (
          <div
            key={f.label}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${TONE_STYLES[f.tone]}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-[13px] font-semibold text-charcoal">
                  {f.label}
                </p>
                <p className="truncate text-[11px] text-stone">{f.cadence}</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.06em] ${TONE_STYLES[f.tone]}`}
            >
              {f.status}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-stone">
        <Clock className="h-3 w-3" />
        All times shown in your local timezone · America/Los_Angeles
      </p>
    </section>
  );
}
