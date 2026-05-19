"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe,
  Loader2,
  Lock,
  Sparkles,
  Target,
  User,
  Zap,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StepId = "welcome" | "dealership" | "connect" | "complete";

interface WizardState {
  fullName: string;
  role: string;
  dealershipName: string;
  domain: string;
  brand: string;
  market: string;
  gscConnected: boolean;
}

const STEPS: { id: StepId; title: string; eyebrow: string }[] = [
  { id: "welcome", title: "Tell us who you are", eyebrow: "Welcome" },
  { id: "dealership", title: "Add your first rooftop", eyebrow: "Step 2 of 4" },
  { id: "connect", title: "Connect Search Console", eyebrow: "Step 3 of 4" },
  { id: "complete", title: "You're in.", eyebrow: "Done" },
];

const ROLES = [
  "Principal Dealer",
  "General Manager",
  "Marketing Director",
  "Internet Director",
  "Service Manager",
  "Other",
];

const BRANDS = [
  "Ford",
  "Toyota",
  "Honda",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Lincoln",
  "Subaru",
  "Lexus",
  "Audi",
  "Other",
];

export function OnboardingWizard() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = React.useState(0);
  const [state, setState] = React.useState<WizardState>({
    fullName: "",
    role: "",
    dealershipName: "",
    domain: "",
    brand: "",
    market: "",
    gscConnected: false,
  });

  const step = STEPS[stepIdx];
  if (!step) return null;

  const next = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIdx((i) => Math.max(i - 1, 0));
  const update = (patch: Partial<WizardState>) =>
    setState((s) => ({ ...s, ...patch }));

  const canAdvance = (() => {
    if (step.id === "welcome")
      return state.fullName.trim().length > 1 && state.role.length > 0;
    if (step.id === "dealership")
      return (
        state.dealershipName.trim().length > 1 &&
        state.domain.trim().length > 3 &&
        state.brand.length > 0
      );
    if (step.id === "connect") return true; // skipping or connecting both allowed
    return true;
  })();

  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-12">
      {/* Left brand panel */}
      <aside className="ink-section relative hidden flex-col justify-between overflow-hidden p-10 lg:col-span-4 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        />

        <div className="relative">
          <Logo variant="light" size="md" />
        </div>

        <div className="relative">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
            Set up · 60 seconds
          </p>
          <h1 className="mt-3 font-display text-[34px] font-black leading-[38px] tracking-tight text-white">
            Built for dealer principals
            <br />
            <span className="text-brand">who need real numbers.</span>
          </h1>
          <p className="mt-4 max-w-sm text-[14px] leading-[22px] text-white/70">
            Connect one rooftop or fifty. A3 Brands rolls up every dealership
            in your group into one executive view — refreshed every 24 hours.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "16 months of GSC history backfilled in under 90 seconds",
              "AI insights ranked by projected click recovery per hour",
              "Branded monthly PDFs your dealer principals will read",
            ].map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 text-[13px] leading-[18px] text-white/85"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <p className="text-[12px] text-white/55">
            Need to come back later?{" "}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </aside>

      {/* Right wizard panel */}
      <section className="flex flex-col px-6 py-10 sm:px-12 lg:col-span-8 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <Logo variant="dark" size="md" />
        </div>

        {/* Progress */}
        <StepRail current={stepIdx} />

        <div className="mx-auto mt-10 w-full max-w-xl flex-1">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
            {step.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal sm:text-[32px] sm:leading-[36px]">
            {step.title}
          </h2>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {step.id === "welcome" ? (
                  <WelcomeStep state={state} update={update} />
                ) : step.id === "dealership" ? (
                  <DealershipStep state={state} update={update} />
                ) : step.id === "connect" ? (
                  <ConnectStep state={state} update={update} />
                ) : (
                  <CompleteStep state={state} onGo={() => router.push("/dashboard")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          {step.id !== "complete" ? (
            <div className="mt-10 flex items-center justify-between">
              {stepIdx > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.05em] text-stone hover:text-charcoal"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-3">
                {step.id === "connect" ? (
                  <button
                    type="button"
                    onClick={next}
                    className="font-display text-[12px] font-semibold uppercase tracking-[0.05em] text-stone hover:text-charcoal"
                  >
                    Skip for now
                  </button>
                ) : null}
                <Button
                  variant="default"
                  size="lg"
                  disabled={!canAdvance}
                  onClick={next}
                  className="bg-charcoal hover:bg-ink"
                >
                  {step.id === "connect" ? "Continue" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

function WelcomeStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="fullName" className="text-[13px] font-semibold">
          Your full name
        </Label>
        <div className="relative mt-2">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            id="fullName"
            value={state.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            placeholder="Charles Rourke"
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      <div>
        <Label className="text-[13px] font-semibold">Your role</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ROLES.map((r) => {
            const active = state.role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => update({ role: r })}
                className={
                  "rounded-lg border px-3 py-2.5 text-left transition-all " +
                  (active
                    ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                    : "border-stone-200 bg-white hover:border-stone-300")
                }
              >
                <p
                  className={
                    "text-[13px] font-medium leading-[18px] " +
                    (active ? "text-charcoal" : "text-charcoal")
                  }
                >
                  {r}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DealershipStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="dealershipName" className="text-[13px] font-semibold">
          Dealership name
        </Label>
        <div className="relative mt-2">
          <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            id="dealershipName"
            value={state.dealershipName}
            onChange={(e) => update({ dealershipName: e.target.value })}
            placeholder="Lone Star Ford"
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      <div>
        <Label htmlFor="domain" className="text-[13px] font-semibold">
          Website domain
        </Label>
        <div className="relative mt-2">
          <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            id="domain"
            value={state.domain}
            onChange={(e) => update({ domain: e.target.value })}
            placeholder="lonestarford.com"
            className="pl-10"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-stone">
          We'll match this against your Search Console properties in the next step.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label className="text-[13px] font-semibold">Primary brand</Label>
          <select
            value={state.brand}
            onChange={(e) => update({ brand: e.target.value })}
            className="mt-2 h-11 w-full rounded-lg border border-stone-200 bg-white px-3.5 text-[14px] text-charcoal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="">Choose brand…</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="market" className="text-[13px] font-semibold">
            Market area
          </Label>
          <div className="relative mt-2">
            <Target className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              id="market"
              value={state.market}
              onChange={(e) => update({ market: e.target.value })}
              placeholder="Dallas-Fort Worth, TX"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50/60 px-4 py-3">
        <Sparkles className="h-4 w-4 shrink-0 text-brand" />
        <p className="text-[12px] leading-[18px] text-charcoal">
          You can add more rooftops anytime in <span className="font-semibold">Settings → Dealerships</span>.
          Dealer groups typically connect all properties at once.
        </p>
      </div>
    </div>
  );
}

function ConnectStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  const [connecting, setConnecting] = React.useState(false);

  const fakeConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      update({ gscConnected: true });
    }, 1800);
  };

  if (state.gscConnected) {
    return (
      <div className="rounded-2xl border-2 border-brand/30 bg-brand/[0.04] p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
              Connected · synced from your account
            </p>
            <h3 className="font-display text-[18px] font-bold text-charcoal">
              Google Search Console is live
            </h3>
          </div>
        </div>
        <p className="mt-4 text-[13px] leading-[20px] text-charcoal">
          We'll backfill 16 months of clicks, impressions, and rankings for{" "}
          <span className="font-semibold">{state.domain || "your domain"}</span> in the background.
          You can use the dashboard immediately — fresh data lands within ~90 seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-stone-200 bg-white">
      <div className="h-1 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC04]" />
      <div className="p-6">
        <div className="flex items-center gap-3">
          <GoogleMark className="h-8 w-8" />
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              Primary data source
            </p>
            <h3 className="font-display text-[16px] font-bold text-charcoal">
              Google Search Console
            </h3>
          </div>
        </div>

        <p className="mt-4 text-[13px] leading-[20px] text-charcoal">
          One click and we backfill 16 months of search performance for your
          domain. Read-only access — we never write back to your account.
        </p>

        <button
          type="button"
          onClick={fakeConnect}
          disabled={connecting}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-charcoal px-6 font-display text-[13px] font-bold uppercase tracking-[0.05em] text-white transition-all hover:bg-ink disabled:opacity-70 sm:w-auto"
        >
          {connecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-brand" />
              Authorizing…
            </>
          ) : (
            <>
              <GoogleMark className="h-4 w-4" />
              Connect with Google
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-stone">
          <Lock className="h-3 w-3" />
          OAuth 2.0 · Tokens encrypted at rest · revoke anytime
        </p>
      </div>
    </div>
  );
}

function CompleteStep({
  state,
  onGo,
}: {
  state: WizardState;
  onGo: () => void;
}) {
  return (
    <div>
      <div className="rounded-2xl border-2 border-brand/20 bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/40 p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
              All set, {state.fullName.split(" ")[0] || "there"}
            </p>
            <h3 className="font-display text-[22px] font-black tracking-tight text-charcoal">
              Your workspace is ready.
            </h3>
          </div>
        </div>
        <p className="mt-4 text-[14px] leading-[22px] text-charcoal">
          We're backfilling{" "}
          <span className="font-semibold">{state.dealershipName || "your dealership"}</span>'s
          GSC history now. The dashboard will populate within ~90 seconds. While
          we sync, take a quick tour.
        </p>
      </div>

      <ul className="mt-6 space-y-2.5">
        {[
          { label: "Dashboard", helper: "KPIs, traffic, top movers — your daily view", href: "/dashboard" },
          { label: "AI insights", helper: "Recommendations ranked by projected click recovery", href: "/insights" },
          { label: "Keywords", helper: "Rank distribution, gainers, drops", href: "/keywords" },
          { label: "Local SEO & GBP", helper: "Map-pack visibility and review velocity", href: "/local-seo" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3 transition-colors hover:border-brand/40"
            >
              <div>
                <p className="font-display text-[14px] font-semibold text-charcoal">
                  {item.label}
                </p>
                <p className="text-[11px] text-stone">{item.helper}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-stone group-hover:text-brand" />
            </Link>
          </li>
        ))}
      </ul>

      <Button
        variant="default"
        size="lg"
        className="mt-7 w-full bg-charcoal hover:bg-ink"
        onClick={onGo}
      >
        <Zap className="h-4 w-4 text-brand" />
        Open my dashboard
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step rail
// ---------------------------------------------------------------------------

function StepRail({ current }: { current: number }) {
  return (
    <ol className="mx-auto flex w-full max-w-xl items-center gap-2">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <span
              className={
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-[12px] font-bold transition-all " +
                (done
                  ? "bg-brand text-white"
                  : active
                    ? "bg-charcoal text-white ring-4 ring-charcoal/10"
                    : "bg-stone-200 text-stone-500")
              }
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </span>
            {i < STEPS.length - 1 ? (
              <span
                className={
                  "h-px flex-1 transition-colors " +
                  (done ? "bg-brand" : "bg-stone-200")
                }
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
