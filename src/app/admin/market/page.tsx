import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function AdminMarketPage() {
  return (
    <PageShell
      title="后台 / 行情管理"
      description="用于管理行情源配置、缓存策略与推荐展示位。"
      badge="Admin / Market"
    >
      <PlaceholderCard
        title="预期能力"
        description="当前无业务实现。"
        items={["行情源配置", "缓存刷新", "推荐币种维护", "告警监控"]}
      />
    </PageShell>
  );
}
