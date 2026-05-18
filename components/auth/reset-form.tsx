"use client";

import * as React from "react";
import { toast } from "sonner";

export function ResetForm({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [pending, setPending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending || sent) return;
    setPending(true);
    setTimeout(() => {
      toast.success("Check your inbox.", {
        description:
          "If an account exists for that email, a reset link will arrive within a minute.",
        duration: 6000,
      });
      setSent(true);
      setPending(false);
    }, 500);
  };

  return (
    <form onSubmit={onSubmit} className={className} aria-busy={pending}>
      <fieldset disabled={pending || sent} className="space-y-4">
        {children}
      </fieldset>
      {sent ? (
        <p className="mt-4 rounded-lg border border-brand bg-brand/[0.06] p-3 text-center text-[12px] font-medium text-charcoal">
          ✓ Reset link sent. Check the inbox for the email you entered.
        </p>
      ) : null}
    </form>
  );
}
