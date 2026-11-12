"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { ScrollEffects } from "@/components/layout/ScrollEffects";
import { registerGsap, scrollToElement } from "@/lib/gsap";

/**
 * Site-wide smooth scrolling with GSAP ScrollSmoother. Everything inside is the
 * scrolling page; the fixed header lives outside it. Skipped entirely when the
 * visitor prefers reduced motion, and on touch screens ScrollSmoother leaves
 * native scrolling alone, so phones keep their own momentum.
 *
 * ScrollSmoother moves the page with transforms, so CSS `position: sticky` does
 * not work inside it. Sticky blocks use <StickyPin> (a GSAP pin) instead.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { ScrollSmoother, ScrollTrigger } = registerGsap();
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.15,
      smoothTouch: false,
      effects: false,
    });
    // fonts and images change the page height after load
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener("load", refresh);
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
      {/* these two read the route, so they sit in Suspense: a page whose address is only
          known at request time (a job page) then does not hold up the whole shell */}
      <Suspense fallback={null}>
        <ScrollToTopOnRoute />
        <ScrollEffects />
      </Suspense>
    </div>
  );
}

/**
 * A new route starts at the top, unless its address names a section (`/careers#apply`,
 * `/projects#riyadh-metro`): then it goes there.
 *
 * Two things make that less simple than it sounds. The section may arrive a moment
 * later (the careers list is read from the database), so it is looked for until it
 * appears. And while a page is still starting up, the smooth scroller and the pinned
 * sections reset the scroll position more than once, so the target is held for a short
 * while after it is first reached. Any input from the visitor ends that at once.
 */
function ScrollToTopOnRoute() {
  const pathname = usePathname();
  useEffect(() => {
    const { ScrollSmoother, ScrollTrigger } = registerGsap();
    const s = ScrollSmoother.get();
    if (s) s.scrollTop(0);
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();

    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const FIND_MS = 4000;
    const HOLD_MS = 1500;
    const started = performance.now();
    let reachedAt = 0;
    let refreshed = false;

    const stop = () => {
      window.clearInterval(timer);
      for (const e of EVENTS) window.removeEventListener(e, stop);
    };
    const EVENTS = [
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
      "hashchange",
    ];
    for (const e of EVENTS) window.addEventListener(e, stop, { passive: true });

    const timer = window.setInterval(() => {
      const now = performance.now();
      const el = document.getElementById(id);
      if (!el) {
        if (now - started > FIND_MS) stop();
        return;
      }
      if (!refreshed) {
        // the page height may have changed since the first pass
        refreshed = true;
        ScrollTrigger.refresh();
      }
      // the element's own scroll margin (project cards have one) is the gap to leave above it
      const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      if (Math.abs(el.getBoundingClientRect().top - offset) > 4) {
        scrollToElement(el, offset);
      }
      if (!reachedAt) reachedAt = now;
      if (now - reachedAt > HOLD_MS) stop();
    }, 100);
    return stop;
  }, [pathname]);
  return null;
}
