import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Tagline } from "@/components/ui/Typography";
import { footerNav, legalNav } from "@/content/navigation";
import { site } from "@/content/site";

const COPYRIGHT_YEAR = 2026;

export function SiteFooter() {
  const [head, ...groupOffices] = site.offices;
  return (
    <footer id="site-footer" data-surface="dark" className="surface-navy">
      <div className="container-x">
        <div className="grid-12 gap-y-12 border-t border-[var(--hairline)] pt-14 pb-12 md:pt-20">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
            <Logo lockup="primary" tone="inverse" className="w-[200px] md:w-[232px]" />
            <p className="text-lead">
              <Tagline />
            </p>
            <p className="max-w-[34ch] text-sm text-white/64">
              The production firm of {site.group}. BIM, reality capture, digital twins and facility systems, delivered from our newly opened production centre in Chennai.
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5 lg:col-start-5">
            {footerNav.map((group) => (
              <div key={group.title} className="flex flex-col gap-4">
                <p className="text-caption font-semibold uppercase tracking-[0.16em] text-white/50">{group.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-white/82 underline-offset-[5px] transition-colors hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="col-span-12 flex flex-col gap-6 sm:flex-row sm:gap-12 lg:col-span-3 lg:col-start-10 lg:flex-col lg:gap-6">
            {head ? (
              <address className="flex flex-col gap-1 not-italic">
                <p className="mb-3 text-caption font-semibold uppercase tracking-[0.16em] text-white/50">{head.role}</p>
                {head.address.map((line) => (
                  <span key={line} className="text-[0.9375rem] text-white/82">
                    {line}
                  </span>
                ))}
                <a href={`mailto:${site.contact.email}`} className="mt-3 font-semibold underline-offset-[5px] hover:underline">
                  {site.contact.email}
                </a>
              </address>
            ) : null}
            <div>
              <p className="mb-3 text-caption font-semibold uppercase tracking-[0.16em] text-white/50">Group offices</p>
              <p className="text-[0.9375rem] text-white/82">{groupOffices.map((o) => o.city).join(" · ")}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--hairline)] py-6 text-caption text-white/56 md:flex-row md:items-center md:justify-between">
          <p>
            © {COPYRIGHT_YEAR} {site.name}. The production firm of {site.group}.
          </p>
          <ul className="flex items-center gap-5">
            <li>ISO 19650 certified delivery</li>
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline-offset-[4px] hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
