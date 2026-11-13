import Image from "next/image";
import { SymbolCrop } from "@/components/brand/Symbol";
import { cn } from "@/lib/cn";

/**
 * A post's or event's picture, filling its box. With no picture it shows a quiet
 * navy panel with the brand symbol and the category, so lists never have gaps.
 */
export function PostCover({
  src,
  alt,
  label,
  sizes,
  priority,
  className,
}: {
  src: string | null;
  alt?: string | null;
  label?: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-navy", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="grade object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
      ) : (
        <>
          <SymbolCrop
            tone="ghost-white"
            className="absolute -right-[18%] -bottom-[30%] w-[85%]"
          />
          {label ? (
            <span className="absolute bottom-3 left-4 font-mono text-overline font-medium text-white/80 uppercase">
              {label}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}
