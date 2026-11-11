"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * A "sticky" block that works inside GSAP ScrollSmoother, where CSS sticky does
 * not. On wide screens it pins to the top of the viewport while its parent column
 * is still on screen, then lets go at the bottom of that column. `top` is in
 * rem, added to the header height.
 */
export function StickyPin({
  children,
  topRem = 2,
  className,
  ...rest
}: {
  children: ReactNode;
  topRem?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const header = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 80;
      const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const offset = () => header() + topRem * rem();
      const st = ScrollTrigger.create({
        trigger: parent,
        start: () => `top top+=${offset()}`,
        end: () => `+=${Math.max(parent.offsetHeight - el.offsetHeight, 0)}`,
        pin: el,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [topRem]);

  return (
    <div ref={ref} className={cn(className)} {...rest}>
      {children}
    </div>
  );
}
