import Link from "next/link";
import type { Route } from "next";

type PageShellProps = {
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
};

const navItems = [
  { href: "/" as Route, label: "首页" },
  { href: "/login" as Route, label: "登录" },
  { href: "/market" as Route, label: "行情" },
  { href: "/ai/predictions" as Route, label: "AI预测" },
  { href: "/ai/chat" as Route, label: "AI聊天" },
  { href: "/points" as Route, label: "积分" },
  { href: "/locks" as Route, label: "锁仓" },
  { href: "/dashboard" as Route, label: "用户中心" },
  { href: "/admin" as Route, label: "后台" },
];

export function PageShell({ title, description, badge, children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 md:px-10">
        <header className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            {badge ? (
              <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                {badge}
              </div>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">{description}</p>
          </div>
        </header>
        {children ? children : null}
      </div>
    </main>
  );
}
