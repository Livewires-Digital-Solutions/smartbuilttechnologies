import type { Metadata } from "next";
import { NotFoundView } from "@/components/sections/NotFoundView";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Shown when a page inside the site (a post, an event or a job) does not exist. */
export default function NotFound() {
  return <NotFoundView />;
}
