"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PathwayGlyph } from "@/components/brand/Symbol";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Typography";
import { StickyPin } from "@/components/ui/StickyPin";
import type { PathwayId } from "@/content/pathways";
import { cn } from "@/lib/cn";

export interface ServiceRow {
  slug: string;
  num: string;
  title: string;
  summary: string;
  href: string;
  pathway: PathwayId;
  /** A real project that used this service. Absent → the pathway glyph is shown instead. */
  preview?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
  };
}

export interface ServiceGroup {
  id: PathwayId;
  name: string;
  meaning: string;
  color: string;
  rows: ServiceRow[];
}

/**
 * The services as an index. On desktop a sticky frame beside the list shows a real
 * project for whichever service you point at or focus; on phones it is just the list.
 */
export function ServicesIndex({ groups }: { groups: ServiceGroup[] }) {
  const all = groups.flatMap((g) => g.rows);
  const [active, setActive] = useState(all[0]?.slug ?? "");
  const current = all.find((r) => r.slug === active) ?? all[0];

  return (
    <div className="grid-12 gap-y-10">
      <div className="col-span-12 lg:col-span-7">
        {groups.map((g) => (
          <div key={g.id} className="mb-10 last:mb-0">
            <div className="flex items-center gap-3 border-t-[1.5px] border-t-navy pt-3 pb-3">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-[2px]"
                style={{ background: g.color }}
              />
              <Label>{g.name}</Label>
              <Label className="text-slate-700">· {g.meaning}</Label>
            </div>
            <ul>
              {g.rows.map((r) => (
                <li key={r.slug} className="border-t border-[var(--hairline)]">
                  <Link
                    href={r.href}
                    onMouseEnter={() => setActive(r.slug)}
                    onFocus={() => setActive(r.slug)}
                    className="group grid grid-cols-[2.25rem_1fr_auto] items-start gap-x-4 py-5 lg:py-6"
                  >
                    <span className="pt-2 font-mono text-overline text-slate-500">
                      {r.num}
                    </span>
                    <span className="flex flex-col gap-2">
                      <span
                        className={cn(
                          "text-[clamp(1.5rem,1.1rem+1.2vw,2.375rem)] leading-[1.08] font-medium tracking-[-0.035em] transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)]",
                          "group-hover:translate-x-2 group-focus-visible:translate-x-2",
                        )}
                      >
                        {r.title}
                      </span>
                      <span className="max-w-[52ch] text-[0.9375rem] text-slate-700">
                        {r.summary}
                      </span>
                    </span>
                    <Icon
                      name="arrow-right"
                      size={20}
                      className="mt-2 text-slate-500 transition-[translate,color] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-navy"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative hidden lg:col-span-4 lg:col-start-9 lg:block">
        <StickyPin
          topRem={2}
          className="flex flex-col gap-3"
          aria-hidden="true"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-cobalt-10">
            {all.map((r) => (
              <div
                key={r.slug}
                className={cn(
                  "absolute inset-0 transition-opacity duration-[400ms] ease-[var(--ease-out)]",
                  r.slug === current?.slug ? "opacity-100" : "opacity-0",
                )}
              >
                {r.preview ? (
                  <Image
                    src={r.preview.src}
                    alt=""
                    width={r.preview.width}
                    height={r.preview.height}
                    sizes="(min-width: 1440px) 420px, 30vw"
                    className="grade h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-[18%]">
                    <PathwayGlyph
                      pathway={r.pathway}
                      className="h-auto w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <Label className="text-slate-700">
              {current?.preview
                ? `Fig. · ${current.preview.caption}`
                : "Symbol · pathway"}
            </Label>
            <Label className="text-slate-700">{current?.num}</Label>
          </div>
        </StickyPin>
      </div>
    </div>
  );
}
