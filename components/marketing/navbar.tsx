"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const NAV_LINKS = [
  { href: "#platform", label: "WHAT WE DO" },
  { href: "#ai-insights", label: "AI INSIGHTS" },
  { href: "#case-studies", label: "CASE STUDIES" },
  { href: "/pricing", label: "PRICING" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const bgAlpha = useTransform(scrollY, [0, 80], [0.6, 0.9]);
  const [open, setOpen] = React.useState(false);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        style={{
          backgroundColor: useTransform(
            bgAlpha,
            (v) => `rgba(22, 27, 37, ${v})`,
          ),
        }}
        className="backdrop-blur-md shadow-elevated"
      >
        <nav className="container flex h-[68px] items-center justify-between px-4 sm:px-14">
          <Link
            href="/"
            className="flex items-center text-white"
            aria-label={siteConfig.shortName}
          >
            <Logo variant="light" size="md" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3 py-2 font-display text-[14px] font-medium tracking-[0.08em] text-white/90 transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="px-3 py-2 font-display text-[14px] font-medium tracking-[0.05em] text-white/80 transition-colors hover:text-brand"
            >
              SIGN IN
            </Link>
            <Button asChild variant="default" size="default">
              <Link href="/book-demo">BOOK A STRATEGY CALL</Link>
            </Button>
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-white/90 lg:hidden focus-ring"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.div>

      <div
        className={cn(
          "lg:hidden transition-all duration-300 overflow-hidden",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="border-b border-white/[0.08] bg-ink/95 backdrop-blur-xl">
          <ul className="container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-2.5 font-display text-[14px] tracking-[0.06em] text-white/90 hover:bg-white/[0.04] hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
              <Link
                href="/login"
                className="block rounded-md px-3 py-2.5 font-display text-[14px] tracking-[0.06em] text-white/80 hover:text-brand"
                onClick={() => setOpen(false)}
              >
                SIGN IN
              </Link>
              <Button
                asChild
                variant="default"
                size="default"
                className="w-full"
              >
                <Link href="/book-demo" onClick={() => setOpen(false)}>
                  BOOK A STRATEGY CALL
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </motion.header>
  );
}
