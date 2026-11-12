import type { ServiceSlug } from "@/content/services";

/**
 * A photograph for each service, shown beside the list. Each is chosen to show the
 * work itself. Asset management and CAFM share one photograph until a separate one
 * is supplied; `position` crops it differently so the two do not look identical.
 */
export const SERVICE_PHOTO: Record<
  ServiceSlug,
  {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
    position?: string;
  }
> = {
  bim: {
    src: "/assets/services/bim.jpg",
    width: 2000,
    height: 1333,
    alt: "Two BIM coordinators reviewing a federated building model on screen",
    caption: "Coordinating the BIM model",
  },
  "4d-simulation": {
    src: "/assets/services/digital-twin.jpg",
    width: 1024,
    height: 559,
    alt: "A site engineer checking the construction programme against the model on a tablet, with a building rising behind",
    caption: "Programme checked against the model",
  },
  "reality-capture": {
    src: "/assets/services/reality-capture.jpg",
    width: 2000,
    height: 1333,
    alt: "A surveyor setting up a total station to capture an existing site",
    caption: "Survey and scan on site",
  },
  "digital-twin": {
    src: "/assets/services/cafm.jpg",
    width: 1024,
    height: 608,
    alt: "A facilities engineer with a tablet showing live building data over a campus",
    caption: "Live data on the building model",
  },
  "gis-smart-cities": {
    src: "/assets/services/gis-smart-cities.jpg",
    width: 1024,
    height: 551,
    alt: "A city at dusk with glowing data connections between buildings",
    caption: "Building data across a city",
  },
  "immersive-solutions": {
    src: "/assets/misc/hero-architecture.webp",
    width: 2400,
    height: 1432,
    alt: "A 3D model of a room held over architectural drawings",
    caption: "From drawing to walk-through model",
  },
  "asset-management": {
    src: "/assets/services/asset-management.png",
    width: 1024,
    height: 682,
    alt: "A technician scanning an asset tag in a server room",
    caption: "Assets tagged and scanned",
  },
  cafm: {
    src: "/assets/services/asset-management.png",
    width: 1024,
    height: 682,
    alt: "A technician with a handheld device checking an asset register",
    caption: "The asset register in use",
    position: "20% 30%",
  },
  "it-services": {
    src: "/assets/services/it-services.jpg",
    width: 1024,
    height: 574,
    alt: "An engineer using a touch interface of cloud, security and analytics tools",
    caption: "Software and integration",
  },
};
