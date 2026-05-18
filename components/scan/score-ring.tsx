"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  grade: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreRing({
  score,
  grade,
  size = 220,
  strokeWidth = 14,
  className,
}: ScoreRingProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const target = Math.max(0, Math.min(100, score));
  const progress = useMotionValue(0);
  const dashOffset = useTransform(
    progress,
    (v) => circumference - (v / 100) * circumference,
  );
  const display = useTransform(progress, (v) => Math.round(v));

  const ringColor =
    target >= 65 ? "#1DB954" : target >= 50 ? "#F59E0B" : "#EF4444";

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(progress, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, progress, target]);

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: dashOffset,
            filter: `drop-shadow(0 0 10px ${ringColor}55)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="font-display text-[64px] font-black leading-none tracking-tight text-charcoal">
          {display}
        </motion.span>
        <span className="mt-1 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-stone">
          / 100
        </span>
        <span
          className="mt-3 rounded-[4px] px-2.5 py-1 font-display text-[12px] font-bold leading-none text-white"
          style={{ backgroundColor: ringColor }}
        >
          GRADE {grade}
        </span>
      </div>
    </div>
  );
}
