"use client";

import * as React from "react";
import { useActionState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

import { submitLead, type LeadFormState } from "@/actions/leads";
import { Button } from "@/components/ui/button";

interface Props {
  scanDomain: string;
  scanScore: number;
}

const initial: LeadFormState = { status: "idle" };

export function LeadCapture({ scanDomain, scanScore }: Props) {
  const [state, formAction, pending] = useActionState(submitLead, initial);

  if (state.status === "ok") {
    return (
      <article className="rounded-2xl border-2 border-brand bg-brand/[0.06] p-7 md:p-10">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-charcoal shadow-floating">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-[20px] font-black tracking-tight text-charcoal md:text-[24px]">
              Got it - we'll be in touch within one business day.
            </h3>
            <p className="mt-2 text-[14px] leading-[22px] text-charcoal text-pretty">
              We're prepping a custom version of this audit for{" "}
              <span className="font-mono font-semibold">{scanDomain}</span>{" "}
              with the top 5 plays prioritized for your specific market. Look
              for an email from{" "}
              <span className="font-mono">hello@lonestarford.com</span>.
            </p>
            <p className="mt-2 font-mono text-[11px] text-stone">
              Ref · {state.id}
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border-2 border-brand bg-white p-7 shadow-card-hover md:p-10">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Mail className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[20px] font-black leading-[24px] tracking-tight text-charcoal md:text-[22px]">
            Want the full audit emailed?
          </h3>
          <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty">
            We'll send a branded PDF report plus a strategist's note within one
            business day. Includes everything below + competitor benchmarks
            specific to your market.
          </p>
        </div>
      </div>

      <form action={formAction} className="mt-6 grid gap-3 sm:grid-cols-2">
        <input type="hidden" name="source" value="scan" />
        <input type="hidden" name="scanDomain" value={scanDomain} />
        <input type="hidden" name="scanScore" value={scanScore} />

        <Field label="Your name" required>
          <input
            name="name"
            type="text"
            required
            placeholder="Marcus Hill"
            className={inputCls}
          />
        </Field>
        <Field label="Work email" required>
          <input
            name="email"
            type="email"
            required
            placeholder="marcus@dealergroup.com"
            className={inputCls}
          />
        </Field>
        <Field label="Dealership / dealer group">
          <input
            name="company"
            type="text"
            placeholder="A3 Brands Auto Group"
            className={inputCls}
          />
        </Field>
        <Field label="Your role">
          <select name="role" className={inputCls} defaultValue="">
            <option value="" disabled>
              Select a role
            </option>
            <option>Principal Dealer</option>
            <option>General Manager</option>
            <option>Marketing Director</option>
            <option>Dealer Group Executive</option>
            <option>Other</option>
          </select>
        </Field>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" variant="default" size="lg" disabled={pending}>
            {pending ? "Sending…" : "Send my full audit"}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-[11px] text-stone">
            No spam. We respond within one business day. By submitting you agree
            to our privacy policy.
          </p>
        </div>

        {state.status === "error" ? (
          <p className="sm:col-span-2 text-[13px] font-semibold text-red-600">
            {state.message}
          </p>
        ) : null}
      </form>
    </article>
  );
}

const inputCls =
  "block w-full h-12 rounded-lg border border-stone-200 bg-white px-4 text-[14px] text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-brand focus:shadow-input-focus transition-all";

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-[12px] font-semibold text-charcoal">
        {label}
        {required ? <span className="ml-1 text-brand">*</span> : null}
      </span>
      {children}
    </label>
  );
}
