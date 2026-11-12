/**
 * Home FAQ. Seven questions in the same themes as txgksa.com, rewritten for SBT.
 * Positioning follows the client's messaging brief (11 Nov 2026): Smart Built
 * Technologies is the production firm of Technical Xperts Group (TXG) - Saudi Arabia and carries its track
 * record; the Chennai office is newly opened, the company is not new. Plain strings
 * so the same text feeds both the accordion and FAQPage JSON-LD.
 */

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const homeFaqs: Faq[] = [
  {
    id: "what-we-do",
    question: "What does Smart Built Technologies do?",
    answer:
      "We provide BIM in design, 4D construction simulation, reality capture and scan to BIM, digital twins, GIS integration, immersive AR/VR/XR, asset management, CAFM implementation and IT services for engineering, construction and facilities teams. Our production teams are based in Chennai.",
  },
  {
    id: "part-of-txg",
    question:
      "Is Smart Built Technologies part of Technical Xperts Group (TXG) - Saudi Arabia?",
    answer:
      "Yes. Smart Built Technologies is the production firm of Technical Xperts Group (TXG) - Saudi Arabia, which was founded in Riyadh in 2014. Our newly opened production centre in Chennai expands the TXG portfolio to meet growing demand and operates under the TXG name, so its experience and track record are ours.",
  },
  {
    id: "what-is-bim",
    question: "What is BIM (Building Information Modelling)?",
    answer:
      "BIM is a digital representation of the physical and functional characteristics of a facility. We manage BIM from schematic design through to facility operations, producing coordinated models up to LOD 500 and delivering them to ISO 19650.",
  },
  {
    id: "iso-19650",
    question: "Do you work to ISO 19650?",
    answer:
      "Our BIM delivery follows ISO 19650, the international standard for managing information over the whole life of a built asset.",
  },
  {
    id: "vision-2030",
    question: "Do you support Saudi Vision 2030 projects?",
    answer:
      "Technical Xperts Group (TXG) - Saudi Arabia is an active BIM and digital construction partner on giga-projects in Saudi Arabia, including NEOM, Red Sea Global, Diriyah and the King Abdullah Financial District. Our Chennai production teams support these projects with modelling, coordination and digital delivery.",
  },
  {
    id: "where",
    question: "Where do you operate?",
    answer:
      "Technical Xperts Group (TXG) - Saudi Arabia is headquartered in Riyadh, with a group office in Sharjah (UAE). Our production centre is in Chennai. Projects have been delivered in Saudi Arabia and Australia, among other places.",
  },
  {
    id: "projects",
    question: "What major projects have you delivered?",
    answer:
      "Our experience comes from 22 landmark projects associated with Technical Xperts Group (TXG) - Saudi Arabia, including NEOM Bay Airport, King Abdullah Financial District, Sports Boulevard, Riyadh Metro, Jeddah Tower, Tadawul Tower and the Jeddah Opera House.",
  },
];

/** About-page FAQ: the questions a client asks when checking who is behind SBT. */
const pick = (ids: string[]) =>
  ids.map((id) => homeFaqs.find((f) => f.id === id)).filter((f): f is Faq => Boolean(f));

export const aboutFaqs: Faq[] = [
  ...pick(["part-of-txg"]),
  {
    id: "why-chennai",
    question: "Why was the Chennai production centre opened?",
    answer:
      "To meet growing demand. The Chennai production centre expands the Technical Xperts Group (TXG) - Saudi Arabia portfolio with more capacity for BIM, reality capture, digital twins and software, and it works under the TXG name.",
  },
  ...pick(["where", "projects"]),
];
