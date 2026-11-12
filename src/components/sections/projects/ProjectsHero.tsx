import { StageHero, type HeroStage } from "@/components/sections/StageHero";
import { ButtonLink } from "@/components/ui/Button";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/** Four landmarks with sharp photographs, one stage each. Short label for the list, full name in the caption. */
const PICKS: {
  slug: string;
  label: string;
  colour: string;
  position?: string;
}[] = [
  {
    slug: "king-abdullah-financial-district",
    label: "KAFD",
    colour: "var(--color-navy)",
    position: "55% 40%",
  },
  {
    slug: "riyadh-metro",
    label: "Riyadh Metro",
    colour: "var(--color-cobalt)",
  },
  {
    slug: "six-senses-hotel-wadi-safar",
    label: "Six Senses",
    colour: "var(--color-sky)",
  },
  {
    slug: "jeddah-opera-house",
    label: "Jeddah Opera House",
    colour: "var(--color-orange)",
  },
];

const stages: HeroStage[] = PICKS.flatMap((pick) => {
  const p = projects.find((x) => x.slug === pick.slug);
  if (!p) return [];
  return [
    {
      label: pick.label,
      phrase: p.location.split(",")[0]!,
      colour: pick.colour,
      chip: `Associated with ${site.groupLabel}`,
      caption: p.name,
      text: `${p.client}. ${p.scope[0]}.`,
      links: [{ label: "See the project", href: `#${p.slug}` }],
      image: {
        src: p.image.src,
        width: p.image.width,
        height: p.image.height,
        alt: `${p.name}, ${p.location}`,
        position: pick.position,
      },
    },
  ];
});

/** Projects hero, built like the home hero: four landmarks, one stage each, pinned on wide screens. */
export function ProjectsHero() {
  return (
    <StageHero
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
      listLabel="Four landmark projects"
      figureLabel="The production firm of TXG, KSA"
      hintTouch="Tap a project"
      hintScroll="Scroll through the landmarks"
      stages={stages}
    />
  );
}
