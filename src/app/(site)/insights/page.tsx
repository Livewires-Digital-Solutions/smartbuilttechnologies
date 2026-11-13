import type { Metadata } from "next";
import { Suspense } from "react";
import {
  EventsContent,
  EventsSkeleton,
} from "@/components/sections/events/EventsContent";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

const title = "Events | Smart Built Technologies, Production Firm of TXG, KSA";
const description =
  "Exhibitions, conferences and milestones: where Technical Xperts Group (TXG) - Saudi Arabia, the group behind Smart Built Technologies, has shown digital construction and BIM, from the Saudi Airport Exhibition to the World Defense Show.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/insights" },
  openGraph: { title, description, url: "/insights", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/** Events index: what is coming up and where we have been, read from the database. */
export default function EventsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Events", path: "/insights" },
        ])}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <Suspense fallback={<EventsSkeleton />}>
        <EventsContent />
      </Suspense>
      <HomeCta />
    </>
  );
}
