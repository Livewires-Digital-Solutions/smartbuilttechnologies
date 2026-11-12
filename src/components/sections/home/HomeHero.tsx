"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { BuildingPoster } from "@/components/home/building/BuildingPoster";
import { BuildingScene } from "@/components/home/building/BuildingScene";
import { LAYERS, type ActiveLayer } from "@/components/home/building/geometry";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const HEADLINE = ["Your building,", "modelled before", "it’s built"];

/** Share of the pinned scroll used by the opening and closing "all layers" views. */
const LEAD = 0.05;
const TAIL = 0.04;

const reducedMotion = {
  subscribe(cb: () => void) {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    q.addEventListener("change", cb);
    return () => q.removeEventListener("change", cb);
  },
  get: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  server: () => false,
};

/** Whether this browser can run WebGL. Checked once; assumed true on the server so no poster is drawn. */
let webglSupport: boolean | null = null;
const webgl = {
  subscribe: () => () => {},
  get: () => {
    if (webglSupport === null) {
      const c = document.createElement("canvas");
      webglSupport = !!(c.getContext("webgl2") ?? c.getContext("webgl"));
    }
    return webglSupport;
  },
  server: () => true,
};

const phaseAt = (p: number): ActiveLayer => {
  if (p < LEAD || p > 1 - TAIL) return "all";
  const i = Math.floor(((p - LEAD) / (1 - LEAD - TAIL)) * 4);
  return Math.min(3, Math.max(0, i)) as 0 | 1 | 2 | 3;
};

/**
 * Hero, split left and right. Left: the headline, one line, the buttons, and the
 * four layers as a list. Right: the 3D building on a tall stage. On wide screens
 * the hero pins and scrolling drives it: the building turns and the camera moves
 * to each layer in turn (Model, Scan, Connect, Hand over) while the list follows.
 * Clicking a layer scrolls to its moment. Without WebGL, or with reduced motion,
 * an isometric drawing takes the stage and the layers are simply clickable.
 */
export function HomeHero() {
  const [active, setActive] = useState<ActiveLayer>("all");
  const [failed, setFailed] = useState(false);
  const reduced = useSyncExternalStore(
    reducedMotion.subscribe,
    reducedMotion.get,
    reducedMotion.server,
  );
  const hasWebgl = useSyncExternalStore(
    webgl.subscribe,
    webgl.get,
    webgl.server,
  );
  /** The drawn building is only for visitors who cannot, or should not, get the 3D one. */
  const still = reduced || !hasWebgl || failed;
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
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
        end: () => `+=${Math.round(window.innerHeight * 2.8)}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.current = self.progress;
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
        progress.current = 0;
      };
    });
    return () => mm.revert();
  }, [reduced]);

  /** Choosing a layer scrolls to its moment in the pinned sequence (or just selects it when not pinned). */
  const pick = (a: 0 | 1 | 2 | 3) => {
    const t = trigger.current;
    if (!t) {
      setActive((cur) => (cur === a ? "all" : a));
      return;
    }
    const p = a === active ? 0 : LEAD + ((a + 0.5) / 4) * (1 - LEAD - TAIL);
    const y = t.start + p * (t.end - t.start);
    const smoother = registerGsap().ScrollSmoother.get();
    if (smoother) smoother.scrollTo(y, true);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const layer = active === "all" ? null : LAYERS[active];
  const step = active === "all" ? 0 : active + 1;

  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby="hero-title"
      className="pt-[var(--header-h)] lg:flex lg:h-svh lg:min-h-[640px] lg:flex-col"
      style={
        {
          "--cw": "calc(min(100%, var(--container)) - 2 * var(--margin))",
        } as CSSProperties
      }
      ref={section}
    >
      <div className="container-x flex w-full flex-1 flex-col pb-8 lg:min-h-0 lg:pb-6">
        <div className="grid-12 flex-1 items-stretch gap-y-8 lg:min-h-0">
          {/* Left: words */}
          <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
              <Label>Smart Built Technologies · Chennai</Label>
              <Label className="text-slate-700 lg:hidden">
                The production firm of Technical Xperts Group (TXG) - Saudi
                Arabia
              </Label>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-[clamp(0.75rem,2svh,1.25rem)] py-5 lg:min-h-0">
              <h1 id="hero-title" className="flex flex-col gap-3">
                <span className="font-mono text-overline font-medium text-slate-700 uppercase">
                  BIM, scan to BIM and digital twin services · Chennai
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

              <p className="max-w-[44ch] text-[1.0625rem] leading-snug text-slate-700">
                BIM modelling, scan to BIM, digital twins and CAFM for projects
                worldwide, produced in Chennai.
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
                aria-label="The four layers of our work"
                className="mt-1 border-t-[1.5px] border-t-navy"
              >
                {LAYERS.map((l, i) => {
                  const n = i as 0 | 1 | 2 | 3;
                  const on = active === n;
                  return (
                    <button
                      key={l.key}
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
                        style={{ background: l.colour, scale: on ? 1.4 : 1 }}
                      />
                      <span
                        className={cn(
                          "text-[clamp(1.375rem,1rem+1vw,2rem)] leading-none font-medium tracking-[-0.04em] transition-opacity",
                          active !== "all" && !on && "opacity-45",
                        )}
                      >
                        {l.label}
                      </span>
                      <Label className="ml-auto text-slate-700">
                        {l.phrase}
                      </Label>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: the building */}
          <figure className="relative col-span-12 flex min-h-0 flex-col lg:col-span-5">
            <div className="relative h-[460px] flex-none sm:h-[560px] lg:h-auto lg:min-h-0 lg:flex-1">
              <Label className="absolute top-3.5 right-0 z-10 hidden max-w-[32ch] text-right leading-snug text-slate-700 lg:block">
                The production firm of Technical Xperts Group (TXG) - Saudi
                Arabia
              </Label>
              <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_68%_62%_at_50%_50%,#000_48%,transparent_100%)]">
                {still ? (
                  <BuildingPoster
                    active={active}
                    className="absolute inset-0 h-full w-full lg:pl-[10%]"
                  />
                ) : (
                  <BuildingScene
                    active={active}
                    progress={progress}
                    onFail={() => setFailed(true)}
                    className="absolute inset-0"
                  />
                )}
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-0 flex items-center gap-2"
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-[3px] w-8 transition-colors duration-[var(--duration-ui)]"
                    style={{
                      background:
                        step === i + 1
                          ? LAYERS[i]!.colour
                          : "rgb(12 20 70 / 0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
            <figcaption className="flex flex-col gap-2 border-t border-navy/15 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <Label className="text-slate-700">
                  Fig. 01 ·{" "}
                  {layer
                    ? `0${step} · ${layer.label}: ${layer.phrase}`
                    : "All four layers"}
                </Label>
                <Label className="text-slate-700">
                  {still ? (
                    "Illustrative building"
                  ) : (
                    <>
                      <span className="lg:hidden">Drag to turn it</span>
                      <span className="hidden lg:inline">
                        Scroll or drag to turn it
                      </span>
                    </>
                  )}
                </Label>
              </div>
              <div aria-live="polite" className="min-h-[2.9rem]">
                {layer ? (
                  <p
                    key={layer.key}
                    className="he-card max-w-[74ch] text-[0.9375rem] leading-snug text-slate-700"
                  >
                    {layer.text}{" "}
                    <Link
                      href={layer.href}
                      className="group/l inline-flex items-center gap-1.5 font-semibold whitespace-nowrap text-navy"
                    >
                      <span className="underline underline-offset-[5px]">
                        {layer.service}
                      </span>
                      <Icon
                        name="arrow-right"
                        size={14}
                        className="transition-transform group-hover/l:translate-x-1"
                      />
                    </Link>
                  </p>
                ) : (
                  <p className="text-[0.9375rem] leading-snug text-slate-700">
                    {still ? (
                      "Choose a layer to isolate it."
                    ) : (
                      <>
                        <span className="lg:hidden">
                          Tap a layer to isolate it.
                        </span>
                        <span className="hidden lg:inline">
                          Scroll to take the building apart, layer by layer.
                        </span>
                      </>
                    )}
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
