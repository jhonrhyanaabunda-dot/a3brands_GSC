"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { FloatingWidgets } from "@/components/marketing/floating-widgets";

export function Hero() {
  return (
    <section className="ink-section relative isolate overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[640px]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(29,185,84,0.18) 0%, rgba(11,13,15,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundSize: "64px 64px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 40%, black 30%, transparent 85%)",
        }}
      />

      <div className="container relative px-4 sm:px-8 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2.5 rounded-pill border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
              Automotive SEO Intelligence
            </span>
          </motion.div>

          <h1 className="mt-8 text-balance font-display font-black tracking-tight text-white text-[36px] leading-[40px] sm:text-[44px] sm:leading-[48px] md:text-[51px] md:leading-[56px] lg:text-[64px] lg:leading-[68px]">
            See How Your Dealership <span className="text-brand">Performs on Google.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[14px] leading-[22px] text-white/75 sm:text-[15px] sm:leading-[24px]">
            A3 Brands is the AI-powered Google Search Console and dealership SEO
            intelligence platform for General Managers, Marketing Directors,
            Principal Dealers, and Automotive Dealer Groups. Surface where
            you're losing - and where you can win - in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" variant="default">
              <Link href="/scan">
                RUN FREE GSC SCAN
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="invert">
              <Link href="/book-demo">
                <Calendar className="mr-1 h-4 w-4" />
                BOOK A STRATEGY CALL
              </Link>
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/55">
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              No credit card required
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              10-minute onboarding
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              SOC 2 Type II aligned
            </li>
          </ul>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-6xl md:mt-20">
          <FloatingWidgets />
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
