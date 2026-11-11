"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { registerGsap } from "@/lib/gsap";

/**
 * Scroll-triggered reveals and the "Why BIM" stage lighting, for the whole site.
 *
 * These used to be CSS scroll timelines, which cannot see the transform that GSAP
 * ScrollSmoother applies, so revealed content never appeared. IntersectionObserver
 * and ScrollTrigger both read real on-screen positions and work with smoothing.
 *
 * - `.reveal` elements fade in once as they enter. Siblings that enter together are
 *   staggered. Anything already on screen shows immediately, so there is no flash.
 * - `.why-stage` elements get `--on` (0 → 1 → 0) from their scroll progress.
 *
 * Nothing is hidden until this has run (`html[data-reveal]`), and it does nothing at
 * all when the visitor prefers reduced motion.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      return;
    }

    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add("is-in");
    }
    root.setAttribute("data-reveal", "");

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${Math.min(n, 5) * 90}ms`);
          el.classList.add("is-in");
          io.unobserve(el);
          n++;
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of items) if (!el.classList.contains("is-in")) io.observe(el);

    const { ScrollTrigger } = registerGsap();
    const triggers = Array.from(document.querySelectorAll<HTMLElement>(".why-stage")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: ({ progress: p }) => {
          // 0 → 1 over the first 40%, hold to 60%, back to 0
          const on = p < 0.4 ? p / 0.4 : p > 0.6 ? Math.max(0, (1 - p) / 0.4) : 1;
          el.style.setProperty("--on", on.toFixed(3));
        },
      }),
    );

    return () => {
      io.disconnect();
      triggers.forEach((t) => t.kill());
      root.removeAttribute("data-reveal");
    };
  }, [pathname]);

  return null;
}
