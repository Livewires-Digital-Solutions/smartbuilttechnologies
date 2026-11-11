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

export { gsap, ScrollTrigger, ScrollSmoother };
