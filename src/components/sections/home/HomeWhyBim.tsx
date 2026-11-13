import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Label, Overline } from "@/components/ui/Typography";
import { StickyPin } from "@/components/ui/StickyPin";
import { projects } from "@/content/projects";

const stages = [
  {
    stage: "Design and planning",
    body: "Test options and visualise them early, so decisions on layout, materials and sustainability are made with evidence.",
    service: { label: "BIM in design", href: "/services/bim" },
    project: "tadawul-tower",
  },
  {
    stage: "Construction",
    body: "Better visualisation and coordination during the build, so errors are caught on a screen before they are built in.",
    service: { label: "4D simulation", href: "/services/4d-simulation" },
    project: "jeddah-tower",
  },
  {
    stage: "Operations and maintenance",
    body: "A complete asset information model, so the facility team inherits a building that is already documented.",
    service: { label: "Asset management", href: "/services/asset-management" },
    project: "king-abdullah-financial-district",
  },
  {
    stage: "Risk management",
    body: "Informed decisions, earlier: structural and spatial issues are found while they are still cheap to resolve.",
    service: { label: "Reality capture", href: "/services/reality-capture" },
    project: "jeddah-opera-house",
  },
];

/**
 * Why choose us: the advantage of BIM-based construction. The one navy band on
 * the page. The four stages sit on a vertical line; each lights up (its node
 * turns orange) as it crosses the middle of the screen, so scrolling reads as
 * following one model through a building's life.
 */
export function HomeWhyBim() {
  return (
    <Section surface="navy" aria-labelledby="why-title">
      <div className="container-x">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <StickyPin topRem={3} className="flex flex-col gap-7">
              <Overline index="05" className="text-white/70">
                Why choose us
              </Overline>
              <h2 id="why-title" className="text-h1">
                One model, from first sketch to facility handover
                <span className="text-orange">.</span>
              </h2>
              <p className="max-w-[44ch] text-lead text-white/75">
                BIM-based construction is a digital method that improves
                collaboration, visualisation and efficiency across the whole
                building process. One model carries every decision from design
                into operation.
              </p>
              <div className="flex max-w-[44ch] flex-col gap-1.5 border-t border-[var(--hairline)] pt-4">
                <Label className="text-sky">Sustainable integration</Label>
                <p className="text-[0.9375rem] text-white/75">
                  3D digital representations of a building’s physical and
                  functional characteristics support better decisions at every
                  stage.
                </p>
              </div>
            </StickyPin>
          </div>

          <ol className="relative col-span-12 flex flex-col lg:col-span-6 lg:col-start-7">
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[7px] w-px bg-white/16"
            />
            {stages.map((s, i) => {
              const p = projects.find((x) => x.slug === s.project);
              return (
                <li
                  key={s.stage}
                  className="why-stage relative pb-14 pl-12 last:pb-0 lg:min-h-[44svh]"
                >
                  <span
                    aria-hidden="true"
                    className="why-node absolute top-2 left-0 size-[15px] rounded-[4px] border"
                  />
                  <div className="why-body flex flex-col gap-4">
                    <Label className="text-sky">Stage {i + 1}</Label>
                    <h3 className="text-[clamp(1.875rem,1.2rem+2.4vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance">
                      {s.stage}
                    </h3>
                    <p className="max-w-[42ch] text-lead text-white/75">
                      {s.body}
                    </p>
                    <p className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                      <Link
                        href={s.service.href}
                        className="group inline-flex min-h-11 items-center gap-2 font-semibold"
                      >
                        <span className="underline underline-offset-[5px]">
                          {s.service.label}
                        </span>
                        <Icon
                          name="arrow-right"
                          size={16}
                          className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
                        />
                      </Link>
                      {p ? (
                        <Label className="text-white/60">e.g. {p.name}</Label>
                      ) : null}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
