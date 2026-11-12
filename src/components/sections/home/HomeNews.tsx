import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { articles, formatDate, latestNews } from "@/content/journal";
import { cn } from "@/lib/cn";

const latestArticles = articles.slice(0, 3);

/**
 * Latest news: one company update told large, then the three latest articles as
 * an editorial list with dates in tabular figures.
 */
export function HomeNews() {
  return (
    <Section surface="white" aria-labelledby="news-title">
      <div className="container-x">
        <SectionHead id="news-title" index="07" label="Latest news">
          What’s happening
        </SectionHead>

        <div className="grid-12 mt-12 gap-y-12 lg:mt-16">
          <article className="reveal col-span-12 flex flex-col gap-6 lg:col-span-5 lg:col-start-4">
            <div className="flex items-center gap-3">
              <span className="border border-navy px-2 py-0.5">
                <Label>Technical Xperts Group (TXG) - Saudi Arabia news</Label>
              </span>
              <Label className="tabular text-slate-700">
                {formatDate(latestNews.date)}
              </Label>
            </div>
            <h3 className="text-h1 text-balance">
              <Link
                href={`/blog/${latestNews.slug}`}
                className="underline-offset-[6px] decoration-1 hover:underline"
              >
                {latestNews.title}
              </Link>
            </h3>
            <p className="max-w-[46ch] text-lead text-slate-700">
              {latestNews.standfirst}
            </p>
            <Link
              href={`/blog/${latestNews.slug}`}
              className="group inline-flex w-fit items-center gap-2 font-semibold"
            >
              <span className="underline underline-offset-[6px]">
                Read the update
              </span>
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
              />
            </Link>
          </article>

          <div className="reveal col-span-12 lg:col-span-4 lg:col-start-9">
            <div className="flex items-baseline justify-between border-t-[1.5px] border-t-navy pt-3 pb-1">
              <Label>Latest articles</Label>
              <Link
                href="/blog"
                className="text-[0.875rem] font-semibold underline underline-offset-[5px]"
              >
                All articles
              </Link>
            </div>
            <ul>
              {latestArticles.map((a, i) => (
                <li
                  key={a.slug}
                  className="border-t border-[var(--hairline)] first:border-t-0"
                >
                  <Link
                    href={`/blog/${a.slug}`}
                    className="group flex flex-col gap-3 py-5"
                  >
                    {i === 0 && a.image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-slate-200">
                        <Image
                          src={a.image.src}
                          alt=""
                          width={a.image.width}
                          height={a.image.height}
                          sizes="(min-width: 1024px) 30vw, 100vw"
                          className="grade h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : null}
                    <Label className="tabular text-slate-700">
                      {formatDate(a.date)}
                    </Label>
                    <span
                      className={cn(
                        "text-[1.25rem] leading-[1.2] font-medium tracking-[-0.025em] underline-offset-[5px] decoration-1 group-hover:underline",
                      )}
                    >
                      {a.title}
                    </span>
                    <span className="max-w-[44ch] text-[0.9375rem] text-slate-700">
                      {a.standfirst}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
