/** Public date formatting. Dates are shown as they were entered (UTC), never shifted by the visitor's time zone. */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const parts = (d: string) => {
  const [y, m, day] = d.slice(0, 10).split("-").map(Number) as [
    number,
    number,
    number,
  ];
  return { y, m: m - 1, d: day };
};

/** 28 Jun 2026 */
export function shortDate(d: string) {
  const p = parts(d);
  return `${p.d} ${MONTHS[p.m]!.slice(0, 3)} ${p.y}`;
}

/** 28 June 2026 */
export function longDate(d: string) {
  const p = parts(d);
  return `${p.d} ${MONTHS[p.m]} ${p.y}`;
}

/** 11–12 November 2024 · 30 November – 2 December 2023 · 22 February 2024 */
export function dateRange(start: string, end?: string | null) {
  if (!end || end === start) return longDate(start);
  const a = parts(start);
  const b = parts(end);
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m]} ${a.y}`;
  if (a.y === b.y)
    return `${a.d} ${MONTHS[a.m]} – ${b.d} ${MONTHS[b.m]} ${a.y}`;
  return `${longDate(start)} – ${longDate(end)}`;
}

/** Today's date (UTC) as YYYY-MM-DD. Call only at request time. */
export const todayUtc = () => new Date().toISOString().slice(0, 10);
