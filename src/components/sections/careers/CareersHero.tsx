import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";

/** Careers hero: the headline, the lede and the buttons beside one photograph. */
export function CareersHero() {
  return (
    <PageHero
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
      figure={{
        src: "/assets/services/bim.jpg",
        width: 2000,
        height: 1333,
        alt: "Two BIM coordinators reviewing a federated building model on screen",
        chip: "Now hiring",
        caption: "Coordinating the federated model",
      }}
    />
  );
}
