"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StickyCTA() {
  const [visible, setVisible] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 1400 && !dismissed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-4 z-40 mx-auto flex max-w-xl px-4"
        >
          <div className="relative flex w-full items-center gap-3 rounded-pill border border-stone-200 bg-white px-2 py-1.5 pl-5 shadow-raised">
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-brand" />
            <p className="min-w-0 flex-1 truncate font-display text-[13px] font-medium text-charcoal">
              Free scan + 5 AI recommendations in under 60s.
            </p>
            <Button asChild size="sm" variant="default">
              <Link href="/scan">
                SCAN NOW
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="hidden h-8 w-8 items-center justify-center rounded-full text-stone hover:bg-stone-50 hover:text-charcoal sm:flex"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
