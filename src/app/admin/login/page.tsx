import type { Route } from "next";
import { redirect } from "next/navigation";

import { HomeShell } from "@/app/_home/home-shell";
import { findAdminSession } from "@/lib/auth";

import { AdminLoginForm } from "./_components/admin-login-form";

export default async function AdminLoginPage() {
  const session = await findAdminSession();

  if (session) {
    redirect("/admin" as Route);
  }

  return (
    <HomeShell>
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[560px] items-center">
        <section className="w-full rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.95)_0%,rgba(5,10,25,0.94)_100%)] p-8 shadow-[0_32px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-10">
          <div className="inline-flex rounded-full border border-cyan-300/24 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            Admin Access
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            后台管理系统
          </h1>
          

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <AdminLoginForm />
          </div>
        </section>
      </div>
    </HomeShell>
  );
}
