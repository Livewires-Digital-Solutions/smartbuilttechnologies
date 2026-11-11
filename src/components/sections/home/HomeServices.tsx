import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { pathways } from "@/content/pathways";
import { projects } from "@/content/projects";
import { servicesByPathway, services } from "@/content/services";
import { ServicesIndex, type ServiceGroup } from "./ServicesIndex";

/** One real project per service where the work exists; the rest show the pathway glyph. */
const PREVIEW_PROJECT: Record<string, string> = {
  bim: "tadawul-tower",
  "4d-simulation": "jeddah-tower",
  "reality-capture": "jeddah-opera-house",
  "digital-twin": "king-abdullah-financial-district",
  "immersive-solutions": "six-senses-hotel-wadi-safar",
  "asset-management": "sports-boulevard",
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
        const project = projects.find(
          (x) => x.slug === PREVIEW_PROJECT[s.slug],
        );
        return {
          slug: s.slug,
          num: String((order.get(s.slug) ?? 0) + 1).padStart(2, "0"),
          title: s.title,
          summary: s.summary,
          href: `/services/${s.slug}`,
          pathway: p.id,
          preview: project
            ? {
                ...project.image,
                alt: `${project.name}, ${project.location}`,
                caption: `${project.name}, ${project.location.split(",")[0]}`,
              }
            : undefined,
        };
      }),
    }));
}

/**
 * Services: all nine, grouped by the four pathways of the SBT symbol. Reads like
 * a table of contents; pointing at a row shows a project that used the service.
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
