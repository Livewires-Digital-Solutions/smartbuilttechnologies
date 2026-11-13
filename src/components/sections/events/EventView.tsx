import Link from "next/link";
import type { CSSProperties } from "react";
import { PostCover } from "@/components/sections/blog/PostCover";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Markdown } from "@/components/ui/Markdown";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";
import { site } from "@/content/site";
import { dateRange } from "@/lib/dates";
import type { SiteEvent } from "@/lib/events";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

/** One event: the hero with when and where, and its write-up in Markdown. */
export function EventView({ event }: { event: SiteEvent }) {
  const base = process.env.SITE_URL || site.url;
  const when = dateRange(event.startDate, event.endDate);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/insights" },
            { name: event.title, path: `/insights/${event.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description: event.summary ?? undefined,
            startDate: event.startDate,
            endDate: event.endDate ?? event.startDate,
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: event.location },
            image: event.cover ? `${base}${event.cover}` : undefined,
            url: `${base}/insights/${event.slug}`,
            organizer: { "@type": "Organization", name: site.group },
          },
        ]}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <Section
        surface="paper"
        spacing={false}
        aria-labelledby="event-title"
        className="pt-[var(--header-h)] lg:flex lg:min-h-[min(92svh,820px)] lg:flex-col"
      >
        <div className="container-x flex w-full flex-1 flex-col pb-10 lg:pb-12">
          <div className="grid-12 flex-1 items-stretch gap-y-8">
            <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
                <Label>Smart Built Technologies · Events</Label>
                <Label className="text-slate-700">{event.type}</Label>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-[clamp(1rem,2.4svh,1.5rem)] py-8">
                <Breadcrumbs
                  className="text-slate-700"
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Events", href: "/insights" },
                    { label: event.title },
                  ]}
                />
                <h1
                  id="event-title"
                  className="text-[clamp(2.25rem,min(5vw,9svh),5rem)] leading-[0.98] font-medium tracking-[-0.055em] text-balance"
                >
                  <span
                    className="hero-line"
                    style={{ "--i": 0 } as CSSProperties}
                  >
                    <span>
                      {event.title}
                      <Stop />
                    </span>
                  </span>
                </h1>
                {event.summary ? (
                  <p className="max-w-[54ch] text-[1.0625rem] leading-snug text-slate-700">
                    {event.summary}
                  </p>
                ) : null}
                <dl className="mt-1 border-t-[1.5px] border-t-navy">
                  {(
                    [
                      ["Type", event.type],
                      ["When", when],
                      ["Where", event.location],
                    ] as [string, string][]
                  ).map(([k, v]) => (
                    <div
                      key={k}
                      className="grid grid-cols-[8rem_1fr] gap-4 border-b border-[var(--hairline)] py-2.5"
                    >
                      <dt className="pt-1">
                        <Label className="text-slate-700">{k}</Label>
                      </dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <figure className="relative col-span-12 flex flex-col lg:col-span-5">
              <PostCover
                src={event.cover}
                alt={event.coverAlt ?? event.title}
                label={event.type}
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="min-h-[320px] flex-1 max-lg:aspect-[4/3]"
              />
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
                <Label className="text-slate-700">
                  Fig. 01 · {event.title}
                </Label>
                <Label className="text-slate-700">{event.location}</Label>
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      {event.body?.trim() ? (
        <Section surface="white" aria-label="About the event">
          <div className="container-x">
            <div className="grid-12 gap-y-8">
              <div className="col-span-12 lg:col-span-3">
                <Link
                  href="/insights"
                  className="group inline-flex items-center gap-2 font-semibold text-navy"
                >
                  <Icon
                    name="arrow-left"
                    size={16}
                    className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:-translate-x-1"
                  />
                  <span className="underline underline-offset-[6px]">
                    All events
                  </span>
                </Link>
              </div>
              <article className="col-span-12 lg:col-span-8 lg:col-start-4">
                <Markdown>{event.body}</Markdown>
                <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t-[1.5px] border-t-navy pt-6">
                  <ButtonLink href="/contact" variant="signal">
                    Get in touch
                  </ButtonLink>
                  <ButtonLink
                    href="/insights"
                    variant="ghost"
                    className="underline"
                  >
                    All events
                  </ButtonLink>
                </div>
              </article>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
