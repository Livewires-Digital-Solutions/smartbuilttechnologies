"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ScrollEffects } from "@/components/layout/ScrollEffects";
import { registerGsap } from "@/lib/gsap";

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
  const pathname = usePathname();

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

  // A new route starts at the top.
  useEffect(() => {
    const { ScrollSmoother, ScrollTrigger } = registerGsap();
    const s = ScrollSmoother.get();
    if (s) s.scrollTop(0);
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
      <ScrollEffects />
    </div>
  );
}
