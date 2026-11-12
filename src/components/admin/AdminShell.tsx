import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/(admin)/sys-ops/actions";
import { hasSession } from "@/lib/auth";
import { btnOutline } from "./styles";

const nav = [
  { href: "/sys-ops", label: "Overview" },
  { href: "/sys-ops/jobs", label: "Jobs" },
  { href: "/sys-ops/applications", label: "Applications" },
];

/** The admin frame: a top bar with the sections, shown only when signed in. The login page stands alone. */
export async function AdminShell({ children }: { children: ReactNode }) {
  if (!(await hasSession())) return <>{children}</>;
  return (
    <>
      <header className="border-b border-navy/15 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-3">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <Link href="/sys-ops" className="flex items-baseline gap-2">
              <span className="text-[1.125rem] font-semibold tracking-[-0.03em]">
                SBT
              </span>
              <span className="font-mono text-overline font-medium text-slate-700 uppercase">
                Sys Ops
              </span>
            </Link>
            <nav aria-label="Admin" className="flex flex-wrap gap-x-5 gap-y-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-[0.9375rem] font-medium text-navy underline-offset-[6px] hover:underline"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/careers"
              target="_blank"
              className="text-[0.875rem] font-medium text-slate-700 underline-offset-[5px] hover:underline"
            >
              View careers page
            </Link>
            <form action={logoutAction}>
              <button type="submit" className={btnOutline}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-8 lg:py-10">
        {children}
      </main>
    </>
  );
}
