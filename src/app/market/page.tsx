import { PageShell } from "@/components/layout/page-shell";

import { MarketBoard } from "./_components/market-board";

export default function MarketPage() {
  return (
    <PageShell
      title="实时行情"
      description="当前接入 CoinGecko，统一展示 BTC / ETH / USDT 的 USD 价格与 24h 涨跌幅。"
      badge="Market / CoinGecko"
    >
      <MarketBoard />
    </PageShell>
  );
}
