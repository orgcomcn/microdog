import Link from "next/link";
import type { Route } from "next";

import { adminLogoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin" as Route, label: "总览" },
  { href: "/admin/users" as Route, label: "用户管理" },
  { href: "/admin/predictions" as Route, label: "预测管理" },
  { href: "/admin/announcements" as Route, label: "公告管理" },
  { href: "/admin/points" as Route, label: "积分管理" },
  { href: "/admin/locks" as Route, label: "锁仓管理" },
  { href: "/admin/settings" as Route, label: "系统配置" },
];

export function AdminTopbar() {
  return (
    <section className="mt-5 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] px-5 py-5 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-cyan-200/72 uppercase">
            Admin Console
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
            后台管理导航
          </h2>
        </div>

        <form action={adminLogoutAction}>
          <Button
            type="submit"
            variant="outline"
            className="h-10 rounded-full border-white/10 bg-white/[0.04] px-4 text-white hover:bg-white/[0.08]"
          >
            退出后台
          </Button>
        </form>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/78 transition hover:bg-white/[0.08] hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
