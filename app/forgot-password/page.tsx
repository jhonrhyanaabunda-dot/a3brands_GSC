import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Mail } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ResetForm } from "@/components/auth/reset-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Email us a reset link for your A3 Brands account.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-display text-[12px] font-semibold text-stone transition-colors hover:text-charcoal"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to sign in
          </Link>

          <Link href="/" className="mt-6 inline-flex items-center">
            <Logo variant="dark" size="md" />
          </Link>

          <h1 className="mt-8 font-display text-[32px] font-black leading-[36px] tracking-tight text-charcoal">
            Reset your password.
          </h1>
          <p className="mt-2 text-[14px] leading-[22px] text-stone">
            Enter the email on your account. We'll send a one-time reset link
            within a minute.
          </p>

          <ResetForm className="mt-8">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block font-display text-[12px] font-semibold text-charcoal"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@dealergroup.com"
                  className="h-12 w-full rounded-lg border border-stone-200 bg-white pl-10 pr-4 text-[14px] text-charcoal placeholder:text-stone-400 transition-all focus:border-brand focus:shadow-input-focus focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="default" size="lg" className="w-full">
              Send reset link
              <ArrowRight className="h-4 w-4" />
            </Button>
          </ResetForm>

          <p className="mt-8 text-center text-[14px] leading-[22px] text-stone">
            Remember it after all?{" "}
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
            How resets work
          </p>
          <h2 className="mt-4 font-display text-[36px] font-black leading-[40px] tracking-tight text-white">
            We don't store passwords.
          </h2>
          <p className="mt-4 text-[14px] leading-[22px] text-white/75">
            A3 Brands uses one-time reset tokens - never plaintext recovery.
            Your password is hashed with bcrypt at cost factor 12. If you've
            lost access, the reset link is the only way back in.
          </p>
          <ul className="mt-7 space-y-3 text-[14px] leading-[22px] text-white/85">
            {[
              "One-time tokens, expire in 30 minutes",
              "Rate-limited to 3 per email per hour",
              "Audit-logged for security review",
              "SSO admins can also reset via your IdP",
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
