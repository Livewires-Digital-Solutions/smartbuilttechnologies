import { StageHero, type HeroStage } from "@/components/sections/StageHero";
import { ButtonLink } from "@/components/ui/Button";
import { pathways, PATHWAY_COLOUR, type PathwayId } from "@/content/pathways";
import { servicesIndexCopy } from "@/content/service-pages";
import { assetTaggingLink, servicesByPathway } from "@/content/services";

const PHOTO: Record<
  PathwayId,
  { src: string; width: number; height: number; alt: string; position?: string; caption: string }
> = {
  foundation: {
    src: "/assets/services/bim.jpg",
    width: 2000,
    height: 1333,
    alt: "Two BIM coordinators reviewing a federated building model on screen",
    caption: "Coordinating the BIM model",
  },
  precision: {
    src: "/assets/services/reality-capture.jpg",
    width: 2000,
    height: 1333,
    alt: "A surveyor setting up a total station to capture an existing site",
    caption: "Survey and scan on site",
  },
  "digital-layer": {
    src: "/assets/services/gis-smart-cities.jpg",
    width: 1024,
    height: 551,
    alt: "A city at dusk with glowing data connections between buildings",
    caption: "Building data across a city",
  },
  integration: {
    src: "/assets/services/asset-management.png",
    width: 1024,
    height: 682,
    alt: "A technician scanning an asset tag in a server room",
    caption: "Assets tagged and scanned",
  },
};

const stages: HeroStage[] = [...pathways]
  .sort((a, b) => a.order - b.order)
  .map((p) => {
    const photo = PHOTO[p.id];
    const links = servicesByPathway(p.id).map((s) => ({
      label: s.shortTitle,
      href: `/services/${s.slug}`,
    }));
    if (p.id === "precision") {
      links.push({ label: assetTaggingLink.title, href: assetTaggingLink.href });
    }
    return {
      label: p.name,
      phrase: p.meaning,
      colour: PATHWAY_COLOUR[p.id],
      chip: `0${p.order} · ${p.name}`,
      caption: photo.caption,
      text: p.description,
      links,
      image: {
        src: photo.src,
        width: photo.width,
        height: photo.height,
        alt: photo.alt,
        position: photo.position,
      },
    };
  });

/** Services hero, built like the home hero: one stage for each of the four pathways. */
export function ServicesHero() {
  return (
    <StageHero
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
          <ButtonLink href="#all-services" variant="ghost" className="underline">
            All services
          </ButtonLink>
        </>
      }
      listLabel="The four pathways"
      figureLabel="The production firm of TXG, KSA"
      hintTouch="Tap a pathway"
      hintScroll="Scroll through the pathways"
      stages={stages}
    />
  );
}
