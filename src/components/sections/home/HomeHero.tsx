import { ExplodedSymbol } from "@/components/brand/Symbol";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Overline, Stop } from "@/components/ui/Typography";
import { site } from "@/content/site";

/**
 * H-01 Hero (Midnight depth).
 * Text is the LCP element and is never animated. The exploded symbol is
 * inline SVG (no image request) and assembles once along the 30° axis.
 * Orange appears only in the symbol's integration pathway and the tagline full
 * stop; the page's orange CTA is saved for the closing section.
 */
export function HomeHero() {
  return (
    <Section surface="midnight" spacing={false} className="overflow-hidden" aria-labelledby="hero-title">
      {/* Symbol — in flow on small screens, anchored right on large */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mr-[var(--margin)] ml-auto w-[64vw] max-w-[400px] pt-[calc(var(--header-h)+2.5rem)] lg:absolute lg:top-[calc(var(--header-h)+3.5rem)] lg:right-[max(var(--margin),calc((100vw-1440px)/2+var(--margin)))] lg:m-0 lg:w-[37vw] lg:max-w-[600px] lg:pt-0"
      >
        <ExplodedSymbol tone="inverse" drift className="h-auto w-full" />
      </div>

      <div className="container-x relative flex flex-col lg:min-h-[min(100svh,1000px)] lg:justify-end">
        <div className="grid-12 pt-10 lg:pt-[calc(var(--header-h)+6rem)]">
          <div className="col-span-12 flex flex-col gap-7 lg:col-span-6">
            <Overline className="text-white/72">{site.name} · Chennai</Overline>
            <h1 id="hero-title" className="text-display max-w-[11ch]">
              Built with Intelligence<Stop />
            </h1>
            <p className="measure max-w-[44ch] text-lead text-white/75">
              BIM, reality capture, digital twins and facility systems, delivered from Chennai for landmark buildings
              across the Gulf, India and beyond.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-7 gap-y-4">
              <ButtonLink href="/contact" variant="inverse">
                Start a project
              </ButtonLink>
              <ButtonLink href="/projects" variant="ghost">
                See selected work
              </ButtonLink>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 border-t border-[var(--hairline)] lg:mt-24 lg:grid-cols-4">
          {site.figures.map((f, i) => (
            <div
              key={f.label}
              className={[
                "flex flex-col-reverse gap-2 py-6 lg:py-8",
                i % 2 === 1 ? "border-l border-[var(--hairline)] pl-5 sm:pl-8" : "",
                i >= 2 ? "border-t border-[var(--hairline)] lg:border-t-0" : "",
                i === 2 ? "lg:border-l lg:pl-8" : "",
                i > 0 ? "lg:pl-8" : "",
              ].join(" ")}
            >
              <dt className="text-caption text-white/64">{f.label}</dt>
              <dd className="tabular text-h2 font-extrabold tracking-[-0.02em]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
