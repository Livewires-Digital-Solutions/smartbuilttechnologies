import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/content/site";
import { indexable } from "@/lib/seo";
import "./globals.css";

/** Plus Jakarta Sans — what we say: headlines, copy, UI (Typography System v1.0). Variable 200–800, self-hosted. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

/** Italic is for quotes only; not preloaded so it costs nothing on pages without quotes. */
const jakartaItalic = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-jakarta-italic",
  display: "swap",
  preload: false,
});

/**
 * IBM Plex Mono — what we measure: labels, captions, figure numbers, specs and
 * standards. Never headings or running text (Design direction v2, §3).
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | BIM and Digital Twin, Chennai`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Construction technology",
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  // Search Console and Bing Webmaster verification, set on the server (see .env.example)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#F8FAFD",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * The shell shared by everything: fonts, global styles and the document. The public
 * site's header, footer and smooth scrolling live in `(site)/layout.tsx`; the admin
 * area in `(admin)` has its own plain layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      // globals.css sets smooth scrolling; this lets a route change still jump straight to the top
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${jakartaItalic.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
