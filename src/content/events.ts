/** Exhibitions, summits and milestones (source: txgksa.com/insights). */

export type EventType = "Exhibition" | "Conference" | "Technology showcase" | "Company milestone";

export interface GroupEvent {
  slug: string;
  title: string;
  type: EventType;
  /** ISO dates; `end` for multi-day events */
  start: string;
  end?: string;
  location: string;
  image: { src: string; width: number; height: number };
}

const e = (file: string, width: number, height: number) => ({ src: `/assets/events/${file}`, width, height });

export const events: GroupEvent[] = [
  {
    slug: "saudi-airport-exhibition-2024",
    title: "Saudi Airport Exhibition 2024",
    type: "Exhibition",
    start: "2024-11-11",
    end: "2024-11-12",
    location: "Riyadh, KSA",
    image: e("saudi-airport-exhibition-2024.jpg", 1000, 666),
  },
  {
    slug: "construction-technology-confex-ksa-2024",
    title: "Construction Technology Confex KSA 2024",
    type: "Conference",
    start: "2024-10-23",
    location: "Riyadh, KSA",
    image: e("construction-technology-confex-ksa-2024.jpg", 1000, 666),
  },
  {
    slug: "autodesk-technology-day-2024",
    title: "Autodesk Technology Day",
    type: "Technology showcase",
    start: "2024-02-22",
    location: "Riyadh, KSA",
    image: e("autodesk-technology-day.jpg", 1000, 666),
  },
  {
    slug: "world-defense-show-2024",
    title: "World Defense Show 2024",
    type: "Exhibition",
    start: "2024-02-04",
    end: "2024-02-08",
    location: "Riyadh, KSA",
    image: e("world-defense-show-2024.webp", 2400, 1598),
  },
  {
    slug: "saudi-airport-exhibition-2023",
    title: "Saudi Airport Exhibition 2023",
    type: "Exhibition",
    start: "2023-12-19",
    end: "2023-12-20",
    location: "Riyadh, KSA",
    image: e("saudi-airport-exhibition-2023.jpg", 1066, 800),
  },
  {
    slug: "10th-anniversary-riyadh",
    title: "Tenth anniversary — Riyadh",
    type: "Company milestone",
    start: "2023-11-30",
    location: "Riyadh, KSA",
    image: e("10th-anniversary-event-riyadh.jpg", 1200, 800),
  },
  {
    slug: "10th-anniversary-kozhikode",
    title: "Tenth anniversary — Kozhikode",
    type: "Company milestone",
    start: "2023-10-13",
    location: "Kozhikode, India",
    image: e("10th-anniversary-event-kozhikode.jpg", 1024, 587),
  },
  {
    slug: "ifsec-international-2023",
    title: "IFSEC International 2023",
    type: "Exhibition",
    start: "2023-05-16",
    end: "2023-05-18",
    location: "London, UK",
    image: e("ifsec-international-2023.jpg", 768, 1024),
  },
  {
    slug: "office-inauguration-cyberpark",
    title: "Office opening, Cyberpark",
    type: "Company milestone",
    start: "2022-09-16",
    location: "Kozhikode, India",
    image: e("office-inauguration-cyberpark.jpg", 1800, 1200),
  },
];
