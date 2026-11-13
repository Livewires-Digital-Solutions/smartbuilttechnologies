import type { ReactNode } from "react";

/** A labelled form field with an error and an optional hint, shared by the admin forms. */
export function Field({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="font-mono text-overline font-medium text-slate-700 uppercase">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="text-[0.8125rem] text-slate-700">{hint}</span>
      ) : null}
      {error ? (
        <span role="alert" className="text-[0.875rem] text-orange">
          {error}
        </span>
      ) : null}
    </label>
  );
}
