import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Calendar, Mail, MessageSquare, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/marketing/contact-form";
import { InfoHero } from "@/components/marketing/info-hero";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the A3 Brands team. Email, phone, or book a 30-minute strategy call.",
};

const CHANNELS = [
  {
    icon: Calendar,
    title: "Book a strategy call",
    body: "30 minutes, no slides. We'll walk through your GSC data live.",
    href: "/book-demo",
    cta: "Book a call",
  },
  {
    icon: Mail,
    title: "Email us",
    body: "Sales, support, partnerships - all routed here.",
    href: "mailto:hello@lonestarford.com",
    cta: "hello@lonestarford.com",
  },
  {
    icon: Phone,
    title: "Call us",
    body: "Mon-Fri, 9-6 CT. Voicemail goes to a human, not a queue.",
    href: "tel:+15550143220",
    cta: "+1 (555) 0143-2200",
  },
  {
    icon: MessageSquare,
    title: "In-app chat",
    body: "Already a customer? Use the chat widget inside the dashboard.",
    href: "/dashboard",
    cta: "Open dashboard",
  },
];

export default function ContactPage() {
  return (
    <>
      <InfoHero
        eyebrow="Contact"
        title={
          <>
            How to <span className="text-brand">actually</span> talk to us.
          </>
        }
        description="No contact-form-to-nowhere. Pick a channel below - they all reach the same small team."
      />

      <section className="container py-12">
        <ul className="grid gap-5 md:grid-cols-2">
          {CHANNELS.map((c) => (
            <li key={c.title}>
              <article className="h-full rounded-2xl border border-stone-200 bg-white p-7 transition-all duration-200 hover:border-brand hover:shadow-card-hover">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold text-charcoal">
                  {c.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
                  {c.body}
                </p>
                <Link
                  href={c.href}
                  className="mt-5 inline-flex items-center gap-1.5 font-display text-[13px] font-semibold text-brand hover:underline"
                >
                  {c.cta}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="container py-16">
        <div className="rounded-2xl border border-stone-200 bg-white p-7 md:p-10">
          <Badge variant="default">SEND A MESSAGE</Badge>
          <h2 className="mt-3 font-display text-[24px] font-black leading-[28px] tracking-tight text-charcoal md:text-[28px] md:leading-[33px]">
            Or just write us something.
          </h2>
          <p className="mt-2 text-[14px] leading-[22px] text-stone">
            We respond within one business day, usually faster.
          </p>

          <div className="mt-7">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-7">
          <div className="flex items-start gap-4">
            <Building2 className="mt-1 h-5 w-5 shrink-0 text-brand" />
            <div>
              <h3 className="font-display text-[16px] font-bold text-charcoal">
                Office (by appointment)
              </h3>
              <p className="mt-1 text-[14px] leading-[22px] text-stone">
                4001 Preston Rd, Plano, TX 75093
              </p>
              <p className="mt-1 text-[12px] text-stone">
                We're a distributed team. Mail still reaches us, but please
                book ahead if you want to meet in person.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

