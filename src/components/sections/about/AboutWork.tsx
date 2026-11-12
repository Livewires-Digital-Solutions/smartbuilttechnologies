import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { pathways } from "@/content/pathways";
import { servicesByPathway } from "@/content/services";

/** What we do: the four pathways of the SBT symbol, each linking into Services. */
export function AboutWork() {
  return (
    <Section surface="white" aria-labelledby="work-title">
      <div className="container-x">
        <SectionHead id="work-title" index="05" label="What we do">
          Four pathways, one model
          <span className="text-orange">.</span>
        </SectionHead>

        <ol className="reveal mt-12 grid gap-px bg-[var(--hairline)] sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {pathways.map((p) => {
            const count = servicesByPathway(p.id).length;
            return (
              <li key={p.id} className="bg-white">
                <Link
                  href="/services"
                  className="group flex h-full flex-col gap-5 p-6 transition-colors hover:bg-paper lg:p-8"
                >
                  <Label className="text-slate-700">
                    {String(p.order).padStart(2, "0")} · {p.meaning}
                  </Label>
                  <h3 className="text-h2">{p.name}</h3>
                  <p className="text-slate-700">{p.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-navy">
                    <span className="underline underline-offset-[6px]">
                      {count} {count === 1 ? "service" : "services"}
                    </span>
                    <Icon
                      name="arrow-right"
                      size={16}
                      className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
