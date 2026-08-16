import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/env";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Akhil Karthik Boddupalli — Software Engineer | AI, Cloud & DevOps",
    template: "%s | Akhil Karthik Boddupalli",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: "Akhil Karthik Boddupalli — Software Engineer",
    description: site.description,
    url: "/",
    siteName: "Akhil Karthik Boddupalli",
    images: [{ url: "/assets/personal/profile/akhil-karthik-boddupalli-profile.png", alt: "Akhil Karthik Boddupalli" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhil Karthik Boddupalli — Software Engineer",
    description: site.description,
    images: ["/assets/personal/profile/akhil-karthik-boddupalli-profile.png"],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#07080a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Person", "ProfilePage"],
  name: site.name,
  headline: site.title,
  description: site.description,
  homeLocation: { "@type": "Place", name: site.location },
  email: `mailto:${site.email}`,
  telephone: site.phone,
  sameAs: [site.github, site.linkedin, site.credly],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteNav />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Script id="person-json-ld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(jsonLd)}
        </Script>
      </body>
    </html>
  );
}
