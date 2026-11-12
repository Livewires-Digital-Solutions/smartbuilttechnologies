import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { CountUp } from "@/components/ui/CountUp";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const lead =
  projects.find((p) => p.slug === "king-abdullah-financial-district") ??
  projects[0]!;
const countries = new Set(projects.map((p) => p.country)).size;

/** Where SBT comes from, oldest first. The last stop is the one we are in. */
const lineage = [
  {
    when: String(site.foundedGroup),
    where: "Riyadh",
    text: `${site.groupLabel} is founded and builds its record on landmark projects in the Gulf and Australia.`,
  },
  {
    when: "Group",
    where: "Sharjah",
    text: "A group office in the UAE supports projects for clients across the Gulf.",
  },
  {
    when: "Now",
    where: "Chennai",
    text: `${site.name} opens as the production firm of ${site.groupLabel}: modelling, scanning, data and software.`,
    current: true,
  },
];

const figures: { n: number; suffix?: string; label: string; note: string }[] = [
  {
    n: projects.length,
    label: "Landmark projects",
    note: `Associated with ${site.groupLabel}`,
  },
  {
    n: countries,
    label: "Countries delivered in",
    note: "Saudi Arabia and Australia",
  },
  {
    n: 250,
    suffix: "+",
    label: "Professionals",
    note: `At ${site.groupLabel}, and growing`,
  },
  { n: site.offices.length, label: "Offices", note: "From Riyadh to Chennai" },
];

/**
 * About: who we are. SBT is the production firm of Technical Xperts Group (TXG) - Saudi Arabia and carries its track
 * record (client brief, 11 Nov 2026). A short statement, then a real project beside
 * the family tree (Riyadh → group offices → Chennai), then four counted figures.
 */
export function HomeAbout() {
  return (
    <Section surface="paper" aria-labelledby="about-title">
      <div className="container-x">
        <SectionHead
          id="about-title"
          index="02"
          label={`About us · TXG since ${site.foundedGroup}`}
        >
          Who we are
        </SectionHead>

        <div className="grid-12 mt-10 lg:mt-14">
          <p className="reveal text-statement col-span-12 max-w-[32ch] lg:col-span-8 lg:col-start-4 lg:max-w-[36ch]">
            {site.name} is the production firm of {site.group}. Our new
            production centre in Chennai carries the experience of{" "}
            {projects.length}
            <sup className="-top-[1.15em] ml-[0.08em] font-mono text-[0.4em] font-medium tracking-normal text-slate-700">
              <a href="#about-fn" aria-label="Note 1">
                1
              </a>
            </sup>{" "}
            landmark projects.
          </p>
        </div>

        <div className="grid-12 mt-14 items-end gap-y-12 lg:mt-20">
          <figure className="reveal col-span-12 flex flex-col gap-3 lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
              <Image
                src={lead.image.src}
                alt={`${lead.name}, ${lead.location}`}
                width={lead.image.width}
                height={lead.image.height}
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="grade h-full w-full object-cover"
              />
              <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                Associated with {site.groupLabel}
              </span>
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <Label className="text-slate-700">Fig. 02 · {lead.name}</Label>
              <Label className="text-slate-700">{lead.location}</Label>
            </figcaption>
          </figure>

          <div className="col-span-12 flex flex-col gap-9 lg:col-span-5 lg:col-start-8">
            <p className="reveal max-w-[50ch] text-lead text-slate-700">
              We were set up to meet growing demand and we work under the{" "}
              {site.groupLabel} name. Teams in Riyadh and Sharjah stay close to
              clients in the Gulf, while the modelling, scanning, data and
              software production happens in Chennai.
            </p>

            <ol className="reveal relative flex flex-col">
              <span
                aria-hidden="true"
                className="absolute top-3 bottom-3 left-[7px] w-px bg-[var(--hairline)]"
              />
              {lineage.map((s) => (
                <li
                  key={s.where}
                  className="relative grid grid-cols-[1fr] gap-1 pb-7 pl-10 last:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1.5 left-0 size-[15px] rounded-[4px] border",
                      s.current
                        ? "border-orange bg-orange"
                        : "border-navy bg-navy",
                    )}
                  />
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <Label
                      className={s.current ? "text-navy" : "text-slate-700"}
                    >
                      {s.when}
                    </Label>
                    <span className="text-[1.25rem] leading-tight font-medium tracking-[-0.025em]">
                      {s.where}
                    </span>
                  </span>
                  <span className="max-w-[44ch] text-[0.9375rem] text-slate-700">
                    {s.text}
                  </span>
                </li>
              ))}
            </ol>

            <Link
              href="/about"
              className="group inline-flex items-center gap-2 self-start font-semibold text-navy"
            >
              <span className="underline underline-offset-[6px]">
                About SBT
              </span>
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <dl className="reveal mt-16 grid grid-cols-2 border-t-[1.5px] border-t-navy lg:mt-24 lg:grid-cols-4">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className={cn(
                "flex flex-col gap-2 border-b border-[var(--hairline)] py-6 pr-4 lg:border-b-0 lg:py-8",
                i > 0 && "lg:border-l lg:pl-8",
                i % 2 === 1 && "pl-4 max-lg:border-l",
              )}
            >
              <dt className="order-2 mt-2">
                <Label>{f.label}</Label>
              </dt>
              <dd className="order-1 text-[clamp(3.25rem,2rem+4.6vw,6.25rem)] leading-[0.9] font-medium tracking-[-0.06em] tabular-nums">
                <CountUp to={f.n} suffix={f.suffix} />
              </dd>
              <dd className="order-3 text-[0.875rem] text-slate-700">
                {f.note}
              </dd>
            </div>
          ))}
        </dl>

        <p
          id="about-fn"
          className="mt-8 max-w-[70ch] font-mono text-[0.75rem] leading-relaxed text-slate-700"
        >
          1 · Projects associated with {site.groupLabel}, whose experience and
          track record {site.name} carries.{" "}
          <Link href="/projects" className="underline underline-offset-2">
            Full list on Projects
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}
