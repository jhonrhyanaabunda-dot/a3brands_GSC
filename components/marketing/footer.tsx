import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/lib/site-config";

const COLUMNS = [
  {
    title: "PLATFORM",
    links: [
      { href: "#platform", label: "Executive dashboard" },
      { href: "#ai-insights", label: "AI insights" },
      { href: "#local-seo", label: "Local SEO" },
      { href: "/scan", label: "GSC analyzer" },
      { href: "/reports", label: "Reporting" },
    ],
  },
  {
    title: "SOLUTIONS",
    links: [
      { href: "#case-studies", label: "Dealer groups" },
      { href: "#case-studies", label: "Marketing directors" },
      { href: "#case-studies", label: "General managers" },
      { href: "#case-studies", label: "Principal dealers" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/changelog", label: "Changelog" },
      { href: "/security", label: "Security" },
      { href: "/status", label: "Status" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { href: "/about", label: "About" },
      { href: "/customers", label: "Customers" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="ink-section relative">
      <div className="container py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center">
              <Logo variant="light" size="md" />
            </Link>
            <p className="max-w-xs text-[14px] leading-[22px] text-white/70 text-pretty">
              AI-powered Google Search Console intelligence for automotive
              dealer groups, GMs, principal dealers, and marketing directors.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.links.twitter}
                className="text-white/60 hover:text-brand transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                className="text-white/60 hover:text-brand transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-brand">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] leading-[22px] text-white/70 hover:text-brand transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse items-start gap-4 border-t border-white/[0.08] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] text-white/50">
            © {new Date().getFullYear()} A3 Brands. All rights reserved. SOC 2
            Type II aligned.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-white/50">
            <li>
              <Link href="/privacy" className="hover:text-brand transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand transition-colors">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/dpa" className="hover:text-brand transition-colors">
                DPA
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-brand transition-colors">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
