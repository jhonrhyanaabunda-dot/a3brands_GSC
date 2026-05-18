import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Check, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for single rooftops, multi-rooftop groups, and enterprise dealer groups.",
};

interface Tier {
  name: string;
  tagline: string;
  monthly: number | null;
  yearly: number | null;
  description: string;
  cta: { label: string; href: string; variant: "default" | "secondary" };
  features: string[];
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Single Rooftop",
    tagline: "For one dealership",
    monthly: 299,
    yearly: 249,
    description:
      "Built for general managers running a single store who want executive-grade SEO intelligence.",
    cta: { label: "Start free scan", href: "/scan", variant: "secondary" },
    features: [
      "1 dealership · 1 GSC property",
      "Daily GSC sync",
      "200 tracked keywords",
      "AI recommendations (refreshed daily)",
      "Map-pack grid scans (5×5, weekly)",
      "Core Web Vitals monitoring",
      "Weekly executive PDF",
      "Email support",
    ],
  },
  {
    name: "Multi-Rooftop",
    tagline: "For dealer groups (2-20 stores)",
    monthly: 899,
    yearly: 749,
    description:
      "Marketing directors and principal dealers running 2-20 rooftops who need group-level rollups + per-store drill-downs.",
    cta: { label: "Book a strategy call", href: "/book-demo", variant: "default" },
    featured: true,
    features: [
      "Up to 20 dealerships",
      "Group-level KPIs + per-store drill-down",
      "1,000 tracked keywords per rooftop",
      "AI recommendations + cross-rooftop dedupe",
      "Map-pack grid scans (9×9, weekly)",
      "Competitor benchmark (in-market SOV)",
      "Branded monthly PDF (white-label)",
      "Slack + email digests",
      "Priority support · 4h SLA",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For dealer groups (20+ stores)",
    monthly: null,
    yearly: null,
    description:
      "Bespoke for groups operating 20+ rooftops or running OEM compliance programs across multiple banners.",
    cta: { label: "Talk to sales", href: "/contact", variant: "secondary" },
    features: [
      "Unlimited dealerships",
      "Dedicated CS + technical solutions engineer",
      "SAML SSO · SCIM provisioning",
      "API + warehouse export (Snowflake, BigQuery, S3)",
      "Custom KPI definitions",
      "OEM compliance reporting",
      "Audit log + role-based permissions",
      "99.9% uptime SLA · 1h SLA",
      "SOC 2 Type II report on request",
    ],
  },
];

const FAQ = [
  {
    q: "Do I need GSC access to use A3 Brands?",
    a: "Yes - read-only API access. Onboarding is ~10 minutes per rooftop. We never modify your GSC settings.",
  },
  {
    q: "Can I switch plans later?",
    a: "Anytime. Upgrade or downgrade with no penalty. Annual plans are pro-rated.",
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees on Single Rooftop or Multi-Rooftop. Enterprise includes implementation services.",
  },
  {
    q: "What if I have more than 20 rooftops?",
    a: "Talk to us - Enterprise pricing is per-rooftop with volume discounts starting at 25 stores.",
  },
];

export default function PricingPage() {
  return (
    <>
      <InfoHero
        eyebrow="Pricing"
        title={
          <>
            Pricing that scales with your{" "}
            <span className="text-brand">rooftops.</span>
          </>
        }
        description="Three plans. Built for single GMs, multi-rooftop marketing directors, and enterprise dealer groups. Cancel anytime."
        meta={
          <div className="inline-flex items-center gap-2 rounded-pill border border-stone-200 bg-white p-1">
            <span className="rounded-pill bg-charcoal px-4 py-1 text-[12px] font-semibold text-white">
              Monthly
            </span>
            <span className="rounded-pill px-4 py-1 text-[12px] font-medium text-stone">
              Yearly · save 15%
            </span>
          </div>
        }
      />

      <section className="container py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className={
                "relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-200 " +
                (tier.featured
                  ? "border-brand bg-white shadow-card-hover"
                  : "border-stone-200 bg-white hover:border-brand")
              }
            >
              {tier.featured ? (
                <Badge variant="default" className="absolute -top-3 left-8">
                  <Sparkles className="h-3 w-3" />
                  Most popular
                </Badge>
              ) : null}
              <header>
                <h2 className="font-display text-[20px] font-bold tracking-tight text-charcoal">
                  {tier.name}
                </h2>
                <p className="mt-1 text-[14px] leading-[22px] text-stone">{tier.tagline}</p>
              </header>
              <div className="mt-6 flex items-baseline gap-1">
                {tier.monthly === null ? (
                  <span className="font-display text-[40px] font-black tracking-tight text-charcoal">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="font-display text-[40px] font-black tracking-tight text-charcoal">
                      ${tier.monthly}
                    </span>
                    <span className="text-[14px] text-stone">/mo</span>
                  </>
                )}
              </div>
              {tier.yearly !== null ? (
                <p className="mt-1 text-[12px] text-stone">
                  Billed annually at ${tier.yearly * 12}/yr (save 15%)
                </p>
              ) : (
                <p className="mt-1 text-[12px] text-stone">
                  Annual contract · talk to us
                </p>
              )}
              <p className="mt-5 text-[14px] leading-[22px] text-charcoal text-pretty">
                {tier.description}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-[14px] leading-[22px]">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-charcoal">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  asChild
                  variant={tier.cta.variant}
                  size="lg"
                  className="w-full"
                >
                  <Link href={tier.cta.href}>
                    {tier.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 md:p-10">
          <h2 className="text-balance font-display text-[24px] font-bold tracking-tight text-charcoal sm:text-[28px]">
            What's included at every tier
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-[22px] text-stone">
            All plans ship with the data integrity and security guarantees you'd
            expect from an enterprise platform.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Isolated tenants - your data, your data only",
              "Encryption at rest (AES-256) and in transit (TLS 1.3)",
              "SOC 2 Type II aligned",
              "Daily backups · point-in-time recovery",
              "AI recommendations with confidence scores",
              "Branded PDF reports",
              "Audit log of every action",
              "30-day data retention minimum",
              "Cancel anytime, no penalty",
            ].map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 rounded-xl border border-stone-200 bg-white p-4 text-[14px] leading-[22px] text-charcoal"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-balance font-display text-[24px] font-bold tracking-tight text-charcoal sm:text-[28px]">
          Pricing FAQ
        </h2>
        <dl className="mt-8 grid gap-4 md:grid-cols-2">
          {FAQ.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <dt className="font-display text-[14px] font-bold text-charcoal">
                {f.q}
              </dt>
              <dd className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="ink-section py-20">
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-display text-[28px] font-black leading-[32px] tracking-tight text-white sm:text-[35px] sm:leading-[39px]">
              Not sure where you fit?
            </h2>
            <p className="mt-3 text-[14px] leading-[22px] text-white/75 text-pretty">
              Book a 30-minute call and we'll walk through your group, plug
              into your GSC data live, and recommend the right plan.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="default" size="lg">
                <Link href="/book-demo">
                  <Calendar className="h-4 w-4" />
                  Book a call
                </Link>
              </Button>
              <Button asChild variant="invert" size="lg">
                <Link href="/scan">Run free scan</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
