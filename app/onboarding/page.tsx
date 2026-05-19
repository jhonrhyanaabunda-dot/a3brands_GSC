import type { Metadata } from "next";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Welcome to A3 Brands",
  description: "Set up your dealership in under 60 seconds.",
  alternates: { canonical: "/onboarding" },
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
