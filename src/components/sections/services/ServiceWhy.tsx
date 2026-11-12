import { Section } from "@/components/ui/Section";
import { StickyPin } from "@/components/ui/StickyPin";
import { Label, Overline } from "@/components/ui/Typography";
import type { ServiceDoc } from "@/content/service-pages";

/**
 * "Why choose us": the one navy band on the page, built like "Why BIM" on the
 * home page. The title and intro stay in view on the left while each reason
 * lights up as it crosses the middle of the screen.
 */
export function ServiceWhy({ doc }: { doc: ServiceDoc }) {
  const { why } = doc;
  if (why.items.length === 0) return null;
  return (
    <Section surface="navy" aria-labelledby="why-title">
      <div className="container-x">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <StickyPin topRem={3} className="flex flex-col gap-7">
              <Overline index="02" className="text-white/70">
                {why.label}
              </Overline>
              <h2 id="why-title" className="text-h1 text-balance">
                {why.title}
              </h2>
              <p className="max-w-[44ch] text-lead text-white/75">
                {why.intro}
              </p>
            </StickyPin>
          </div>

          <ol className="relative col-span-12 flex flex-col lg:col-span-6 lg:col-start-7">
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[7px] w-px bg-white/16"
            />
            {why.items.map((it, i) => (
              <li
                key={it.title}
                className="why-stage relative pb-12 pl-12 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="why-node absolute top-2 left-0 size-[15px] rounded-[4px] border"
                />
                <div className="why-body flex flex-col gap-4">
                  <Label className="text-sky">
                    {String(i + 1).padStart(2, "0")}
                  </Label>
                  <h3 className="text-[clamp(1.75rem,1.1rem+2.2vw,3rem)] leading-[1.04] font-medium tracking-[-0.04em] text-balance">
                    {it.title}
                  </h3>
                  <p className="max-w-[48ch] text-lead text-white/75">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
