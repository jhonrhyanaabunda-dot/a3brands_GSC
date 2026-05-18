import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Code,
  Database,
  Eye,
  Globe,
  Lock,
  MapPin,
  Search,
  TrendingUp,
  X as XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How A3 Brands actually scores your dealership. The full breakdown of audits, data sources, scoring formulas, and the things we deliberately do not measure.",
};

const TOC = [
  { id: "scan-pipeline", label: "The scan pipeline" },
  { id: "categories", label: "Six audit categories" },
  { id: "scoring", label: "Scoring formula" },
  { id: "recommendations", label: "Recommendation prioritization" },
  { id: "field-vs-lab", label: "Field vs. lab data" },
  { id: "honesty", label: "What we do not measure" },
  { id: "comparison", label: "Vs. other tools" },
  { id: "freshness", label: "Data freshness" },
];

const PIPELINE_STEPS = [
  {
    n: 1,
    title: "Direct HTTP fetch with Chrome User-Agent",
    icon: Globe,
    body: "We open a real HTTPS connection to the URL with a real Chrome 130 User-Agent. We follow redirects, cap the response body at 2.5MB, abort at 12 seconds, then parse the HTML with cheerio. Around 80 percent of dealership sites resolve here in 2-6 seconds.",
    detail: "Source: lib/scan/fetch.ts → attemptFetch()",
  },
  {
    n: 2,
    title: "Retry with Googlebot User-Agent",
    icon: Search,
    body: "If step 1 returns 403, we retry with Googlebot's published UA string. Many WAFs allowlist Googlebot UA without doing the more expensive reverse-DNS verification, so this rescues a meaningful chunk of sites for free.",
    detail: "Triggered automatically on HTTP 403 only.",
  },
  {
    n: 3,
    title: "PageSpeed Insights API fallback",
    icon: Brain,
    body: "If steps 1 and 2 both fail, we call Google's public PageSpeed Insights API. Google fetches the page from their own IPs, which Cloudflare and Akamai allowlist by default. We get back the full Lighthouse audit plus Chrome UX Report field data (real-user LCP, INP, CLS from real Chrome users on that origin).",
    detail: "Free quota with a PAGESPEED_API_KEY: 25,000 req/day per key.",
  },
];

const CATEGORIES = [
  {
    icon: Code,
    badge: "Scored",
    badgeVariant: "success" as const,
    title: "Meta & Content",
    body: "Title tags, meta descriptions, H1 hierarchy, canonicals, Open Graph and Twitter cards, viewport, lang attribute, alt text, descriptive links.",
    source: "cheerio HTML parsing of the live page, or Lighthouse audits via PSI.",
  },
  {
    icon: Database,
    badge: "Scored",
    badgeVariant: "success" as const,
    title: "Technical SEO",
    body: "HTTPS enforced, robots.txt valid and reachable, sitemap.xml discoverable, redirect chains, HSTS, compression, X-Robots-Tag, hreflang.",
    source: "Live HTTP fetches of /robots.txt and /sitemap.xml plus response headers from the homepage fetch.",
  },
  {
    icon: TrendingUp,
    badge: "Scored",
    badgeVariant: "success" as const,
    title: "Performance & Mobile",
    body: "Page weight, render-blocking resources, image formats, CLS-safe images, mobile viewport. With PSI: real LCP, INP, CLS from Chrome UX Report.",
    source: "Direct: our own server-side fetch timings. PSI: Lighthouse lab plus 28-day CrUX field data.",
  },
  {
    icon: Code,
    badge: "Scored",
    badgeVariant: "success" as const,
    title: "Schema & Structured Data",
    body: "JSON-LD presence, Organization / LocalBusiness / AutoDealer, Vehicle schema (for VDPs), Offer schema (for pricing), Review / AggregateRating.",
    source: "Direct path only - we parse every JSON-LD script block. PSI does not expose HTML, so this category is skipped if PSI fallback is used.",
  },
  {
    icon: MapPin,
    badge: "Locked",
    badgeVariant: "muted" as const,
    title: "Local SEO & GBP",
    body: "Google Business Profile health, map-pack visibility, NAP consistency, photo cadence, review velocity and sentiment.",
    source: "Requires the dealer to grant GBP API access via OAuth. We never claim a score we cannot measure.",
  },
  {
    icon: Lock,
    badge: "Locked",
    badgeVariant: "muted" as const,
    title: "Keyword Visibility",
    body: "Branded vs. non-branded distribution, intent coverage, CTR vs. market benchmark, ranking deltas, query-level attribution.",
    source: "Requires the dealer to grant Search Console API access via OAuth. Public scans cannot see this.",
  },
];

const SCORING_TILES = [
  {
    tone: "brand" as const,
    label: "PASS",
    weight: "weight = 1.0",
    body: "Clean. The page meets best practice for this check.",
  },
  {
    tone: "amber" as const,
    label: "WARN",
    weight: "weight = 0.55",
    body: "Partial. The check is present but has a problem - title too long, meta description too short, etc.",
  },
  {
    tone: "red" as const,
    label: "FAIL",
    weight: "weight = 0.1",
    body: "Missing or broken. We still award a small floor so a single fail does not tank the whole category.",
  },
];

const GRADE_ROWS = [
  { g: "A+", r: "92-100", m: "Elite. Focus on local + content depth." },
  { g: "A", r: "85-91", m: "Strong. Schema and metadata are the upside." },
  { g: "B", r: "75-84", m: "Solid foundation. Rich-result and CTR gains available." },
  { g: "C", r: "65-74", m: "Underperforming for market. Technical fixes blocking growth." },
  { g: "D", r: "55-64", m: "Structural gaps. Multiple categories need attention." },
  { g: "F", r: "0-54", m: "Urgent. Likely blocking organic performance materially." },
];

const PRIORITY_TILES = [
  {
    badge: "CRITICAL",
    tone: "critical" as const,
    body: "Page is fundamentally broken for indexing or rendering: missing viewport meta, no title, blocked from crawl. Address first.",
  },
  {
    badge: "HIGH",
    tone: "warning" as const,
    body: "Significant gap with measurable impact: missing Vehicle schema, oversized HTML, render-blocking CSS over 100KB.",
  },
  {
    badge: "MEDIUM",
    tone: "default" as const,
    body: "Tunable: title length out of band, meta description length suboptimal, missing Open Graph tags.",
  },
  {
    badge: "LOW",
    tone: "muted" as const,
    body: "Hygiene: alt text on decorative images, hreflang for English-only sites, etc. Worth doing, not first.",
  },
];

const HONESTY_ROWS = [
  {
    label: "Conversion-rate impact of a fix",
    body: "We can project a click gain. We cannot predict whether those clicks convert into a lead form submission without seeing your CRM funnel. We do not pretend to.",
  },
  {
    label: "Backlink quality / domain authority",
    body: "We do not have an independent crawler at the scale of Ahrefs or Semrush. If you want backlink analysis, use them. We integrate with their APIs on Enterprise plans for a single source of truth.",
  },
  {
    label: "Competitor pricing data",
    body: "We track competitor visibility, not their lease offers. Scraping competitor pricing is brittle, ethically gray, and the legal team would call.",
  },
  {
    label: "Content quality at the topic level",
    body: "We measure structural quality (H1 hierarchy, meta description fit). We do not grade prose. That is a job for a human editor, not a Lighthouse audit.",
  },
];

const COMPARISON_ROWS: Array<[string, boolean, boolean, boolean]> = [
  ["Real GSC ingestion", true, false, true],
  ["Map-pack grid scans", true, false, false],
  ["Multi-rooftop rollups", true, false, false],
  ["AI insights w/ projected ROI", true, false, false],
  ["OEM compliance presets", true, false, false],
  ["Backlink graph (deep)", false, true, false],
  ["SERP feature tracking", true, true, false],
  ["Ranking history (5+ years)", false, true, false],
];

const FRESHNESS_ROWS = [
  {
    label: "GSC clicks / impressions / CTR / position",
    cadence: "Synced every 24 hours",
    body: "Google holds GSC data behind a 2-3 day rolling window; we ingest as soon as available.",
  },
  {
    label: "Core Web Vitals (CrUX field data)",
    cadence: "Refreshed every 28 days",
    body: "Chrome UX Report aggregates real-user data on a 28-day window. Fresher data is not available.",
  },
  {
    label: "Map-pack grid scans",
    cadence: "Weekly (Multi-Rooftop) / Daily (Enterprise)",
    body: "9x9 grid across your service area. Daily on Enterprise plans for time-sensitive launches.",
  },
  {
    label: "Competitor visibility",
    cadence: "Every 6 hours",
    body: "We aggregate shared-keyword rankings into a single visibility score per competitor.",
  },
  {
    label: "AI insight queue",
    cadence: "Every 24 hours",
    body: "Each rooftop's recommendation queue is re-ranked nightly based on the day's signal changes.",
  },
  {
    label: "GBP photos / posts / reviews",
    cadence: "Every 12 hours",
    body: "Pulled via the Google Business Profile API. Review sentiment recomputed on each pull.",
  },
];

export default function MethodologyPage() {
  return (
    <div>
      <InfoHero
        eyebrow="Methodology"
        title="How A3 Brands actually scores your dealership."
        description="The full breakdown of every audit, every data source, and the things we deliberately do not measure. If a number is on a screen, this is where it comes from."
      />

      <section className="container py-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          {/* TOC */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                Contents
              </p>
              <ol className="mt-3 space-y-2 text-[13px]">
                {TOC.map((t, i) => (
                  <li key={t.id}>
                    <Link
                      href={`#${t.id}`}
                      className="flex gap-2 text-stone transition-colors hover:text-brand"
                    >
                      <span className="font-mono text-[11px] text-stone-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                  TL;DR
                </p>
                <p className="mt-2 text-[12px] leading-[18px] text-charcoal">
                  We do real HTTP fetches, parse real HTML, hit Google's PageSpeed
                  Insights and Search Console APIs. Every finding cites its data
                  source. We mark locked categories honestly rather than
                  fabricating.
                </p>
              </div>
            </div>
          </aside>

          {/* Body */}
          <article className="space-y-16 lg:col-span-9">
            {/* 1. Pipeline */}
            <section id="scan-pipeline">
              <Badge variant="default">01 · The scan pipeline</Badge>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
                Three real attempts, in order.
              </h2>
              <p className="mt-4 text-[15px] leading-[24px] text-stone text-pretty">
                When you submit a URL on{" "}
                <Link
                  href="/scan"
                  className="font-semibold text-brand hover:underline"
                >
                  /scan
                </Link>
                , the orchestrator runs a cascade. The first step that succeeds
                is the one that fills the result.
              </p>

              <ol className="mt-6 space-y-4">
                {PIPELINE_STEPS.map((step) => (
                  <li key={step.n}>
                    <article className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-6">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 font-display text-[14px] font-bold text-brand">
                        {step.n}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-[17px] font-bold text-charcoal">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                          {step.body}
                        </p>
                        <p className="mt-2 font-mono text-[11px] text-stone-400">
                          {step.detail}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-[14px] leading-[22px] text-charcoal">
                  <span className="font-display font-bold">
                    If all three fail
                  </span>
                  : we tell you which step failed and why. We never fabricate a
                  result.
                </p>
              </div>
            </section>

            {/* 2. Categories */}
            <section id="categories">
              <Badge variant="default">02 · Six audit categories</Badge>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
                Four we score. Two we mark locked.
              </h2>
              <p className="mt-4 text-[15px] leading-[24px] text-stone text-pretty">
                The dashboard shows six categories. Four are auditable from a
                public scan. Two require authenticated API access from the
                dealer themselves - and we say so out loud.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {CATEGORIES.map((cat) => (
                  <CategoryCard key={cat.title} cat={cat} />
                ))}
              </div>
            </section>

            {/* 3. Scoring */}
            <section id="scoring">
              <Badge variant="default">03 · Scoring formula</Badge>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
                Pass / warn / fail, then a weighted average.
              </h2>
              <p className="mt-4 text-[15px] leading-[24px] text-stone text-pretty">
                Every category produces a list of findings. Each finding gets
                one of three labels based on whether the check passed cleanly,
                with caveats, or failed.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {SCORING_TILES.map((t) => (
                  <ScoreTile key={t.label} tile={t} />
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-6">
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                  Per-category score
                </p>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-stone-200 bg-white p-4 font-mono text-[12px] leading-[20px] text-charcoal">
{`score = round(
  sum(weight[status]) / findingCount * 100
)`}
                </pre>
                <p className="mt-3 text-[14px] leading-[22px] text-stone text-pretty">
                  A category with 8 findings - 6 pass, 1 warn, 1 fail - scores{" "}
                  <code className="font-mono text-charcoal">
                    ((6 * 1.0 + 1 * 0.55 + 1 * 0.1) / 8) * 100 = 83
                  </code>
                  . Grade: B.
                </p>

                <p className="mt-6 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                  Overall score
                </p>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-stone-200 bg-white p-4 font-mono text-[12px] leading-[20px] text-charcoal">
{`overallScore = round(
  sum(scoredCategory.score) / scoredCategory.count
)`}
                </pre>
                <p className="mt-3 text-[14px] leading-[22px] text-stone text-pretty">
                  Locked categories (Local SEO, Keyword Visibility) are
                  excluded from the denominator - we do not penalize you for
                  not having a GSC connection yet.
                </p>
              </div>

              <h3 className="mt-8 font-display text-[18px] font-bold text-charcoal">
                Grade bands
              </h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white">
                <table className="w-full text-[14px]">
                  <thead className="bg-stone-50 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                    <tr>
                      <th className="px-4 py-2 text-left">Grade</th>
                      <th className="px-4 py-2 text-left">Score range</th>
                      <th className="px-4 py-2 text-left">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {GRADE_ROWS.map((g) => (
                      <tr key={g.g}>
                        <td className="px-4 py-2 font-display font-bold text-charcoal">
                          {g.g}
                        </td>
                        <td className="px-4 py-2 font-mono text-stone">{g.r}</td>
                        <td className="px-4 py-2 text-stone">{g.m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Recommendations */}
            <section id="recommendations">
              <Badge variant="default">04 · Recommendation prioritization</Badge>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
                Every recommendation maps back to a finding.
              </h2>
              <p className="mt-4 text-[15px] leading-[24px] text-stone text-pretty">
                A recommendation is never freestanding - it is always derived
                from a specific failed or warning finding. The recommendation
                text references the actual data we collected, not a generic
                template.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PRIORITY_TILES.map((p) => (
                  <article
                    key={p.badge}
                    className="rounded-2xl border border-stone-200 bg-white p-5"
                  >
                    <Badge variant={p.tone}>{p.badge}</Badge>
                    <p className="mt-3 text-[14px] leading-[22px] text-stone text-pretty">
                      {p.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* 5. Field vs lab */}
            <section id="field-vs-lab">
              <Badge variant="default">05 · Field vs. lab data</Badge>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
                Why the PSI fallback is sometimes the better path.
              </h2>
              <p className="mt-4 text-[15px] leading-[24px] text-stone text-pretty">
                A direct scan gives us synthetic lab measurements from one
                server-side fetch. A PSI scan gives us the same plus{" "}
                <strong>Chrome UX Report field data</strong> - the 75th
                percentile of real-user measurements from every Chrome user
                who hit that origin in the last 28 days. Field data is what
                Google actually uses to rank you.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-6">
                  <h3 className="font-display text-[16px] font-bold text-charcoal">
                    Lab data (synthetic)
                  </h3>
                  <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                    Lighthouse loads the page in a controlled environment with
                    a simulated 3G connection and a single device. Useful for
                    isolated A/B changes. Less representative of real users.
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-brand bg-brand/[0.06] p-6">
                  <h3 className="flex items-center gap-2 font-display text-[16px] font-bold text-charcoal">
                    Field data (CrUX) <Badge variant="success">Preferred</Badge>
                  </h3>
                  <p className="mt-2 text-[14px] leading-[22px] text-charcoal text-pretty">
                    Aggregated from real Chrome users at the 75th percentile.
                    This is what Google's Core Web Vitals ranking signal
                    actually uses. If a site has insufficient traffic, CrUX is
                    null - we then fall back to lab data and say so on the
                    card.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Honesty */}
            <section id="honesty">
              <Badge variant="default">06 · What we do not measure</Badge>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
                Things we would love to score - but will not fake.
              </h2>

              <ul className="mt-6 space-y-3">
                {HONESTY_ROWS.map((h) => (
                  <li
                    key={h.label}
                    className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-5"
                  >
                    <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                    <div>
                      <p className="font-display text-[14px] font-bold text-charcoal">
                        {h.label}
                      </p>
                      <p className="mt-1 text-[13px] leading-[20px] text-stone text-pretty">
                        {h.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* 7. Comparison */}
            <section id="comparison">
              <Badge variant="default">07 · Vs. other tools</Badge>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
                We do not replace your SEO stack. We unify it.
              </h2>
              <p className="mt-4 text-[15px] leading-[24px] text-stone text-pretty">
                Semrush is great for backlinks. Lighthouse is great for one-off
                technical audits. GSC is great for raw ranking data. A3 Brands
                is the layer that ties all of them to dealer-specific
                workflows: inventory turnover, lease cycles, OEM banner
                compliance, rooftop-level rollups.
              </p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <table className="w-full text-[14px]">
                  <thead className="bg-stone-50 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                    <tr>
                      <th className="px-4 py-3 text-left">Capability</th>
                      <th className="px-4 py-3 text-center">A3 Brands</th>
                      <th className="px-4 py-3 text-center">Semrush / Ahrefs</th>
                      <th className="px-4 py-3 text-center">Raw GSC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 font-medium text-charcoal">
                          {row[0]}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <CheckOrCross on={row[1]} />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <CheckOrCross on={row[2]} />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <CheckOrCross on={row[3]} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 8. Freshness */}
            <section id="freshness">
              <Badge variant="default">08 · Data freshness</Badge>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[32px] md:leading-[36px]">
                How often each number updates.
              </h2>

              <ul className="mt-6 space-y-3">
                {FRESHNESS_ROWS.map((f) => (
                  <li
                    key={f.label}
                    className="rounded-2xl border border-stone-200 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-[15px] font-bold text-charcoal">
                        {f.label}
                      </h3>
                      <Badge variant="muted">{f.cadence}</Badge>
                    </div>
                    <p className="mt-2 text-[13px] leading-[20px] text-stone text-pretty">
                      {f.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Close */}
            <section className="rounded-2xl border border-stone-200 bg-stone-50 p-8 md:p-10">
              <Eye className="h-6 w-6 text-brand" />
              <h2 className="mt-3 font-display text-[24px] font-black leading-[28px] tracking-tight text-charcoal sm:text-[28px] sm:leading-[33px]">
                Found a methodology issue?
              </h2>
              <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                We would rather be corrected than wrong. Email{" "}
                <a
                  href="mailto:methodology@lonestarford.com"
                  className="font-semibold text-brand hover:underline"
                >
                  methodology@lonestarford.com
                </a>{" "}
                with the specific claim and your data - we will either fix the
                page or fix the engine.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="default" size="lg">
                  <Link href="/scan">
                    Run a real scan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/book-demo">Book a strategy call</Link>
                </Button>
              </div>
            </section>
          </article>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({
  cat,
}: {
  cat: {
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
    badgeVariant: "success" | "muted";
    title: string;
    body: string;
    source: string;
  };
}) {
  const Icon = cat.icon;
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon className="h-5 w-5" />
        </span>
        <Badge variant={cat.badgeVariant}>{cat.badge}</Badge>
      </div>
      <h3 className="mt-4 font-display text-[17px] font-bold text-charcoal">
        {cat.title}
      </h3>
      <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
        {cat.body}
      </p>
      <p className="mt-3 text-[11px] leading-[16px] text-stone-400 text-pretty">
        <span className="font-display font-bold uppercase tracking-[0.08em] text-stone">
          Source:
        </span>{" "}
        {cat.source}
      </p>
    </article>
  );
}

function ScoreTile({
  tile,
}: {
  tile: {
    tone: "brand" | "amber" | "red";
    label: string;
    weight: string;
    body: string;
  };
}) {
  const toneClass =
    tile.tone === "brand"
      ? "border-brand bg-brand/[0.06]"
      : tile.tone === "amber"
        ? "border-amber-400/50 bg-amber-50"
        : "border-red-300 bg-red-50";
  const dotClass =
    tile.tone === "brand"
      ? "bg-brand"
      : tile.tone === "amber"
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className={"rounded-xl border-2 p-5 " + toneClass}>
      <div className="flex items-center gap-2">
        <span className={"h-2.5 w-2.5 rounded-full " + dotClass} />
        <span className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-charcoal">
          {tile.label}
        </span>
      </div>
      <div className="mt-1 font-mono text-[11px] text-stone">{tile.weight}</div>
      <p className="mt-3 text-[13px] leading-[20px] text-charcoal text-pretty">
        {tile.body}
      </p>
    </div>
  );
}

function CheckOrCross({ on }: { on: boolean }) {
  return on ? (
    <CheckCircle2 className="mx-auto h-4 w-4 text-brand" />
  ) : (
    <XIcon className="mx-auto h-4 w-4 text-stone-300" />
  );
}
