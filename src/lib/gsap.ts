"use client";

import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register GSAP plugins once, on the client. */
export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    registered = true;
  }
  return { gsap, ScrollTrigger, ScrollSmoother };
}

/**
 * Scrolls the page to an element, `offset` pixels below the top of the window. On a
 * desktop the smooth scroller does it. On touch screens the smooth scroller is switched
 * off and ignores the request, so the window is scrolled directly.
 */
export function scrollToElement(el: Element, offset = 0, smooth = false) {
  const { ScrollSmoother, ScrollTrigger } = registerGsap();
  const smoother = ScrollSmoother.get();
  if (smoother && ScrollTrigger.isTouch !== 1) {
    smoother.scrollTo(el, smooth, `top ${offset}px`);
    return;
  }
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top: Math.max(0, y),
    behavior: smooth ? "smooth" : "instant",
  });
}

export { gsap, ScrollTrigger, ScrollSmoother };
