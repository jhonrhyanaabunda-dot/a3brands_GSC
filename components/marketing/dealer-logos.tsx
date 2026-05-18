import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { DEALER_LOGOS } from "@/lib/mock-data";

const BRAND_TAGS = ["ACURA", "SUBARU", "CDJR", "FORD", "TOYOTA", "BMW"];

export function DealerLogos() {
  return (
    <section className="bg-white">
      <div className="container py-14">
        <ScrollReveal>
          <p className="text-center font-display text-[10px] font-bold uppercase tracking-[0.2em] text-stone">
            Trusted by dealer groups across North America
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            {BRAND_TAGS.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-[4px] bg-brand px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.18}>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 items-center sm:grid-cols-4 md:grid-cols-8">
            {DEALER_LOGOS.map((logo) => (
              <div
                key={logo}
                className="flex items-center justify-center text-center font-display text-[14px] font-semibold text-stone hover:text-charcoal transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
