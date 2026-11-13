import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import {
  EventsContent,
  EventsSkeleton,
} from "@/components/sections/events/EventsContent";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";

const title =
  "Events and Exhibitions | Smart Built Technologies";
const description =
  "Exhibitions, conferences and milestones where Technical Xperts Group (TXG) - Saudi Arabia, the group behind Smart Built Technologies, has shown BIM and digital construction.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/events",
});

/** Events index: what is coming up and where we have been, read from the database. */
export default function EventsPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/events",
          name: title,
          description,
          type: "CollectionPage",
          crumbs: [{ name: "Events", path: "/events" }],
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <Suspense fallback={<EventsSkeleton />}>
        <EventsContent />
      </Suspense>
      <HomeCta />
    </>
  );
}
