import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { Toaster } from "sonner";

import { SiteThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  // Google Fonts ships Sora through weight 800. `font-black` (900) renders at
  // the heaviest loaded weight without synthetic bolding.
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0D0F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "automotive SEO",
    "dealership SEO",
    "Google Search Console",
    "dealer group analytics",
    "AI SEO platform",
    "Ford SEO",
    "Toyota dealer SEO",
    "local SEO dealerships",
    "dealership marketing",
  ],
  authors: [{ name: "A3 Brands" }],
  creator: "A3 Brands",
  publisher: "A3 Brands",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: siteConfig.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.png"],
    creator: "@a3brands",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  alternates: { canonical: siteConfig.url },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Google Search Console verification.
          Required for domain ownership verification - do not remove.
        */}
        <meta
          name="google-site-verification"
          content="VwtQf-f6xZOXpRtmaI3OjUtvxnj4exVXhJgv4iIA5qo"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-charcoal",
          sora.variable,
        )}
      >
        <SiteThemeProvider>
          <div className="relative flex min-h-screen flex-col">{children}</div>
          <Toaster
            theme="light"
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className:
                "border border-stone-200 bg-white text-charcoal shadow-subtle",
            }}
          />
        </SiteThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: siteConfig.name,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: siteConfig.description,
              url: siteConfig.url,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free GSC scan, paid intelligence plans available.",
              },
              audience: {
                "@type": "BusinessAudience",
                audienceType:
                  "Automotive Dealer Groups, Principal Dealers, General Managers, Marketing Directors",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
