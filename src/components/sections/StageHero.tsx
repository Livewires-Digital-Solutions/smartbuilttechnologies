"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export interface HeroStage {
  label: string;
  /** Short mono phrase at the right of the list row */
  phrase: string;
  colour: string;
  /** Tag on the photograph */
  chip: string;
  caption: string;
  text: string;
  links: { label: string; href: string }[];
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    position?: string;
  };
}

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
 * A hero built like the home hero. Left: the headline, the buttons and a list of
 * stages. Right: a photograph for the stage in focus. On wide screens the hero
 * pins and scrolling moves through the stages while the list follows; clicking a
 * stage scrolls to its moment. On phones and with reduced motion the stages are
 * simply clickable.
 */
export function StageHero({
  id,
  headerLabel,
  kicker,
  headline,
  lede,
  actions,
  listLabel,
  figureLabel,
  hintTouch,
  hintScroll,
  stages,
}: {
  id: string;
  /** Mono running head over the headline, left */
  headerLabel: string;
  kicker: string;
  headline: string[];
  lede: ReactNode;
  actions: ReactNode;
  /** Accessible name of the stage list */
  listLabel: string;
  figureLabel: string;
  hintTouch: string;
  hintScroll: string;
  stages: HeroStage[];
}) {
  const n = stages.length;
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
        end: () => `+=${Math.round(window.innerHeight * 0.6 * n)}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(n - 1, Math.floor(self.progress * n));
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
  }, [reduced, n]);

  const pick = (i: number) => {
    const t = trigger.current;
    if (!t) {
      setActive(i);
      return;
    }
    const y = t.start + ((i + 0.5) / n) * (t.end - t.start);
    const smoother = registerGsap().ScrollSmoother.get();
    if (smoother) smoother.scrollTo(y, true);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const stage = stages[active]!;

  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby={id}
      className="pt-[var(--header-h)] lg:flex lg:h-svh lg:min-h-[640px] lg:flex-col"
      ref={section}
    >
      <div className="container-x flex w-full flex-1 flex-col pb-8 lg:min-h-0 lg:pb-6">
        <div className="grid-12 flex-1 items-stretch gap-y-8 lg:min-h-0">
          {/* Left: words */}
          <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
              <Label>{headerLabel}</Label>
              <Label className="text-slate-700 lg:hidden">
                {figureLabel}
              </Label>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-[clamp(0.75rem,2svh,1.25rem)] py-5 lg:min-h-0">
              <h1 id={id} className="flex flex-col gap-3">
                <span className="font-mono text-overline font-medium text-slate-700 uppercase">
                  {kicker}
                </span>
                <span className="text-[clamp(2.75rem,min(6.3vw,10svh),7rem)] leading-[0.93] font-medium tracking-[-0.06em]">
                  {headline.map((line, i) => (
                    <span
                      key={line}
                      className="hero-line lg:w-max lg:whitespace-nowrap"
                      style={{ "--i": i } as CSSProperties}
                    >
                      <span>
                        {line}
                        {i === headline.length - 1 ? <Stop /> : " "}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              <p className="max-w-[46ch] text-[1.0625rem] leading-snug text-slate-700">
                {lede}
              </p>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                {actions}
              </div>

              <div
                role="group"
                aria-label={listLabel}
                className="mt-1 border-t-[1.5px] border-t-navy"
              >
                {stages.map((s, i) => {
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

          {/* Right: the photograph for the stage in focus */}
          <figure className="relative col-span-12 flex min-h-0 flex-col lg:col-span-5">
            <div className="hidden items-center justify-end border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5 lg:flex">
              <Label className="text-slate-700">{figureLabel}</Label>
            </div>
            <div className="relative mt-0 h-[380px] flex-none overflow-hidden bg-slate-200 sm:h-[480px] lg:mt-4 lg:h-auto lg:min-h-0 lg:flex-1">
              {stages.map((s, i) => (
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
                {stages.map((s, i) => (
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
                  <span className="lg:hidden">{hintTouch}</span>
                  <span className="hidden lg:inline">{hintScroll}</span>
                </Label>
              </div>
              <div aria-live="polite" className="min-h-[2.9rem]">
                <p
                  key={active}
                  className="he-card max-w-[74ch] text-[0.9375rem] leading-snug text-slate-700"
                >
                  {stage.text}{" "}
                  {stage.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group/l mr-4 inline-flex items-center gap-1.5 font-semibold whitespace-nowrap text-navy"
                    >
                      <span className="underline underline-offset-[5px]">
                        {l.label}
                      </span>
                      <Icon
                        name="arrow-right"
                        size={14}
                        className="transition-transform group-hover/l:translate-x-1"
                      />
                    </Link>
                  ))}
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
