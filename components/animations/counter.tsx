"use client";

import * as React from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from "framer-motion";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  format?: "number" | "percent" | "decimal" | "compact" | "currency";
  unit?: string;
  className?: string;
}

function formatValue(
  value: number,
  format: CounterProps["format"],
  decimals: number,
) {
  switch (format) {
    case "compact":
      return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
    case "percent":
      return `${value.toFixed(decimals || 1)}%`;
    case "decimal":
      return value.toFixed(decimals || 1);
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
    case "number":
    default:
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: decimals,
      }).format(value);
  }
}

export function Counter({
  from = 0,
  to,
  duration = 1.6,
  decimals = 0,
  format = "number",
  unit,
  className,
}: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const motionValue = useMotionValue(from);
  const display = useTransform(motionValue, (latest) =>
    formatValue(latest, format, decimals),
  );

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, motionValue, to, duration]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
      {unit ? <span className="text-muted-foreground/80">{unit}</span> : null}
    </span>
  );
}
