"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { FAQ_ITEMS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="bg-stone-50 py-20 sm:py-28">
      <div className="container">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">FAQ</p>
            <h2 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[32px] leading-[36px] sm:text-[35px] sm:leading-[39px] md:text-[44px] md:leading-[48px]">
              Questions principal dealers ask.
            </h2>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors focus-ring",
                    isOpen ? "text-charcoal" : "text-charcoal hover:text-brand",
                  )}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                >
                  <span className="font-display text-[15px] font-bold sm:text-[16px]">
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                      isOpen
                        ? "bg-brand text-charcoal shadow-floating"
                        : "border border-stone-200 bg-white text-stone",
                    )}
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[14px] leading-[22px] text-stone text-pretty">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
