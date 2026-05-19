import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";

const BENEFITS = [
  "Pull real search performance data daily — branded vs. non-branded, intent mix, ranking trends",
  "Surface AI-ranked recommendations against your actual click & impression history",
  "Multi-rooftop rollups across every property you own",
];

export function ConnectGscCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/60 p-6 sm:p-8">
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
      />

      <div className="relative grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white px-3 py-1 shadow-subtle">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
              Unlock live data · 60-second setup
            </span>
          </div>

          <h2 className="mt-4 font-display text-[26px] font-black leading-[30px] tracking-tight text-charcoal sm:text-[30px] sm:leading-[34px]">
            Connect your Google Search Console
            <br className="hidden sm:block" />
            <span className="text-brand">to see real numbers.</span>
          </h2>

          <p className="mt-3 max-w-2xl text-[14px] leading-[22px] text-stone">
            You're previewing this dashboard with a deterministic sample.
            Authorize Search Console and we'll backfill 16 months of history,
            then keep it fresh every 24 hours.
          </p>

          <ul className="mt-5 space-y-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[13px] leading-[20px] text-charcoal">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/settings"
              className="inline-flex h-11 items-center gap-2 rounded-pill bg-charcoal px-6 font-display text-[13px] font-bold uppercase tracking-[0.05em] text-white transition-all hover:bg-ink hover:shadow-lg"
            >
              <Zap className="h-4 w-4 text-brand" />
              Connect Search Console
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-stone hover:text-charcoal"
            >
              How it works →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-stone-200 bg-white/80 p-5 backdrop-blur shadow-subtle">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              What you'll get on day one
            </p>
            <div className="mt-4 space-y-3">
              <MetricPreview label="Tracked keywords" value="2,400+" hint="Auto-discovered from your GSC" />
              <MetricPreview label="Historical depth" value="16 months" hint="Backfilled in under 90s" />
              <MetricPreview label="Refresh cadence" value="Every 24h" hint="Nightly delta sync" />
              <MetricPreview label="AI insights" value="Weekly" hint="Ranked by projected click gain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPreview({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
      <div className="min-w-0">
        <p className="font-display text-[13px] font-semibold text-charcoal">
          {label}
        </p>
        <p className="text-[11px] text-stone">{hint}</p>
      </div>
      <p className="font-display text-[18px] font-black text-charcoal">{value}</p>
    </div>
  );
}
