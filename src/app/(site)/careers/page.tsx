import type { Metadata } from "next";
import { Suspense } from "react";
import {
  CareersContent,
  OpeningsSkeleton,
} from "@/components/sections/careers/CareersContent";
import { CareersHero } from "@/components/sections/careers/CareersHero";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

const title = "Careers | Smart Built Technologies, Production Firm of TXG, KSA";
const description =
  "Join Smart Built Technologies, the production firm of Technical Xperts Group (TXG) - Saudi Arabia, and shape the future of digital construction. We are hiring BIM Modellers, BIM Engineers, BIM Coordinators and Team Leaders across India and the Middle East. Apply today.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/careers" },
  openGraph: { title, description, url: "/careers", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/**
 * Careers: a pinned hero on the three role families, the open positions (live from
 * the database, managed in the admin area) and the application form on the navy band.
 */
export default function CareersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ])}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <CareersHero />
      <Suspense fallback={<OpeningsSkeleton />}>
        <CareersContent />
      </Suspense>
    </>
  );
}
