"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import {
  GroupRoute,
  STOPS,
  type RouteActive,
  type RouteStop,
} from "@/components/about/GroupRoute";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const HEADLINE = ["The production", "firm behind", "landmarks"];

/** Share of the pinned scroll used by the opening and closing "whole route" views. */
const LEAD = 0.06;
const TAIL = 0.06;

const STAGES = [
  {
    phrase: "Where it began",
    text: `${site.groupLabel} is founded in Riyadh in ${site.foundedGroup} and builds its record on landmark projects in the Gulf and Australia.`,
    link: { label: "See the projects", href: "/projects" },
  },
  {
    phrase: "Group office",
    text: "A group office in the UAE supports projects for clients across the Gulf.",
    link: { label: "Where we work", href: "#where" },
  },
  {
    phrase: "Production centre",
    text: `${site.name} opens in Chennai as the production firm of ${site.groupLabel}: modelling, scanning, data and software.`,
    link: { label: "Our services", href: "/services" },
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

const phaseAt = (p: number): RouteActive => {
  if (p < LEAD || p > 1 - TAIL) return "all";
  const i = Math.floor(((p - LEAD) / (1 - LEAD - TAIL)) * 3);
  return Math.min(2, Math.max(0, i)) as RouteStop;
};

/**
 * About hero, built like the home hero. Left: the headline, the buttons and the
 * three places of the group as a list. Right: a drawing of the route from Riyadh
 * to Sharjah to Chennai. On wide screens the hero pins and scrolling travels the
 * route, place by place, while the list follows; clicking a place scrolls to its
 * moment. On phones and with reduced motion the places are simply clickable.
 */
export function AboutHero() {
  const [active, setActive] = useState<RouteActive>("all");
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
        end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = phaseAt(self.progress);
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

  const pick = (a: RouteStop) => {
    const t = trigger.current;
    if (!t) {
      setActive((cur) => (cur === a ? "all" : a));
      return;
    }
    const p = a === active ? 0 : LEAD + ((a + 0.5) / 3) * (1 - LEAD - TAIL);
    const y = t.start + p * (t.end - t.start);
    const smoother = registerGsap().ScrollSmoother.get();
    if (smoother) smoother.scrollTo(y, true);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const stage = active === "all" ? null : STAGES[active];
  const step = active === "all" ? 0 : active + 1;

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
                aria-label="The three places of the group"
                className="mt-1 border-t-[1.5px] border-t-navy"
              >
                {STOPS.map((s, i) => {
                  const n = i as RouteStop;
                  const on = active === n;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(n)}
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
                          active !== "all" && !on && "opacity-45",
                        )}
                      >
                        {s.city}
                      </span>
                      <Label className="ml-auto text-slate-700">
                        {STAGES[i]!.phrase}
                      </Label>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: the route */}
          <figure className="relative col-span-12 flex min-h-0 flex-col lg:col-span-5">
            <div className="relative h-[400px] flex-none sm:h-[480px] lg:h-auto lg:min-h-0 lg:flex-1">
              <Label className="absolute top-3.5 right-0 z-10 hidden whitespace-nowrap text-right text-slate-700 lg:block">
                The production firm of TXG, KSA
              </Label>
              <div
                className="absolute inset-0"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)",
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }}
              >
                <GroupRoute active={active} className="absolute inset-0" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-0 flex items-center gap-2"
              >
                {STOPS.map((s, i) => (
                  <span
                    key={s.key}
                    className="h-[3px] w-8 transition-colors duration-[var(--duration-ui)]"
                    style={{
                      background:
                        step === i + 1 ? s.colour : "rgb(12 20 70 / 0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
            <figcaption className="flex flex-col gap-2 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <Label className="text-slate-700">
                  Fig. 01 ·{" "}
                  {stage
                    ? `0${step} · ${STOPS[step - 1]!.city}: ${stage.phrase}`
                    : "The whole route"}
                </Label>
                <Label className="text-slate-700">
                  <span className="lg:hidden">Tap a place</span>
                  <span className="hidden lg:inline">
                    Scroll to travel the route
                  </span>
                </Label>
              </div>
              <div aria-live="polite" className="min-h-[2.9rem]">
                {stage ? (
                  <p
                    key={step}
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
                ) : (
                  <p className="max-w-[74ch] text-[0.9375rem] leading-snug text-slate-700">
                    From the headquarters in Riyadh, through the group office
                    in Sharjah, to the production centre in Chennai.
                  </p>
                )}
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
