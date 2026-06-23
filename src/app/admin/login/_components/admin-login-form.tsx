"use client";

import { useActionState } from "react";

import { adminLoginAction, type AdminLoginActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const initialState: AdminLoginActionState = {
  error: null,
};

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLoginAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/78" htmlFor="admin-username">
          管理员账号
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          defaultValue="admin"
          autoComplete="username"
          className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none transition focus:border-cyan-300/40"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/78" htmlFor="admin-password">
          密码
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          defaultValue="admin123"
          autoComplete="current-password"
          className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none transition focus:border-cyan-300/40"
          required
        />
      </div>

      {state.error ? (
        <div className="rounded-2xl border border-rose-300/16 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-100/88">
          {state.error}
        </div>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] text-white hover:opacity-95"
        disabled={pending}
      >
        {pending ? "登录中..." : "登录后台"}
      </Button>
    </form>
  );
}
