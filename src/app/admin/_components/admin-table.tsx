import * as React from "react";

import { cn } from "@/lib/utils";

export function AdminTableCard({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "mt-5 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function AdminTableToolbar({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminTableWrap({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="overflow-x-auto">{children}</div>;
}

export function AdminTable({
  children,
  className,
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn("min-w-full text-left text-sm text-white/80", className)}>
      {children}
    </table>
  );
}

export function AdminTh({
  children,
  className,
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "border-b border-white/10 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-white/45 uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function AdminTd({
  children,
  className,
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("border-b border-white/6 px-4 py-4 align-top", className)}>
      {children}
    </td>
  );
}

export function AdminTr({
  children,
  className,
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-white/[0.03]", className)}>{children}</tr>;
}

export function AdminStatusBadge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "danger" | "info";
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-300/18 bg-emerald-400/10 text-emerald-100"
      : tone === "danger"
        ? "border-rose-300/18 bg-rose-400/10 text-rose-100"
        : tone === "info"
          ? "border-cyan-300/18 bg-cyan-400/10 text-cyan-100"
          : "border-white/10 bg-white/[0.05] text-white/72";

  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs", toneClass)}>
      {children}
    </span>
  );
}
