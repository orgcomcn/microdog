import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function PointsPage() {
  return (
    <PageShell
      title="积分系统"
      description="用于展示积分余额、获取规则、消费记录与平台权益说明。"
      badge="Points"
    >
      <PlaceholderCard
        title="建议后续拆分"
        description="先完成账本，再挂接业务事件。"
        items={[
          "积分余额概览",
          "积分变动日志",
          "奖励与消耗规则",
          "后台人工调整入口",
        ]}
      />
    </PageShell>
  );
}
