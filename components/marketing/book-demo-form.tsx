"use client";

import * as React from "react";
import { useActionState } from "react";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { submitLead, type LeadFormState } from "@/actions/leads";
import { Button } from "@/components/ui/button";

const initial: LeadFormState = { status: "idle" };

const TIME_SLOTS = [
  "Wed · 10:00 AM CT",
  "Wed · 2:00 PM CT",
  "Thu · 9:30 AM CT",
  "Thu · 1:00 PM CT",
  "Fri · 11:00 AM CT",
  "Fri · 3:30 PM CT",
];

const inputCls =
  "block w-full h-12 rounded-lg border border-stone-200 bg-white px-4 text-[14px] text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-brand focus:shadow-input-focus transition-all";

export function BookDemoLayout() {
  const [slot, setSlot] = React.useState<string | null>(null);
  const [state, formAction, pending] = useActionState(submitLead, initial);
  const sent = state.status === "ok";

  React.useEffect(() => {
    if (state.status === "ok") {
      toast.success("Demo requested.", {
        description: slot
          ? `Slot held: ${slot}. We'll confirm by email within an hour.`
          : "We'll respond within one business day.",
        duration: 6000,
      });
    } else if (state.status === "error") {
      toast.error(state.message ?? "Something went wrong.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-12 lg:gap-10">
      {/* Form */}
      <div className="lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-7 shadow-subtle md:p-10">
        {sent ? (
          <SentState slot={slot} ref={state.id} />
        ) : (
          <>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-brand">
              YOUR DETAILS
            </p>
            <h2 className="mt-2 font-display text-[24px] font-bold tracking-tight text-charcoal md:text-[28px]">
              Tell us a little about your group.
            </h2>

            <form action={formAction} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="source" value="demo" />
              {slot ? (
                <input type="hidden" name="company" value={`Slot: ${slot}`} />
              ) : null}

              <Field label="Full name" required>
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
              <Field label="Role">
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
              <Field label="Dealership website">
                <input
                  name="websiteUrl"
                  type="url"
                  placeholder="https://yourdealership.com"
                  className={inputCls}
                />
              </Field>
              <Field label="What would you like to focus on?" className="sm:col-span-2">
                <textarea
                  name="message"
                  rows={4}
                  placeholder="e.g. fix mobile speed, recover Ford lease keywords, improve map-pack across 6 cities"
                  className={`${inputCls} h-auto resize-y py-3`}
                />
              </Field>

              {slot ? (
                <div className="sm:col-span-2 rounded-lg border border-brand bg-brand/[0.06] p-3 text-[13px] font-medium text-charcoal">
                  <Calendar className="mr-1.5 inline h-4 w-4 align-[-3px] text-brand" />
                  Holding <span className="font-display font-bold">{slot}</span>{" "}
                  for you. Submit to confirm.
                </div>
              ) : null}

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={pending}
                className="mt-2 w-full sm:col-span-2 sm:w-auto"
              >
                {pending ? "Requesting…" : "REQUEST CALL"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="sm:col-span-2 text-[11px] text-stone">
                We'll respond within 1 business day. By submitting you agree to
                our{" "}
                <a href="/privacy" className="underline">
                  privacy policy
                </a>
                .
              </p>
            </form>
          </>
        )}
      </div>

      {/* Slots + contact */}
      <aside className="lg:col-span-5 space-y-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-7">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-brand">
            AVAILABILITY THIS WEEK
          </p>
          <h3 className="mt-2 font-display text-[18px] font-bold text-charcoal">
            Prefer to grab a slot now?
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((s) => {
              const active = slot === s;
              return (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setSlot(active ? null : s)}
                    className={
                      "w-full rounded-pill border px-3 py-2 font-display text-[12px] font-semibold transition-colors " +
                      (active
                        ? "border-brand bg-brand text-charcoal shadow-floating"
                        : "border-stone-200 bg-white text-charcoal hover:border-brand hover:text-brand")
                    }
                  >
                    {s}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[11px] text-stone">
            {slot
              ? `${slot} held. Submit the form to confirm.`
              : "Pick a slot to hold it while you fill out the form."}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-7">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.05em] text-brand">
            PREFER NOT TO FILL OUT A FORM
          </p>
          <ul className="mt-4 space-y-3 text-[14px] leading-[22px] text-charcoal">
            <li className="flex items-center gap-2.5">
              <span className="text-brand">✉</span>
              <a href="mailto:hello@a3brands.com" className="hover:text-brand">
                hello@a3brands.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-brand">☎</span>
              <a href="tel:+15550143220" className="hover:text-brand">
                +1 (555) 0143-2200
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function SentState({ slot, ref }: { slot: string | null; ref: string }) {
  return (
    <article className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-charcoal shadow-floating">
        <CheckCircle2 className="h-5 w-5" />
      </span>
      <div>
        <h2 className="font-display text-[20px] font-black tracking-tight text-charcoal md:text-[24px]">
          {slot ? "Your slot is held. See you then." : "Demo requested."}
        </h2>
        <p className="mt-2 text-[14px] leading-[22px] text-charcoal text-pretty">
          {slot ? (
            <>
              We're holding{" "}
              <span className="font-display font-bold">{slot}</span> for you. A
              calendar invite from{" "}
              <span className="font-mono">hello@a3brands.com</span> will follow
              within an hour.
            </>
          ) : (
            <>
              We'll be in touch within one business day from{" "}
              <span className="font-mono">hello@a3brands.com</span>.
            </>
          )}
        </p>
        <p className="mt-2 font-mono text-[11px] text-stone">Ref · {ref}</p>
      </div>
    </article>
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
