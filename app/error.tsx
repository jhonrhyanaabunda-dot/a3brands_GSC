"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[A3 root error]", error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center bg-white px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="font-display text-[28px] leading-[33px] font-bold tracking-tight text-charcoal">
          Something hit a speed bump.
        </h1>
        <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
          We've logged the issue. Try reloading the page - if it persists, our
          team has already been notified.
        </p>
        {error?.digest ? (
          <p className="mt-3 font-mono text-[11px] text-stone">
            ref: {error.digest}
          </p>
        ) : null}
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default">
            <RotateCw className="mr-1.5 h-4 w-4" />
            TRY AGAIN
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">GO HOME</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
