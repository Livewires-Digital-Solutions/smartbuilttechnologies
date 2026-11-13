import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { PostCover } from "@/components/sections/blog/PostCover";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { articles, formatDate, latestNews } from "@/content/journal";
import { cn } from "@/lib/cn";
import { dbConfigured } from "@/lib/db";
import { listLivePosts } from "@/lib/posts";

/** What the section needs from a post, whether it came from the database or the built-in copy. */
interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  /** YYYY-MM-DD */
  date: string;
  cover: string | null;
}

const clean = (s: string) => s.replace(/^DRAFT\s*·\s*/, "");

/** The copy that ships with the site, used when there is no database (for example a preview deploy). */
const builtIn = (): { news: NewsItem | null; articles: NewsItem[] } => ({
  news: {
    slug: latestNews.slug,
    title: latestNews.title,
    excerpt: clean(latestNews.standfirst),
    date: latestNews.date,
    cover: latestNews.image?.src ?? null,
  },
  articles: articles.slice(0, 3).map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: clean(a.standfirst),
    date: a.date,
    cover: a.image?.src ?? null,
  })),
});

async function load(): Promise<{
  news: NewsItem | null;
  articles: NewsItem[];
}> {
  // request time only; kept outside the try so the prerender can stop here
  await connection();
  if (!dbConfigured()) return builtIn();
  try {
    const posts = await listLivePosts();
    const item = (p: (typeof posts)[number]): NewsItem => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.publishedAt.slice(0, 10),
      cover: p.cover,
    });
    const news = posts.find((p) => p.kind === "news");
    return {
      news: news ? item(news) : null,
      articles: posts
        .filter((p) => p.kind === "article")
        .slice(0, 3)
        .map(item),
    };
  } catch (e) {
    console.error("[home] could not load news, using the built-in copy:", e);
    return builtIn();
  }
}

/**
 * Latest news: one company update told large, then the latest articles as an editorial
 * list with dates in tabular figures. Read from the database, so a post published in
 * the admin area appears here at once; with no database it shows the copy shipped with
 * the site.
 */
function NewsView({
  news,
  articles: latestArticles,
}: {
  news: NewsItem | null;
  articles: NewsItem[];
}) {
  if (!news && latestArticles.length === 0) return null;
  return (
    <Section surface="white" aria-labelledby="news-title">
      <div className="container-x">
        <SectionHead id="news-title" index="07" label="Latest news">
          What’s happening
        </SectionHead>

        <div className="grid-12 mt-12 gap-y-12 lg:mt-16">
          {news ? (
            <article className="reveal col-span-12 flex flex-col gap-6 lg:col-span-5 lg:col-start-4">
              <div className="flex items-center gap-3">
                <span className="border border-navy px-2 py-0.5">
                  <Label>TXG, KSA news</Label>
                </span>
                <Label className="tabular text-slate-700">
                  {formatDate(news.date)}
                </Label>
              </div>
              <h3 className="text-h1 text-balance">
                <Link
                  href={`/blog/${news.slug}`}
                  className="underline-offset-[6px] decoration-1 hover:underline"
                >
                  {news.title}
                </Link>
              </h3>
              <p className="max-w-[46ch] text-lead text-slate-700">
                {news.excerpt}
              </p>
              <Link
                href={`/blog/${news.slug}`}
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
          ) : null}

          <div
            className={cn(
              "reveal col-span-12",
              news
                ? "lg:col-span-4 lg:col-start-9"
                : "lg:col-span-8 lg:col-start-4",
            )}
          >
            <div className="flex items-baseline justify-between border-t-[1.5px] border-t-navy pt-3 pb-1">
              <Label>Latest articles</Label>
              <Link
                href="/blog"
                className="-my-2 inline-block py-2 text-[0.875rem] font-semibold underline underline-offset-[5px]"
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
                    {i === 0 && a.cover ? (
                      <PostCover
                        src={a.cover}
                        alt=""
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        className="aspect-[16/9]"
                      />
                    ) : null}
                    <Label className="tabular text-slate-700">
                      {formatDate(a.date)}
                    </Label>
                    <span className="text-[1.25rem] leading-[1.2] font-medium tracking-[-0.025em] underline-offset-[5px] decoration-1 group-hover:underline">
                      {a.title}
                    </span>
                    <span className="max-w-[44ch] text-[0.9375rem] text-slate-700">
                      {a.excerpt}
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

async function NewsLive() {
  const { news, articles: list } = await load();
  return <NewsView news={news} articles={list} />;
}

/** Placeholder while the news loads, so the page does not jump. */
function NewsSkeleton() {
  return (
    <Section surface="white" aria-label="Latest news">
      <div className="container-x min-h-[28rem]">
        <div className="h-10 w-1/2 animate-pulse bg-navy/8" />
      </div>
    </Section>
  );
}

export function HomeNews() {
  return (
    <Suspense fallback={<NewsSkeleton />}>
      <NewsLive />
    </Suspense>
  );
}
