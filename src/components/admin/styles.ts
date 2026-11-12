/**
 * Class names shared by the admin screens. Kept in a plain module (not a "use client"
 * one) so server-rendered pages get real strings: a constant imported from a client
 * module arrives on the server as a reference, which breaks when joined into a class list.
 */

export const inputCls =
  "w-full rounded-[var(--radius-button)] border border-navy/25 bg-white px-3 py-2.5 text-[0.9375rem] text-navy placeholder:text-slate-500 hover:border-navy/50 focus:border-navy focus:outline-none aria-[invalid=true]:border-orange";

export const btn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-button)] px-4 text-[0.875rem] font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50";
export const btnPrimary = `${btn} bg-navy text-white hover:bg-navy-80`;
export const btnSignal = `${btn} bg-orange text-navy hover:bg-orange-80`;
export const btnOutline = `${btn} border border-navy/25 text-navy hover:border-navy hover:bg-white`;
export const btnDanger = `${btn} border border-navy/25 text-navy hover:border-orange hover:text-orange`;
