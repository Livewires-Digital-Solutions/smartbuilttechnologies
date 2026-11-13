import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";

/**
 * Renders Markdown in the site's own type. Safe by construction: raw HTML in the
 * source is not rendered (it shows as text), links to `javascript:` and similar are
 * dropped by react-markdown, and pictures may only come from our own folders or https.
 * Used for blog posts and events on the public site and for the live preview in the
 * admin editor.
 */

const external = (href?: string) => !!href && /^https?:\/\//i.test(href);

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-14 mb-4 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-14 mb-4 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-3 text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] leading-[1.15] font-medium tracking-[-0.025em] text-balance first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-8 mb-2 font-mono text-overline font-medium text-slate-700 uppercase first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-5 text-[1.0625rem] leading-[1.7] text-navy/90 first:mt-0">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-navy underline underline-offset-[5px] decoration-1 hover:decoration-2"
      {...(external(href)
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-5 flex flex-col gap-2.5 pl-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 flex list-decimal flex-col gap-2.5 pl-6 marker:font-mono marker:text-slate-500">
      {children}
    </ol>
  ),
  // bullets are drawn here so they match the rest of the site; ordered lists keep their numbers
  li: ({ children }) => (
    <li className="relative pl-6 text-[1.0625rem] leading-[1.65] text-navy/90 before:absolute before:top-[0.7em] before:left-0 before:size-1.5 before:rounded-[2px] before:bg-navy [ol>&]:pl-0 [ol>&]:before:hidden">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-[3px] border-l-orange bg-white py-1 pr-5 pl-6 [&>p]:my-3">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-0 border-t border-[var(--hairline)]" />,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="rounded-[3px] bg-navy/8 px-1.5 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-[3px] bg-navy p-5 font-mono text-[0.875rem] leading-relaxed text-white [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-[0.9375rem]">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b-[1.5px] border-b-navy px-3 py-2 font-mono text-overline font-medium uppercase">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[var(--hairline)] px-3 py-2.5 align-top">
      {children}
    </td>
  ),
  img: ({ src, alt }) => {
    const s = typeof src === "string" ? src : "";
    // only our own pictures, or https: nothing else is drawn
    if (!(/^\/(media|assets)\//.test(s) || /^https:\/\//i.test(s))) return null;
    return (
      <span className="my-8 block">
        {/* eslint-disable-next-line @next/next/no-img-element -- sizes of uploaded pictures are not known here */}
        <img
          src={s}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className="grade h-auto w-full bg-slate-200"
        />
        {alt ? (
          <span className="mt-2 block font-mono text-overline text-slate-700 uppercase">
            {alt}
          </span>
        ) : null}
      </span>
    );
  },
};

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("markdown max-w-[68ch]", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
