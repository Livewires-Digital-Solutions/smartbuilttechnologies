import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { servicesIndexCopy } from "@/content/service-pages";

/** Services hero: the headline, the lede and the buttons beside one photograph. */
export function ServicesHero() {
  return (
    <PageHero
      id="services-hero-title"
      headerLabel="Smart Built Technologies · Services"
      kicker="Nine services · Four pathways"
      headline={[servicesIndexCopy.title]}
      lede={servicesIndexCopy.lede}
      actions={
        <>
          <ButtonLink href="/contact" variant="signal">
            Start a project
          </ButtonLink>
          <ButtonLink
            href="#all-services"
            variant="ghost"
            className="underline"
          >
            All services
          </ButtonLink>
        </>
      }
      figure={{
        src: "/assets/services/bim.jpg",
        width: 2000,
        height: 1333,
        alt: "Two BIM coordinators reviewing a federated building model on screen",
        chip: "Nine services",
        caption: "Coordinating the BIM model",
      }}
    />
  );
}
