import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center bg-white px-4">
      <div className="relative max-w-md text-center">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
          404 · PAGE NOT FOUND
        </p>
        <h1 className="mt-4 font-display font-black tracking-tight text-charcoal text-[40px] leading-[44px] sm:text-[51px] sm:leading-[56px]">
          Off the lot.
        </h1>
        <p className="mt-4 text-[14px] leading-[22px] text-stone text-pretty">
          The page you're looking for moved, was renamed, or never existed.
          Head back to the dashboard or run a fresh GSC scan.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button asChild variant="default">
            <Link href="/">BACK TO HOME</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/scan">
              <Search className="mr-1.5 h-4 w-4" />
              RUN A FREE SCAN
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
