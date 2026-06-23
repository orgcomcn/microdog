import * as React from "react";

import { cn } from "@/lib/utils";

export function AdminFormSection({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "mt-5 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function AdminSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
      {children}
    </div>
  );
}

export function AdminFormGrid({
  children,
  className,
}: React.HTMLAttributes<HTMLFormElement>) {
  return <form className={cn("mt-5 grid gap-4", className)}>{children}</form>;
}

export function AdminField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium text-white/78">{label}</span>
      {children}
      {hint ? <span className="text-xs text-white/45">{hint}</span> : null}
    </label>
  );
}

const inputClassName =
  "h-11 w-full rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/15";

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClassName, props.className)} />;
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputClassName, props.className)} />;
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/15",
        props.className,
      )}
    />
  );
}

export function AdminCheckbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/78">
      <input {...props} type="checkbox" className="h-4 w-4 accent-cyan-300" />
      <span>{label}</span>
    </label>
  );
}
