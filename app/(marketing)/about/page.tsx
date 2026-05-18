import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Compass, Eye, Heart, Sparkles, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "About",
  description:
    "A3 Brands builds the first AI-powered SEO intelligence platform purpose-built for automotive dealer groups.",
};

const VALUES = [
  {
    icon: Eye,
    title: "Honest data",
    body:
      "Every number on a screen ties to a verifiable source. If we can't measure it accurately, we say so - we don't fabricate.",
  },
  {
    icon: Target,
    title: "Built for dealer workflows",
    body:
      "Inventory turnover, lease cycles, OEM banner compliance, multi-rooftop rollups - every feature assumes you operate a dealership.",
  },
  {
    icon: Compass,
    title: "Outcomes over dashboards",
    body:
      "A pretty chart doesn't move a unit. We surface the 3-5 actions a Marketing Director can ship this quarter.",
  },
  {
    icon: Heart,
    title: "Boring infrastructure",
    body:
      "Postgres, TLS 1.3 at rest, daily backups, SOC 2 Type II aligned. The unglamorous work that lets you sleep.",
  },
];

const TIMELINE = [
  {
    year: "2023",
    title: "Idea",
    body: "Founders watched dealer groups burn six figures a year on SEO agencies that couldn't tell them which keywords moved which units.",
  },
  {
    year: "2024 Q1",
    title: "First rooftop",
    body: "Closed the first 5-rooftop Ford group in Dallas. Three months in, organic clicks rose 38%.",
  },
  {
    year: "2024 Q3",
    title: "AI insights engine",
    body: "Shipped the recommendation engine - projected clicks, revenue, effort, and confidence on every insight.",
  },
  {
    year: "2025 Q2",
    title: "Multi-banner expansion",
    body: "Added 6 OEM-specific compliance presets. AutoNation, Group 1, Lithia-style enterprise rollups become standard.",
  },
  {
    year: "Today",
    title: "2,400+ rooftops",
    body: "Tracking 84M monthly impressions, refreshing AI recommendations every 24 hours, with a measurable lead-growth average of 38%.",
  },
];

const TEAM = [
  { name: "Charles Rourke", title: "Principal Dealer · Founding Advisor", initials: "CR" },
  { name: "Priya Desai", title: "Head of Customer Success", initials: "PD" },
  { name: "Marcus Hill", title: "GM-in-Residence", initials: "MH" },
  { name: "Sandra Liang", title: "VP of Operations", initials: "SL" },
  { name: "Devin Park", title: "Engineering Lead", initials: "DP" },
  { name: "Allison Vega", title: "Head of Content", initials: "AV" },
];

export default function AboutPage() {
  return (
    <>
      <InfoHero
        eyebrow="About A3 Brands"
        title={
          <>
            We build the platform we{" "}
            <span className="text-brand">wished existed</span> when we ran rooftops.
          </>
        }
        description="A3 Brands is the first AI intelligence platform purpose-built for automotive dealer groups. Founded by operators who got tired of generic SEO tools pretending to understand inventory turnover."
      />

      {/* Mission */}
      <section className="container py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-stone-50 p-8 md:p-10">
          <Badge variant="default">Our mission</Badge>
          <h2 className="mt-4 font-display text-[24px] font-black leading-[28px] tracking-tight text-charcoal sm:text-[28px] sm:leading-[33px]">
            Make every dealership's organic search performance{" "}
            <span className="text-brand">visible, measurable, and improvable</span>{" "}
            - without an agency in the middle.
          </h2>
          <p className="mt-4 text-[14px] leading-[22px] text-stone text-pretty">
            Dealer groups spend an average of $180k/year on SEO services and still
            can't answer "which page is bleeding leads this week?" We built A3
            Brands so a Marketing Director or General Manager can answer that
            question in under 30 seconds - with data they own.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container py-16">
        <p className="section-label">WHAT WE VALUE</p>
        <h2 className="mt-3 max-w-2xl font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[35px] md:leading-[39px]">
          Four principles every screen has to pass.
        </h2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <li key={v.title}>
              <article className="h-full rounded-2xl border border-stone-200 bg-white p-7 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold text-charcoal">
                  {v.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                  {v.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <section className="container py-16">
        <p className="section-label">HOW WE GOT HERE</p>
        <h2 className="mt-3 max-w-2xl font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[35px] md:leading-[39px]">
          Two years from idea to 2,400+ rooftops.
        </h2>

        <ol className="mt-10 grid gap-5 md:grid-cols-5">
          {TIMELINE.map((t, i) => (
            <li
              key={t.title}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
                {t.year}
              </div>
              <h3 className="mt-3 font-display text-[15px] font-bold text-charcoal">
                {t.title}
              </h3>
              <p className="mt-2 text-[12px] leading-[18px] text-stone text-pretty">
                {t.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Team */}
      <section className="container py-16">
        <p className="section-label">TEAM</p>
        <h2 className="mt-3 max-w-2xl font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[35px] md:leading-[39px]">
          Operators first, engineers second.
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-[22px] text-stone">
          Most of the team ran rooftops or led marketing for dealer groups
          before building software. The credibility you feel using A3 comes
          from that.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((p) => (
            <li
              key={p.name}
              className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand font-display text-[14px] font-bold text-charcoal">
                {p.initials}
              </span>
              <div className="min-w-0">
                <div className="truncate font-display text-[15px] font-bold text-charcoal">
                  {p.name}
                </div>
                <div className="truncate text-[12px] text-stone">{p.title}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="ink-section py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Sparkles className="mx-auto h-6 w-6 text-brand" />
            <h2 className="mt-4 font-display text-[28px] font-black leading-[32px] tracking-tight text-white sm:text-[35px] sm:leading-[39px]">
              Want to know how the scoring really works?
            </h2>
            <p className="mt-3 text-[14px] leading-[22px] text-white/75">
              Our methodology page walks through every audit, the data sources
              we use, and what we deliberately don't measure.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="default" size="lg">
                <Link href="/methodology">
                  Read methodology
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="invert" size="lg">
                <Link href="/book-demo">Book a strategy call</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
