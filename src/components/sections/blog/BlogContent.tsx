import Link from "next/link";
import { connection } from "next/server";
import { ListHero } from "@/components/sections/ListHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { dbConfigured } from "@/lib/db";
import { longDate, shortDate } from "@/lib/dates";
import { listLivePosts, readingMinutes, type Post } from "@/lib/posts";
import { BlogList, type ListPost } from "./BlogList";
import { PostCover } from "./PostCover";

/** Placeholder while the posts load, so the page does not jump. */
export function BlogSkeleton() {
  return (
    <Section
      surface="paper"
      spacing={false}
      aria-label="Blog"
      className="pt-[var(--header-h)]"
    >
      <div className="container-x min-h-[min(100svh,880px)] pt-16">
        <div className="h-24 w-2/3 animate-pulse bg-navy/8" />
        <div className="mt-10 h-5 w-1/2 animate-pulse bg-navy/8" />
      </div>
    </Section>
  );
}

const toListPost = (p: Post): ListPost => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  category: p.category,
  cover: p.cover,
  coverAlt: p.coverAlt,
  date: shortDate(p.publishedAt),
  minutes: readingMinutes(p.body),
});

/**
 * The blog index: the hero, the latest company news told large, and every post as
 * rows with a category filter. Read from the database when the page is asked for, so
 * a post published in the admin area is here straight away.
 */
export async function BlogContent() {
  await connection();
  let posts: Post[] = [];
  let unavailable = false;
  if (!dbConfigured()) unavailable = true;
  else {
    try {
      posts = await listLivePosts();
    } catch (e) {
      console.error("[blog] could not load posts:", e);
      unavailable = true;
    }
  }

  const latest = posts[0];
  const news = posts.find((p) => p.kind === "news");
  const articles = posts.filter((p) => p !== news);
  const facts: [string, string][] = [
    ["Articles", String(posts.filter((p) => p.kind === "article").length)],
    ["News", String(posts.filter((p) => p.kind === "news").length)],
    ...(latest
      ? ([["Latest", longDate(latest.publishedAt)]] as [string, string][])
      : []),
  ];

  return (
    <>
      <ListHero
        id="blog-title"
        headerLabel="Smart Built Technologies · Blog"
        crumb="Blog"
        headline={["Our Blog"]}
        lede="Deep dives into BIM, Digital Twin, GIS integration, CAFM, and the technologies reshaping the Architecture, Engineering & Construction industry."
        actions={
          <>
            <ButtonLink href="#articles" variant="signal" icon="arrow-down">
              Browse all insights
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" className="underline">
              Contact us
            </ButtonLink>
          </>
        }
        facts={posts.length ? facts : []}
        figure={{
          src: latest?.cover ?? "/assets/misc/hero-architecture.webp",
          alt: latest?.coverAlt ?? latest?.title,
          chip: latest
            ? latest.kind === "news"
              ? "Latest news"
              : "Latest article"
            : "Blog",
          caption:
            latest?.title ?? "BIM, digital twins and digital construction",
          href: latest ? `/blog/${latest.slug}` : undefined,
          note: latest ? shortDate(latest.publishedAt) : undefined,
        }}
      />

      {unavailable ? (
        <Section surface="white">
          <div className="container-x">
            <p className="max-w-[56ch] border-t-[1.5px] border-t-navy pt-6 text-lead text-slate-700">
              Articles cannot be shown right now. Please try again in a few
              minutes.
            </p>
          </div>
        </Section>
      ) : posts.length === 0 ? (
        <Section surface="white">
          <div className="container-x">
            <div className="flex flex-col gap-3 border-t-[1.5px] border-t-navy pt-6">
              <p className="text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.1] font-medium tracking-[-0.03em]">
                Nothing published yet.
              </p>
              <p className="max-w-[52ch] text-lead text-slate-700">
                Our first articles are on their way. In the meantime, see our{" "}
                <Link
                  href="/projects"
                  className="font-semibold underline underline-offset-[5px]"
                >
                  projects
                </Link>
                .
              </p>
            </div>
          </div>
        </Section>
      ) : (
        <>
          {news ? (
            <Section surface="white" aria-labelledby="news-heading">
              <div className="container-x">
                <SectionHead id="news-heading" index="01" label="Latest News">
                  What’s happening at TXG, KSA.
                </SectionHead>
                <article className="grid-12 mt-12 items-center gap-y-8 lg:mt-16">
                  <Link
                    href={`/blog/${news.slug}`}
                    className="group relative col-span-12 block lg:col-span-5 lg:col-start-4"
                    aria-label={news.title}
                  >
                    <PostCover
                      src={news.cover}
                      alt={news.coverAlt}
                      label={news.category}
                      sizes="(min-width: 1024px) 36vw, 100vw"
                      className="aspect-[4/3]"
                    />
                  </Link>
                  <div className="col-span-12 flex flex-col gap-5 lg:col-span-4 lg:col-start-9">
                    <div className="flex flex-wrap items-center gap-3">
                      {news.category ? (
                        <span className="border border-navy px-2 py-0.5">
                          <Label>{news.category}</Label>
                        </span>
                      ) : null}
                      <Label className="tabular text-slate-700">
                        {shortDate(news.publishedAt)}
                      </Label>
                    </div>
                    <h3 className="text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-[1.04] font-medium tracking-[-0.04em] text-balance">
                      <Link
                        href={`/blog/${news.slug}`}
                        className="underline-offset-[6px] decoration-1 hover:underline"
                      >
                        {news.title}
                      </Link>
                    </h3>
                    <p className="text-slate-700">{news.excerpt}</p>
                    <Link
                      href={`/blog/${news.slug}`}
                      className="group/l inline-flex w-fit items-center gap-2 font-semibold text-navy"
                    >
                      <span className="underline underline-offset-[6px]">
                        View details
                      </span>
                      <Icon
                        name="arrow-right"
                        size={16}
                        className="transition-transform group-hover/l:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              </div>
            </Section>
          ) : null}

          <Section
            surface="paper"
            id="articles"
            aria-labelledby="articles-heading"
          >
            <div className="container-x">
              <SectionHead
                id="articles-heading"
                index={news ? "02" : "01"}
                label="Our Articles"
                aside={
                  <p className="max-w-[56ch] text-lead text-slate-700">
                    From technical deep-dives to industry perspectives, find the
                    article that sparks your curiosity.
                  </p>
                }
              >
                Browse all insights
              </SectionHead>
              <div className="mt-12 lg:mt-16">
                <BlogList posts={(news ? articles : posts).map(toListPost)} />
              </div>
            </div>
          </Section>
        </>
      )}
    </>
  );
}
