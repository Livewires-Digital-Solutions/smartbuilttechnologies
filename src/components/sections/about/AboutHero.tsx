import { StageHero, type HeroStage } from "@/components/sections/StageHero";
import { ButtonLink } from "@/components/ui/Button";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const riyadhMetro = projects.find((p) => p.slug === "riyadh-metro");

/** The three chapters of the story, each with its own photograph. */
const STAGES: HeroStage[] = [
  {
    label: "The record",
    phrase: `Since ${site.foundedGroup}`,
    colour: "var(--color-navy)",
    chip: `Associated with ${site.groupLabel}`,
    caption: "King Abdullah Financial District",
    text: `${site.groupLabel} is founded in Riyadh in ${site.foundedGroup} and builds its record on landmark projects in the Gulf and Australia.`,
    links: [{ label: "See the projects", href: "/projects" }],
    image: {
      src: "/assets/misc/hero-architecture.webp",
      width: 2400,
      height: 1432,
      alt: "The King Abdullah Financial District skyline in Riyadh at sunset",
      position: "55% 40%",
    },
  },
  {
    label: "The group",
    phrase: "Riyadh · Sharjah",
    colour: "var(--color-cobalt)",
    chip: `Associated with ${site.groupLabel}`,
    caption: riyadhMetro
      ? `${riyadhMetro.name}, ${riyadhMetro.location}`
      : "Riyadh",
    text: "Group teams in Riyadh and Sharjah work with clients across the Gulf, on projects that shape the region’s skylines.",
    links: [{ label: "Where we work", href: "#where" }],
    image: {
      src: riyadhMetro?.image.src ?? "/assets/misc/hero-architecture.webp",
      width: riyadhMetro?.image.width ?? 2400,
      height: riyadhMetro?.image.height ?? 1432,
      alt: riyadhMetro ? `${riyadhMetro.name}, ${riyadhMetro.location}` : "",
      position: "50% 50%",
    },
  },
  {
    label: "The production firm",
    phrase: "Chennai · Now",
    colour: "var(--color-orange)",
    chip: "From drawing to model",
    caption: "Modelling, scanning, data and software",
    text: `${site.name} opens in Chennai as the production firm of ${site.groupLabel}, carrying the group’s experience into every model.`,
    links: [{ label: "Our services", href: "/services" }],
    image: {
      src: "/assets/misc/team-at-work.jpg",
      width: 1040,
      height: 660,
      alt: "A hand holding a building model over architectural drawings",
      position: "62% 50%",
    },
  },
];

/**
 * About hero, built like the home hero: the headline, the buttons and the three
 * chapters of the story on the left, a photograph for the chapter in focus on
 * the right. The hero pins on wide screens and scrolling moves through the story.
 */
export function AboutHero() {
  return (
    <StageHero
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
      listLabel="The story in three chapters"
      figureLabel="The production firm of TXG, KSA"
      hintTouch="Tap a chapter"
      hintScroll="Scroll to read the story"
      stages={STAGES}
    />
  );
}
