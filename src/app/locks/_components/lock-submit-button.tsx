"use client";

import { useFormStatus } from "react-dom";

export function LockSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-50"
    >
      {pending ? "提交中..." : "发起锁仓"}
    </button>
  );
}
