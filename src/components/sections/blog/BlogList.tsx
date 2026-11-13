"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { PostCover } from "./PostCover";

export interface ListPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  cover: string | null;
  coverAlt: string | null;
  /** Already formatted for display */
  date: string;
  minutes: number;
}

/**
 * Every post as ruled rows, filtered by category with chips. The chips only show when
 * there is more than one category to choose from.
 */
export function BlogList({ posts }: { posts: ListPost[] }) {
  const [category, setCategory] = useState("");
  const categories = [
    ...new Set(posts.map((p) => p.category).filter((c): c is string => !!c)),
  ].sort();
  const shown = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <div>
      {categories.length > 1 ? (
        <div
          role="group"
          aria-label="Filter by category"
          className="mb-8 flex flex-wrap gap-2"
        >
          {["", ...categories].map((c) => {
            const on = category === c;
            return (
              <button
                key={c || "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-[var(--radius-button)] border px-3.5 py-2 font-mono text-overline font-medium uppercase transition-colors duration-[var(--duration-ui)]",
                  on
                    ? "border-navy bg-navy text-white"
                    : "border-navy/25 text-navy hover:border-navy",
                )}
              >
                {c || "All"}
              </button>
            );
          })}
        </div>
      ) : null}
      <p aria-live="polite" className="sr-only">
        {shown.length} posts
      </p>

      <ul className="border-t-[1.5px] border-t-navy">
        {shown.map((p, i) => (
          <li key={p.slug} className="border-b border-[var(--hairline)]">
            <Link
              href={`/blog/${p.slug}`}
              className="group grid grid-cols-12 items-start gap-x-6 gap-y-4 py-7 transition-colors hover:bg-white lg:py-9"
            >
              <span className="col-span-3 pt-1.5 font-mono text-overline text-slate-500 lg:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "col-span-9 flex flex-col gap-2",
                  p.cover ? "lg:col-span-6" : "lg:col-span-10",
                )}
              >
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Label className="tabular text-slate-700">{p.date}</Label>
                  {p.category ? (
                    <span className="border border-navy px-2 py-0.5">
                      <Label>{p.category}</Label>
                    </span>
                  ) : null}
                  <Label className="text-slate-700">{p.minutes} min read</Label>
                </span>
                <span className="text-[clamp(1.5rem,1.1rem+1.7vw,2.5rem)] leading-[1.06] font-medium tracking-[-0.04em] text-balance transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1">
                  {p.title}
                </span>
                <span className="max-w-[56ch] text-[0.9375rem] text-slate-700">
                  {p.excerpt}
                </span>
                <span className="mt-1 inline-flex items-center gap-2 font-semibold text-navy">
                  <span className="underline underline-offset-[6px]">
                    Read article
                  </span>
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
                  />
                </span>
              </span>
              {/* a post without a picture gets a text-only row, not an empty panel */}
              {p.cover ? (
                <PostCover
                  src={p.cover}
                  alt={p.coverAlt}
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="col-span-12 aspect-[16/10] lg:col-span-5"
                />
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
