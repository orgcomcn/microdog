import type { Route } from "next";

import { SiteHeader } from "@/components/layout/site-header";

const navItems = [
  { href: "/" as Route, label: "首页" },
  { href: "/market" as Route, label: "行情" },
  { href: "/points" as Route, label: "积分" },
  { href: "/dashboard" as Route, label: "个人中心" },
];

export function DashboardHeader() {
  return <SiteHeader navItems={navItems} subtitle="Member Center" />;
}
