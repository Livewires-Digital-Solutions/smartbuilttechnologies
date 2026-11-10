import Link from "next/link";
import { cn } from "@/lib/cn";

export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-caption", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden="true" className="opacity-40">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="opacity-70 transition-opacity hover:opacity-100">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-[var(--radius-pill)] bg-navy px-5 py-3 text-sm font-semibold text-white transition-transform focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}
