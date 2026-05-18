import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Book, Brain, Code, Compass, KeyRound, MapPin, Plug } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Documentation",
};

const SECTIONS = [
  {
    icon: Compass,
    title: "Getting started",
    body: "Onboard your first rooftop in 10 minutes. Includes the OAuth dance for Google Search Console and GA4.",
    href: "/methodology",
  },
  {
    icon: Brain,
    title: "AI insights methodology",
    body: "How we score every category, prioritize recommendations, and decide what we deliberately don't measure.",
    href: "/methodology",
  },
  {
    icon: MapPin,
    title: "Local SEO module",
    body: "Map-pack grid scans, GBP health, NAP consistency, and the review monitoring pipeline.",
    href: "/methodology#local",
  },
  {
    icon: Plug,
    title: "Integrations",
    body: "Slack, HubSpot, Calendly, Snowflake, BigQuery, and the API for custom warehouse exports.",
    href: "/settings",
  },
  {
    icon: KeyRound,
    title: "API & SSO",
    body: "API key authentication, rate limits, OAuth-based programmatic access, and SAML SSO configuration.",
    href: "/settings",
  },
  {
    icon: Code,
    title: "Webhooks",
    body: "Subscribe to scan-completed, ranking-drop, report-ready, and competitor-move events.",
    href: "/settings",
  },
];

export default function DocsPage() {
  return (
    <>
      <InfoHero
        eyebrow="Documentation"
        title={
          <>
            Everything we know about{" "}
            <span className="text-brand">how this works.</span>
          </>
        }
        description="The full methodology, the integration playbooks, the API reference. If something's unclear, email docs@lonestarford.com - we'll fix the page."
      />

      <section className="container py-12">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <li key={s.title}>
              <Link
                href={s.href}
                className="group block h-full rounded-2xl border border-stone-200 bg-white p-7 transition-all duration-200 hover:border-brand hover:shadow-card-hover"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold text-charcoal">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                  {s.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 font-display text-[12px] font-semibold text-brand">
                  Read
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container py-16">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-7 md:p-10">
          <div className="flex items-start gap-4">
            <Book className="mt-1 h-5 w-5 shrink-0 text-brand" />
            <div>
              <h2 className="font-display text-[20px] font-bold tracking-tight text-charcoal sm:text-[24px]">
                Looking for the methodology paper?
              </h2>
              <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                The single most important page in this docs site is the methodology
                doc - the full breakdown of how we audit, score, and recommend.
                Every number on a screen ties back to this page.
              </p>
              <div className="mt-5">
                <Button asChild variant="default" size="lg">
                  <Link href="/methodology">
                    Read methodology
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
