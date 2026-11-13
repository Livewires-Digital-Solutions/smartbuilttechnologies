import Link from "next/link";
import type { CSSProperties } from "react";
import { PostCover } from "@/components/sections/blog/PostCover";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Markdown } from "@/components/ui/Markdown";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label, Stop } from "@/components/ui/Typography";
import { site } from "@/content/site";
import { longDate, shortDate } from "@/lib/dates";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { readingMinutes, type Post } from "@/lib/posts";

/** Search-engine data for one post, with an absolute picture address. */
function articleJsonLd(post: Post) {
  const base = process.env.SITE_URL || site.url;
  const url = `${base}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": post.kind === "news" ? "NewsArticle" : "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    image: post.cover ? `${base}${post.cover}` : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: post.category ?? undefined,
    wordCount: post.body.trim().split(/\s+/).length,
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      parentOrganization: site.group,
      logo: { "@type": "ImageObject", url: `${base}/icon.svg` },
    },
    inLanguage: "en",
  };
}

/** One post: the hero, the Markdown body, more reading and the closing call to action. */
export function ArticleView({
  post,
  related,
}: {
  post: Post;
  related: Post[];
}) {
  const minutes = readingMinutes(post.body);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleJsonLd(post),
        ]}
      />
      <div className="scroll-progress" aria-hidden="true" />

      <Section
        surface="paper"
        spacing={false}
        aria-labelledby="post-title"
        className="pt-[var(--header-h)] lg:flex lg:min-h-[min(92svh,820px)] lg:flex-col"
      >
        <div className="container-x flex w-full flex-1 flex-col pb-10 lg:pb-12">
          <div className="grid-12 flex-1 items-stretch gap-y-8">
            <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
                <Label>Smart Built Technologies · Blog</Label>
                <Label className="text-slate-700">
                  {post.kind === "news" ? "News" : "Article"}
                </Label>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-[clamp(1rem,2.4svh,1.5rem)] py-8">
                <Breadcrumbs
                  className="text-slate-700"
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Blog", href: "/blog" },
                    {
                      label:
                        post.category ??
                        (post.kind === "news" ? "News" : "Article"),
                    },
                  ]}
                />
                <h1
                  id="post-title"
                  className="text-[clamp(2.25rem,min(5vw,9svh),5rem)] leading-[0.98] font-medium tracking-[-0.055em] text-balance"
                >
                  <span
                    className="hero-line"
                    style={{ "--i": 0 } as CSSProperties}
                  >
                    <span>
                      {post.title}
                      <Stop />
                    </span>
                  </span>
                </h1>
                <p className="max-w-[54ch] text-[1.0625rem] leading-snug text-slate-700">
                  {post.excerpt}
                </p>
                <dl className="mt-1 border-t-[1.5px] border-t-navy">
                  {(
                    [
                      ["Published", longDate(post.publishedAt)],
                      ...(post.category
                        ? ([["Category", post.category]] as [string, string][])
                        : []),
                      ["Reading time", `${minutes} min`],
                    ] as [string, string][]
                  ).map(([k, v]) => (
                    <div
                      key={k}
                      className="grid grid-cols-[8rem_1fr] gap-4 border-b border-[var(--hairline)] py-2.5"
                    >
                      <dt className="pt-1">
                        <Label className="text-slate-700">{k}</Label>
                      </dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <figure className="relative col-span-12 flex flex-col lg:col-span-5">
              <PostCover
                src={post.cover}
                alt={post.coverAlt ?? post.title}
                label={post.category}
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="min-h-[320px] flex-1 max-lg:aspect-[4/3]"
              />
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
                <Label className="text-slate-700">
                  Fig. 01 · {post.coverAlt ?? post.title}
                </Label>
                <Label className="text-slate-700">
                  The production firm of TXG, KSA
                </Label>
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      <Section surface="white" aria-label="Article">
        <div className="container-x">
          <div className="grid-12 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 font-semibold text-navy"
              >
                <Icon
                  name="arrow-left"
                  size={16}
                  className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:-translate-x-1"
                />
                <span className="underline underline-offset-[6px]">
                  All articles
                </span>
              </Link>
            </div>
            <article className="col-span-12 lg:col-span-8 lg:col-start-4">
              <Markdown>{post.body}</Markdown>
              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t-[1.5px] border-t-navy pt-6">
                <Label className="text-slate-700">
                  Have questions about BIM, Digital Twin, or our services?
                </Label>
                <ButtonLink href="/contact" variant="signal">
                  Contact Us
                </ButtonLink>
              </div>
            </article>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section surface="paper" aria-labelledby="more-title">
          <div className="container-x">
            <SectionHead id="more-title" index="02" label="More Articles">
              Keep reading
            </SectionHead>
            <ul className="mt-12 border-t-[1.5px] border-t-navy lg:mt-16">
              {related.map((p, i) => (
                <li key={p.slug} className="border-b border-[var(--hairline)]">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group grid grid-cols-12 items-baseline gap-x-6 gap-y-2 py-6 transition-colors hover:bg-white lg:py-8"
                  >
                    <span className="col-span-2 font-mono text-overline text-slate-500 lg:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Label className="tabular col-span-10 text-slate-700 lg:col-span-2">
                      {shortDate(p.publishedAt)}
                    </Label>
                    <span className="col-span-12 text-[clamp(1.375rem,1.05rem+1.3vw,2rem)] leading-[1.1] font-medium tracking-[-0.035em] text-balance transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1 lg:col-span-6">
                      {p.title}
                    </span>
                    <span className="col-span-12 text-[0.9375rem] text-slate-700 lg:col-span-3">
                      {p.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}
    </>
  );
}
