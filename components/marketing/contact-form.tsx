"use client";

import * as React from "react";
import { useActionState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { submitLead, type LeadFormState } from "@/actions/leads";
import { Button } from "@/components/ui/button";

const initial: LeadFormState = { status: "idle" };

const inputCls =
  "block w-full h-12 rounded-lg border border-stone-200 bg-white px-4 text-[14px] text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-brand focus:shadow-input-focus transition-all";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initial);
  const sent = state.status === "ok";

  React.useEffect(() => {
    if (state.status === "ok") {
      toast.success("Message sent.", {
        description: "We'll respond within one business day.",
        duration: 5000,
      });
    } else if (state.status === "error") {
      toast.error(state.message ?? "Something went wrong.");
    }
  }, [state]);

  if (sent) {
    return (
      <article className="rounded-2xl border-2 border-brand bg-brand/[0.06] p-7 md:p-10">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-charcoal shadow-floating">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-[20px] font-black tracking-tight text-charcoal md:text-[24px]">
              Message received. We'll get back to you.
            </h3>
            <p className="mt-2 text-[14px] leading-[22px] text-charcoal text-pretty">
              Expect a response within one business day from{" "}
              <span className="font-mono">hello@a3brands.com</span>. If it's
              urgent, ping us directly.
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
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="source" value="contact" />

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
      <Field label="Dealership / dealer group" className="sm:col-span-2">
        <input
          name="company"
          type="text"
          placeholder="A3 Brands Auto Group"
          className={inputCls}
        />
      </Field>
      <Field label="What's on your mind?" required className="sm:col-span-2">
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us what you're trying to solve…"
          className={`${inputCls} h-auto resize-y py-3`}
        />
      </Field>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="default" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="text-[11px] text-stone">
          By submitting you agree to our{" "}
          <a href="/privacy" className="underline">
            privacy policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={"block " + (className ?? "")}>
      <span className="mb-1.5 block font-display text-[12px] font-semibold text-charcoal">
        {label}
        {required ? <span className="ml-1 text-brand">*</span> : null}
      </span>
      {children}
    </label>
  );
}
