import { ArrowRight, CheckCircle2, Database, Lock, Shield } from "lucide-react";

import { DemoActionButton } from "@/components/demo/action-button";

const STEPS = [
  {
    n: 1,
    title: "Authorize with Google",
    detail: "Read-only access to your Search Console data. Revocable anytime.",
  },
  {
    n: 2,
    title: "Pick your properties",
    detail: "Select the dealership domains you want to track — one rooftop or all of them.",
  },
  {
    n: 3,
    title: "Initial sync (~90s)",
    detail: "We backfill 16 months of clicks, impressions, CTR, and average position.",
  },
];

const PERMISSIONS = [
  "View Search Analytics performance data",
  "View list of verified Search Console properties",
  "View sitemap submission history",
];

export function GscConnectHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-subtle">
      {/* Top accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC04]" />

      <div className="grid gap-0 lg:grid-cols-12">
        {/* Left: brand + action */}
        <div className="relative border-b border-stone-100 p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <GoogleMark className="h-9 w-9" />
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                Primary data source
              </p>
              <h2 className="font-display text-[18px] font-bold tracking-tight text-charcoal">
                Google Search Console
              </h2>
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-700">
              Not connected
            </span>
          </div>

          <p className="mt-5 text-[14px] leading-[22px] text-charcoal">
            Connect your GSC account to replace the sample data on this dashboard
            with live performance from your dealerships. Sync runs every 24 hours.
          </p>

          <DemoActionButton
            variant="default"
            size="lg"
            className="mt-6 w-full sm:w-auto bg-charcoal hover:bg-ink"
            toastMessage="Google OAuth flow opens here in production."
            toastDescription="Configure GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET in .env.local to enable the live consent screen."
          >
            <GoogleMark className="h-4 w-4" />
            Connect with Google
            <ArrowRight className="h-4 w-4" />
          </DemoActionButton>

          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-stone">
            <Lock className="h-3 w-3" />
            OAuth 2.0 · Tokens encrypted at rest with KMS
          </p>
        </div>

        {/* Right: 3-step process */}
        <div className="p-6 sm:p-8 lg:col-span-7">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
            What happens when you click connect
          </p>

          <ol className="mt-5 space-y-4">
            {STEPS.map((s) => (
              <li key={s.n} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 font-display text-[13px] font-bold text-charcoal">
                  {s.n}
                </span>
                <div className="min-w-0 flex-1 pb-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-stone-100">
                  <p className="font-display text-[14px] font-bold text-charcoal">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-[18px] text-stone">
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-2 rounded-xl border border-stone-200 bg-stone-50/50 p-4">
            <p className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.08em] text-stone">
              <Shield className="h-3 w-3" />
              Scopes requested
            </p>
            <ul className="mt-2 space-y-1">
              {PERMISSIONS.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2 text-[12px] leading-[18px] text-charcoal"
                >
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-brand" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom data-types strip */}
      <div className="grid grid-cols-2 gap-px bg-stone-100 sm:grid-cols-4">
        {[
          { icon: Database, label: "Clicks & impressions", sub: "Daily" },
          { icon: Database, label: "Query rankings", sub: "Per page" },
          { icon: Database, label: "CTR & positions", sub: "16-mo history" },
          { icon: Database, label: "Sitemaps & coverage", sub: "Errors & warnings" },
        ].map((d) => (
          <div
            key={d.label}
            className="flex items-center gap-2.5 bg-white px-4 py-3.5"
          >
            <d.icon className="h-4 w-4 shrink-0 text-stone-400" />
            <div className="min-w-0">
              <p className="truncate font-display text-[12px] font-semibold text-charcoal">
                {d.label}
              </p>
              <p className="truncate text-[11px] text-stone">{d.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
