import {
  BarChart3,
  Brain,
  Building2,
  Gauge,
  Globe2,
  LineChart,
  MapPin,
  Search,
  ShieldCheck,
  Target,
  Wrench,
  Zap,
} from "lucide-react";

import { ScrollReveal } from "@/components/animations/scroll-reveal";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Executive dashboard",
    description:
      "Lead opportunity score, SEO health, organic clicks, impressions, CTR, and avg. position in one C-suite view.",
  },
  {
    icon: Brain,
    title: "AI recommendations",
    description:
      "Prioritized actions with projected clicks gained, revenue lift, and effort estimates - refreshed every 24 hours.",
  },
  {
    icon: MapPin,
    title: "Local SEO module",
    description:
      "Map pack rankings, proximity analysis, GBP health, and city-level visibility across every rooftop.",
  },
  {
    icon: Search,
    title: "GSC analyzer",
    description:
      "Paste a URL - get meta audit, Core Web Vitals, schema validation, mobile checks, and indexing issues in seconds.",
  },
  {
    icon: LineChart,
    title: "Keyword tracking",
    description:
      "Position deltas, intent classification, branded vs. non-branded splits, and inventory-aware ranking signals.",
  },
  {
    icon: Target,
    title: "Competitor intelligence",
    description:
      "Visibility scores against AutoNation, Group 1, Sonic, Lithia, Penske - shared keywords and outranked pages.",
  },
  {
    icon: Wrench,
    title: "Technical SEO",
    description:
      "Detect broken canonicals, duplicate titles, missing H1s, and indexability issues across your full site.",
  },
  {
    icon: Globe2,
    title: "Inventory + service SEO",
    description:
      "Schema validation for Vehicle and Offer markup, plus service-page metadata audits at scale.",
  },
  {
    icon: Building2,
    title: "Multi-rooftop rollups",
    description:
      "Group-level KPIs with per-store drill-downs. Built for principal dealers and dealer groups.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    description:
      "Isolated tenants, encryption at rest, SSO/SAML ready, SOC 2 Type II aligned.",
  },
  {
    icon: Gauge,
    title: "Core Web Vitals",
    description:
      "Continuous monitoring of LCP, INP, and CLS by template - caught before they hit rankings.",
  },
  {
    icon: Zap,
    title: "Reports + ROI",
    description:
      "Branded PDF reports, monthly executive summaries, and ROI projections you can send to the board.",
  },
];

export function Features() {
  return (
    <section id="platform" className="bg-white py-20 sm:py-28">
      <div className="container">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">WHAT WE DO</p>
            <h2 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[32px] leading-[36px] sm:text-[35px] sm:leading-[39px] md:text-[44px] md:leading-[48px]">
              Built for the way dealer groups{" "}
              <span className="text-brand">actually work.</span>
            </h2>
            <p className="mt-5 text-pretty text-[14px] leading-[22px] text-stone sm:text-[15px] sm:leading-[24px]">
              Every workflow assumes inventory turnover, lease cycles, OEM
              compliance, and rooftop-level reporting. Generic SEO tools fit
              cars into a marketing playbook. We start with the dealership.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <ScrollReveal
              key={feature.title}
              delay={Math.min(i * 0.03, 0.3)}
              className="h-full"
            >
              <div className="group h-full rounded-2xl border border-stone-200 bg-white p-7 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-[18px] font-bold text-charcoal leading-[24px]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
