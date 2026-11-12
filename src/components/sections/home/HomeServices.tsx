import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { pathways, PATHWAY_COLOUR } from "@/content/pathways";
import { servicesByPathway, services } from "@/content/services";
import { SERVICE_PHOTO } from "@/components/sections/services/service-photos";
import { ServicesIndex, type ServiceGroup } from "./ServicesIndex";

const order = new Map(services.map((s, i) => [s.slug, i]));

function buildGroups(): ServiceGroup[] {
  return [...pathways]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      id: p.id,
      name: p.name,
      meaning: p.meaning,
      color: PATHWAY_COLOUR[p.id],
      rows: servicesByPathway(p.id).map((s) => {
        const image = SERVICE_PHOTO[s.slug];
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
