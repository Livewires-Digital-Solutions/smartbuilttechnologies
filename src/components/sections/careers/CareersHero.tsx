import { StageHero, type HeroStage } from "@/components/sections/StageHero";
import { ButtonLink } from "@/components/ui/Button";
import { roleFamilies } from "@/content/careers";

const stages: HeroStage[] = [
  {
    label: roleFamilies[0].title,
    phrase: "Design",
    colour: "var(--color-navy)",
    chip: "Now hiring",
    caption: "Modelling the building",
    text: roleFamilies[0].line,
    links: [{ label: "See open positions", href: "#openings" }],
    image: {
      src: "/assets/misc/hero-architecture.webp",
      width: 2400,
      height: 1432,
      alt: "A 3D model of a room held over architectural drawings",
      position: "55% 40%",
    },
  },
  {
    label: roleFamilies[1].title,
    phrase: "Projects",
    colour: "var(--color-cobalt)",
    chip: "Now hiring",
    caption: "Checking the programme against the model",
    text: roleFamilies[1].line,
    links: [{ label: "See open positions", href: "#openings" }],
    image: {
      src: "/assets/services/digital-twin.jpg",
      width: 1024,
      height: 559,
      alt: "A site engineer checking the construction programme against the model on a tablet, with a building rising behind",
    },
  },
  {
    label: roleFamilies[2].title,
    phrase: "Disciplines",
    colour: "var(--color-orange)",
    chip: "Now hiring",
    caption: "Coordinating the federated model",
    text: roleFamilies[2].line,
    links: [{ label: "Apply now", href: "#apply" }],
    image: {
      src: "/assets/services/bim.jpg",
      width: 2000,
      height: 1333,
      alt: "Two BIM coordinators reviewing a federated building model on screen",
    },
  },
];

/** Careers hero, built like the home hero: the three role families, one stage each, pinned on wide screens. */
export function CareersHero() {
  return (
    <StageHero
      id="careers-hero-title"
      headerLabel="Smart Built Technologies · Careers"
      kicker="Hiring in India and the Middle East"
      headline={["Careers"]}
      lede="We are hiring BIM Modellers, BIM Engineers, Team Leaders, and BIM Coordinators (all discipline) for our new projects. Locations will be in India and Middle East."
      actions={
        <>
          <ButtonLink href="#openings" variant="signal" icon="arrow-down">
            Open positions
          </ButtonLink>
          <ButtonLink href="#apply" variant="ghost" className="underline">
            Apply now
          </ButtonLink>
        </>
      }
      listLabel="The roles we are hiring for"
      figureLabel="The production firm of TXG, KSA"
      hintTouch="Tap a role"
      hintScroll="Scroll through the roles"
      stages={stages}
    />
  );
}
