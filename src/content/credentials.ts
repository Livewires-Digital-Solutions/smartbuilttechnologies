/** Clients, technology partners and accreditations (source: txgksa.com). */

export interface Logo {
  name: string;
  src: string;
}

const client = (file: string, name: string): Logo => ({ name, src: `/assets/clients/${file}.png` });
const partner = (n: number, name: string): Logo => ({
  name,
  src: `/assets/partners/partner-${String(n).padStart(2, "0")}.png`,
});

export const clients: Logo[] = [
  client("neom", "NEOM"),
  client("kafd", "King Abdullah Financial District"),
  client("red-sea-global", "Red Sea Global"),
  client("samsung", "Samsung C&T"),
  client("sp", "Shapoorji Pallonji"),
  client("nesma", "Nesma & Partners"),
  client("sevens", "Seven Entertainment Ventures"),
  client("jeddah-central", "Jeddah Central Development Company"),
  client("al-bhawani", "Al Bawani"),
  client("mbl", "Modern Building Leaders"),
  client("midad", "MIDAD Real Estate"),
  client("huta", "HUTA Group"),
  client("hatco", "HATCO Trading & Contracting"),
  client("cce", "Contracting & Construction Enterprises"),
  client("al-moosa", "Almoosa Specialist Hospital"),
  client("icad", "ICAD"),
  client("ifas", "iFAS"),
  client("baumat", "Baumat"),
  client("first-fix", "First Fix"),
  /** CONFIRM — logo is an "R" emblem; TXG labels it "RSG" */
  client("rsg", "RSG"),
];

export const partners: Logo[] = [
  partner(4, "Autodesk"),
  partner(3, "Bentley Systems"),
  partner(5, "Trimble"),
  partner(9, "Leica Geosystems"),
  partner(2, "Esri"),
  partner(11, "IBM Maximo"),
  partner(1, "EcoDomus"),
  partner(8, "YouBIM"),
  partner(7, "BEXEL"),
  partner(10, "Unity"),
  partner(6, "Meta"),
];

export type AccreditationCategory = "iso" | "government" | "regulatory";

export interface Accreditation {
  id: string;
  title: string;
  standard: string;
  scope: string;
  category: AccreditationCategory;
  image?: { src: string; width: number; height: number };
}

/** TXG lists 15 (5 per category); only the four ISO certificates are published. */
export const accreditations: Accreditation[] = [
  {
    id: "iso-19650-1",
    title: "ISO 19650-1:2018",
    standard: "Organisation and digitisation of information about buildings — concepts and principles",
    scope: "Information management using BIM",
    category: "iso",
    image: { src: "/assets/certificates/iso-19650-1.png", width: 960, height: 1396 },
  },
  {
    id: "iso-19650-2",
    title: "ISO 19650-2:2018",
    standard: "Information management during the delivery phase of assets",
    scope: "BIM delivery phase",
    category: "iso",
    image: { src: "/assets/certificates/iso-19650-2.png", width: 473, height: 688 },
  },
  {
    id: "iso-9001",
    title: "ISO 9001:2015",
    standard: "Quality management systems",
    scope: "Quality management",
    category: "iso",
    image: { src: "/assets/certificates/iso-9001.png", width: 495, height: 691 },
  },
  {
    id: "iso-14001",
    title: "ISO 14001:2015",
    standard: "Environmental management systems",
    scope: "Environmental management",
    category: "iso",
    image: { src: "/assets/certificates/iso-14001.png", width: 495, height: 691 },
  },
];

export const accreditationCategories: { id: AccreditationCategory | "all"; label: string; total: number }[] = [
  { id: "all", label: "All", total: 15 },
  { id: "iso", label: "ISO standards", total: 5 },
  { id: "government", label: "Government and trade", total: 5 },
  { id: "regulatory", label: "Regulatory and compliance", total: 5 },
];
