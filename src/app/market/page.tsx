import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function MarketPage() {
  return (
    <PageShell
      title="实时行情"
      description="V1 提供页面路由与 API 占位。后续可接交易所或聚合行情源，扩展为列表、详情与图表。"
      badge="Market"
    >
      <PlaceholderCard
        title="模块范围"
        description="当前阶段不实现真实数据源。"
        items={[
          "行情列表接口 `/api/market/tickers`",
          "币种详情页预留",
          "图表与技术指标后续接入",
        ]}
      />
    </PageShell>
  );
}
