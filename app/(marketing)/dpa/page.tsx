import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Data Processing Addendum",
};

export default function DpaPage() {
  return (
    <LegalPage
      eyebrow="Data Processing Addendum"
      title="DPA"
      description="The terms under which A3 Brands processes personal data on your behalf. GDPR / CCPA compliant."
      lastUpdated="May 18, 2026"
      sections={[
        {
          title: "Roles",
          body: [
            "You (the customer) are the data controller. A3 Brands is the data processor. We process personal data only on your documented instructions, expressed through your configuration of the service.",
          ],
        },
        {
          title: "Subprocessors",
          body: [
            "We use a small list of subprocessors: AWS (us-east-1 hosting), Neon (database hosting), Postmark (transactional email), Google (PageSpeed Insights, Search Console, Business Profile APIs). The full list and locations are at /security and is updated 30 days before any addition.",
          ],
        },
        {
          title: "Security measures",
          body: [
            "Encryption at rest (AES-256) and in transit (TLS 1.3). Quarterly penetration testing, annual SOC 2 Type II audit, mandatory MFA for all A3 Brands staff, principle-of-least-privilege access controls.",
            "Documented incident response plan with 72-hour breach notification.",
          ],
        },
        {
          title: "Data subject rights",
          body: [
            "We will assist you in responding to data subject requests (access, rectification, erasure, portability) within the timeframes required by GDPR and CCPA. Requests can be initiated via /settings or sent to privacy@lonestarford.com.",
          ],
        },
        {
          title: "International transfers",
          body: [
            "Where customer data is transferred from the EU/UK/Switzerland to the US, we rely on the Standard Contractual Clauses (2021/914/EU) and supplemental measures as required.",
            "EU customers may opt into EU-only data residency under their order form.",
          ],
        },
        {
          title: "Term and termination",
          body: [
            "This DPA remains in force for the duration of your subscription. On termination, we delete or return all personal data within 30 days, unless legally required to retain.",
          ],
        },
        {
          title: "Signed copy",
          body: [
            "Enterprise customers can request a counter-signed PDF copy of this DPA from privacy@lonestarford.com.",
          ],
        },
      ]}
    />
  );
}
