import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary CTA - emerald pill, charcoal text
        default:
          "bg-brand text-charcoal shadow-floating hover:opacity-85 hover:shadow-floating-hover active:opacity-70 active:shadow-floating-active rounded-pill",
        electric:
          "bg-brand text-charcoal shadow-floating hover:opacity-85 hover:shadow-floating-hover active:opacity-70 active:shadow-floating-active rounded-pill",
        secondary:
          "bg-transparent text-charcoal border border-stone-200 rounded-pill hover:border-brand hover:text-brand",
        outline:
          "bg-transparent text-current border border-current/20 rounded-pill hover:border-brand hover:text-brand",
        ghost:
          "bg-transparent text-brand rounded-md hover:bg-brand/10",
        link:
          "bg-transparent text-brand underline-offset-4 hover:underline rounded-none px-0 shadow-none",
        nav:
          "bg-transparent text-charcoal rounded-none hover:text-brand",
        destructive:
          "bg-red-500 text-white rounded-pill hover:bg-red-600",
        invert:
          "bg-white text-charcoal rounded-pill hover:bg-stone-50 shadow-subtle",
      },
      size: {
        sm: "h-9 px-4 text-[13px] leading-[19px]",
        default: "h-12 px-6 text-[14px] leading-[21px]",
        lg: "h-12 px-6 text-[14px] leading-[21px]",
        xl: "h-14 px-8 text-[14px] leading-[21px]",
        icon: "h-12 w-12 rounded-pill",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
