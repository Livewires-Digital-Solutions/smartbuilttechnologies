import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import {
  CareersContent,
  OpeningsSkeleton,
} from "@/components/sections/careers/CareersContent";
import { CareersHero } from "@/components/sections/careers/CareersHero";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";

const title =
  "BIM Careers and Jobs | Smart Built Technologies";
const description =
  "Join Smart Built Technologies. We are hiring BIM Modellers, BIM Engineers, BIM Coordinators and Team Leaders across India and the Middle East. Apply online.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/careers",
});

/**
 * Careers: a pinned hero on the three role families, the open positions (live from
 * the database, managed in the admin area) and the application form on the navy band.
 */
export default function CareersPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/careers",
          name: title,
          description,
          type: "CollectionPage",
          crumbs: [{ name: "Careers", path: "/careers" }],
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <CareersHero />
      <Suspense fallback={<OpeningsSkeleton />}>
        <CareersContent />
      </Suspense>
    </>
  );
}
