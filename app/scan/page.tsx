import type { Metadata } from "next";
import { Search } from "lucide-react";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { ScanTool } from "@/components/scan/scan-tool";

export const metadata: Metadata = {
  title: "Free GSC Scan",
  description:
    "Free Google Search Console scan for any dealership URL. Get an instant SEO health score, technical issue list, and the top AI recommendations to recover lost organic leads.",
  alternates: { canonical: "/scan" },
};

// Production safety: scans (especially PSI fallback) can run 60-90s.
// Vercel hobby caps at 60s; Pro/Enterprise honors longer values up to 900s.
export const maxDuration = 180;

export default function ScanPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="relative isolate overflow-hidden border-b border-stone-200 bg-stone-50 pt-32 pb-16 sm:pt-40 sm:pb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[420px] opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(29,185,84,0.18) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-label inline-flex items-center gap-1.5">
                <Search className="h-3 w-3" />
                FREE GSC SCAN
              </p>
              <h1 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[36px] leading-[40px] sm:text-[48px] sm:leading-[52px] md:text-[56px] md:leading-[60px]">
                See where your dealership is{" "}
                <span className="text-brand">losing search.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-[14px] leading-[22px] text-stone sm:text-[15px] sm:leading-[24px]">
                Paste any dealership URL and we'll audit meta tags, technical
                SEO, Core Web Vitals, schema markup, Google Business Profile
                health, and competitive visibility. Free. No login. ~3 seconds.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-4xl">
              <ScanTool />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-label">WHAT WE AUDIT</p>
              <h2 className="mt-3 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[35px] md:leading-[39px]">
                Six pillars - same as Google's algorithm.
              </h2>
            </div>
            <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                "Meta & content",
                "Technical SEO",
                "Performance",
                "Schema markup",
                "Local SEO + GBP",
                "Keyword visibility",
              ].map((p) => (
                <li
                  key={p}
                  className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-4 text-center font-display text-[12px] font-bold text-charcoal"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
