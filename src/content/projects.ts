import type { ServiceSlug } from "./services";

/**
 * Group track record (PLAN.md §1 #2). Source: txgksa.com/projects, crawled 10 Nov 2026.
 * Sectors are proposed and need confirming. Image sizes are the originals
 * served by TXG; several are low resolution and should be replaced.
 */

export type Sector =
  | "Airports"
  | "Mixed use"
  | "Hospitals"
  | "Hotels"
  | "Commercial"
  | "Infrastructure"
  | "Industrial"
  | "Government";

export type Country = "KSA" | "Australia";

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  name: string;
  client: string;
  location: string;
  country: Country;
  sector: Sector;
  services: ServiceSlug[];
  scope: string[];
  image: ProjectImage;
  /** Every project is shown as associated with TXG KSA, whose track record Smart Built carries. */
  deliveredBy: "TXG KSA";
  featured?: boolean;
}

const img = (file: string, width: number, height: number): ProjectImage => ({
  src: `/assets/projects/${file}`,
  width,
  height,
});

const STOWE_SCOPE = [
  "Lighting and small power layouts",
  "Containment layouts, coordinated with MEP, architectural and structural services",
  "Security and communications layouts",
  "Trimble file extraction",
  "Revizto exports for coordination",
];

export const projects: Project[] = [
  {
    slug: "neom-bay-airport-t1-t2",
    name: "NEOM Bay Airport T1 T2",
    client: "NEOM",
    location: "NEOM, KSA",
    country: "KSA",
    sector: "Airports",
    services: ["bim"],
    scope: [
      "Digital delivery partner",
      "BIM development for structure, architecture, interiors, MEP, ELV and SAS",
      "Systems modelled to LOD 300, 350, 400 and 500",
    ],
    image: img("neom-bay-airport-t1-t2.jpg", 572, 586),
    deliveredBy: "TXG KSA",
    featured: true,
  },
  {
    slug: "king-abdullah-financial-district",
    name: "King Abdullah Financial District",
    client: "KAFD",
    location: "Riyadh, KSA",
    country: "KSA",
    sector: "Mixed use",
    services: ["digital-twin", "bim", "asset-management"],
    scope: ["Digital twin implementation", "Operational BIM development", "Asset information model"],
    image: img("king-abdullah-financial-district.webp", 1247, 935),
    deliveredBy: "TXG KSA",
    featured: true,
  },
  {
    slug: "sports-boulevard",
    name: "Sports Boulevard",
    client: "Sports Boulevard Foundation",
    location: "Riyadh, KSA",
    country: "KSA",
    sector: "Infrastructure",
    services: ["asset-management", "bim"],
    scope: [
      "As-built asset information modelling",
      "Assessment reports on received inputs",
      "LOD 500 asset information models (eLOD 300 + iLOD 500)",
      "Asset register and COBie extraction",
      "Asset information layouts extracted from the model",
    ],
    image: img("sports-boulevard.webp", 572, 586),
    deliveredBy: "TXG KSA",
    featured: true,
  },
  {
    slug: "riyadh-metro",
    name: "Riyadh Metro",
    client: "High Commission for the Development of Ar-Riyadh",
    location: "Riyadh, KSA",
    country: "KSA",
    sector: "Infrastructure",
    services: ["bim"],
    scope: ["BIM model development", "Construction documents", "ELV shop drawings"],
    image: img("riyadh-metro.webp", 1247, 935),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "neom-oxagon",
    name: "NEOM Oxagon",
    client: "Samsung C&T",
    location: "NEOM Oxagon, KSA",
    country: "KSA",
    sector: "Industrial",
    services: ["bim"],
    scope: [
      "Senior electrical draughtsman deployed on site",
      "Electrical shop drawings for a 246,186 m² modular factory",
    ],
    image: img("neom-oxagon.jpg", 293, 300),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "shura-hc1-the-tail-marsa-village",
    name: "Shura HC-1, The Tail, Marsa Village",
    client: "Red Sea Global and ICAD (ELV contractor)",
    location: "Shura Island, KSA",
    country: "KSA",
    sector: "Hotels",
    services: ["bim"],
    scope: [
      "ELV systems BIM to LOD 400",
      "ELV shop drawings to LOD 400 / D05",
      "On-site project coordinator",
    ],
    image: img("shura-hc1-the-tail-marsa-village.jpg", 293, 300),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "al-nahda-entertainment-complex",
    name: "Al Nahda Entertainment Complex, Exit 15",
    client: "Seven Entertainment Ventures",
    location: "Riyadh, KSA",
    country: "KSA",
    sector: "Commercial",
    services: ["bim"],
    scope: ["BIM professionals staffing"],
    image: img("al-nahda-entertainment-complex.webp", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "melbourne-airport",
    name: "Melbourne Airport",
    client: "Stowe",
    location: "Melbourne, Australia",
    country: "Australia",
    sector: "Airports",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("melbourne-airport.webp", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "chadstone-shopping-centre",
    name: "Chadstone Shopping Centre",
    client: "Stowe",
    location: "Melbourne, Australia",
    country: "Australia",
    sector: "Commercial",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("chadstone-shopping-center.webp", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "banksia-csl",
    name: "Banksia CSL",
    client: "Stowe",
    location: "Melbourne, Australia",
    country: "Australia",
    sector: "Industrial",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("banksia-csl.webp", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "thomas-embling-hospital",
    name: "Thomas Embling Hospital",
    client: "Stowe",
    location: "Melbourne, Australia",
    country: "Australia",
    sector: "Hospitals",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("thomas-embling-hospital.webp", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "microsoft-data-center-mel07",
    name: "Microsoft Data Centre MEL07",
    client: "Stowe",
    location: "Melbourne, Australia",
    country: "Australia",
    sector: "Industrial",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("microsoft-data-center-mel07.webp", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "geelong-convention-and-event-centre",
    name: "Geelong Convention and Event Centre",
    client: "Stowe",
    location: "Geelong, Australia",
    country: "Australia",
    sector: "Commercial",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("geelong-convention-event-center.webp", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "airtrunk-shell-hjkl",
    name: "AirTrunk Shell (H, J, K, L)",
    client: "Stowe",
    location: "Melbourne, Australia",
    country: "Australia",
    sector: "Industrial",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("airtrunk-shell-hjkl.webp", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "king-salman-park",
    name: "King Salman Park",
    client: "MBL",
    location: "Riyadh, KSA",
    country: "KSA",
    sector: "Government",
    services: ["bim"],
    scope: ["Tendering support"],
    image: img("king-salman-park.webp", 1247, 935),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "jeddah-tower",
    name: "Jeddah Tower",
    client: "Saudi Binladin Group",
    location: "Jeddah, KSA",
    country: "KSA",
    sector: "Mixed use",
    services: ["4d-simulation", "bim"],
    scope: ["4D construction simulation", "3D space coordination"],
    image: img("jeddah-tower.jpg", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "hegra-boutique-hotel",
    name: "Hegra Boutique Hotel (UNESCO site)",
    client: "Gioforma",
    location: "AlUla, KSA",
    country: "KSA",
    sector: "Hotels",
    services: ["bim"],
    scope: ["BIM conversion", "ArchiCAD to Revit conversion of all architectural drawings"],
    image: img("hegra-boutique-hotel.webp", 1247, 935),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "king-abdulaziz-international-airport",
    name: "King Abdulaziz International Airport",
    client: "GACA",
    location: "Jeddah, KSA",
    country: "KSA",
    sector: "Airports",
    services: ["bim", "it-services"],
    scope: [
      "Engineering support",
      "Site coordination",
      "Project close-out documentation",
      "Master system integration",
      "CAD standardisation",
    ],
    image: img("king-abdulaziz-international-airport.webp", 1247, 935),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "tadawul-tower",
    name: "Tadawul Tower",
    client: "Samsung CCE JV",
    location: "KAFD, Riyadh, KSA",
    country: "KSA",
    sector: "Commercial",
    services: ["bim"],
    scope: [
      "BIM modelling of architecture, structure, interiors and MEP",
      "Clash detection and multi-trade coordination",
      "Fully coordinated, clash-free consolidated 3D model",
      "BIM site coordination",
      "2D drawings extracted from the model for CSD production",
    ],
    image: img("tadawul-tower.webp", 1247, 935),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "al-moosa-rehabilitation-hospital",
    name: "Al Moosa Rehabilitation and Long-term Care Hospital",
    client: "Al Moosa Hospital",
    location: "Al Ahsa, KSA",
    country: "KSA",
    sector: "Hospitals",
    services: ["bim"],
    scope: [
      "BIM modelling of architecture, structure, interiors and MEP",
      "Clash detection and multi-trade coordination",
      "Fully coordinated, clash-free consolidated 3D model",
      "BIM site coordination",
      "2D drawings extracted from the model for CSD production",
    ],
    image: img("al-moosa-rehabilitation-hospital.jpg", 572, 586),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "six-senses-hotel-wadi-safar",
    name: "Six Senses Hotel, Wadi Safar",
    client: "Diriyah Company (BUJV: Albawani and UCC JV)",
    location: "Diriyah, KSA",
    country: "KSA",
    sector: "Hotels",
    services: ["bim", "4d-simulation", "immersive-solutions"],
    scope: [
      "BIM model preparation: documents, CDE, 4D and 5D, VR and other deliverables",
      "LOD 400 and LOD 500 modelling",
    ],
    image: img("six-senses-hotel-wadi-safar.jpg", 1691, 951),
    deliveredBy: "TXG KSA",
  },
  {
    slug: "jeddah-opera-house",
    name: "Jeddah Opera House",
    client: "Jeddah Central Development Company",
    location: "Jeddah, KSA",
    country: "KSA",
    sector: "Government",
    services: ["reality-capture"],
    scope: ["LiDAR scanning"],
    image: img("jeddah-opera-house.jpg", 1500, 1000),
    deliveredBy: "TXG KSA",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectsForService = (slug: ServiceSlug) =>
  projects.filter((p) => p.services.includes(slug));

export const sectors: Sector[] = [
  "Airports",
  "Mixed use",
  "Hospitals",
  "Hotels",
  "Commercial",
  "Infrastructure",
  "Industrial",
  "Government",
];
