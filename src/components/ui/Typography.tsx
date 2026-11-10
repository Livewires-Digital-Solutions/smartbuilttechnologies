import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Overline — the "/ 01 · Section" running head used across the brand PDFs.
 * The slash is orange; the label inherits the surface text colour. This keeps
 * small text above 4.5:1 on light backgrounds (orange text on white is 3.3:1).
 */
export function Overline({
  index,
  children,
  className,
  as: Tag = "p",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("flex items-center gap-2.5 text-overline font-semibold uppercase", className)}>
      <span aria-hidden="true" className="text-orange font-extrabold tracking-normal">
        /
      </span>
      <span>
        {index ? <span className="tabular">{index} · </span> : null}
        {children}
      </span>
    </Tag>
  );
}

/** The tagline, always written "Built with Intelligence." with the orange full stop. */
export function Tagline({ className }: { className?: string }) {
  return (
    <span className={cn("font-semibold", className)}>
      Built with Intelligence<span className="text-orange">.</span>
    </span>
  );
}

/** Ends a headline with the brand's orange full stop. */
export function Stop() {
  return <span className="text-orange">.</span>;
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-[var(--hairline)]", className)} />;
}
