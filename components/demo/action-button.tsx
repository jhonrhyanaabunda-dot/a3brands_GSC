"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";

interface Props extends Omit<ButtonProps, "onClick"> {
  toastMessage: string;
  toastDescription?: string;
}

/**
 * Drop-in client Button that fires a sonner toast on click. Used to wire up
 * surfaces whose backing infrastructure (CRM / Stripe / etc.) isn't built yet
 * but where the click MUST feel responsive in a demo.
 */
export function DemoActionButton({
  toastMessage,
  toastDescription,
  children,
  ...buttonProps
}: Props) {
  return (
    <Button
      {...buttonProps}
      onClick={() => {
        toast.success(toastMessage, {
          description: toastDescription,
          duration: 4000,
        });
      }}
    >
      {children}
    </Button>
  );
}
