import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
};

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Cookie Policy"
      description="The cookies we set, what they do, and how to turn them off."
      lastUpdated="May 18, 2026"
      sections={[
        {
          title: "What cookies we set",
          body: [
            "On lonestarford.com (marketing): one anonymous analytics cookie to count unique visitors. No third-party advertising pixels.",
            "On app.lonestarford.com (product): authentication session cookies, user preference cookies (date range, active dealership), and CSRF protection cookies. All first-party, all HttpOnly + Secure + SameSite=Lax.",
          ],
        },
        {
          title: "Cookies we do NOT set",
          body: [
            "No advertising cookies. No retargeting. No third-party tracking. We don't run Facebook Pixel, Google Ads conversion, LinkedIn Insight Tag, or similar on either domain.",
          ],
        },
        {
          title: "How to opt out",
          body: [
            "All cookies on the marketing site are strictly necessary or analytics-only. You can disable cookies entirely in your browser - the marketing site will still work.",
            "Product cookies on app.lonestarford.com are required for authentication. Disabling them will sign you out.",
          ],
        },
        {
          title: "Updates",
          body: [
            "If we ever add a non-essential cookie we'll update this page and notify you with a banner.",
          ],
        },
      ]}
    />
  );
}
