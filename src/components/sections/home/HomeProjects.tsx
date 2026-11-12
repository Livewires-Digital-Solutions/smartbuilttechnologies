import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";
import { ProjectsFilmstrip, type FilmFrame } from "./ProjectsFilmstrip";

/** The landmarks shown in the strip, in order. Chosen for the sharpest photographs. */
const SLUGS = [
  "king-abdullah-financial-district",
  "neom-bay-airport-t1-t2",
  "riyadh-metro",
  "sports-boulevard",
  "melbourne-airport",
  "chadstone-shopping-centre",
  "al-nahda-entertainment-complex",
  "microsoft-data-center-mel07",
];

const frames: FilmFrame[] = SLUGS.flatMap((slug) => {
  const p = projects.find((x) => x.slug === slug);
  return p
    ? [
        {
          slug: p.slug,
          name: p.name,
          location: p.location,
          sector: p.sector,
          country: p.country,
          image: p.image,
        },
      ]
    : [];
});

/**
 * Iconic projects: a filmstrip. The section pins on wide screens and scrolling slides
 * the strip sideways, one landmark at a time. Every project is associated with Technical Xperts Group (TXG) - Saudi Arabia,
 * whose track record Smart Built Technologies carries. Most photographs are 572 px
 * wide, so frames stay small until the originals arrive (PLAN.md).
 */
export function HomeProjects() {
  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby="projects-title"
      className="py-16 lg:py-0"
    >
      <ProjectsFilmstrip frames={frames} total={projects.length} />
    </Section>
  );
}
