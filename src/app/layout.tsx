import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Logo } from "@/components/brand/Logo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/ui/Breadcrumbs";
import { site } from "@/content/site";
import { organizationJsonLd, JsonLd } from "@/lib/jsonld";
import "./globals.css";

/** Plus Jakarta Sans — the only typeface (Typography System v1.0). Variable 200–800, self-hosted. */
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — BIM and digital construction, Chennai`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${jakarta.variable} ${jakartaItalic.variable}`}>
      <body>
        <SkipLink />
        <SiteHeader logo={<Logo lockup="horizontal" title={null} />} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
