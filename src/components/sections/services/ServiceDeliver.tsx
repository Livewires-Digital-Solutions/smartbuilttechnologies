import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import type { ServiceDoc } from "@/content/service-pages";
import { pathwayById, PATHWAY_COLOUR } from "@/content/pathways";
import { serviceBySlug } from "@/content/services";

/**
 * "What we deliver": big-type ruled rows, like the home page's service index.
 * Each row is a number, the category in mono, the deliverable set large, and
 * the sentence that explains it.
 */
export function ServiceDeliver({
  doc,
  index,
}: {
  doc: ServiceDoc;
  index: string;
}) {
  const colour =
    PATHWAY_COLOUR[pathwayById(serviceBySlug(doc.slug).pathway).id];
  return (
    <Section surface="paper" aria-labelledby="deliver-title">
      <div className="container-x">
        <SectionHead
          id="deliver-title"
          index={index}
          label={doc.deliver.label}
          aside={
            <p className="max-w-[56ch] text-lead text-slate-700">
              {doc.deliver.intro}
            </p>
          }
        >
          {doc.deliver.title}
        </SectionHead>

        <ol className="mt-12 border-t-[1.5px] border-t-navy lg:mt-16">
          {doc.deliver.items.map((it, i) => (
            <li
              key={it.title}
              className="reveal group border-b border-[var(--hairline)]"
            >
              <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-3 py-7 transition-colors hover:bg-white lg:py-9">
                <span className="col-span-2 font-mono text-overline text-slate-500 lg:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-10 flex items-center gap-3 lg:col-span-2">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-[3px] transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:scale-[1.4]"
                    style={{ background: colour }}
                  />
                  <Label className="text-slate-700">{it.tag}</Label>
                </span>
                <h3 className="col-span-12 text-[clamp(1.625rem,1.1rem+1.9vw,2.75rem)] leading-[1.04] font-medium tracking-[-0.04em] text-balance transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1 lg:col-span-5">
                  {it.title}
                </h3>
                <p className="col-span-12 max-w-[46ch] text-[0.9375rem] text-slate-700 lg:col-span-4">
                  {it.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
