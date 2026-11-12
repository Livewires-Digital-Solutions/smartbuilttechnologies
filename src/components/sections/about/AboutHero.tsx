"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const HEADLINE = ["The production", "firm behind", "landmarks"];

const riyadhMetro = projects.find((p) => p.slug === "riyadh-metro");

/** The three chapters of the story, each with its own photograph. */
const STAGES = [
  {
    label: "The record",
    phrase: `Since ${site.foundedGroup}`,
    colour: "var(--color-navy)",
    chip: `Associated with ${site.groupLabel}`,
    caption: "King Abdullah Financial District",
    text: `${site.groupLabel} is founded in Riyadh in ${site.foundedGroup} and builds its record on landmark projects in the Gulf and Australia.`,
    link: { label: "See the projects", href: "/projects" },
    image: {
      src: "/assets/misc/hero-architecture.webp",
      width: 2400,
      height: 1432,
      alt: "The King Abdullah Financial District skyline in Riyadh at sunset",
      position: "55% 40%",
    },
  },
  {
    label: "The group",
    phrase: "Riyadh · Sharjah",
    colour: "var(--color-cobalt)",
    chip: `Associated with ${site.groupLabel}`,
    caption: riyadhMetro
      ? `${riyadhMetro.name}, ${riyadhMetro.location}`
      : "Riyadh",
    text: "Group teams in Riyadh and Sharjah work with clients across the Gulf, on projects that shape the region’s skylines.",
    link: { label: "Where we work", href: "#where" },
    image: {
      src: riyadhMetro?.image.src ?? "/assets/misc/hero-architecture.webp",
      width: riyadhMetro?.image.width ?? 2400,
      height: riyadhMetro?.image.height ?? 1432,
      alt: riyadhMetro ? `${riyadhMetro.name}, ${riyadhMetro.location}` : "",
      position: "50% 50%",
    },
  },
  {
    label: "The production firm",
    phrase: "Chennai · Now",
    colour: "var(--color-orange)",
    chip: "From drawing to model",
    caption: "Modelling, scanning, data and software",
    text: `${site.name} opens in Chennai as the production firm of ${site.groupLabel}, carrying the group’s experience into every model.`,
    link: { label: "Our services", href: "/services" },
    image: {
      src: "/assets/misc/team-at-work.jpg",
      width: 1040,
      height: 660,
      alt: "A hand holding a building model over architectural drawings",
      position: "62% 50%",
    },
  },
] as const;

const reducedMotion = {
  subscribe(cb: () => void) {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    q.addEventListener("change", cb);
    return () => q.removeEventListener("change", cb);
  },
  get: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  server: () => false,
};

/**
 * About hero, built like the home hero. Left: the headline, the buttons and the
 * three chapters of the story as a list. Right: a photograph for the chapter in
 * focus. On wide screens the hero pins and scrolling moves through the chapters
 * while the list follows; clicking a chapter scrolls to its moment. On phones and
 * with reduced motion the chapters are simply clickable.
 */
export function AboutHero() {
  const [active, setActive] = useState(0);
  const reduced = useSyncExternalStore(
    reducedMotion.subscribe,
    reducedMotion.get,
    reducedMotion.server,
  );
  const section = useRef<HTMLElement>(null);
  const trigger = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 1.8)}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(2, Math.floor(self.progress * 3));
          setActive((cur) => (cur === next ? cur : next));
        },
        onRefresh: (self) => {
          trigger.current = { start: self.start, end: self.end };
        },
      });
      trigger.current = { start: st.start, end: st.end };
      return () => {
        st.kill();
        trigger.current = null;
      };
    });
    return () => mm.revert();
  }, [reduced]);

  const pick = (i: number) => {
    const t = trigger.current;
    if (!t) {
      setActive(i);
      return;
    }
    const y = t.start + ((i + 0.5) / 3) * (t.end - t.start);
    const smoother = registerGsap().ScrollSmoother.get();
    if (smoother) smoother.scrollTo(y, true);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const stage = STAGES[active]!;

  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby="about-hero-title"
      className="pt-[var(--header-h)] lg:flex lg:h-svh lg:min-h-[640px] lg:flex-col"
      ref={section}
    >
      <div className="container-x flex w-full flex-1 flex-col pb-8 lg:min-h-0 lg:pb-6">
        <div className="grid-12 flex-1 items-stretch gap-y-8 lg:min-h-0">
          {/* Left: words */}
          <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
              <Label>Smart Built Technologies · About</Label>
              <Label className="text-slate-700 lg:hidden">
                The production firm of TXG, KSA
              </Label>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-[clamp(0.75rem,2svh,1.25rem)] py-5 lg:min-h-0">
              <h1 id="about-hero-title" className="flex flex-col gap-3">
                <span className="font-mono text-overline font-medium text-slate-700 uppercase">
                  About us · Part of {site.groupLabel} since {site.foundedGroup}
                </span>
                <span className="text-[clamp(2.75rem,min(6.3vw,10svh),7rem)] leading-[0.93] font-medium tracking-[-0.06em]">
                  {HEADLINE.map((line, i) => (
                    <span
                      key={line}
                      className="hero-line lg:w-max lg:whitespace-nowrap"
                      style={{ "--i": i } as CSSProperties}
                    >
                      <span>
                        {line}
                        {i === HEADLINE.length - 1 ? <Stop /> : " "}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              <p className="max-w-[46ch] text-[1.0625rem] leading-snug text-slate-700">
                {site.name} is the production firm of {site.group}. From a newly
                opened production centre in Chennai, we carry the experience of{" "}
                {projects.length} landmark projects into every model we deliver.
              </p>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <ButtonLink href="/contact" variant="signal">
                  Start a project
                </ButtonLink>
                <ButtonLink
                  href="/projects"
                  variant="ghost"
                  className="underline"
                >
                  Our projects
                </ButtonLink>
              </div>

              <div
                role="group"
                aria-label="The story in three chapters"
                className="mt-1 border-t-[1.5px] border-t-navy"
              >
                {STAGES.map((s, i) => {
                  const on = active === i;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(i)}
                      className="group flex w-full items-center gap-4 border-b border-[var(--hairline)] py-[clamp(0.35rem,1.15svh,0.7rem)] text-left"
                    >
                      <span className="w-6 font-mono text-overline text-slate-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden="true"
                        className="size-3 shrink-0 rounded-[3px] transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)]"
                        style={{ background: s.colour, scale: on ? 1.4 : 1 }}
                      />
                      <span
                        className={cn(
                          "text-[clamp(1.375rem,1rem+1vw,2rem)] leading-none font-medium tracking-[-0.04em] transition-opacity",
                          !on && "opacity-45",
                        )}
                      >
                        {s.label}
                      </span>
                      <Label className="ml-auto text-slate-700">
                        {s.phrase}
                      </Label>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: the photograph for the chapter in focus */}
          <figure className="relative col-span-12 flex min-h-0 flex-col lg:col-span-5">
            <div className="hidden items-center justify-end border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5 lg:flex">
              <Label className="text-slate-700">
                The production firm of TXG, KSA
              </Label>
            </div>
            <div className="relative mt-0 h-[380px] flex-none overflow-hidden bg-slate-200 sm:h-[480px] lg:mt-4 lg:h-auto lg:min-h-0 lg:flex-1">
              {STAGES.map((s, i) => (
                <Image
                  key={s.label}
                  src={s.image.src}
                  alt={i === active ? s.image.alt : ""}
                  aria-hidden={i === active ? undefined : true}
                  width={s.image.width}
                  height={s.image.height}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  priority={i === 0}
                  className="grade absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-[900ms] ease-[var(--ease-out)]"
                  style={{
                    objectPosition: s.image.position,
                    opacity: i === active ? 1 : 0,
                    scale: i === active ? 1 : 1.06,
                  }}
                />
              ))}
              <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                {stage.chip}
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2"
              >
                {STAGES.map((s, i) => (
                  <span
                    key={s.label}
                    className="h-[3px] w-8 transition-colors duration-[var(--duration-ui)]"
                    style={{
                      background:
                        i === active ? s.colour : "rgb(255 255 255 / 0.55)",
                    }}
                  />
                ))}
              </div>
            </div>
            <figcaption className="flex flex-col gap-2 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <Label className="text-slate-700">
                  Fig. 01 · 0{active + 1} · {stage.label}: {stage.caption}
                </Label>
                <Label className="text-slate-700">
                  <span className="lg:hidden">Tap a chapter</span>
                  <span className="hidden lg:inline">
                    Scroll to read the story
                  </span>
                </Label>
              </div>
              <div aria-live="polite" className="min-h-[2.9rem]">
                <p
                  key={active}
                  className="he-card max-w-[74ch] text-[0.9375rem] leading-snug text-slate-700"
                >
                  {stage.text}{" "}
                  <Link
                    href={stage.link.href}
                    className="group/l inline-flex items-center gap-1.5 font-semibold whitespace-nowrap text-navy"
                  >
                    <span className="underline underline-offset-[5px]">
                      {stage.link.label}
                    </span>
                    <Icon
                      name="arrow-right"
                      size={14}
                      className="transition-transform group-hover/l:translate-x-1"
                    />
                  </Link>
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
