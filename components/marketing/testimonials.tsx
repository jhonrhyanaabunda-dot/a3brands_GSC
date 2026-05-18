import { Star } from "lucide-react";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { TESTIMONIALS } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">TESTIMONIALS</p>
            <h2 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[32px] leading-[36px] sm:text-[35px] sm:leading-[39px] md:text-[44px] md:leading-[48px]">
              The dealers running ahead.
            </h2>
            <p className="mt-4 text-[14px] leading-[22px] text-stone">
              Principal dealers, marketing directors, and GMs already operating
              on A3 Brands.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.07}>
              <figure className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-7 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="text-[14px] leading-[22px] text-charcoal text-pretty">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-charcoal"
                    aria-hidden
                  >
                    {t.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-display text-[14px] font-bold text-charcoal">
                      {t.name}
                    </div>
                    <div className="truncate text-[12px] text-stone">
                      {t.title} · {t.org}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
