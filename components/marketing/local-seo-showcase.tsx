"use client";

import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

const GRID = Array.from({ length: 25 }).map((_, i) => {
  const x = i % 5;
  const y = Math.floor(i / 5);
  const distance = Math.sqrt(Math.pow(x - 2, 2) + Math.pow(y - 2, 2));
  const position = Math.min(20, Math.max(1, Math.round(distance * 2.5 + 1)));
  return { x, y, position };
});

function gridColor(pos: number) {
  if (pos <= 3) return "bg-brand text-white";
  if (pos <= 7) return "bg-brand/40 text-charcoal";
  if (pos <= 12) return "bg-amber-400/50 text-charcoal";
  return "bg-stone-200 text-stone";
}

export function LocalSeoShowcase() {
  return (
    <section id="local-seo" className="bg-white py-20 sm:py-28">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-subtle">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-stone">
                      MAP PACK SCAN
                    </p>
                    <p className="mt-1 font-display text-[14px] font-semibold text-charcoal">
                      "toyota dealer near me" · Frisco, TX
                    </p>
                  </div>
                  <Badge variant="status">
                    <MapPin className="h-3 w-3" />
                    Top 3
                  </Badge>
                </div>
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundSize: "32px 32px",
                      backgroundImage:
                        "linear-gradient(to right, rgba(44,48,56,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(44,48,56,0.05) 1px, transparent 1px)",
                    }}
                  />
                  <div className="relative grid h-full w-full grid-cols-5 gap-2">
                    {GRID.map((g, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.02, duration: 0.4 }}
                        className={
                          "flex items-center justify-center rounded-lg border border-stone-200/60 font-mono text-[10px] font-bold " +
                          gridColor(g.position)
                        }
                      >
                        #{g.position}
                      </motion.div>
                    ))}
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="relative flex h-6 w-6">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/70" />
                      <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand ring-2 ring-white shadow-floating">
                        <MapPin className="h-3.5 w-3.5 text-charcoal" />
                      </span>
                    </span>
                  </div>
                </div>
                <ul className="mt-4 grid grid-cols-3 gap-2 font-display text-[10px] font-bold uppercase tracking-[0.05em] text-stone">
                  <li className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-brand" />
                    Map pack
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-amber-400/60" />
                    Page 1
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-stone-300" />
                    Off page 1
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="mt-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-display text-[14px] font-semibold text-charcoal">
                    4.7 average rating · 1,284 reviews
                  </span>
                </div>
                <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                  Sentiment trending +6.8pp over 30 days. New reviews up 22%
                  since enabling automated review response in A3.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="lg:col-span-6">
            <p className="section-label inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              LOCAL SEO
            </p>
            <h2 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[32px] leading-[36px] sm:text-[35px] sm:leading-[39px] md:text-[44px] md:leading-[48px]">
              Win the map pack -{" "}
              <span className="text-brand">in every city you serve.</span>
            </h2>
            <p className="mt-5 text-[14px] leading-[22px] text-stone text-pretty sm:text-[15px] sm:leading-[24px]">
              Dealerships live and die by local proximity. A3 scans your map
              pack visibility across a 5×5 grid, monitors competitor proximity,
              and surfaces the city-specific actions that move you up the
              rankings.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Map pack grid scans",
                  body:
                    "5×5 to 9×9 grid scans across your service area - refreshed weekly.",
                },
                {
                  title: "Competitor proximity",
                  body:
                    "See which competing dealerships are eating your local SOV by mile.",
                },
                {
                  title: "GBP health checks",
                  body:
                    "Photo cadence, hours accuracy, post frequency, Q&A coverage.",
                },
                {
                  title: "Review monitoring",
                  body:
                    "Sentiment tracking with one-click auto-response drafting.",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-brand"
                >
                  <h3 className="font-display text-[14px] font-bold text-charcoal">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-[17px] text-stone text-pretty">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
