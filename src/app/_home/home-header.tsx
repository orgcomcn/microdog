import { SiteHeader } from "@/components/layout/site-header";

export function HomeHeader() {
  return (
    <SiteHeader
      navItems={[
        { href: "/asset-pool", label: "资产池" },
        { href: "/market", label: "行情" },
        { href: "/ai/predictions", label: "AI预测" },
        { href: "/points", label: "积分" },
        { href: "/locks", label: "锁仓" },
        { href: "/dashboard", label: "个人中心" },
      ]}
    />
  );
}
