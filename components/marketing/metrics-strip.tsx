import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Counter } from "@/components/animations/counter";
import { PLATFORM_STATS } from "@/lib/mock-data";

export function MetricsStrip() {
  return (
    <section className="border-y border-stone-200 bg-stone-50">
      <div className="container">
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 md:gap-y-0 md:py-14">
            {PLATFORM_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={
                  "text-center md:px-6 " +
                  (i < PLATFORM_STATS.length - 1
                    ? "md:border-r md:border-stone-200"
                    : "")
                }
              >
                <div className="font-display font-black tracking-tight text-charcoal text-[36px] leading-[40px] md:text-[44px] md:leading-[48px]">
                  {typeof stat.value === "string" ? (
                    stat.value
                  ) : (
                    <Counter to={stat.value as unknown as number} />
                  )}
                </div>
                <div className="mt-1.5 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-stone">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
