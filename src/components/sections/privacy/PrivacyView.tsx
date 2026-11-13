import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";
import { privacy, privacySections } from "@/content/privacy";

/**
 * The privacy notice in the site's own layout: a short hero, then the notice as ruled
 * rows (a number and title on the left, the text on the right), with a contents list
 * so a visitor can jump to a part.
 */
export function PrivacyView() {
  return (
    <>
      <Section
        surface="paper"
        spacing={false}
        aria-labelledby="privacy-title"
        className="pt-[var(--header-h)]"
      >
        <div className="container-x pb-12 lg:pb-16">
          <div className="grid-12 gap-y-8">
            <div className="col-span-12 flex flex-col lg:col-span-9">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
                <Label>Smart Built Technologies · Privacy</Label>
                <Label className="text-slate-700">
                  Updated{" "}
                  <time dateTime={privacy.updated}>{privacy.updatedLabel}</time>
                </Label>
              </div>
              <div className="flex flex-col gap-[clamp(1rem,2.4svh,1.5rem)] py-10 lg:py-14">
                <Breadcrumbs
                  className="text-slate-700"
                  items={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
                />
                <h1
                  id="privacy-title"
                  className="text-[clamp(2.75rem,min(6.3vw,10svh),7rem)] leading-[0.93] font-medium tracking-[-0.06em]"
                >
                  <span
                    className="hero-line"
                    style={{ "--i": 0 } as CSSProperties}
                  >
                    <span>
                      Privacy
                      <Stop />
                    </span>
                  </span>
                </h1>
                <p className="max-w-[54ch] text-[1.0625rem] leading-snug text-slate-700">
                  What we collect when you apply for a job or write to us, why
                  we collect it, who sees it, how long we keep it and how to ask
                  us to change or delete it.
                </p>
                {!privacy.reviewed ? (
                  <p
                    role="note"
                    className="max-w-[54ch] border-l-[3px] border-l-orange bg-white py-3 pr-4 pl-4 text-[0.9375rem] text-slate-700"
                  >
                    This notice is a draft that has not yet been reviewed by a
                    lawyer.
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  <ButtonLink
                    href="#contact"
                    variant="signal"
                    icon="arrow-down"
                  >
                    Ask about your data
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section surface="white" aria-label="The privacy notice">
        <div className="container-x">
          <div className="grid-12 gap-y-10">
            <nav
              aria-label="On this page"
              className="col-span-12 lg:col-span-3"
            >
              <Label className="text-slate-700">On this page</Label>
              <ol className="mt-4 border-t-[1.5px] border-t-navy">
                {privacySections.map((s, i) => (
                  <li key={s.id} className="border-b border-[var(--hairline)]">
                    <a
                      href={`#${s.id}`}
                      className="flex min-h-11 items-baseline gap-3 py-2.5 text-[0.9375rem] font-medium underline-offset-[5px] hover:underline"
                    >
                      <span className="font-mono text-overline text-slate-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              {privacySections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-title`}
                  className="scroll-mt-28 border-t-[1.5px] border-t-navy py-8 first:pt-6 lg:py-10"
                >
                  <h2
                    id={`${s.id}-title`}
                    className="flex items-baseline gap-4 text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance"
                  >
                    <span className="font-mono text-overline font-normal tracking-normal text-slate-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </h2>
                  <Markdown className="mt-4">{s.body}</Markdown>
                </section>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
