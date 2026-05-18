import type { Metadata } from "next";
import { Calendar } from "lucide-react";

import { BookDemoLayout } from "@/components/marketing/book-demo-form";
import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";

export const metadata: Metadata = {
  title: "Book a Strategy Call",
  description:
    "Schedule a 30-minute call with the A3 Brands team to walk through your dealership group's SEO performance.",
  alternates: { canonical: "/book-demo" },
};

export default function BookDemoPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="relative isolate overflow-hidden border-b border-stone-200 bg-stone-50 pt-32 pb-16 sm:pt-40 sm:pb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[400px] opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(29,185,84,0.16) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-label inline-flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                BOOK A STRATEGY CALL
              </p>
              <h1 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[36px] leading-[40px] sm:text-[48px] sm:leading-[52px] md:text-[56px] md:leading-[60px]">
                30 minutes with our team - <span className="text-brand">no slides.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-[14px] leading-[22px] text-stone sm:text-[15px] sm:leading-[24px]">
                We'll walk through your dealer group's actual GSC data live and
                surface 3-5 plays you can ship this quarter. If we can't
                identify clear wins inside the first 15 minutes, you've got
                back half the time for free coffee.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container">
            <BookDemoLayout />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
