import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function AdminPointsPage() {
  return (
    <PageShell
      title="后台 / 积分管理"
      description="用于查看积分流水、规则与手工调整操作。"
      badge="Admin / Points"
    >
      <PlaceholderCard
        title="预期能力"
        description="当前无业务实现。"
        items={["积分流水", "规则配置", "手动加减分", "权益关联"]}
      />
    </PageShell>
  );
}
