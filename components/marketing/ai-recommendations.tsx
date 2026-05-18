import Link from "next/link";
import { ArrowRight, Brain, Sparkles, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { AI_RECOMMENDATIONS } from "@/lib/mock-data";
import type { AIRecommendation } from "@/types";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

const PRIORITY_VARIANTS: Record<
  AIRecommendation["priority"],
  "critical" | "warning" | "default" | "muted"
> = {
  CRITICAL: "critical",
  HIGH: "warning",
  MEDIUM: "default",
  LOW: "muted",
};

const CATEGORY_LABELS: Record<AIRecommendation["category"], string> = {
  TECHNICAL: "Technical",
  CONTENT: "Content",
  LOCAL_SEO: "Local SEO",
  COMPETITIVE: "Competitive",
  KEYWORD: "Keywords",
  SCHEMA: "Schema",
  PERFORMANCE: "Performance",
  INVENTORY: "Inventory",
  SERVICE_PAGE: "Service pages",
  GOOGLE_BUSINESS: "GBP",
};

export function AIRecommendations() {
  return (
    <section id="ai-insights" className="bg-stone-50 py-20 sm:py-28">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ScrollReveal className="lg:col-span-5">
            <p className="section-label inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              AI RECOMMENDATION ENGINE
            </p>
            <h2 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[32px] leading-[36px] sm:text-[35px] sm:leading-[39px] md:text-[44px] md:leading-[48px]">
              An AI second-in-command for your{" "}
              <span className="text-brand">marketing director.</span>
            </h2>
            <p className="mt-5 text-[14px] leading-[22px] text-stone text-pretty sm:text-[15px] sm:leading-[24px]">
              Every 24 hours, A3 re-ranks your action queue based on competitor
              moves, GSC deltas, Core Web Vitals, schema validity, and review
              sentiment. Every recommendation ships with a click-gain estimate
              and a confidence score.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Prioritized by projected click gain × confidence",
                "Effort estimates for sprint planning",
                "Per-recommendation revenue lift",
                "Reasons + evidence - no black boxes",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14px] leading-[22px] text-charcoal"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="default">
                <Link href="/insights">
                  SEE AI INSIGHTS DEMO
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/methodology">VIEW METHODOLOGY</Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="lg:col-span-7">
            <div className="space-y-3.5">
              {AI_RECOMMENDATIONS.map((rec, i) => (
                <ScrollReveal
                  key={rec.id}
                  delay={Math.min(i * 0.05, 0.3)}
                >
                  <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                        <Brain className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={PRIORITY_VARIANTS[rec.priority]}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="muted">
                            {CATEGORY_LABELS[rec.category]}
                          </Badge>
                          {typeof rec.confidence === "number" && (
                            <span className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-stone">
                              {Math.round(rec.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 font-display text-[16px] font-bold text-charcoal leading-[22px] sm:text-[17px]">
                          {rec.title}
                        </h3>
                        <p className="mt-1.5 text-[14px] leading-[22px] text-stone text-pretty">
                          {rec.summary}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
                          {rec.estimatedClicksGain && (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
                              <Target className="h-3 w-3" />
                              +{formatCompactNumber(rec.estimatedClicksGain)} clicks/mo
                            </span>
                          )}
                          {rec.estimatedRevenueGainUsd && (
                            <span className="font-semibold text-charcoal">
                              {formatCurrency(rec.estimatedRevenueGainUsd)} projected
                            </span>
                          )}
                          {typeof rec.effortHours === "number" && (
                            <span className="text-stone">
                              {rec.effortHours}h effort
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
