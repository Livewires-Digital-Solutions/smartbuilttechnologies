/**
 * Company facts. Values marked PLACEHOLDER must be confirmed before launch
 * (see PLAN.md §1).
 */

export interface Office {
  id: string;
  city: string;
  country: string;
  role: string;
  address: string[];
  mapUrl: string;
  primary?: boolean;
}

export const site = {
  name: "Smart Built Technologies",
  shortName: "SBT",
  tagline: "Built with Intelligence.",
  group: "Technical Xperts Group (TXG) - Saudi Arabia",
  groupShort: "TXG",
  /** Short form for labels, tags and chips where the full name does not fit */
  groupLabel: "TXG KSA",
  groupUrl: "https://txgksa.com",
  /** PLACEHOLDER — final domain */
  url: "https://www.smartbuilttech.com",
  description:
    "Smart Built Technologies is the production firm of Technical Xperts Group (TXG) - Saudi Arabia, operating from a newly opened production centre in Chennai. BIM, reality capture, digital twins and facility systems for landmark buildings.",
  locale: "en_IN",
  foundedGroup: 2014,

  contact: {
    /** PLACEHOLDER — SBT addresses */
    email: "hello@smartbuilttech.com",
    salesEmail: "projects@smartbuilttech.com",
    careersEmail: "careers@smartbuilttech.com",
    phone: "+91 44 0000 0000",
    phoneHref: "tel:+914400000000",
    hours: "Mon–Fri, 9:30–18:30 IST",
    replyTime: "two working days",
  },

  offices: [
    {
      id: "chennai",
      city: "Chennai",
      country: "India",
      role: "Production centre",
      /** PLACEHOLDER — street address */
      address: ["Smart Built Technologies", "Chennai, Tamil Nadu", "India"],
      mapUrl: "https://maps.google.com/?q=Chennai,Tamil+Nadu",
      primary: true,
    },
    {
      id: "riyadh",
      city: "Riyadh",
      country: "Saudi Arabia",
      role: "TXG KSA headquarters",
      address: [
        "Technical Xperts Group (TXG) - Saudi Arabia",
        "Al Kindi Plaza, Diplomatic Quarter",
        "Riyadh, KSA",
      ],
      mapUrl:
        "https://maps.google.com/?q=Al+Kindi+Plaza,+Diplomatic+Quarter,+Riyadh",
    },
    {
      id: "sharjah",
      city: "Sharjah",
      country: "UAE",
      role: "Group office",
      address: [
        "Technical Xperts Group (TXG) - Saudi Arabia",
        "SAIF Zone, PO Box 513153",
        "Sharjah, UAE",
      ],
      mapUrl: "https://maps.google.com/?q=SAIF+Zone,+Sharjah",
    },
    {
      id: "kozhikode",
      city: "Kozhikode",
      country: "India",
      role: "Group office",
      address: [
        "Technical Xperts Group (TXG) - Saudi Arabia",
        "Cyberpark, Kozhikode",
        "Kerala, India",
      ],
      mapUrl: "https://maps.google.com/?q=Govt+Cyberpark,+Kozhikode",
    },
  ] satisfies Office[],

  /** Key figures — group-level until SBT-specific numbers are confirmed (PLAN.md §1 #4) */
  figures: [
    { value: "2014", label: "Group founded" },
    {
      value: "250+",
      label: "Professionals at TXG KSA",
    },
    { value: "22", label: "Landmark projects" },
    { value: "ISO 19650", label: "Certified delivery" },
  ],

  /** Hidden until SBT accounts exist (PLAN.md §1 #9) */
  socials: [] as { label: string; href: string }[],
} as const;

export type Site = typeof site;
