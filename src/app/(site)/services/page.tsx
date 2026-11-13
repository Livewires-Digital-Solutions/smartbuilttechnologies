import type { Metadata } from "next";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { HomeProjects } from "@/components/sections/home/HomeProjects";
import { ServicesHero } from "@/components/sections/services/ServicesHero";
import { ServicesList } from "@/components/sections/services/ServicesList";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";

const title =
  "BIM & Digital Construction Services | Smart Built Technologies";
const description =
  "BIM, scan to BIM, digital twin, CAFM, GIS, AR/VR/XR, 4D simulation and IT services from Smart Built Technologies, the production firm of TXG - Saudi Arabia.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/services",
});

/**
 * Services, built from the home page's moves: a pinned hero with one stage for
 * each of the four pathways, the full index with the group's own wording, the
 * pinned projects filmstrip and the closing call to action.
 */
export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/services",
          name: title,
          description,
          type: "CollectionPage",
          crumbs: [{ name: "Services", path: "/services" }],
          list: {
            name: "Services",
            items: services.map((s) => ({
              name: s.title,
              path: `/services/${s.slug}`,
            })),
          },
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <ServicesHero />
      <ServicesList />
      <HomeProjects index="02" />
      <HomeCta />
    </>
  );
}
