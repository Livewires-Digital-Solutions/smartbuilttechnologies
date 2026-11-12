import Image from "next/image";
import { CountUp } from "@/components/ui/CountUp";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const photo =
  projects.find((p) => p.slug === "tadawul-tower") ?? projects[0]!;
const countries = new Set(projects.map((p) => p.country)).size;

/** Three chapters, oldest first. Copy follows the client's messaging brief (11 Nov 2026). */
const chapters = [
  {
    label: `${site.foundedGroup} · Riyadh`,
    title: "Founded in Riyadh",
    body: `${site.group} was founded in Riyadh in ${site.foundedGroup}, and has built its record on BIM and digital delivery ever since.`,
  },
  {
    label: "Since · Saudi Arabia and Australia",
    title: "Built on landmarks",
    body: "From the King Abdullah Financial District and Jeddah Tower to NEOM Bay Airport, the group’s projects are the experience we carry into every model.",
  },
  {
    label: "Now · Chennai",
    title: "Extended from Chennai",
    body: `${site.name} is its production firm. The Chennai production centre opened to meet growing demand and works under the TXG name, so the standards and track record behind every project are the group’s, and ours.`,
    current: true,
  },
];

const figures: { n: number; suffix?: string; label: string; note: string }[] = [
  { n: 250, suffix: "+", label: "Professionals", note: `At ${site.groupLabel}` },
  {
    n: projects.length,
    label: "Landmark projects",
    note: `Associated with ${site.groupLabel}`,
  },
  { n: countries, label: "Countries", note: "Saudi Arabia and Australia" },
  { n: site.offices.length, label: "Offices", note: "Riyadh, Sharjah, Chennai" },
];

/**
 * Our story. The heading, then a tall photograph of a landmark beside three
 * chapters laid out down its full height, then four counted figures.
 */
export function AboutStory() {
  return (
    <Section surface="paper" aria-labelledby="story-title">
      <div className="container-x">
        <SectionHead id="story-title" index="01" label="Our story">
          A group with a record, and a centre built to extend it
          <span className="text-orange">.</span>
        </SectionHead>

        <div className="grid-12 mt-12 items-stretch gap-y-10 lg:mt-16">
          <figure className="reveal col-span-12 flex flex-col gap-3 lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 lg:aspect-auto lg:min-h-0 lg:flex-1">
              <Image
                src={photo.image.src}
                alt={`${photo.name}, ${photo.location}`}
                width={photo.image.width}
                height={photo.image.height}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="grade h-full w-full object-cover lg:absolute lg:inset-0"
              />
              <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                Associated with {site.groupLabel}
              </span>
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <Label className="text-slate-700">
                Fig. 02 · {photo.name}
              </Label>
              <Label className="text-slate-700">{photo.location}</Label>
            </figcaption>
          </figure>

          <ol className="relative col-span-12 flex flex-col justify-between gap-10 lg:col-span-6 lg:col-start-7">
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[7px] w-px bg-[var(--hairline)]"
            />
            {chapters.map((c) => (
              <li key={c.title} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-2 left-0 size-[15px] rounded-[4px] border",
                    "current" in c && c.current
                      ? "border-orange bg-orange"
                      : "border-navy bg-navy",
                  )}
                />
                <div className="reveal flex flex-col gap-3">
                  <Label className="text-slate-700">{c.label}</Label>
                  <h3 className="text-[clamp(1.875rem,1.2rem+2.4vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance">
                    {c.title}
                  </h3>
                  <p className="max-w-[44ch] text-lead text-slate-700">
                    {c.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
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
      </div>
    </Section>
  );
}
