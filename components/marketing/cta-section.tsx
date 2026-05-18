import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export function CTASection() {
  return (
    <section className="ink-section relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(29,185,84,0.35) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(29,185,84,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container relative">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              READY WHEN YOU ARE
            </p>
            <h2 className="mt-4 text-balance font-display font-black tracking-tight text-white text-[36px] leading-[40px] sm:text-[44px] sm:leading-[48px] md:text-[56px] md:leading-[60px]">
              See where you're losing search -{" "}
              <span className="text-brand">in 60 seconds.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-[14px] leading-[22px] text-white/75 sm:text-[15px] sm:leading-[24px]">
              Run a free GSC scan on any dealership URL. Get an instant SEO
              health score, technical issue list, and the top 5 AI
              recommendations to recover lost organic leads.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="default">
                <Link href="/scan">
                  RUN FREE GSC SCAN
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="invert">
                <Link href="/book-demo">
                  <Calendar className="mr-1 h-4 w-4" />
                  BOOK A STRATEGY CALL
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
