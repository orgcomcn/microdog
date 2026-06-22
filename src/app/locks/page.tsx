import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function LocksPage() {
  return (
    <PageShell
      title="锁仓系统"
      description="锁仓系统页面预留，用于后续接入锁仓记录、期限、收益或权益规则。"
      badge="Locks"
    >
      <PlaceholderCard
        title="锁仓模块"
        description="当前只定义目录和数据模型占位。"
        items={[
          "锁仓发起与确认",
          "锁仓记录列表",
          "状态管理：生效 / 解锁",
          "与积分或会员权益联动",
        ]}
      />
    </PageShell>
  );
}
