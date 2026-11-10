import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/* Figure — every image is a captioned, numbered figure.                      */
/* -------------------------------------------------------------------------- */

export function Figure({
  src,
  alt,
  width,
  height,
  number,
  caption,
  sizes,
  priority,
  className,
  imageClassName,
  aspect,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  number?: number | string;
  caption?: ReactNode;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Crop to a fixed ratio, e.g. "4/5" */
  aspect?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div
        className="relative overflow-hidden rounded-[var(--radius-card)] bg-navy-10"
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={cn("grade h-full w-full object-cover", imageClassName)}
        />
      </div>
      {caption ? (
        <figcaption className="text-caption text-slate-500 [[data-surface=dark]_&]:text-white/60">
          {number !== undefined ? (
            <span className="tabular font-semibold text-current">Fig. {String(number).padStart(2, "0")} — </span>
          ) : null}
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* SpecList — a ruled definition list, like a drawing title block.            */
/* -------------------------------------------------------------------------- */

export interface Spec {
  term: string;
  value: ReactNode;
}

export function SpecList({ items, className }: { items: Spec[]; className?: string }) {
  return (
    <dl className={cn("border-t border-[var(--hairline)]", className)}>
      {items.map((item) => (
        <div
          key={item.term}
          className="grid grid-cols-[minmax(6.5rem,1fr)_2.4fr] gap-x-6 gap-y-1 border-b border-[var(--hairline)] py-3.5"
        >
          <dt className="text-caption font-medium uppercase tracking-[0.12em] text-slate-500 [[data-surface=dark]_&]:text-white/60">
            {item.term}
          </dt>
          <dd className="text-body">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------------------- */
/* KeyFigure — a figure in tabular numerals with a short caption.             */
/* -------------------------------------------------------------------------- */

export function KeyFigure({
  value,
  label,
  signal,
  className,
}: {
  value: string;
  label: string;
  /** Mark as the page's one orange key figure */
  signal?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className={cn("tabular text-h1 font-extrabold leading-none tracking-[-0.02em]", signal && "text-orange")}>
        {value}
      </span>
      <span className="text-caption text-slate-500 [[data-surface=dark]_&]:text-white/64">{label}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tag                                                                        */
/* -------------------------------------------------------------------------- */

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-[var(--radius-pill)] border border-[var(--hairline)] px-3 text-caption font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
