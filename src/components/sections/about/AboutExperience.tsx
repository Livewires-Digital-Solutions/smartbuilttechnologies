import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const slugs = [
  "tadawul-tower",
  "jeddah-tower",
  "jeddah-opera-house",
] as const;
const picks = slugs
  .map((s) => projects.find((p) => p.slug === s))
  .filter((p): p is (typeof projects)[number] => Boolean(p));

/** The experience we carry: three landmarks, each tied to the group, then a link to all of them. */
export function AboutExperience() {
  return (
    <Section surface="paper" aria-labelledby="experience-title">
      <div className="container-x">
        <SectionHead
          id="experience-title"
          index="06"
          label="Experience we carry"
        >
          Landmarks, modelled
        </SectionHead>

        <ul className="mt-12 grid gap-8 sm:grid-cols-3 lg:mt-16 lg:gap-10">
          {picks.map((p, i) => (
            <li key={p.slug} className="reveal">
              <Link
                href={`/projects#${p.slug}`}
                className="group flex flex-col gap-4"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                  <Image
                    src={p.image.src}
                    alt={`${p.name}, ${p.location}`}
                    width={p.image.width}
                    height={p.image.height}
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="grade h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute top-0 left-0 bg-paper px-3 py-1.5 font-mono text-overline text-navy">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="flex items-start justify-between gap-3 text-h2">
                    {p.name}
                    <Icon
                      name="arrow-up-right"
                      size={20}
                      className="mt-1 shrink-0 text-slate-500 transition-[translate,color] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy"
                    />
                  </h3>
                  <Label className="text-slate-700">
                    {p.sector} · {p.location}
                  </Label>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-[var(--hairline)] pt-6">
          <p className="max-w-[60ch] text-slate-700">
            Projects associated with {site.groupLabel}, whose experience and
            track record {site.name} carries.
          </p>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-semibold text-navy"
          >
            <span className="underline underline-offset-[6px]">
              All {projects.length} projects
            </span>
            <Icon
              name="arrow-right"
              size={16}
              className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Section>
  );
}
