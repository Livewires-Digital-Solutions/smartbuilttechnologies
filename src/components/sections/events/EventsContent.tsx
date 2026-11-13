import { connection } from "next/server";
import { ListHero } from "@/components/sections/ListHero";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { dateRange, todayUtc } from "@/lib/dates";
import { dbConfigured } from "@/lib/db";
import { lastDay, listLiveEvents, type SiteEvent } from "@/lib/events";
import { EventCard, EventsList, type ListEvent } from "./EventsList";

export function EventsSkeleton() {
  return (
    <Section
      surface="paper"
      spacing={false}
      aria-label="Events"
      className="pt-[var(--header-h)]"
    >
      <div className="container-x min-h-[min(100svh,880px)] pt-16">
        <div className="h-24 w-2/3 animate-pulse bg-navy/8" />
        <div className="mt-10 h-5 w-1/2 animate-pulse bg-navy/8" />
      </div>
    </Section>
  );
}

const toListEvent = (e: SiteEvent): ListEvent => ({
  slug: e.slug,
  title: e.title,
  type: e.type,
  when: dateRange(e.startDate, e.endDate),
  location: e.location,
  summary: e.summary,
  cover: e.cover,
  coverAlt: e.coverAlt,
  hasPage: !!e.body?.trim(),
});

/**
 * The events index: the hero, what is coming up, and everything that has happened, with
 * a type filter. Read from the database when asked for, with "upcoming" decided by
 * today's date, so an event moves from one list to the other by itself.
 */
export async function EventsContent() {
  await connection();
  const today = todayUtc();
  let events: SiteEvent[] = [];
  let unavailable = false;
  if (!dbConfigured()) unavailable = true;
  else {
    try {
      events = await listLiveEvents();
    } catch (e) {
      console.error("[events] could not load events:", e);
      unavailable = true;
    }
  }
  const upcoming = events
    .filter((e) => lastDay(e) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = events.filter((e) => lastDay(e) < today);
  const spotlight = upcoming[0] ?? past[0];

  return (
    <>
      <ListHero
        id="events-title"
        headerLabel="Smart Built Technologies · Events"
        crumb="Events"
        headline={["Our Events"]}
        lede="Showcasing our presence at global exhibitions, tech summits, and industry milestones across Saudi Arabia, UAE, and beyond."
        actions={
          <>
            <ButtonLink href="#events" variant="signal" icon="arrow-down">
              Latest events
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" className="underline">
              Meet us at an event
            </ButtonLink>
          </>
        }
        facts={
          events.length
            ? [
                ["Events", String(events.length)],
                ["Upcoming", String(upcoming.length)],
                ...(spotlight
                  ? ([
                      [
                        upcoming[0] ? "Next" : "Latest",
                        dateRange(spotlight.startDate, spotlight.endDate),
                      ],
                    ] as [string, string][])
                  : []),
              ]
            : []
        }
        figure={{
          src: spotlight?.cover ?? "/assets/misc/hero-architecture.webp",
          alt: spotlight?.coverAlt ?? spotlight?.title,
          chip: spotlight
            ? upcoming[0]
              ? "Next event"
              : "Latest event"
            : "Events",
          caption: spotlight?.title ?? "Exhibitions, summits and milestones",
          href: spotlight?.body?.trim()
            ? `/events/${spotlight.slug}`
            : undefined,
          note: spotlight?.location,
        }}
      />

      {unavailable ? (
        <Section surface="white">
          <div className="container-x">
            <p className="max-w-[56ch] border-t-[1.5px] border-t-navy pt-6 text-lead text-slate-700">
              Events cannot be shown right now. Please try again in a few
              minutes.
            </p>
          </div>
        </Section>
      ) : (
        <>
          {upcoming.length > 0 ? (
            <Section
              surface="white"
              id="upcoming"
              aria-labelledby="upcoming-title"
            >
              <div className="container-x">
                <SectionHead id="upcoming-title" index="01" label="Coming up">
                  Upcoming events
                </SectionHead>
                <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
                  {upcoming.map((e) => (
                    <li key={e.slug}>
                      <EventCard e={toListEvent(e)} />
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          ) : null}

          <Section surface="paper" id="events" aria-labelledby="events-heading">
            <div className="container-x">
              <SectionHead
                id="events-heading"
                index={upcoming.length > 0 ? "02" : "01"}
                label="Latest Exhibitions & Events"
                aside={
                  <p className="max-w-[56ch] text-lead text-slate-700">
                    Explore the global exhibitions, summits, and milestones TXG,
                    KSA has participated in to pioneer digital construction and
                    BIM advancements.
                  </p>
                }
              >
                Where we have been
              </SectionHead>
              <div className="mt-12 lg:mt-16">
                {past.length > 0 ? (
                  <EventsList events={past.map(toListEvent)} />
                ) : (
                  <p className="border-t-[1.5px] border-t-navy pt-6 text-lead text-slate-700">
                    No past events to show yet.
                  </p>
                )}
              </div>
            </div>
          </Section>
        </>
      )}
    </>
  );
}
