import type { Metadata } from "next";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { HomeHero } from "@/components/sections/home/HomeHero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home — built section by section (PLAN.md §7.1).
 * Done: H-01 Hero, H-09 Closing CTA. Next: H-02 Statement.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ClosingCta />
    </>
  );
}
