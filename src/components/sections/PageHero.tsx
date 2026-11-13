import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";

/**
 * The hero for the inner pages, in the home hero's split: the running head, the
 * headline, the lede and the buttons on the left, one photograph on the right.
 * No pinning and nothing that changes on scroll.
 */
export function PageHero({
  id,
  headerLabel,
  kicker,
  headline,
  lede,
  actions,
  figure,
}: {
  id: string;
  /** Mono running head over the headline, left */
  headerLabel: string;
  kicker: string;
  headline: string[];
  lede: ReactNode;
  actions: ReactNode;
  figure: {
    src: string;
    width: number;
    height: number;
    alt: string;
    position?: string;
    /** Tag on the photograph */
    chip: string;
    caption: string;
  };
}) {
  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby={id}
      className="pt-[var(--header-h)] lg:flex lg:min-h-[min(100svh,880px)] lg:flex-col"
    >
      <div className="container-x flex w-full flex-1 flex-col pb-10 lg:pb-12">
        <div className="grid-12 flex-1 items-stretch gap-y-8">
          <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
              <Label>{headerLabel}</Label>
              <Label className="text-slate-700">
                The production firm of TXG, KSA
              </Label>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-[clamp(1rem,2.4svh,1.5rem)] py-8">
              <h1 id={id} className="flex flex-col gap-3">
                <span className="font-mono text-overline font-medium text-slate-700 uppercase">
                  {kicker}
                </span>
                <span className="text-[clamp(2.75rem,min(6.3vw,10svh),7rem)] leading-[0.93] font-medium tracking-[-0.06em]">
                  {headline.map((line, i) => (
                    <span
                      key={line}
                      className="hero-line lg:w-max lg:whitespace-nowrap"
                      style={{ "--i": i } as CSSProperties}
                    >
                      <span>
                        {line}
                        {i === headline.length - 1 ? <Stop /> : " "}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>
              <p className="max-w-[50ch] text-[1.0625rem] leading-snug text-slate-700">
                {lede}
              </p>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                {actions}
              </div>
            </div>
          </div>

          <figure className="relative col-span-12 flex flex-col lg:col-span-5">
            <div className="relative min-h-[320px] flex-1 overflow-hidden bg-slate-200 max-lg:aspect-[4/3]">
              <Image
                src={figure.src}
                alt={figure.alt}
                width={figure.width}
                height={figure.height}
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="grade absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: figure.position }}
              />
              <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                {figure.chip}
              </span>
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
              <Label className="text-slate-700">
                Fig. 01 · {figure.caption}
              </Label>
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
