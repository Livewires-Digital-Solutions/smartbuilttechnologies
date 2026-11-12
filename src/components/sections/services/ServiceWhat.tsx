import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import type { ServiceDoc } from "@/content/service-pages";
import { projects, projectsForService } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * "What is …?": the definition in the home page's about layout. The text sits
 * beside a real project where the group has one for this service, and the key
 * figures run underneath in big type.
 */
export function ServiceWhat({ doc }: { doc: ServiceDoc }) {
  // The NEOM Bay Airport photograph has a logo baked in, so it is not used as a figure.
  const project =
    projectsForService(doc.slug).find((p) => p.slug !== "neom-bay-airport-t1-t2") ??
    projects.find((p) => p.slug === "king-abdullah-financial-district") ??
    projects[0]!;
  const cols = doc.what.stats.length;

  return (
    <Section surface="white" aria-labelledby="what-title">
      <div className="container-x">
        <SectionHead id="what-title" index="01" label={doc.what.label}>
          {doc.what.title}
        </SectionHead>

        <div className="grid-12 mt-12 items-start gap-y-12 lg:mt-16">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-6 lg:col-start-4">
            {doc.what.body.map((p, i) => (
              <p
                key={i}
                className={cn(
                  "reveal max-w-[54ch]",
                  i === 0
                    ? "text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] leading-[1.3] tracking-[-0.02em]"
                    : "text-lead text-slate-700",
                )}
              >
                {p}
              </p>
            ))}
          </div>

          <figure className="reveal col-span-12 flex flex-col gap-3 lg:col-span-3 lg:col-start-10">
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
              <Image
                src={project.image.src}
                alt={`${project.name}, ${project.location}`}
                width={project.image.width}
                height={project.image.height}
                sizes="(min-width: 1024px) 24vw, 100vw"
                className="grade h-full w-full object-cover"
              />
              <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                Associated with {site.groupLabel}
              </span>
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <Label className="text-slate-700">Fig. 02 · {project.name}</Label>
              <Label className="text-slate-700">{project.location}</Label>
            </figcaption>
          </figure>
        </div>

        <dl
          className={cn(
            "reveal mt-16 grid grid-cols-2 border-t-[1.5px] border-t-navy lg:mt-24",
            cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {doc.what.stats.map((f, i) => (
            <div
              key={f.big}
              className={cn(
                "flex flex-col gap-2 border-b border-[var(--hairline)] py-6 pr-4 lg:border-b-0 lg:py-8",
                i > 0 && "lg:border-l lg:pl-8",
                i % 2 === 1 && "pl-4 max-lg:border-l",
              )}
            >
              <dt className="order-2 mt-2">
                <Label>{f.label}</Label>
              </dt>
              <dd className="order-1 text-[clamp(3.25rem,2rem+4.6vw,6.25rem)] leading-[0.9] font-medium tracking-[-0.06em]">
                {f.big}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
