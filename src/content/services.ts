import type { BrandIconName } from "@/components/brand/icon-data";
import type { PathwayId } from "./pathways";

/**
 * Service index data. Full page content (definition, approach, deliverables,
 * process, FAQs) is added per service in Phase 3.
 */

export type ServiceSlug =
  | "bim"
  | "4d-simulation"
  | "reality-capture"
  | "asset-management"
  | "cafm"
  | "it-services"
  | "digital-twin"
  | "gis-smart-cities"
  | "immersive-solutions";

export interface ServiceSummary {
  slug: ServiceSlug;
  pathway: PathwayId;
  order: number;
  title: string;
  /** Used in menus where space is tight */
  shortTitle: string;
  summary: string;
  icon: BrandIconName;
}

export const services: ServiceSummary[] = [
  {
    slug: "bim",
    pathway: "foundation",
    order: 1,
    title: "BIM in design",
    shortTitle: "BIM in design",
    summary:
      "Coordinated, multi-discipline models from concept to LOD 500, delivered to ISO 19650.",
    icon: "bim-model",
  },
  {
    slug: "4d-simulation",
    pathway: "foundation",
    order: 2,
    title: "4D construction and logistics simulation",
    shortTitle: "4D simulation",
    summary:
      "The model linked to the programme, so sequence, logistics and clashes in time are seen before site.",
    icon: "schedule",
  },
  {
    slug: "reality-capture",
    pathway: "precision",
    order: 3,
    title: "Reality capture and scan to BIM",
    shortTitle: "Reality capture",
    summary:
      "LiDAR scanning and point-cloud processing, modelled to the detail the project actually needs.",
    icon: "scan",
  },
  {
    slug: "digital-twin",
    pathway: "digital-layer",
    order: 4,
    title: "Digital twin and smart buildings",
    shortTitle: "Digital twin",
    summary:
      "A live model of the building, connected to BMS and IoT data for monitoring and maintenance.",
    icon: "digital-twin",
  },
  {
    slug: "gis-smart-cities",
    pathway: "digital-layer",
    order: 5,
    title: "GIS integration and smart cities",
    shortTitle: "GIS and smart cities",
    summary:
      "Building data placed in geographic context, from one site to a whole district.",
    icon: "site",
  },
  {
    slug: "immersive-solutions",
    pathway: "digital-layer",
    order: 6,
    title: "Immersive solutions (AR / VR / XR)",
    shortTitle: "AR / VR / XR",
    summary:
      "Walk through the model at full scale, or overlay it on site, before decisions are fixed.",
    icon: "layers",
  },
  {
    slug: "asset-management",
    pathway: "integration",
    order: 7,
    title: "Asset management systems",
    shortTitle: "Asset management",
    summary:
      "CAFM and CMMS platforms fed with clean BIM and asset data, ready on the day of handover.",
    icon: "data",
  },
  {
    slug: "cafm",
    pathway: "integration",
    order: 8,
    title: "CAFM implementation",
    shortTitle: "CAFM",
    summary:
      "Facility management software configured around how your team actually runs the building.",
    icon: "building",
  },
  {
    slug: "it-services",
    pathway: "integration",
    order: 9,
    title: "IT services and infrastructure",
    shortTitle: "IT services",
    summary:
      "Web, mobile and integration software for engineering, construction and facilities teams.",
    icon: "cloud",
  },
];

export const serviceBySlug = (slug: ServiceSlug) => {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service: ${slug}`);
  return s;
};

export const servicesByPathway = (pathway: PathwayId) =>
  services
    .filter((s) => s.pathway === pathway)
    .sort((a, b) => a.order - b.order);

/** Asset tagging lives as a section of asset-management but is listed under Precision. */
export const assetTaggingLink = {
  title: "Asset tagging",
  href: "/services/asset-management#asset-tagging",
  summary:
    "QR, barcode and RFID tagging that links every physical asset to its digital record.",
  icon: "report" as BrandIconName,
};
