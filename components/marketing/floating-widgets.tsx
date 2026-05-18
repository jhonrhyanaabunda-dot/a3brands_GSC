"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Target, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

// Each widget is positioned OUTSIDE the dashboard preview so it never covers
// real data. Top widgets peek above the window-chrome; bottom widgets peek
// below the keywords table. Negative top/bottom values do the work.
const WIDGETS = [
  {
    id: "wd-1",
    icon: <Sparkles className="h-3.5 w-3.5 text-brand" />,
    title: "+2,100 clicks/mo",
    sub: "Vehicle schema deploy",
    badge: { variant: "status" as const, label: "AI" },
    className:
      "-top-6 -left-2 sm:-top-8 sm:-left-6 md:-top-10 md:-left-12 lg:-top-12 lg:-left-20",
    delay: 0.5,
    drift: 8,
  },
  {
    id: "wd-2",
    icon: <TrendingUp className="h-3.5 w-3.5 text-brand" />,
    title: "Position 2.1",
    sub: "ford f-150 dallas",
    badge: { variant: "status" as const, label: "↑5" },
    className:
      "-top-6 -right-2 sm:-top-8 sm:-right-6 md:-top-10 md:-right-12 lg:-top-12 lg:-right-20",
    delay: 0.75,
    drift: -6,
  },
  {
    id: "wd-3",
    icon: <Target className="h-3.5 w-3.5 text-amber-600" />,
    title: "Map pack #1",
    sub: "toyota dealer frisco",
    badge: { variant: "warning" as const, label: "Local" },
    className:
      "-bottom-6 -left-2 sm:-bottom-8 sm:-left-6 md:-bottom-10 md:-left-12 lg:-bottom-12 lg:-left-20",
    delay: 1.0,
    drift: 5,
  },
  {
    id: "wd-4",
    icon: <Brain className="h-3.5 w-3.5 text-brand" />,
    title: "32 actions ready",
    sub: "AI recommendation queue",
    badge: { variant: "muted" as const, label: "Today" },
    className:
      "-bottom-6 -right-2 sm:-bottom-8 sm:-right-6 md:-bottom-10 md:-right-12 lg:-bottom-12 lg:-right-20",
    delay: 1.25,
    drift: -8,
  },
];

export function FloatingWidgets() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {WIDGETS.map((w) => (
        <motion.div
          key={w.id}
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: w.delay,
          }}
          className={`absolute z-10 ${w.className}`}
        >
          <motion.div
            animate={{ y: [0, w.drift, 0] }}
            transition={{
              duration: 6 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 shadow-raised"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-50">
                {w.icon}
              </span>
              <div className="min-w-0">
                <div className="font-display text-[12px] font-bold text-charcoal truncate">
                  {w.title}
                </div>
                <div className="text-[10px] text-stone-400 truncate">
                  {w.sub}
                </div>
              </div>
              <Badge variant={w.badge.variant} className="ml-1">
                {w.badge.label}
              </Badge>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
