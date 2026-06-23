import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { HeaderWalletPanel } from "@/components/wallet/header-wallet-panel";

const defaultNavItems = [
  { href: "/" as Route, label: "首页" },
  { href: "/market" as Route, label: "行情" },
  { href: "/ai/predictions" as Route, label: "AI预测" },
  { href: "/points" as Route, label: "积分" },
  { href: "/locks" as Route, label: "锁仓" },
  { href: "/dashboard" as Route, label: "个人中心" },
];

type HeaderNavItem = {
  href: Route | `#${string}`;
  label: string;
};

type SiteHeaderProps = {
  navItems?: ReadonlyArray<HeaderNavItem>;
  subtitle?: string;
};

export function SiteHeader({
  navItems = defaultNavItems,
  subtitle = "AI Digital Asset Platform",
}: SiteHeaderProps) {
  return (
    <div className="relative z-20 pb-1 pt-4">
      <header className="rounded-[28px] border border-white/10 bg-[#09112c]/78 px-4 py-4 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5 lg:px-7 2xl:px-8">
        <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/15 bg-white/6 shadow-[0_0_30px_rgba(107,114,255,0.3)]">
              <Image
                src="/microdog-logo.png"
                alt="MicroDOG mascot logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="text-[0.95rem] font-semibold tracking-[0.28em] text-white/95 uppercase">
                MicroDOG
              </div>
              <div className="text-[0.7rem] text-white/45">{subtitle}</div>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-white/72 lg:px-4">
            {navItems.map((item) => (
              item.href.startsWith("#") ? (
                <a
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 transition hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 transition hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          <div className="lg:justify-self-end">
            <HeaderWalletPanel />
          </div>
        </div>
      </header>
    </div>
  );
}
