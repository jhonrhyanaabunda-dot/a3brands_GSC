"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
  variant: "signin" | "register";
  className?: string;
}

/**
 * Wraps the login / register forms so a click on submit feels responsive in
 * demo mode. On submit:
 *  1. Show a "Welcome back" / "Account created" toast
 *  2. Brief 700ms delay so the toast registers
 *  3. Redirect to /dashboard
 *
 * When the platform wires real Auth.js v5 + Prisma in the next deploy, this
 * client wrapper is the seam where we replace the redirect with the actual
 * signIn() flow.
 */
export function AuthForm({ children, variant, className }: Props) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    toast.success(
      variant === "signin"
        ? "Welcome back."
        : "Account created.",
      {
        description:
          variant === "signin"
            ? "Loading your workspace…"
            : "We're setting up your dealership workspace.",
        duration: 3000,
      },
    );
    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  };

  return (
    <form onSubmit={onSubmit} className={className} aria-busy={pending}>
      <fieldset disabled={pending} className="space-y-4">
        {children}
      </fieldset>
    </form>
  );
}
