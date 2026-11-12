import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { absolute: "Sys Ops | Smart Built Technologies" },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin area: no public header, footer or smooth scrolling, and kept out of search.
 * The shell checks the sign-in at request time, so it sits inside Suspense.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-paper text-navy">
      <Suspense fallback={<div className="min-h-svh" />}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
    </div>
  );
}
