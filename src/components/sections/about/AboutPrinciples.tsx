import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { StickyPin } from "@/components/ui/StickyPin";
import { Label, Overline } from "@/components/ui/Typography";

/** Vision and mission are the group's own (txgksa.com); the values are its three. */
const values = [
  {
    title: "Quality & teamwork",
    body: "Every discipline works from one coordinated model, and the people behind it work as one team.",
    link: { label: "Our services", href: "/services" },
  },
  {
    title: "Precision & excellence",
    body: "Models and data built to the level of detail the project needs, and checked before they leave us.",
    link: { label: "Reality capture and scan to BIM", href: "/services/reality-capture" },
  },
  {
    title: "Commitment & integrity",
    body: "We say what we can deliver, then deliver it, from the first brief to the final handover.",
    link: { label: "Start a project", href: "/contact" },
  },
];

/**
 * Vision, mission and values. The one navy band on the page, built like "Why
 * choose us" on the home page: the vision and mission stay in view on the left
 * while each value lights up as it crosses the middle of the screen.
 */
export function AboutPrinciples() {
  return (
    <Section surface="navy" aria-labelledby="principles-title">
      <div className="container-x">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <StickyPin topRem={3} className="flex flex-col gap-7">
              <Overline index="02" className="text-white/70">
                Vision, mission, values
              </Overline>
              <h2 id="principles-title" className="text-h1">
                What we work towards
                <span className="text-orange">.</span>
              </h2>
              <p className="max-w-[40ch] text-statement text-white">
                Redefine construction by integrating advanced BIM and digital
                delivery.
              </p>
              <div className="flex max-w-[44ch] flex-col gap-1.5 border-t border-[var(--hairline)] pt-4">
                <Label className="text-sky">Mission</Label>
                <p className="text-[0.9375rem] text-white/75">
                  Empower construction excellence with innovative digital
                  delivery, ensuring cost-effective design and planning.
                </p>
              </div>
            </StickyPin>
          </div>

          <ol className="relative col-span-12 flex flex-col lg:col-span-6 lg:col-start-7">
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[7px] w-px bg-white/16"
            />
            {values.map((v, i) => (
              <li
                key={v.title}
                className="why-stage relative pb-14 pl-12 last:pb-0 lg:min-h-[44svh]"
              >
                <span
                  aria-hidden="true"
                  className="why-node absolute top-2 left-0 size-[15px] rounded-[4px] border"
                />
                <div className="why-body flex flex-col gap-4">
                  <Label className="text-sky">Value {i + 1}</Label>
                  <h3 className="text-[clamp(1.875rem,1.2rem+2.4vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance">
                    {v.title}
                  </h3>
                  <p className="max-w-[42ch] text-lead text-white/75">
                    {v.body}
                  </p>
                  <p className="pt-1">
                    <Link
                      href={v.link.href}
                      className="group inline-flex items-center gap-2 font-semibold"
                    >
                      <span className="underline underline-offset-[5px]">
                        {v.link.label}
                      </span>
                      <Icon
                        name="arrow-right"
                        size={16}
                        className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
                      />
                    </Link>
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
