import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-display transition-colors",
  {
    variants: {
      variant: {
        // Dealership badge - solid emerald, all caps
        dealership:
          "bg-brand text-white rounded-[4px] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.05em] leading-[14px]",
        // Status badge - emerald tint
        status:
          "bg-brand/10 text-brand border border-brand rounded-[4px] px-2.5 py-1 text-[11px] font-semibold leading-[16px]",
        default:
          "bg-brand/10 text-brand border border-brand rounded-[4px] px-2.5 py-1 text-[11px] font-semibold leading-[16px]",
        success:
          "bg-brand/10 text-brand border border-brand rounded-[4px] px-2.5 py-1 text-[11px] font-semibold leading-[16px]",
        label:
          "text-brand text-[10px] font-bold uppercase tracking-[0.05em] leading-[14px]",
        muted:
          "bg-stone-100 text-stone rounded-[4px] px-2.5 py-1 text-[11px] font-medium leading-[16px]",
        invert:
          "bg-white/10 text-white rounded-[4px] px-2.5 py-1 text-[11px] font-medium leading-[16px]",
        warning:
          "bg-amber-500/10 text-amber-700 border border-amber-500/40 rounded-[4px] px-2.5 py-1 text-[11px] font-semibold leading-[16px]",
        critical:
          "bg-red-500/10 text-red-700 border border-red-500/40 rounded-[4px] px-2.5 py-1 text-[11px] font-semibold leading-[16px]",
        destructive:
          "bg-red-500/10 text-red-700 border border-red-500/40 rounded-[4px] px-2.5 py-1 text-[11px] font-semibold leading-[16px]",
        outline:
          "bg-transparent text-current border border-current rounded-[4px] px-2.5 py-1 text-[11px] font-semibold leading-[16px]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
