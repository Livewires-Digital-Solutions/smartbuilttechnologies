import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const kafd = projects.find(
  (p) => p.slug === "king-abdullah-financial-district",
);

/** Projects hero: the headline, the lede and the buttons beside one landmark photograph. */
export function ProjectsHero() {
  return (
    <PageHero
      id="projects-hero-title"
      headerLabel="Smart Built Technologies · Projects"
      kicker={`${projects.length} projects · Associated with ${site.groupLabel}`}
      headline={["Projects"]}
      lede="Showcasing our global footprint and commitment to excellence through transformative digital construction projects."
      actions={
        <>
          <ButtonLink href="#all-projects" variant="signal" icon="arrow-down">
            All projects
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" className="underline">
            Start a project
          </ButtonLink>
        </>
      }
      figure={{
        src: kafd?.image.src ?? "/assets/misc/hero-architecture.webp",
        width: kafd?.image.width ?? 2400,
        height: kafd?.image.height ?? 1432,
        alt: kafd ? `${kafd.name}, ${kafd.location}` : "",
        position: "55% 40%",
        chip: `Associated with ${site.groupLabel}`,
        caption: kafd?.name ?? "King Abdullah Financial District",
      }}
    />
  );
}
