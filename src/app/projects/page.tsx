import type { Metadata } from "next";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { ProjectsClients } from "@/components/sections/projects/ProjectsClients";
import { ProjectsGallery } from "@/components/sections/projects/ProjectsGallery";
import { ProjectsHero } from "@/components/sections/projects/ProjectsHero";
import { Section } from "@/components/ui/Section";
import { projects, sectors } from "@/content/projects";
import { site } from "@/content/site";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

const title =
  "Projects | Smart Built Technologies, Production Firm of TXG, KSA";
const description = `${projects.length} landmark BIM and digital construction projects associated with Technical Xperts Group (TXG) - Saudi Arabia: NEOM Bay Airport, KAFD, Sports Boulevard, Riyadh Metro and international projects in Australia.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title, description, url: "/projects", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

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
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
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
