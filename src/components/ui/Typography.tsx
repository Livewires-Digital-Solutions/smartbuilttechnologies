import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Overline — the "/ 01 · Section" running head used across the brand PDFs,
 * set in the mono label voice. The slash is a quiet mark in the text colour so
 * that orange stays free for the one focal point per screen (Design direction v2).
 */
export function Overline({
  index,
  children,
  className,
  id,
  as: Tag = "p",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
}) {
  return (
    <Tag id={id} className={cn("flex items-center gap-2 font-mono text-overline font-medium uppercase", className)}>
      <span aria-hidden="true" className="opacity-50">
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

/** Small mono label: title-block keys, captions, figure numbers. */
export function Label({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={cn("font-mono text-overline font-medium uppercase", className)}>{children}</Tag>;
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-[var(--hairline)]", className)} />;
}
