import type { Metadata } from "next";

import { AIRecommendations } from "@/components/marketing/ai-recommendations";
import { CaseStudies } from "@/components/marketing/case-studies";
import { CTASection } from "@/components/marketing/cta-section";
import { DealerLogos } from "@/components/marketing/dealer-logos";
import { FAQ } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { LocalSeoShowcase } from "@/components/marketing/local-seo-showcase";
import { MetricsStrip } from "@/components/marketing/metrics-strip";
import { Navbar } from "@/components/marketing/navbar";
import { StickyCTA } from "@/components/marketing/sticky-cta";
import { Testimonials } from "@/components/marketing/testimonials";

export const metadata: Metadata = {
  title: "See how your dealership performs on Google",
  description:
    "AI-powered Google Search Console and dealership SEO analytics built for General Managers, Marketing Directors, Principal Dealers, and Automotive Dealer Groups.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="content" className="relative">
        <Hero />
        <DealerLogos />
        <MetricsStrip />
        <Features />
        <AIRecommendations />
        <LocalSeoShowcase />
        <CaseStudies />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
