import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Database,
  FileText,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Security",
};

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "SOC 2 Type II aligned",
    body: "Annual audit by an AICPA-accredited firm. Full report available to enterprise customers under NDA.",
  },
  {
    icon: Lock,
    title: "Encryption at every layer",
    body: "TLS 1.3 in transit, AES-256 at rest, hardware-backed KMS keys with quarterly rotation.",
  },
  {
    icon: Database,
    title: "Tenant isolation",
    body: "Per-customer schema separation in Postgres. No customer can query another customer's data. Period.",
  },
  {
    icon: KeyRound,
    title: "SSO + MFA",
    body: "SAML SSO via Okta, Azure AD, Google Workspace, or any IdP. MFA mandatory for all A3 Brands staff.",
  },
];

const CONTROLS = [
  "Daily encrypted backups with 30-day point-in-time recovery",
  "Quarterly third-party penetration testing",
  "Documented incident response plan with 72h breach notification",
  "Principle-of-least-privilege access controls + access logging",
  "Mandatory background checks for all staff with production access",
  "Annual security awareness training for the entire team",
  "Dedicated security@lonestarford.com for responsible disclosure",
  "30-day data deletion on account termination",
];

const SUBPROCESSORS = [
  { name: "Amazon Web Services", role: "Hosting", region: "US-East (Virginia) primary, US-West (Oregon) DR" },
  { name: "Neon", role: "Postgres hosting", region: "US-East (Virginia)" },
  { name: "Postmark", role: "Transactional email", region: "US-East" },
  { name: "Cloudflare", role: "CDN + DDoS protection", region: "Global edge" },
  { name: "Google APIs", role: "GSC, GBP, PageSpeed Insights", region: "Per Google's geo policy" },
];

export default function SecurityPage() {
  return (
    <>
      <InfoHero
        eyebrow="Security"
        title={
          <>
            Security is the boring work{" "}
            <span className="text-brand">we love doing.</span>
          </>
        }
        description="Customer data is the platform. Lose trust here and there is no product. The full disclosure of what we do - and how to push us if it's not enough."
      />

      {/* Pillars */}
      <section className="container py-12">
        <ul className="grid gap-5 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <li key={p.title}>
              <article className="h-full rounded-2xl border border-stone-200 bg-white p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold text-charcoal">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                  {p.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Controls list */}
      <section className="container py-12">
        <p className="section-label">OUR CONTROLS</p>
        <h2 className="mt-3 max-w-2xl font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[35px] md:leading-[39px]">
          The unglamorous checklist that keeps you safe.
        </h2>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {CONTROLS.map((c) => (
            <li
              key={c}
              className="flex items-start gap-2.5 rounded-xl border border-stone-200 bg-stone-50 p-4 text-[14px] leading-[22px] text-charcoal"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Subprocessors */}
      <section className="container py-12">
        <p className="section-label">SUBPROCESSORS</p>
        <h2 className="mt-3 max-w-2xl font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal md:text-[35px] md:leading-[39px]">
          The five services that touch your data.
        </h2>

        <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-[14px]">
            <thead className="bg-stone-50 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              <tr>
                <th className="px-5 py-3 text-left">Subprocessor</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {SUBPROCESSORS.map((s) => (
                <tr key={s.name}>
                  <td className="px-5 py-3 font-display font-bold text-charcoal">{s.name}</td>
                  <td className="px-5 py-3 text-stone">{s.role}</td>
                  <td className="px-5 py-3 text-stone">{s.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-stone">
          We notify customers 30 days before adding or changing a subprocessor.
        </p>
      </section>

      {/* Reports + contact */}
      <section className="container py-12">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-7">
            <FileText className="h-5 w-5 text-brand" />
            <h3 className="mt-3 font-display text-[18px] font-bold text-charcoal">
              Reports & docs
            </h3>
            <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
              SOC 2 Type II report, penetration-test summary, and Data
              Processing Addendum available under NDA to enterprise prospects.
            </p>
            <div className="mt-5">
              <Button asChild variant="default" size="sm">
                <Link href="mailto:security@lonestarford.com">Request report</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-7">
            <ShieldCheck className="h-5 w-5 text-brand" />
            <h3 className="mt-3 font-display text-[18px] font-bold text-charcoal">
              Responsible disclosure
            </h3>
            <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
              Found a vulnerability? Email{" "}
              <a
                href="mailto:security@lonestarford.com"
                className="font-semibold text-brand hover:underline"
              >
                security@lonestarford.com
              </a>
              . We acknowledge within 24h and ship a fix or workaround within 72h
              for high-severity issues.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
