/** Shared description of the hero building, used by both the 3D scene and the SVG fallback. */

export const B = {
  /** width (x) and depth (z) of each floor plate, in world units */
  W: 3.6,
  D: 2.8,
  /** floor to floor, slab thickness, number of floors */
  H: 1.05,
  T: 0.16,
  FLOORS: 4,
} as const;

export const COLOURS = {
  navy: "#0C1446",
  cobalt: "#1D6BF3",
  sky: "#7CC0FA",
  orange: "#FF5200",
  paper: "#F8FAFD",
} as const;

export type ActiveLayer = "all" | 0 | 1 | 2 | 3;

/**
 * The four layers of work. The labels and service phrases double as the page's
 * main search anchors: BIM modelling, scan to BIM, digital twin, asset data and CAFM.
 */
export const LAYERS = [
  {
    key: "model",
    label: "Model",
    phrase: "BIM modelling",
    pathway: "Foundation",
    colour: COLOURS.navy,
    text: "Architecture, structure and MEP in one coordinated BIM model, so clashes are found on a screen before anything is built.",
    service: "BIM in design",
    href: "/services/bim",
  },
  {
    key: "scan",
    label: "Scan",
    phrase: "Scan to BIM",
    pathway: "Precision",
    colour: COLOURS.sky,
    text: "Laser scans of the building as built, turned into an accurate as-built BIM model and checked against the design.",
    service: "Reality capture and scan to BIM",
    href: "/services/reality-capture",
  },
  {
    key: "connect",
    label: "Connect",
    phrase: "Digital twin",
    pathway: "Digital layer",
    colour: COLOURS.cobalt,
    text: "The model linked to sensors and building systems, so it stays a live digital twin after handover.",
    service: "Digital twin and smart buildings",
    href: "/services/digital-twin",
  },
  {
    key: "handover",
    label: "Hand over",
    phrase: "Asset data and CAFM",
    pathway: "Integration",
    colour: COLOURS.orange,
    text: "Every asset tagged and loaded into your CAFM or CMMS, so your team starts on day one with clean data.",
    service: "Asset management systems",
    href: "/services/asset-management",
  },
] as const;
