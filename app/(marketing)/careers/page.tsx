import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Careers",
};

const ROLES = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Product",
    location: "Remote (US)",
    type: "Full-time",
    summary:
      "Own the dashboard surface end-to-end. You'll ship features from Postgres schema to ResearchKit-style polish. TypeScript, Next.js 15, Prisma. We bias toward people who've shipped to dealer-facing products before.",
  },
  {
    title: "Staff Data Engineer (GSC + Lighthouse)",
    team: "Data",
    location: "Remote (US/CA)",
    type: "Full-time",
    summary:
      "Architect the GSC, GA4, and GBP ingestion pipelines. You'll shape how we score 2,400+ rooftops every 24 hours. Strong Python/SQL + experience with rate-limited APIs required.",
  },
  {
    title: "Customer Success Manager (Dealer Groups)",
    team: "Customer",
    location: "Plano, TX (hybrid)",
    type: "Full-time",
    summary:
      "Be the post-sale partner for 15-20 multi-rooftop dealer groups. You'll teach Marketing Directors and Principal Dealers how to operationalize the platform. Previous dealership marketing experience is a strong plus.",
  },
  {
    title: "Senior Product Designer",
    team: "Product",
    location: "Remote (US)",
    type: "Full-time",
    summary:
      "Design the executive surface that GMs actually open. You'll own the design system, the dashboard taxonomy, and the report layouts. Portfolio mandatory; B2B SaaS background preferred.",
  },
  {
    title: "Founding Account Executive",
    team: "Revenue",
    location: "Dallas, TX",
    type: "Full-time",
    summary:
      "Close mid-market dealer groups (5-50 rooftops). You'll run the full cycle. Auto industry experience is the difference between a year of learning and shipping pipeline in week two.",
  },
  {
    title: "Marketing Director",
    team: "Marketing",
    location: "Plano, TX (hybrid)",
    type: "Full-time",
    summary:
      "Own positioning, demand, and pipeline. We have a great product and a small but loud customer base. Your job is to scale that voice.",
  },
];

const PRINCIPLES = [
  {
    title: "Operators over optimizers",
    body:
      "We'd rather hire someone who's run a rooftop than someone who's run a million ad campaigns. Industry context compounds.",
  },
  {
    title: "Boring infrastructure",
    body:
      "We use stable, well-understood tools. No resume-driven development. Your work runs in production for years, not quarters.",
  },
  {
    title: "Honest data",
    body:
      "If a model isn't ready for prod, we say so. If a feature was vaporware, we kill it. Trust compounds faster than features.",
  },
  {
    title: "Async by default",
    body:
      "Most decisions get made in writing. Meetings exist for relationships and synthesis, not status updates.",
  },
];

export default function CareersPage() {
  return (
    <>
      <InfoHero
        eyebrow="Careers"
        title={
          <>
            Build the platform <span className="text-brand">we wished existed.</span>
          </>
        }
        description="Six open roles. Small, distributed team. Operators preferred over optimizers. Equity from day one."
      />

      {/* Open roles */}
      <section className="container py-12">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="section-label">OPEN ROLES</p>
            <h2 className="mt-3 font-display text-[24px] font-black leading-[28px] tracking-tight text-charcoal md:text-[28px] md:leading-[33px]">
              {ROLES.length} open roles right now
            </h2>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="mailto:careers@lonestarford.com">careers@lonestarford.com</Link>
          </Button>
        </div>

        <ul className="mt-8 space-y-3">
          {ROLES.map((r) => (
            <li key={r.title}>
              <article className="group rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="muted">{r.team}</Badge>
                      <span className="inline-flex items-center gap-1 text-[12px] text-stone">
                        <MapPin className="h-3 w-3" />
                        {r.location}
                      </span>
                      <span className="text-[12px] text-stone">· {r.type}</span>
                    </div>
                    <h3 className="mt-2 font-display text-[18px] font-bold text-charcoal md:text-[20px]">
                      {r.title}
                    </h3>
                  </div>
                  <Link
                    href="mailto:careers@lonestarford.com"
                    className="inline-flex items-center gap-1 rounded-pill border border-stone-200 px-3 py-1.5 font-display text-[12px] font-semibold text-charcoal transition-colors group-hover:border-brand group-hover:text-brand"
                  >
                    Apply
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <p className="mt-4 text-[14px] leading-[22px] text-stone text-pretty">
                  {r.summary}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* How we work */}
      <section className="container py-16">
        <p className="section-label">HOW WE WORK</p>
        <h2 className="mt-3 max-w-2xl font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[35px] md:leading-[39px]">
          Four operating principles.
        </h2>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.title}>
              <article className="h-full rounded-2xl border border-stone-200 bg-white p-7">
                <h3 className="font-display text-[18px] font-bold text-charcoal">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                  {p.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Don't see your role */}
      <section className="container pb-20">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-10 text-center">
          <h2 className="font-display text-[22px] font-bold tracking-tight text-charcoal sm:text-[24px]">
            Don't see your role?
          </h2>
          <p className="mt-2 max-w-xl mx-auto text-[14px] leading-[22px] text-stone">
            We hire ahead of need when the person is right. Write us at{" "}
            <a
              href="mailto:careers@lonestarford.com"
              className="font-semibold text-brand hover:underline"
            >
              careers@lonestarford.com
            </a>{" "}
            with a one-paragraph pitch on what you'd own.
          </p>
        </div>
      </section>
    </>
  );
}
