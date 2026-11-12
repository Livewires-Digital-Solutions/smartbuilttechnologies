import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { pathways, PATHWAY_COLOUR } from "@/content/pathways";
import { servicesIndexCopy } from "@/content/service-pages";
import { servicesByPathway, services } from "@/content/services";
import {
  ServicesIndex,
  type ServiceGroup,
} from "@/components/sections/home/ServicesIndex";
import { SERVICE_PHOTO } from "./service-photos";

const order = new Map(services.map((s, i) => [s.slug, i]));

function buildGroups(): ServiceGroup[] {
  return [...pathways]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      id: p.id,
      name: p.name,
      meaning: p.meaning,
      color: PATHWAY_COLOUR[p.id],
      rows: servicesByPathway(p.id).map((s) => ({
        slug: s.slug,
        num: String((order.get(s.slug) ?? 0) + 1).padStart(2, "0"),
        title: servicesIndexCopy.cards[s.slug].title,
        summary: servicesIndexCopy.cards[s.slug].body,
        href: `/services/${s.slug}`,
        pathway: p.id,
        preview: SERVICE_PHOTO[s.slug],
      })),
    }));
}

/** Every service, with the group's own wording, grouped by pathway. */
export function ServicesList() {
  return (
    <Section surface="white" aria-labelledby="all-services-title" id="all-services">
      <div className="container-x">
        <SectionHead id="all-services-title" index="01" label="All services">
          Explore every service
        </SectionHead>
        <div className="mt-14 lg:mt-20">
          <ServicesIndex groups={buildGroups()} />
        </div>
      </div>
    </Section>
  );
}
