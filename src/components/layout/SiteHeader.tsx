"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { PathwayGlyph } from "@/components/brand/Symbol";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { mainNav, servicesMenu } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Site header.
 * - Solid off-white with a hairline once scrolled; transparent with the inverse
 *   logo when the page opens on a dark section (pure CSS, see globals.css).
 * - Hides on scroll down, returns on scroll up. Never hides while a menu is open.
 * - Services uses the disclosure pattern (button + region), not ARIA menus.
 */
export function SiteHeader({ logo, contactHref = "/contact" }: { logo: ReactNode; contactHref?: string }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const servicesBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const panelId = useId();
  const mobileId = useId();

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close menus when the route changes (adjusting state during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setServicesOpen(false);
    setMobileOpen(false);
  }

  const anyOpen = servicesOpen || mobileOpen;
  const anyOpenRef = useRef(anyOpen);
  useEffect(() => {
    anyOpenRef.current = anyOpen;
  }, [anyOpen]);

  // Scroll state is written straight to data attributes: no re-render per scroll frame.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      el.dataset.scrolled = y > 8 ? "true" : "false";
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (anyOpenRef.current || y < 160 || el.contains(document.activeElement)) el.dataset.hidden = "false";
      else if (goingDown) el.dataset.hidden = "true";
      else if (goingUp) el.dataset.hidden = "false";
      if (goingDown || goingUp) lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Escape closes; outside click closes the services panel.
  useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (servicesOpen) servicesBtnRef.current?.focus();
      // keyboard users land back on the button that opened the menu
      else if (mobileOpen) menuBtnRef.current?.focus();
      setServicesOpen(false);
      setMobileOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (servicesOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [anyOpen, servicesOpen]);

  // Mobile sheet: lock scroll and make the page behind it inert.
  useEffect(() => {
    const root = document.documentElement;
    const main = document.getElementById("main");
    const footer = document.getElementById("site-footer");
    root.style.overflow = mobileOpen ? "hidden" : "";
    // moving focus into the dialog as it opens, so keyboard and screen reader users start inside it
    if (mobileOpen) sheetRef.current?.querySelector<HTMLElement>("a, summary, button")?.focus();
    main?.toggleAttribute("inert", mobileOpen);
    footer?.toggleAttribute("inert", mobileOpen);
    return () => {
      root.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [mobileOpen]);

  // Hover intent for mouse users only; touch and keyboard use the button.
  const openOnHover = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setServicesOpen(true), 120);
  }, []);
  const closeOnLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setServicesOpen(false), 220);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50"
      data-scrolled="false"
      data-hidden="false"
      data-open={anyOpen ? "true" : "false"}
      data-mobile={mobileOpen ? "true" : "false"}
      onPointerLeave={closeOnLeave}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="header-logo -my-2 flex items-center py-2" aria-label={`Smart Built Technologies, part of ${site.group}, home`}>
          {logo}
          <span className="header-txg" aria-hidden="true">
            Part of {site.group.replace(" - ", "\u00A0- ")}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {mainNav.map((item) =>
              item.href === "/services" ? (
                <li key={item.href} onPointerEnter={openOnHover}>
                  <button
                    ref={servicesBtnRef}
                    type="button"
                    className="nav-link inline-flex items-center gap-1.5"
                    aria-expanded={servicesOpen}
                    aria-controls={panelId}
                    aria-current={isActive("/services") ? "true" : undefined}
                    data-active={isActive("/services") ? "true" : undefined}
                    onClick={() => setServicesOpen((o) => !o)}
                  >
                    Services
                    <Icon
                      name="chevron-down"
                      size={16}
                      className={cn(
                        "transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)]",
                        servicesOpen && "rotate-180",
                      )}
                    />
                  </button>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={isActive(item.href) ? "page" : undefined}
                    data-active={isActive(item.href) ? "true" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={contactHref} className="header-cta hidden sm:inline-flex">
            <span>Start a project</span>
            <Icon name="arrow-up-right" size={16} />
          </Link>
          <button
            ref={menuBtnRef}
            type="button"
            className="menu-toggle inline-flex h-11 items-center gap-2 px-3 text-sm font-semibold lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            onClick={() => {
              setServicesOpen(false);
              setMobileOpen((o) => !o);
            }}
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} />
            <span>{mobileOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* Services panel (desktop) */}
      <div
        id={panelId}
        role="region"
        aria-label="Services"
        className="services-panel absolute inset-x-0 top-full hidden lg:block"
        data-state={servicesOpen ? "open" : "closed"}
        onPointerEnter={openOnHover}
      >
        <div className="container-x">
          <div className="grid-12 gap-y-10 py-10">
            {servicesMenu.map(({ pathway, items }) => (
              <div key={pathway.id} className="col-span-3 flex flex-col gap-5">
                <div className="flex items-start gap-3.5">
                  <PathwayGlyph pathway={pathway.id} className="size-10" />
                  <div>
                    <p className="text-[0.9375rem] font-bold">{pathway.name}</p>
                    <p className="text-caption uppercase tracking-[0.14em] text-slate-500">{pathway.meaning}</p>
                  </div>
                </div>
                <ul className="flex flex-col border-t border-slate-200">
                  {items.map((s) => (
                    <li key={s.href} className="border-b border-slate-200">
                      <Link
                        href={s.href}
                        tabIndex={servicesOpen ? undefined : -1}
                        className="group/item flex flex-col gap-1 py-3.5 pr-2"
                      >
                        <span className="flex items-center justify-between gap-3 font-semibold">
                          {s.title}
                          <Icon
                            name="arrow-right"
                            size={16}
                            className="-translate-x-1 opacity-0 transition-[opacity,translate] duration-[var(--duration-ui)] group-hover/item:translate-x-0 group-hover/item:opacity-100"
                          />
                        </span>
                        <span className="text-caption text-slate-500">{s.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-6 border-t border-slate-200 py-5 text-sm">
            <p className="text-slate-700">Nine services, organised by the four pathways of our symbol.</p>
            <Link
              href="/services"
              tabIndex={servicesOpen ? undefined : -1}
              className="inline-flex items-center gap-2 font-semibold underline-offset-[6px] hover:underline"
            >
              All services <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id={mobileId}
        ref={sheetRef}
        className="mobile-sheet fixed inset-x-0 top-[var(--header-h)] bottom-0 overflow-y-auto overscroll-contain lg:hidden"
        data-state={mobileOpen ? "open" : "closed"}
        data-surface="dark"
        aria-label="Site menu"
        role="dialog"
        aria-modal="true"
        hidden={!mobileOpen}
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <ul className="flex flex-col">
            <li className="border-b border-white/14">
              <Link href="/" className="block py-4 text-h2 font-bold">
                Home
              </Link>
            </li>
            {mainNav.map((item) =>
              item.href === "/services" ? (
                <li key={item.href} className="border-b border-white/14">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-h2 font-bold [&::-webkit-details-marker]:hidden">
                      Services
                      <Icon name="chevron-down" size={22} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="flex flex-col gap-6 pb-6">
                      {servicesMenu.map(({ pathway, items }) => (
                        <div key={pathway.id}>
                          <p className="mb-2 flex items-center gap-2.5 text-caption uppercase tracking-[0.16em] text-white/60">
                            <PathwayGlyph pathway={pathway.id} surface="dark" className="size-5" />
                            {pathway.name}
                          </p>
                          <ul>
                            {items.map((s) => (
                              <li key={s.href}>
                                <Link href={s.href} className="block py-2 text-lead font-medium">
                                  {s.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link href="/services" className="inline-flex min-h-11 items-center gap-2 font-semibold">
                        All services <Icon name="arrow-right" size={16} />
                      </Link>
                    </div>
                  </details>
                </li>
              ) : (
                <li key={item.href} className="border-b border-white/14">
                  <Link
                    href={item.href}
                    className="block py-4 text-h2 font-bold"
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="mt-auto flex flex-col gap-4 pt-10">
            <ButtonLink href={contactHref} variant="signal" className="w-full">
              Start a project
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
