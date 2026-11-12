import { site } from "./site";
import type { ServiceSlug } from "./services";

/**
 * Group track record (PLAN.md §1 #2). Source: txgksa.com/projects, crawled 10 Nov 2026.
 * Sectors are proposed and need confirming. Image sizes are the originals
 * served by TXG; several are low resolution and should be replaced.
 * Client, location and scope are the group's own wording from txgksa.com/projects
 * (crawled 12 Nov 2026); sectors are ours.
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
  /** Every project is shown as associated with Technical Xperts Group (TXG) - Saudi Arabia, whose track record Smart Built carries. */
  deliveredBy: typeof site.groupLabel;
  featured?: boolean;
}

const img = (file: string, width: number, height: number): ProjectImage => ({
  src: `/assets/projects/${file}`,
  width,
  height,
});

const STOWE_SCOPE = [
  "Development of Lighting layout and small power layout.",
  "Creating containment layout and coordination with MEP, Architectural and Structural services.",
  "Creating security and communication layout.",
  "Extraction of Trimble files.",
  "Exporting Revizto files for coordination.",
];

export const projects: Project[] = [
  {
    slug: "neom-bay-airport-t1-t2",
    name: "NEOM Bay Airport T1 T2",
    client: "Neom",
    location: "Neom, KSA",
    country: "KSA",
    sector: "Airports",
    services: ["bim"],
    scope: [
      "Digital Delivery Partner",
      "BIM Development services for Structure, Architecture, Interior, MEP, ELV & SAS.",
      "Systems to the stage of LOD 300, 350, 400 & 500",
    ],
    image: img("neom-bay-airport-t1-t2.jpg", 572, 586),
    deliveredBy: site.groupLabel,
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
    scope: [
      "Digital Twin Implementation",
      "Operational BIM Development",
      "Asset Information Model",
    ],
    image: img("king-abdullah-financial-district.webp", 1247, 935),
    deliveredBy: site.groupLabel,
    featured: true,
  },
  {
    slug: "sports-boulevard",
    name: "Sports Boulevard",
    client: "Sports Boulevard Federation",
    location: "Riyadh, KSA",
    country: "KSA",
    sector: "Infrastructure",
    services: ["asset-management", "bim"],
    scope: [
      "As-Built Asset Information BIM Modeling Services",
      "Preparation of Assessment Reports on the inputs received",
      "Preparation of LOD 500 (eLOD 300 + iLOD 500) Asset Information Models",
      "Asset Register & COBie Extraction",
      "Extraction of Asset Information Layouts from the BIM Model",
    ],
    image: img("sports-boulevard.webp", 572, 586),
    deliveredBy: site.groupLabel,
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
    scope: [
      "BIM Model Development",
      "Construction Document",
      "ELV Shop Drawings",
    ],
    image: img("riyadh-metro.webp", 1247, 935),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "neom-oxagon",
    name: "NEOM Oxagon",
    client: "Samsung C&T",
    location: "Neom Oxagon site, Saudi Arabia",
    country: "KSA",
    sector: "Industrial",
    services: ["bim"],
    scope: [
      "Onsite deployment of a senior electrical draftsman",
      "Creation of electrical shop drawings from design inputs of the modular factory, covering a 246,186 SQM area",
    ],
    image: img("neom-oxagon.jpg", 293, 300),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "shura-hc1-the-tail-marsa-village",
    name: "Shura HC-1 The Tail Marsa Village",
    client: "Red Sea Global & ELV Contractor ICAD",
    location: "Shura Island, Saudi Arabia",
    country: "KSA",
    sector: "Hotels",
    services: ["bim"],
    scope: [
      "ELV Systems BIM LOD 400 Implementation & Development and Shop drawings.",
      "Develop the ELV systems Shop drawings to the stage of LOD 400 / D05.",
      "Deployment of Onsite project coordinator",
    ],
    image: img("shura-hc1-the-tail-marsa-village.jpg", 293, 300),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "al-nahda-entertainment-complex",
    name: "Al Nahda Entertainment Complex, Exit 15",
    client: "Seven Entertainments",
    location: "Riyadh, KSA",
    country: "KSA",
    sector: "Commercial",
    services: ["bim"],
    scope: ["BIM professionals staffing services"],
    image: img("al-nahda-entertainment-complex.webp", 572, 586),
    deliveredBy: site.groupLabel,
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
    deliveredBy: site.groupLabel,
  },
  {
    slug: "chadstone-shopping-centre",
    name: "Chadstone Shopping Center",
    client: "Stowe",
    location: "Melbourne, Australia",
    country: "Australia",
    sector: "Commercial",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("chadstone-shopping-center.webp", 572, 586),
    deliveredBy: site.groupLabel,
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
    deliveredBy: site.groupLabel,
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
    deliveredBy: site.groupLabel,
  },
  {
    slug: "microsoft-data-center-mel07",
    name: "Microsoft Data Center MEL07",
    client: "Stowe",
    location: "Melbourne, Australia",
    country: "Australia",
    sector: "Industrial",
    services: ["bim"],
    scope: STOWE_SCOPE,
    image: img("microsoft-data-center-mel07.webp", 572, 586),
    deliveredBy: site.groupLabel,
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
    deliveredBy: site.groupLabel,
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
    deliveredBy: site.groupLabel,
  },
  {
    slug: "king-salman-park",
    name: "King Salman Park",
    client: "MBL",
    location: "Riyadh, KSA",
    country: "KSA",
    sector: "Government",
    services: ["bim"],
    scope: ["Tendering Support"],
    image: img("king-salman-park.webp", 1247, 935),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "jeddah-tower",
    name: "Jeddah Tower",
    client: "Saudi Bin Ladin Group",
    location: "Jeddah, KSA",
    country: "KSA",
    sector: "Mixed use",
    services: ["4d-simulation", "bim"],
    scope: ["4D Construction Simulation", "3D Space Coordination"],
    image: img("jeddah-tower.jpg", 572, 586),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "hegra-boutique-hotel",
    name: "Hegra Boutique Hotel (UNESCO Approved Building)",
    client: "Gioforma",
    location: "Al Ula, KSA",
    country: "KSA",
    sector: "Hotels",
    services: ["bim"],
    scope: [
      "BIM Conversion",
      "ArchiCAD to Revit Conversion of all Architecture Drawings",
    ],
    image: img("hegra-boutique-hotel.webp", 1247, 935),
    deliveredBy: site.groupLabel,
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
      "Engineering Support",
      "Site Coordination",
      "Project Close-out Documentation",
      "Master System Integration",
      "CAD standardization",
    ],
    image: img("king-abdulaziz-international-airport.webp", 1247, 935),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "tadawul-tower",
    name: "Tadawul Tower",
    client: "Samsung CCE JV",
    location: "King Abdullah Financial District Riyadh, KSA",
    country: "KSA",
    sector: "Commercial",
    services: ["bim"],
    scope: [
      "BIM Modelling of Architecture, Structure, Interior and MEP",
      "Carrying out Clash Detection and Multitrade Coordination",
      "Production of Fully Coordinated Clash-Free Consolidated 3D Model",
      "BIM Site Coordination",
      "Extraction of 2D Drawings from 3D Model for the Production of CSD",
    ],
    image: img("tadawul-tower.webp", 1247, 935),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "al-moosa-rehabilitation-hospital",
    name: "Al Moosa Rehabilitation & Long-Term Care Hospital",
    client: "Al Moosa Hospital",
    location: "Al Ahsa, KSA",
    country: "KSA",
    sector: "Hospitals",
    services: ["bim"],
    scope: [
      "BIM Modelling of Architecture, Structure, Interior and MEP",
      "Carrying out Clash Detection and Multitrade Coordination",
      "Production of Fully Coordinated Clash-Free Consolidated 3D Model",
      "BIM Site Coordination",
      "Extraction of 2D Drawings from 3D Model for the Production of CSD",
    ],
    image: img("al-moosa-rehabilitation-hospital.jpg", 572, 586),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "six-senses-hotel-wadi-safar",
    name: "Six Senses Hotel - Wadi Safar",
    client: "Diriyah Company (BUJV; Albawani and UCC JV)",
    location: "Diriyah, KSA",
    country: "KSA",
    sector: "Hotels",
    services: ["bim", "4d-simulation", "immersive-solutions"],
    scope: [
      "BIM Model Preparation (Documents, CDE, 4D and 5D, VR and other BIM deliverables)",
      "LOD 400 and LOD 500 Modeling",
    ],
    image: img("six-senses-hotel-wadi-safar.jpg", 1691, 951),
    deliveredBy: site.groupLabel,
  },
  {
    slug: "jeddah-opera-house",
    name: "Jeddah Opera House",
    client: "Jeddah Central Development Company",
    location: "Jeddah, KSA",
    country: "KSA",
    sector: "Government",
    services: ["reality-capture"],
    scope: ["LiDAR Scanning Services"],
    image: img("jeddah-opera-house.jpg", 1500, 1000),
    deliveredBy: site.groupLabel,
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
