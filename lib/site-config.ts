export const siteConfig = {
  name: "A3 Brands GSC Intelligence Platform",
  shortName: "A3 Brands",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lonestarford.com",
  description:
    "AI-powered Google Search Console and dealership SEO analytics for General Managers, Marketing Directors, Principal Dealers, and automotive dealer groups.",
  tagline: "See how your dealership performs on Google.",
  ogImage: "/og-image.png",
  links: {
    demo: "/book-demo",
    scan: "/scan",
    docs: "/docs",
    twitter: "https://twitter.com/a3brands",
    linkedin: "https://www.linkedin.com/company/a3brands",
  },
  contact: {
    email: "hello@lonestarford.com",
    phone: "+1 (555) 0143-2200",
  },
} as const;

export type SiteConfig = typeof siteConfig;
