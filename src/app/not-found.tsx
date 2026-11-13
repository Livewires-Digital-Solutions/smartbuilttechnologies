import type { Metadata } from "next";
import { Suspense } from "react";
import { NavLogo } from "@/components/brand/NavLogo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NotFoundView } from "@/components/sections/NotFoundView";
import { SkipLink } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** An address that matches no page. It brings its own header and footer, as it sits outside the site layout. */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Suspense fallback={null}>
        <SiteHeader logo={<NavLogo title={null} />} />
      </Suspense>
      <main id="main" tabIndex={-1} className="outline-none">
        <NotFoundView />
      </main>
      <SiteFooter />
    </>
  );
}
