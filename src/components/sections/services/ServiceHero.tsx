import Image from "next/image";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";
import { pathwayById, PATHWAY_COLOUR } from "@/content/pathways";
import type { ServiceDoc } from "@/content/service-pages";
import { serviceBySlug } from "@/content/services";

/**
 * Service hero, the home hero's split: the headline, lede and buttons on the
 * left with the two defining phrases as a ruled list, a photograph on the right.
 */
export function ServiceHero({ doc }: { doc: ServiceDoc }) {
  const service = serviceBySlug(doc.slug);
  const pathway = pathwayById(service.pathway);
  const colour = PATHWAY_COLOUR[pathway.id];

  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby="service-title"
      className="pt-[var(--header-h)] lg:flex lg:min-h-[min(100svh,880px)] lg:flex-col"
    >
      <div className="container-x flex w-full flex-1 flex-col pb-10 lg:pb-12">
        <div className="grid-12 flex-1 items-stretch gap-y-8">
          <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
              <Label>Smart Built Technologies · Services</Label>
              <Label className="text-slate-700">
                {pathway.name} · {pathway.meaning}
              </Label>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-[clamp(1rem,2.4svh,1.5rem)] py-8">
              <Breadcrumbs
                className="text-slate-700"
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: doc.crumb },
                ]}
              />
              <h1 id="service-title" className="flex flex-col gap-3">
                <span className="text-[clamp(2.75rem,min(6.3vw,10svh),7rem)] leading-[0.93] font-medium tracking-[-0.06em]">
                  {doc.headline.map((line, i) => (
                    <span
                      key={line}
                      className="hero-line"
                      style={{ "--i": i } as CSSProperties}
                    >
                      <span>
                        {line}
                        {i === doc.headline.length - 1 ? <Stop /> : " "}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              <p className="max-w-[50ch] text-[1.0625rem] leading-snug text-slate-700">
                {doc.lede}
              </p>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <ButtonLink href="/contact" variant="signal">
                  Get in touch
                </ButtonLink>
                <ButtonLink
                  href="/services"
                  variant="ghost"
                  className="underline"
                >
                  All services
                </ButtonLink>
              </div>

              <ul className="mt-1 border-t-[1.5px] border-t-navy">
                {doc.tags.map((t, i) => (
                  <li
                    key={t}
                    className="flex items-center gap-4 border-b border-[var(--hairline)] py-3"
                  >
                    <span className="w-6 font-mono text-overline text-slate-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="size-3 shrink-0 rounded-[3px]"
                      style={{ background: colour }}
                    />
                    <span className="text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] leading-none font-medium tracking-[-0.035em]">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <figure className="relative col-span-12 flex flex-col lg:col-span-5">
            <div className="relative min-h-[320px] flex-1 overflow-hidden bg-slate-200 max-lg:aspect-[4/3]">
              {doc.image ? (
                <Image
                  src={doc.image.src}
                  alt={doc.image.alt}
                  width={doc.image.width}
                  height={doc.image.height}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  priority
                  className="grade absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: doc.image.position }}
                />
              ) : null}
              <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                {doc.crumb}
              </span>
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
              <Label className="text-slate-700">Fig. 01 · {doc.tags[0]}</Label>
              <Label className="text-slate-700">The production firm of TXG, KSA</Label>
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
