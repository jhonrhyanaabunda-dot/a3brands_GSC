import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      description="The plain-language version is below each section. Email questions to legal@lonestarford.com."
      lastUpdated="May 18, 2026"
      sections={[
        {
          title: "Acceptance",
          body: [
            "By creating an account or using A3 Brands services, you agree to these terms. If you're agreeing on behalf of a dealership, dealer group, or other entity, you represent that you have authority to bind that entity.",
            "Plain version: signing up = agreeing.",
          ],
        },
        {
          title: "Your account",
          body: [
            "Keep your credentials safe. You're responsible for activity under your account. We support SAML SSO for enterprise customers and recommend SSO over passwords.",
            "Notify us immediately of any unauthorized access at security@lonestarford.com.",
          ],
        },
        {
          title: "Subscriptions and billing",
          body: [
            "Plans renew automatically. Cancel anytime in /settings or by emailing billing@lonestarford.com - you keep access through the end of the paid period.",
            "Annual plans are pro-rated on upgrades, not refunded on downgrades. Enterprise plans follow the terms in your signed order form, which supersede these.",
          ],
        },
        {
          title: "Acceptable use",
          body: [
            "Don't use A3 Brands to scan domains you don't have permission to audit. Don't try to overwhelm our scanners, our API, or other customers' workspaces.",
            "Don't reverse-engineer, scrape, or resell the service. Don't use it to violate any law or third-party right.",
          ],
        },
        {
          title: "Service availability",
          body: [
            "We target 99.9% uptime for the dashboard. Enterprise customers get an SLA in their order form. Status: status.lonestarford.com.",
            "Scheduled maintenance is announced 48 hours in advance and runs outside business hours where possible.",
          ],
        },
        {
          title: "Intellectual property",
          body: [
            "A3 Brands owns the platform, code, models, and brand. You own your data. We have a limited license to process your data to provide the service - nothing more.",
            "Feedback you give us about the product becomes ours to act on without obligation. We won't use your name in marketing without explicit consent.",
          ],
        },
        {
          title: "Termination",
          body: [
            "You can terminate at any time. We can terminate for material breach (acceptable-use violations, non-payment) with 30 days' notice for routine cases and immediately for egregious ones.",
            "On termination, you have 30 days to export your data. After that we delete it.",
          ],
        },
        {
          title: "Limitation of liability",
          body: [
            "To the extent permitted by law, our total liability is capped at the fees you paid in the 12 months before the claim. We're not liable for indirect or consequential damages.",
            "Enterprise contracts may negotiate different terms.",
          ],
        },
        {
          title: "Governing law",
          body: [
            "These terms are governed by the laws of the State of Texas. Disputes will be resolved in Dallas County, Texas.",
          ],
        },
        {
          title: "Changes",
          body: [
            "We'll email you at least 30 days before any material change to these terms. Continued use after the effective date means you accept the new terms.",
          ],
        },
      ]}
    />
  );
}
