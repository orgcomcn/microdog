import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function AdminLocksPage() {
  return (
    <PageShell
      title="后台 / 锁仓管理"
      description="用于查看锁仓记录、状态与运营配置。"
      badge="Admin / Locks"
    >
      <PlaceholderCard
        title="预期能力"
        description="当前无业务实现。"
        items={["锁仓列表", "状态查询", "手动解锁", "规则配置"]}
      />
    </PageShell>
  );
}
