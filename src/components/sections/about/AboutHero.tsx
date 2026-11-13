import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/** About hero: the headline, the lede and the buttons beside one photograph. */
export function AboutHero() {
  return (
    <PageHero
      id="about-hero-title"
      headerLabel="Smart Built Technologies · About"
      kicker={`About us · Part of ${site.groupLabel} since ${site.foundedGroup}`}
      headline={["The production", "firm behind", "landmarks"]}
      lede={`${site.name} is the production firm of ${site.group}. From a newly opened production centre in Chennai, we carry the experience of ${projects.length} landmark projects into every model we deliver.`}
      actions={
        <>
          <ButtonLink href="/contact" variant="signal">
            Start a project
          </ButtonLink>
          <ButtonLink href="/projects" variant="ghost" className="underline">
            Our projects
          </ButtonLink>
        </>
      }
      figure={{
        src: "/assets/misc/hero-architecture.webp",
        width: 2400,
        height: 1432,
        alt: "The King Abdullah Financial District skyline in Riyadh at sunset",
        position: "55% 40%",
        chip: `Associated with ${site.groupLabel}`,
        caption: "King Abdullah Financial District",
      }}
    />
  );
}
