/**
 * The four nested pathways of the SBT symbol (Brand Guidelines p.2).
 * The site's information architecture is organised by them.
 */

export type PathwayId =
  "foundation" | "precision" | "digital-layer" | "integration";

export interface Pathway {
  id: PathwayId;
  name: string;
  meaning: string;
  description: string;
  /** Logo part used to draw this pathway's fragment */
  logoPart: "foundation" | "precision" | "digital" | "integration";
  order: number;
}

export const pathways: Pathway[] = [
  {
    id: "foundation",
    name: "Foundation",
    meaning: "Build / structure",
    description:
      "Models and simulations for the physical environments we help deliver.",
    logoPart: "foundation",
    order: 1,
  },
  {
    id: "precision",
    name: "Precision",
    meaning: "Scan / capture",
    description:
      "Accurate capture of what was actually built, and every asset inside it.",
    logoPart: "precision",
    order: 2,
  },
  {
    id: "digital-layer",
    name: "Digital layer",
    meaning: "Data / twin",
    description:
      "The digital model layered over the built world, from one room to a city.",
    logoPart: "digital",
    order: 3,
  },
  {
    id: "integration",
    name: "Integration",
    meaning: "Systems / people",
    description: "The platforms and software that bring operations together.",
    logoPart: "integration",
    order: 4,
  },
];

export const pathwayById = (id: PathwayId) => {
  const p = pathways.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown pathway: ${id}`);
  return p;
};
