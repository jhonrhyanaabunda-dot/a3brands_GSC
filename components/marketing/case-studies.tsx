import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { CASE_STUDIES } from "@/lib/mock-data";

export function CaseStudies() {
  return (
    <section id="case-studies" className="bg-stone-50 py-20 sm:py-28">
      <div className="container">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">CASE STUDIES</p>
            <h2 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[32px] leading-[36px] sm:text-[35px] sm:leading-[39px] md:text-[44px] md:leading-[48px]">
              Results in 30 to 90 days.
            </h2>
            <p className="mt-4 text-[14px] leading-[22px] text-stone">
              Real dealer groups, real KPIs. Most rooftops see measurable
              improvement inside the first 30 days.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 0.07}>
              <article className="group relative flex h-full flex-col rounded-2xl border-2 border-transparent bg-white p-7 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                <Badge variant="muted" className="self-start">
                  {c.tag}
                </Badge>
                <div className="mt-7 flex items-baseline gap-2">
                  <span className="font-display text-[52px] font-black leading-[56px] tracking-tight text-brand">
                    {c.metric}
                  </span>
                  <span className="text-[12px] text-stone">{c.metricLabel}</span>
                </div>
                <h3 className="mt-5 font-display text-[18px] font-bold text-charcoal">
                  {c.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                  {c.summary}
                </p>
                <a
                  href="/customers"
                  className="mt-auto inline-flex items-center gap-1 pt-6 font-display text-[13px] font-semibold text-brand transition-colors group-hover:gap-2"
                >
                  Read case study
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
