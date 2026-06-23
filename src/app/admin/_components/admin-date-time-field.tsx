import { CalendarDays, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminDateTimeFieldProps = {
  name: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
};

export function AdminDateTimeField({
  name,
  defaultValue,
  required,
  className,
}: AdminDateTimeFieldProps) {
  return (
    <div
      className={cn(
        "flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-sm text-white transition focus-within:border-cyan-300/35 focus-within:ring-2 focus-within:ring-cyan-300/15",
        className,
      )}
    >
      <CalendarDays className="size-4 text-white/45" />
      <Clock3 className="size-4 text-white/35" />
      <input
        name={name}
        type="datetime-local"
        defaultValue={defaultValue}
        required={required}
        className="h-full w-full bg-transparent text-white outline-none [color-scheme:dark]"
      />
    </div>
  );
}
