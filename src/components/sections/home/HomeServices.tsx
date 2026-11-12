import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { pathways } from "@/content/pathways";
import {
  servicesByPathway,
  services,
  type ServiceSlug,
} from "@/content/services";
import { ServicesIndex, type ServiceGroup } from "./ServicesIndex";

/**
 * A photograph for each service, shown beside the list. Each is chosen to show the
 * work itself. Asset management and CAFM share one photograph until a separate one
 * is supplied; `position` crops it differently so the two do not look identical.
 */
const SERVICE_IMAGE: Record<
  ServiceSlug,
  {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
    position?: string;
  }
> = {
  bim: {
    src: "/assets/services/bim.jpg",
    width: 2000,
    height: 1333,
    alt: "Two BIM coordinators reviewing a federated building model on screen",
    caption: "Coordinating the BIM model",
  },
  "4d-simulation": {
    src: "/assets/services/digital-twin.jpg",
    width: 1024,
    height: 559,
    alt: "A site engineer checking the construction programme against the model on a tablet, with a building rising behind",
    caption: "Programme checked against the model",
  },
  "reality-capture": {
    src: "/assets/services/reality-capture.jpg",
    width: 2000,
    height: 1333,
    alt: "A surveyor setting up a total station to capture an existing site",
    caption: "Survey and scan on site",
  },
  "digital-twin": {
    src: "/assets/services/cafm.jpg",
    width: 1024,
    height: 608,
    alt: "A facilities engineer with a tablet showing live building data over a campus",
    caption: "Live data on the building model",
  },
  "gis-smart-cities": {
    src: "/assets/services/gis-smart-cities.jpg",
    width: 1024,
    height: 551,
    alt: "A city at dusk with glowing data connections between buildings",
    caption: "Building data across a city",
  },
  "immersive-solutions": {
    src: "/assets/misc/hero-architecture.webp",
    width: 2400,
    height: 1432,
    alt: "A 3D model of a room held over architectural drawings",
    caption: "From drawing to walk-through model",
  },
  "asset-management": {
    src: "/assets/services/asset-management.png",
    width: 1024,
    height: 682,
    alt: "A technician scanning an asset tag in a server room",
    caption: "Assets tagged and scanned",
  },
  cafm: {
    src: "/assets/services/asset-management.png",
    width: 1024,
    height: 682,
    alt: "A technician with a handheld device checking an asset register",
    caption: "The asset register in use",
    position: "20% 30%",
  },
  "it-services": {
    src: "/assets/services/it-services.jpg",
    width: 1024,
    height: 574,
    alt: "An engineer using a touch interface of cloud, security and analytics tools",
    caption: "Software and integration",
  },
};

/** The pathway colours from the logo (Colour System p.8). */
const PATHWAY_COLOUR: Record<string, string> = {
  foundation: "#0C1446",
  precision: "#7CC0FA",
  "digital-layer": "#1D6BF3",
  integration: "#FF5200",
};

const order = new Map(services.map((s, i) => [s.slug, i]));

function buildGroups(): ServiceGroup[] {
  return [...pathways]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      id: p.id,
      name: p.name,
      meaning: p.meaning,
      color: PATHWAY_COLOUR[p.id] ?? "#0C1446",
      rows: servicesByPathway(p.id).map((s) => {
        const image = SERVICE_IMAGE[s.slug];
        return {
          slug: s.slug,
          num: String((order.get(s.slug) ?? 0) + 1).padStart(2, "0"),
          title: s.title,
          summary: s.summary,
          href: `/services/${s.slug}`,
          pathway: p.id,
          preview: image,
        };
      }),
    }));
}

/**
 * Services: all nine, grouped by the four pathways of the SBT symbol. Reads like
 * a table of contents; pointing at a row shows a photograph of that service at work.
 */
export function HomeServices() {
  return (
    <Section surface="paper" aria-labelledby="services-title">
      <div className="container-x">
        <SectionHead
          id="services-title"
          index="04"
          label="Our services"
          aside={
            <div className="flex flex-col items-start gap-6">
              <p className="max-w-[56ch] text-lead text-slate-700">
                Nine services, grouped the way the symbol is drawn: build it,
                capture it, connect it, run it. Each one cuts project risk and
                leaves your team with data they can use.
              </p>
              <ButtonLink
                href="/services"
                variant="ghost"
                className="underline"
              >
                View all services
              </ButtonLink>
            </div>
          }
        >
          Nine services. Four pathways.
        </SectionHead>

        <div className="mt-14 lg:mt-20">
          <ServicesIndex groups={buildGroups()} />
        </div>
      </div>
    </Section>
  );
}
