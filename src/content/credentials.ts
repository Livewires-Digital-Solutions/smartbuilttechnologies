/** Clients and technology partners (source: txgksa.com). */

export interface Logo {
  name: string;
  src: string;
}

const client = (file: string, name: string): Logo => ({
  name,
  src: `/assets/clients/${file}.png`,
});
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
