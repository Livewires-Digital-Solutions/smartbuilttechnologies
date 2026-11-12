import { Suspense } from "react";
import { NavLogo } from "@/components/brand/NavLogo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SkipLink } from "@/components/ui/Breadcrumbs";
import { organizationJsonLd, JsonLd } from "@/lib/jsonld";

/** The public site: header, smooth-scrolling page with the footer, and the organisation data. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />
      {/* the header reads the route (for its open menus), so it sits in Suspense */}
      <Suspense fallback={null}>
        <SiteHeader logo={<NavLogo title={null} />} />
      </Suspense>
      <SmoothScroll>
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
      </SmoothScroll>
      <JsonLd data={organizationJsonLd()} />
    </>
  );
}
