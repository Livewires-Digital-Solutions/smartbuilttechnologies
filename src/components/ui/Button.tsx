import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/**
 * Buttons. Orange (`signal`) is the ONE call to action per view and always
 * carries a navy label (5.4:1); white on orange fails AA (Colour System p.6).
 */
export type ButtonVariant = "signal" | "primary" | "inverse" | "outline" | "outline-inverse" | "ghost";
type Size = "md" | "sm";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-pill)] font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,box-shadow] duration-[var(--duration-micro)] ease-[var(--ease-out)] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  signal: "bg-orange text-navy hover:bg-orange-80 active:bg-orange",
  primary: "bg-navy text-white hover:bg-navy-80 active:bg-navy",
  inverse: "bg-white text-navy hover:bg-paper active:bg-white",
  outline: "border border-navy/25 text-navy hover:border-navy hover:bg-white",
  "outline-inverse": "border border-white/35 text-white hover:border-white hover:bg-white/8",
  ghost: "px-0! h-auto! rounded-none text-current underline-offset-[6px] decoration-1 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.9375rem]",
  sm: "h-10 px-5 text-sm",
};

interface Common {
  variant?: ButtonVariant;
  size?: Size;
  icon?: IconName | null;
  className?: string;
  children: ReactNode;
}

function Content({ children, icon }: { children: ReactNode; icon?: IconName | null }) {
  return (
    <>
      <span>{children}</span>
      {icon ? (
        <Icon
          name={icon}
          size={18}
          className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover/btn:translate-x-[3px] group-hover/btn:-translate-y-[1.5px]"
        />
      ) : null}
    </>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon = "arrow-right",
  className,
  children,
  ...props
}: Common & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Content icon={icon}>{children}</Content>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  icon = null,
  className,
  children,
  type = "button",
  ...props
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Content icon={icon}>{children}</Content>
    </button>
  );
}
