"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Typography";
import { registerGsap } from "@/lib/gsap";

export interface FilmFrame {
  slug: string;
  name: string;
  location: string;
  sector: string;
  country: string;
  image: { src: string; width: number; height: number };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Projects as a filmstrip. On wide screens the section pins and scrolling slides the
 * strip sideways, one landmark after another, with a counter and a progress line.
 * On phones, and with reduced motion, it is an ordinary swipeable strip.
 */
export function ProjectsFilmstrip({
  frames,
  total,
}: {
  frames: FilmFrame[];
  total: number;
}) {
  const section = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = section.current;
    const vp = wrap.current;
    const tr = track.current;
    if (!el || !vp || !tr) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        vp.style.overflowX = "hidden";
        const dist = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => `+=${Math.round(dist() * 1.05)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(tr, { x: -dist() * self.progress });
            if (bar.current)
              bar.current.style.transform = `scaleX(${self.progress})`;
            if (count.current) {
              const i = Math.min(
                frames.length,
                Math.floor(self.progress * frames.length) + 1,
              );
              count.current.textContent = pad(i);
            }
          },
        });
        return () => {
          st.kill();
          gsap.set(tr, { clearProps: "transform" });
          vp.style.overflowX = "";
          if (bar.current) bar.current.style.transform = "";
          if (count.current) count.current.textContent = "01";
        };
      },
    );
    return () => mm.revert();
  }, [frames.length]);

  return (
    <div
      ref={section}
      className="relative lg:flex lg:h-svh lg:min-h-[640px] lg:items-center lg:overflow-hidden lg:pt-[var(--header-h)]"
    >
      <div className="container-x w-full">
        <div className="grid-12 items-center gap-y-10">
          {/* Left: the running head, pinned with the section */}
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
            <Label className="text-slate-700">/ 06 · Iconic projects</Label>
            <h2 id="projects-title" className="text-h1">
              Landmarks, modelled
            </h2>
            <p className="max-w-[40ch] text-lead text-slate-700">
              Some of the most ambitious buildings in the Gulf and Australia,
              associated with TXG KSA, whose experience and track record are
              Smart Built Technologies’ own.
            </p>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 self-start font-semibold"
            >
              <span className="underline underline-offset-[6px]">
                All {total} projects
              </span>
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
              />
            </Link>

            <div
              className="mt-4 hidden flex-col gap-3 lg:flex"
              aria-hidden="true"
            >
              <div className="flex items-baseline gap-2 font-mono text-overline text-slate-700">
                <span
                  ref={count}
                  className="text-[2.25rem] leading-none font-medium tracking-[-0.04em] text-navy"
                >
                  01
                </span>
                <span>/ {pad(frames.length)}</span>
              </div>
              <div className="h-[2px] w-full max-w-[16rem] bg-navy/12">
                <span
                  ref={bar}
                  className="block h-full origin-left scale-x-0 bg-orange will-change-transform"
                />
              </div>
              <Label className="text-slate-700">Scroll to move along</Label>
            </div>
          </div>

          {/* Right: the strip, bleeding to the screen edge */}
          <div
            ref={wrap}
            className="col-span-12 -mr-[var(--margin)] snap-x snap-mandatory scroll-pl-[var(--margin)] overflow-x-auto pb-4 [scrollbar-width:none] max-lg:-ml-[var(--margin)] max-lg:pl-[var(--margin)] lg:col-span-8 lg:-mr-[calc(var(--margin)_+_max(0px,(100vw_-_var(--container))_/_2))] lg:snap-none lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            <ul
              ref={track}
              className="flex w-max gap-5 pr-[var(--margin)] lg:gap-7 lg:pr-0"
            >
              {frames.map((p, i) => (
                <li
                  key={p.slug}
                  className="w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-[clamp(15rem,24vw,26rem)]"
                >
                  <Link
                    href={`/projects#${p.slug}`}
                    className="group flex flex-col gap-4"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                      <Image
                        src={p.image.src}
                        alt={`${p.name}, ${p.location}`}
                        width={p.image.width}
                        height={p.image.height}
                        sizes="(min-width: 1024px) 26vw, 72vw"
                        className="grade h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.05]"
                      />
                      <span className="absolute top-0 left-0 bg-paper px-3 py-1.5 font-mono text-overline text-navy">
                        {pad(i + 1)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="flex items-start justify-between gap-3 text-[clamp(1.25rem,1.05rem+0.55vw,1.625rem)] leading-[1.1] font-medium tracking-[-0.03em]">
                        {p.name}
                        <Icon
                          name="arrow-up-right"
                          size={20}
                          className="mt-0.5 shrink-0 text-slate-500 transition-[translate,color] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy"
                        />
                      </h3>
                      <Label className="text-slate-700">
                        {p.sector} · {p.location}
                      </Label>
                    </div>
                  </Link>
                </li>
              ))}

              <li className="w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-[clamp(15rem,24vw,26rem)]">
                <Link
                  href="/projects"
                  className="group flex aspect-[4/5] flex-col justify-between bg-navy p-6 text-white transition-colors hover:bg-cobalt"
                >
                  <Label className="text-white/70">More from TXG KSA</Label>
                  <span className="flex flex-col gap-4">
                    <span className="text-[clamp(2.5rem,1.6rem+2.4vw,4rem)] leading-[0.95] font-medium tracking-[-0.05em]">
                      All {total} projects
                    </span>
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <span className="underline underline-offset-[6px]">
                        Open the full list
                      </span>
                      <Icon
                        name="arrow-right"
                        size={16}
                        className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
                      />
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
