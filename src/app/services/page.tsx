import type { Metadata } from "next";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { HomeProjects } from "@/components/sections/home/HomeProjects";
import { ServicesHero } from "@/components/sections/services/ServicesHero";
import { ServicesList } from "@/components/sections/services/ServicesList";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

const title = "Services | Smart Built Technologies, Production Firm of TXG, KSA";
const description =
  "BIM in design, reality capture and scan to BIM, asset management, CAFM, digital twin, GIS, immersive solutions, 4D simulation and IT services, delivered from Chennai by the production firm of Technical Xperts Group (TXG) - Saudi Arabia.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/services" },
  openGraph: { title, description, url: "/services", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/**
 * Services, built from the home page's moves: a pinned hero with one stage for
 * each of the four pathways, the full index with the group's own wording, the
 * pinned projects filmstrip and the closing call to action.
 */
export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <ServicesHero />
      <ServicesList />
      <HomeProjects index="02" />
      <HomeCta />
    </>
  );
}
