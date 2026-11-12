"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import type { Project, Sector } from "@/content/projects";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** The NEOM Bay Airport photograph has a logo baked into its lower edge; cropping from the top keeps it out of the frame. */
const IMAGE_POSITION: Record<string, string> = {
  "neom-bay-airport-t1-t2": "50% 0%",
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Every project, with the client, location and scope as the group publishes them.
 * Sector chips filter the list instantly. A link to `/projects#slug` (from the
 * home page strip or the hero) always lands on its project: if a filter is hiding
 * it, the filter is cleared first.
 */
export function ProjectsGallery({
  projects,
  sectors,
  tag,
}: {
  projects: Project[];
  sectors: Sector[];
  /** "Associated with TXG, KSA" */
  tag: string;
}) {
  const [sector, setSector] = useState<Sector | "All">("All");
  const shown =
    sector === "All" ? projects : projects.filter((p) => p.sector === sector);

  useEffect(() => {
    const toHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id || !projects.some((p) => p.slug === id)) return;
      setSector("All");
      // let the full list render, then scroll under the smoother (native hash scroll cannot see it)
      window.setTimeout(() => {
        const el = document.getElementById(id);
        if (!el) return;
        const smoother = registerGsap().ScrollSmoother.get();
        if (smoother) smoother.scrollTo(el, true, "top 110px");
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 450);
    };
    toHash();
    window.addEventListener("hashchange", toHash);
    return () => window.removeEventListener("hashchange", toHash);
  }, [projects]);

  return (
    <div id="all-projects" className="container-x">
      <SectionHead id="projects-list-title" index="01" label="All projects">
        {projects.length} projects
      </SectionHead>

      <div
        role="group"
        aria-label="Filter by sector"
        className="mt-10 flex flex-wrap gap-2 lg:mt-14"
      >
        {(["All", ...sectors] as const).map((s) => {
          const on = sector === s;
          const n =
            s === "All"
              ? projects.length
              : projects.filter((p) => p.sector === s).length;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={on}
              onClick={() => setSector(s)}
              className={cn(
                "inline-flex items-center gap-2 rounded-[var(--radius-button)] border px-3.5 py-2 font-mono text-overline font-medium uppercase transition-colors duration-[var(--duration-ui)]",
                on
                  ? "border-navy bg-navy text-white"
                  : "border-navy/25 text-navy hover:border-navy",
              )}
            >
              {s}
              <span className={on ? "text-white/70" : "text-slate-500"}>
                {pad(n)}
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {shown.length} projects
      </p>

      <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        {shown.map((p, i) => (
          <li
            key={p.slug}
            id={p.slug}
            className="group/card scroll-mt-28 border-t-[1.5px] border-t-navy pt-4 target:[&_h3]:text-cobalt"
          >
            <article className="flex flex-col gap-5">
              <div className="flex items-baseline justify-between gap-4">
                <Label className="text-slate-500">{pad(i + 1)}</Label>
                <Label className="text-slate-700">{p.sector}</Label>
              </div>
              <div className="relative aspect-[5/4] overflow-hidden bg-slate-200">
                <Image
                  src={p.image.src}
                  alt={`${p.name}, ${p.location}`}
                  width={p.image.width}
                  height={p.image.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                  className="grade h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover/card:scale-[1.04]"
                  style={{ objectPosition: IMAGE_POSITION[p.slug] }}
                />
                <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                  {tag}
                </span>
              </div>
              <h3 className="text-[clamp(1.5rem,1.15rem+1.1vw,2.125rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance transition-colors">
                {p.name}
              </h3>
              <dl className="flex flex-col border-t border-[var(--hairline)] text-[0.9375rem]">
                <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-[var(--hairline)] py-3">
                  <dt className="pt-0.5">
                    <Label className="text-slate-700">Client</Label>
                  </dt>
                  <dd className="font-medium">{p.client}</dd>
                </div>
                <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-[var(--hairline)] py-3">
                  <dt className="pt-0.5">
                    <Label className="text-slate-700">Location</Label>
                  </dt>
                  <dd className="font-medium">{p.location}</dd>
                </div>
                <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-3">
                  <dt className="pt-0.5">
                    <Label className="text-slate-700">Scope</Label>
                  </dt>
                  <dd>
                    <ul className="flex flex-col gap-1.5 text-slate-700">
                      {p.scope.map((s) => (
                        <li key={s} className="relative pl-3.5">
                          <span
                            aria-hidden="true"
                            className="absolute top-[0.6em] left-0 size-1 rounded-[1px] bg-navy"
                          />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
