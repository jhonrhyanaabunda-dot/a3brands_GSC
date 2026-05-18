import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Lock, Mail, User } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your A3 Brands GSC Intelligence Platform account.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center">
            <Logo variant="dark" size="md" />
          </Link>

          <h1 className="mt-10 font-display text-[32px] font-black leading-[36px] tracking-tight text-charcoal">
            Create your account.
          </h1>
          <p className="mt-2 text-[14px] leading-[22px] text-stone">
            10-minute onboarding. Connect GSC in step two.
          </p>

          <AuthForm variant="register" className="mt-8">
            <Field label="Full name" icon={User}>
              <input
                type="text"
                placeholder="Marcus Hill"
                className={inputCls("pl-10")}
                required
              />
            </Field>
            <Field label="Work email" icon={Mail}>
              <input
                type="email"
                placeholder="you@dealergroup.com"
                className={inputCls("pl-10")}
                required
              />
            </Field>
            <Field label="Dealership or dealer group" icon={Building2}>
              <input
                type="text"
                placeholder="A3 Brands Auto Group"
                className={inputCls("pl-10")}
              />
            </Field>
            <Field label="Password" icon={Lock}>
              <input
                type="password"
                placeholder="••••••••"
                className={inputCls("pl-10")}
                required
                minLength={8}
              />
            </Field>

            <Button type="submit" variant="default" size="lg" className="w-full">
              Create account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </AuthForm>

          <p className="mt-8 text-center text-[14px] leading-[22px] text-stone">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden bg-ink lg:flex lg:flex-col lg:justify-center lg:px-14 lg:py-12 ink-scope text-white">
        <div className="max-w-md">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
            What you get on day one
          </p>
          <h2 className="mt-4 font-display text-[36px] font-black leading-[40px] tracking-tight text-white">
            Real numbers in 10 minutes.
          </h2>
          <p className="mt-4 text-[14px] leading-[22px] text-white/75">
            Connect Google Search Console, point us at your rooftops, and the
            executive dashboard fills in within the same session.
          </p>
          <ul className="mt-7 space-y-3 text-[14px] leading-[22px] text-white/85">
            {[
              "Daily GSC sync starts the moment you connect",
              "AI insight queue ready within 24 hours",
              "Map-pack grid scans scheduled weekly",
              "Cancel anytime - no penalty",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function inputCls(extra = "") {
  return (
    "h-12 w-full rounded-lg border border-stone-200 bg-white pr-4 text-[14px] text-charcoal placeholder:text-stone-400 transition-all focus:border-brand focus:shadow-input-focus focus:outline-none " +
    extra
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-display text-[12px] font-semibold text-charcoal">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        {children}
      </div>
    </div>
  );
}
