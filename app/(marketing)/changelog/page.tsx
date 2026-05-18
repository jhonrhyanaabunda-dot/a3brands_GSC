import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Changelog",
};

const RELEASES = [
  {
    version: "1.8.0",
    date: "May 18, 2026",
    tag: "feature",
    title: "Real GSC scan with PageSpeed Insights fallback",
    bullets: [
      "Scan tool now does live HTTP fetches with cheerio HTML parsing - no more deterministic mock results.",
      "Three-step fallback cascade: Chrome UA → Googlebot UA → Google PageSpeed Insights API.",
      "PSI fallback unlocks Cloudflare/Akamai-protected dealership sites that would otherwise 403 us.",
      "Categories that genuinely require GSC/GBP API access are now honestly marked as 'locked' rather than fabricated.",
    ],
  },
  {
    version: "1.7.0",
    date: "May 14, 2026",
    tag: "feature",
    title: "Executive dashboard suite",
    bullets: [
      "9 authenticated routes: /dashboard, /insights, /keywords, /competitors, /local-seo, /reports, /reports/[id], /admin, /settings.",
      "Multi-rooftop dealership switcher with cookie-backed server action.",
      "Click-to-reset KPI grid that drives the main traffic chart.",
      "Map-pack grid scanner with per-query re-renders.",
    ],
  },
  {
    version: "1.6.0",
    date: "May 10, 2026",
    tag: "design",
    title: "A3 Brands design system",
    bullets: [
      "Full visual refresh to the published design system: Sora typography, A3 emerald (#1DB954), Charcoal (#2C3038).",
      "Pill CTAs, alternating light/dark sections, 16px card radius.",
      "Lighthouse score on marketing pages: 98 mobile / 100 desktop.",
    ],
  },
  {
    version: "1.5.0",
    date: "May 5, 2026",
    tag: "feature",
    title: "AI insights queue + workflow",
    bullets: [
      "AI recommendations now ship with priority, projected click gain, revenue lift, effort hours, and confidence score.",
      "Tab filters (Open / In progress / Resolved) and per-card workflow actions (Start, Mark resolved, Dismiss).",
      "Cross-rooftop deduplication for Multi-Rooftop and Enterprise plans.",
    ],
  },
  {
    version: "1.4.0",
    date: "April 28, 2026",
    tag: "improvement",
    title: "Faster competitor benchmarks",
    bullets: [
      "Visibility scores refreshed every 6 hours instead of daily.",
      "Added shared-keywords drill-down on every competitor card.",
    ],
  },
  {
    version: "1.3.0",
    date: "April 20, 2026",
    tag: "feature",
    title: "Branded PDF reports",
    bullets: [
      "Weekly executive summary now ships as a downloadable PDF.",
      "White-label branding for Multi-Rooftop and Enterprise plans.",
      "Distribution lists via /settings.",
    ],
  },
  {
    version: "1.2.1",
    date: "April 14, 2026",
    tag: "fix",
    title: "Crash on dealership switch",
    bullets: [
      "Fixed a race condition where switching dealerships mid-render would unmount the active query.",
    ],
  },
  {
    version: "1.2.0",
    date: "April 10, 2026",
    tag: "feature",
    title: "Local SEO module",
    bullets: [
      "5×5 and 9×9 map-pack grid scans for every rooftop's primary service area.",
      "GBP health score with photo cadence, hours accuracy, NAP consistency, Q&A coverage.",
      "Review snapshot with sentiment analysis and automated response drafting.",
    ],
  },
];

const TAG_VARIANT: Record<string, "default" | "muted" | "warning" | "success"> = {
  feature: "default",
  improvement: "muted",
  design: "muted",
  fix: "warning",
};

export default function ChangelogPage() {
  return (
    <>
      <InfoHero
        eyebrow="Changelog"
        title={
          <>
            What we shipped, <span className="text-brand">when.</span>
          </>
        }
        description="Monthly cadence on feature releases, weekly on improvements. Every line you see is in production today."
      />

      <section className="container py-12">
        <ol className="mx-auto max-w-3xl space-y-8">
          {RELEASES.map((r) => (
            <li key={r.version} className="rounded-2xl border border-stone-200 bg-white p-7 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={TAG_VARIANT[r.tag]}>{r.tag.toUpperCase()}</Badge>
                <span className="font-mono text-[12px] text-stone">v{r.version}</span>
                <span className="font-display text-[12px] font-bold uppercase tracking-[0.05em] text-stone">
                  · {r.date}
                </span>
              </div>
              <h2 className="mt-3 font-display text-[20px] font-bold tracking-tight text-charcoal md:text-[22px]">
                {r.title}
              </h2>
              <ul className="mt-3 space-y-2 text-[14px] leading-[22px] text-charcoal">
                {r.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-pretty">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {b}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
