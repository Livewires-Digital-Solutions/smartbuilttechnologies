import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { ProjectsClients } from "@/components/sections/projects/ProjectsClients";
import { ProjectsGallery } from "@/components/sections/projects/ProjectsGallery";
import { ProjectsHero } from "@/components/sections/projects/ProjectsHero";
import { Section } from "@/components/ui/Section";
import { projects, sectors } from "@/content/projects";
import { site } from "@/content/site";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";

const title =
  `${projects.length} Landmark BIM Projects | Smart Built Technologies`;
const description =
  `${projects.length} landmark BIM and digital construction projects associated with Technical Xperts Group (TXG) - Saudi Arabia, including KAFD, Riyadh Metro and NEOM Bay Airport.`;

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/projects",
});

/** Sectors that have at least one project, in the order the filter shows them. */
const usedSectors = sectors.filter((s) => projects.some((p) => p.sector === s));

/**
 * Projects, built from the home page's moves: a pinned hero with four landmarks,
 * the full portfolio with a sector filter, the client wall and the closing call
 * to action. Each project is at `/projects#slug`.
 */
export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/projects",
          name: title,
          description,
          type: "CollectionPage",
          crumbs: [{ name: "Projects", path: "/projects" }],
          list: {
            name: "Projects",
            items: projects.map((p) => ({
              name: p.name,
              path: `/projects#${p.slug}`,
            })),
          },
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <ProjectsHero />
      <Section surface="paper" aria-labelledby="projects-list-title">
        <ProjectsGallery
          projects={projects}
          sectors={usedSectors}
          tag={`Associated with ${site.groupLabel}`}
        />
      </Section>
      <Section surface="white" aria-labelledby="projects-clients-title">
        <ProjectsClients />
      </Section>
      <HomeCta />
    </>
  );
}
