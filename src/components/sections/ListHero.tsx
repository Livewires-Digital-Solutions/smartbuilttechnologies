import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PostCover } from "@/components/sections/blog/PostCover";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";

/**
 * The split hero shared by the Blog and Events index pages, built like the service
 * heroes: headline, lede and buttons on the left with a ruled list of facts, a
 * photograph on the right (the latest post or event, linking to it).
 */
export function ListHero({
  id,
  headerLabel,
  crumb,
  headline,
  lede,
  actions,
  facts,
  figure,
}: {
  id: string;
  headerLabel: string;
  crumb: string;
  headline: string[];
  lede: string;
  actions: ReactNode;
  facts: [string, string][];
  figure: {
    src: string | null;
    alt?: string | null;
    chip: string;
    caption: string;
    href?: string;
    note?: string;
  };
}) {
  const inner = (
    <PostCover
      src={figure.src}
      alt={figure.alt}
      label={figure.chip}
      sizes="(min-width: 1024px) 40vw, 100vw"
      priority
      className="absolute inset-0"
    />
  );
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
              <Label className="text-slate-700 lg:hidden">
                The production firm of TXG, KSA
              </Label>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-[clamp(1rem,2.4svh,1.5rem)] py-8">
              <Breadcrumbs
                className="text-slate-700"
                items={[{ label: "Home", href: "/" }, { label: crumb }]}
              />
              <h1
                id={id}
                className="text-[clamp(2.75rem,min(6.3vw,10svh),7rem)] leading-[0.93] font-medium tracking-[-0.06em]"
              >
                {headline.map((line, i) => (
                  <span
                    key={line}
                    className="hero-line"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <span>
                      {line}
                      {i === headline.length - 1 ? <Stop /> : " "}
                    </span>
                  </span>
                ))}
              </h1>
              <p className="max-w-[50ch] text-[1.0625rem] leading-snug text-slate-700">
                {lede}
              </p>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                {actions}
              </div>
              {facts.length > 0 ? (
                <dl className="mt-1 border-t-[1.5px] border-t-navy">
                  {facts.map(([k, v]) => (
                    <div
                      key={k}
                      className="grid grid-cols-[7rem_1fr] gap-4 border-b border-[var(--hairline)] py-2.5"
                    >
                      <dt className="pt-1">
                        <Label className="text-slate-700">{k}</Label>
                      </dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>

          <figure className="relative col-span-12 flex flex-col lg:col-span-5">
            <div className="hidden items-center justify-end border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5 lg:flex">
              <Label className="text-slate-700">
                The production firm of TXG, KSA
              </Label>
            </div>
            <div className="group relative min-h-[320px] flex-1 overflow-hidden bg-slate-200 max-lg:aspect-[4/3] lg:mt-4">
              {figure.href ? (
                <Link
                  href={figure.href}
                  aria-label={figure.caption}
                  className="absolute inset-0"
                >
                  {inner}
                </Link>
              ) : (
                inner
              )}
              <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                {figure.chip}
              </span>
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
              <Label className="text-slate-700">
                Fig. 01 · {figure.caption}
              </Label>
              {figure.note ? (
                <Label className="text-slate-700">{figure.note}</Label>
              ) : null}
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
