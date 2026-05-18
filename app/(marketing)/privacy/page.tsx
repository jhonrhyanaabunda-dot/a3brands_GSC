import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How A3 Brands collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      description="What we collect, why, and how to ask us to delete it."
      lastUpdated="May 18, 2026"
      sections={[
        {
          title: "What we collect",
          body: [
            "Account data: name, work email, role, and the dealership(s) you operate. Provided by you at signup or via SSO.",
            "Workspace data: Google Search Console metrics, Google Business Profile data, Google Analytics 4 properties, and crawl results from URLs you submit. Pulled via authenticated OAuth grants you authorize.",
            "Product telemetry: page views, clicks, and feature usage inside the A3 Brands app. We never sell this. We aggregate it to improve the product.",
          ],
        },
        {
          title: "How we use it",
          body: [
            "To compute the dashboards and AI recommendations that are the core of the product. Your GSC and GBP data is processed in our servers, surfaced only to authenticated users in your workspace.",
            "To send transactional emails (weekly summaries, alert digests, account events). You can pause these in /settings.",
            "To improve the product. Aggregate, de-identified usage data helps us understand which insights ship. We never sell, rent, or share customer data with third parties.",
          ],
        },
        {
          title: "Where data lives",
          body: [
            "All customer data is stored in the United States (AWS us-east-1 primary, us-west-2 disaster recovery). EU customers can opt into EU residency (Frankfurt) under our DPA.",
            "Data is encrypted at rest with AES-256 and in transit with TLS 1.3. Daily backups, point-in-time recovery, and quarterly access reviews.",
          ],
        },
        {
          title: "Who can access your data",
          body: [
            "Only authenticated users in your workspace can see your data. A3 Brands employees can access workspace data only when explicitly granted by you (for support) and every access is logged.",
            "We are SOC 2 Type II aligned. A full report is available on request to enterprise customers.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "Access: see all data we hold about you via /settings → Export.",
            "Correction: edit your profile, preferences, and integrations at any time.",
            "Deletion: request a full account deletion by emailing privacy@lonestarford.com. We delete within 30 days unless legally required to retain (audit, tax).",
            "Portability: export your workspace data as CSV/JSON from /settings.",
          ],
        },
        {
          title: "Cookies & analytics",
          body: [
            "We use first-party cookies for authentication and preferences. We use minimal, privacy-respecting product analytics - no third-party trackers, no advertising pixels on app.lonestarford.com.",
            "Marketing pages may set anonymous analytics cookies. See /cookies for the full list.",
          ],
        },
        {
          title: "Contact",
          body: [
            "Data protection inquiries: privacy@lonestarford.com. EU representative details available on request.",
          ],
        },
      ]}
    />
  );
}
