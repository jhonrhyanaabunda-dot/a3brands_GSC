import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to A3 Brands GSC Intelligence Platform.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-2">
      {/* Left: form */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center">
            <Logo variant="dark" size="md" />
          </Link>

          <h1 className="mt-10 font-display text-[32px] font-black leading-[36px] tracking-tight text-charcoal">
            Welcome back.
          </h1>
          <p className="mt-2 text-[14px] leading-[22px] text-stone">
            Sign in to access your dealership intelligence dashboard.
          </p>

          <AuthForm variant="signin" className="mt-8">
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
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@dealership.com"
                  className="h-12 w-full rounded-lg border border-stone-200 bg-white pl-10 pr-4 text-[14px] text-charcoal placeholder:text-stone-400 transition-all focus:border-brand focus:shadow-input-focus focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label
                  htmlFor="password"
                  className="block font-display text-[12px] font-semibold text-charcoal"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-display text-[12px] font-semibold text-brand hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-lg border border-stone-200 bg-white pl-10 pr-4 text-[14px] text-charcoal placeholder:text-stone-400 transition-all focus:border-brand focus:shadow-input-focus focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="default" size="lg" className="w-full">
              SIGN IN
              <ArrowRight className="h-4 w-4" />
            </Button>
          </AuthForm>

          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-stone-200" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.1em] text-stone">
              OR
            </span>
            <span className="h-px flex-1 bg-stone-200" />
          </div>

          <GoogleSignInButton />


          <p className="mt-8 text-center text-[14px] leading-[22px] text-stone">
            New to A3 Brands?{" "}
            <Link
              href="/register"
              className="font-semibold text-brand hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>

      {/* Right: brand panel */}
      <section className="hidden bg-ink lg:flex lg:flex-col lg:justify-center lg:px-14 lg:py-12 ink-scope text-white">
        <div className="max-w-md">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
            EXECUTIVE INTELLIGENCE
          </p>
          <h2 className="mt-4 font-display text-[40px] font-black leading-[44px] tracking-tight text-white">
            The first AI built for dealer groups.
          </h2>
          <p className="mt-4 text-[14px] leading-[22px] text-white/75">
            Multi-rooftop rollups, AI recommendations, Core Web Vitals
            monitoring, GBP health, and competitor visibility - refreshed
            every 24 hours.
          </p>
          <ul className="mt-7 space-y-3 text-[14px] leading-[22px] text-white/85">
            {[
              "Lead opportunity score across every rooftop",
              "AI recommendations ranked by projected click gain",
              "Map-pack tracking and review monitoring",
              "Monthly branded PDF reports",
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
