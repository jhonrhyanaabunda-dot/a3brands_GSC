import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, MapPin, Quote, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "How automotive dealer groups use A3 Brands to grow organic leads.",
};

const STATS = [
  { value: "2,400+", label: "Rooftops monitored" },
  { value: "84M", label: "Monthly impressions tracked" },
  { value: "+38%", label: "Avg. organic lead growth" },
  { value: "<24h", label: "AI insight refresh" },
];

const CASES = [
  {
    tag: "Multi-rooftop",
    title: "A3 Brands Auto Group",
    market: "Dallas-Fort Worth · 5 rooftops",
    metric: "+38%",
    metricLabel: "organic leads in 90 days",
    summary:
      "A Ford + Toyota group restructured around AI insights and lifted lease-intent CTR by 1.4 percentage points. We helped them rebuild every VDP with proper Vehicle schema, then surface 14 city-specific lease landing pages.",
    plays: [
      "Vehicle + Offer schema sitewide",
      "City-specific lease pages (6 cities)",
      "Mobile LCP from 4.1s → 2.2s",
    ],
    quote: {
      body: "We added 38% organic leads in one quarter. A3's AI surfaced opportunities our agency had been missing for years.",
      author: "Charles Rourke",
      role: "Principal Dealer · A3 Brands Auto Group",
    },
  },
  {
    tag: "Schema overhaul",
    title: "Crestwood Automotive",
    market: "Atlanta · 12 rooftops",
    metric: "2.3×",
    metricLabel: "rich result impressions",
    summary:
      "Deployed Vehicle and Offer schema across all twelve rooftops in a single sprint. Within 6 weeks, rich result impressions for inventory queries jumped 2.3× and average position on lease keywords improved by 1.8.",
    plays: [
      "Bulk schema rollout (4,200 VDPs)",
      "Service-page meta rewrite at scale",
      "OEM compliance for 3 banners",
    ],
    quote: {
      body: "Executive reporting that GMs actually open. The lead opportunity score has become a board-level KPI for us.",
      author: "Priya Desai",
      role: "Marketing Director · Crestwood Automotive",
    },
  },
  {
    tag: "Local SEO",
    title: "Hill Motor Co.",
    market: "Phoenix Metro · 22 rooftops",
    metric: "+41%",
    metricLabel: "map-pack visibility",
    summary:
      "Built city-specific landing pages for every rooftop's secondary service area and reactivated GBP photo cadence. Map pack appearance for inventory queries rose 41% inside the first quarter.",
    plays: [
      "City-modifier landing pages (84 in total)",
      "Weekly GBP photo automation",
      "Review response cadence + sentiment monitoring",
    ],
    quote: {
      body: "Map-pack visibility across 22 rooftops jumped 41%. The local SEO module pays for itself before lunch.",
      author: "Marcus Hill",
      role: "General Manager · Hill Motor Co.",
    },
  },
];

const LOGOS = [
  "AutoNation",
  "Group 1 Automotive",
  "Sonic Automotive",
  "Lithia Motors",
  "Penske Automotive",
  "Sewell",
  "Asbury Automotive",
  "Hendrick Automotive",
];

export default function CustomersPage() {
  return (
    <>
      <InfoHero
        eyebrow="Customers"
        title={
          <>
            The dealer groups <span className="text-brand">running ahead.</span>
          </>
        }
        description="Three case studies, full numbers, real recovery plans. The plays you see here are the same ones in your AI insight queue today."
      />

      {/* Stats strip */}
      <section className="border-b border-stone-200 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 md:gap-y-0">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={
                  "text-center md:px-6 " +
                  (i < STATS.length - 1 ? "md:border-r md:border-stone-200" : "")
                }
              >
                <div className="font-display font-black tracking-tight text-charcoal text-[36px] leading-[40px] md:text-[44px] md:leading-[48px]">
                  {s.value}
                </div>
                <div className="mt-1.5 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-stone">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="container py-20">
        <p className="section-label">CASE STUDIES</p>
        <h2 className="mt-3 max-w-2xl font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[35px] md:leading-[39px]">
          Three groups, three playbooks, three real outcomes.
        </h2>

        <div className="mt-12 space-y-6">
          {CASES.map((c, i) => (
            <article
              key={c.title}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <div className="grid gap-0 md:grid-cols-12">
                {/* Left - case meta */}
                <div className="border-b border-stone-200 bg-stone-50 p-7 md:col-span-4 md:border-b-0 md:border-r md:p-10">
                  <Badge variant="muted" className="self-start">
                    {c.tag}
                  </Badge>
                  <h3 className="mt-5 font-display text-[22px] font-bold tracking-tight text-charcoal md:text-[24px]">
                    {c.title}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-stone">
                    <MapPin className="h-3 w-3" />
                    {c.market}
                  </p>

                  <div className="mt-7">
                    <div className="font-display text-[52px] font-black leading-none tracking-tight text-brand">
                      {c.metric}
                    </div>
                    <div className="mt-2 text-[12px] text-stone">
                      {c.metricLabel}
                    </div>
                  </div>
                </div>

                {/* Right - content */}
                <div className="p-7 md:col-span-8 md:p-10">
                  <p className="text-[15px] leading-[24px] text-charcoal text-pretty">
                    {c.summary}
                  </p>

                  <div className="mt-6">
                    <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
                      Plays we shipped
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                      {c.plays.map((p) => (
                        <li
                          key={p}
                          className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-[12px] font-medium text-charcoal"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <figure className="mt-6 rounded-xl border-l-4 border-brand bg-stone-50 p-5">
                    <Quote className="h-4 w-4 text-brand" />
                    <blockquote className="mt-2 text-[14px] leading-[22px] text-charcoal text-pretty">
                      "{c.quote.body}"
                    </blockquote>
                    <figcaption className="mt-3 text-[12px] text-stone">
                      <span className="font-display font-bold text-charcoal">
                        {c.quote.author}
                      </span>{" "}
                      · {c.quote.role}
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-stone-200 bg-stone-50">
        <div className="container py-14">
          <p className="text-center font-display text-[10px] font-bold uppercase tracking-[0.2em] text-stone">
            Trusted by dealer groups across North America
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 items-center sm:grid-cols-4 md:grid-cols-8">
            {LOGOS.map((l) => (
              <div
                key={l}
                className="flex items-center justify-center text-center font-display text-[14px] font-semibold text-stone hover:text-charcoal transition-colors"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center md:p-14">
          <h2 className="font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal sm:text-[35px] sm:leading-[39px]">
            See your own scorecard.
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-[14px] leading-[22px] text-stone">
            Run a free GSC scan on your dealership URL. You'll get the same
            playbook these groups used - tailored to your actual site.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="default" size="lg">
              <Link href="/scan">
                Run free GSC scan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/book-demo">Book a strategy call</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
