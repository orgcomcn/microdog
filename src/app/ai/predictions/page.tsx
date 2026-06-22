import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function PredictionsPage() {
  return (
    <PageShell
      title="AI 预测"
      description="用于承接 AI 行情预测、观点总结与策略建议。当前只保留最小路由和接口骨架。"
      badge="AI / Predictions"
    >
      <PlaceholderCard
        title="建议实现顺序"
        description="先跑通接口，再接模型。"
        items={[
          "定义请求参数：symbol / timeframe / context",
          "封装模型调用层",
          "记录请求日志与配额",
          "展示预测结果与置信度",
        ]}
      />
    </PageShell>
  );
}
