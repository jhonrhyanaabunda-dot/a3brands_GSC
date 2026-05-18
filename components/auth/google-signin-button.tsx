"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function GoogleSignInButton({ label = "Continue with Google" }: { label?: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const onClick = () => {
    if (pending) return;
    setPending(true);
    toast.success("Welcome back.", {
      description: "Loading your workspace…",
      duration: 3000,
    });
    setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-pill border border-stone-200 bg-white font-display text-[14px] font-semibold text-charcoal transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
    >
      <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden>
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.13 4.13 0 0 1-1.79 2.71v2.26h2.9c1.7-1.57 2.69-3.88 2.69-6.62z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34A9 9 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.34z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.96l2.99 2.34C4.66 5.17 6.65 3.58 9 3.58z"
        />
      </svg>
      {pending ? "Signing in…" : label}
    </button>
  );
}
