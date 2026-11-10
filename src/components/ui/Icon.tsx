import { cn } from "@/lib/cn";

/**
 * Interface icons drawn to the brand icon rules: 24px grid, 1.75px stroke,
 * round caps, and diagonals at 30° (or its isometric complement, 60°).
 */
const PATHS = {
  "arrow-right": "M4 12H20M14.8 9L20 12L14.8 15",
  /** Up-right at a true 30°, head lines at 180° and 240° */
  "arrow-up-right": "M5.07 17L18.93 9M18.93 9H12.93M18.93 9L15.93 14.2",
  "arrow-left": "M20 12H4M9.2 9L4 12L9.2 15",
  "arrow-down": "M12 4V20M9 14.8L12 20L15 14.8",
  "chevron-down": "M6 9.5L12 12.96L18 9.5",
  plus: "M12 5V19M5 12H19",
  minus: "M5 12H19",
  close: "M7.96 5L16.04 19M16.04 5L7.96 19",
  menu: "M4 9H20M4 15H20",
  download: "M12 4V15M9 9.8L12 15L15 9.8M5 20H19",
  external: "M10 6H6V18H18V14M13 5H19V11M19 5L11.5 12.5",
  grid: "M4.5 4.5H10.5V10.5H4.5ZM13.5 4.5H19.5V10.5H13.5ZM4.5 13.5H10.5V19.5H4.5ZM13.5 13.5H19.5V19.5H13.5Z",
  list: "M4 6H20M4 12H20M4 18H20",
  play: "M8 5.5V18.5L19 12Z",
  mail: "M4 6H20V18H4ZM4 6L12 12.6L20 6",
  phone:
    "M8.6 4.5L10.4 8.6L8.4 10.1C9.3 12 10.9 13.7 12.9 14.6L14.4 12.6L18.5 14.4L17.9 17.6C17.8 18.2 17.3 18.6 16.7 18.6C10 18.2 5.3 13.5 4.9 6.8C4.9 6.2 5.3 5.7 5.9 5.6Z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 20,
  className,
  title,
  strokeWidth = 1.75,
}: {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={PATHS[name]} fill={name === "play" ? "currentColor" : "none"} />
    </svg>
  );
}
