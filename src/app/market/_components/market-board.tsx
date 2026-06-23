"use client";

import { useQuery } from "@tanstack/react-query";

import { formatShanghaiDateTime } from "@/lib/datetime";
import type { MarketOverview, MarketTicker } from "@/modules/market/types";

type MarketApiResponse = {
  success: boolean;
  message: string;
  data: MarketOverview;
};

function formatUsd(value: number | null) {
  if (value === null) {
    return "-";
  }

  if (value >= 1000) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (value >= 1) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })}`;
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  })}`;
}

function formatChange(value: number | null) {
  if (value === null) {
    return "-";
  }

  const formatted = `${Math.abs(value).toFixed(2)}%`;
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

function getChangeTone(value: number | null) {
  if (value === null) {
    return "text-white/46";
  }

  return value >= 0 ? "text-emerald-300" : "text-rose-300";
}

function TickerCard({ ticker }: { ticker: MarketTicker }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.84)_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[0.68rem] font-semibold tracking-[0.22em] text-cyan-200/72 uppercase">
            {ticker.symbol}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">{ticker.name}</h2>
        </div>

        <div
          className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase ${
            ticker.status === "live"
              ? "border-emerald-300/18 bg-emerald-300/10 text-emerald-100"
              : "border-amber-300/18 bg-amber-300/10 text-amber-100"
          }`}
        >
          {ticker.status === "live" ? "Live" : "待配置"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
          <div className="text-[0.66rem] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Price
          </div>
          <div className="mt-3 text-2xl font-semibold text-white">{formatUsd(ticker.priceUsd)}</div>
        </div>

        <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
          <div className="text-[0.66rem] font-semibold tracking-[0.18em] text-white/45 uppercase">
            24H Change
          </div>
          <div className={`mt-3 text-2xl font-semibold ${getChangeTone(ticker.change24h)}`}>
            {formatChange(ticker.change24h)}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-white/52">
        <div>数据源：{ticker.source}</div>
        <div>
          更新时间：
          {ticker.lastUpdatedAt ? formatShanghaiDateTime(ticker.lastUpdatedAt) : "-"}
        </div>
        {ticker.note ? <div className="leading-6 text-amber-100/70">{ticker.note}</div> : null}
      </div>
    </article>
  );
}

export function MarketBoard() {
  const query = useQuery({
    queryKey: ["market-tickers"],
    queryFn: async () => {
      const response = await fetch("/api/market/tickers", { cache: "no-store" });
      const result = (await response.json()) as MarketApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "行情接口请求失败。");
      }

      return result.data;
    },
    refetchInterval: 15_000,
  });

  const market = query.data;

  return (
    <section className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.88)_0%,rgba(5,10,25,0.82)_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[0.7rem] font-semibold tracking-[0.22em] text-cyan-200/72 uppercase">
              Market Feed
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-white">CoinGecko 行情看板</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-white/62">
              当前统一接入 CoinGecko，展示 BTC / ETH / USDT 的 USD 价格和 24h 涨跌幅。
            </p>
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/62">
            <div>状态：{query.isFetching ? "刷新中" : query.isError ? "加载失败" : "已连接"}</div>
            <div>
              最近更新：
              {market?.updatedAt ? formatShanghaiDateTime(market.updatedAt) : "-"}
            </div>
          </div>
        </div>
      </div>

      {query.isError ? (
        <div className="rounded-[28px] border border-rose-300/16 bg-rose-400/[0.06] p-5 text-sm leading-7 text-rose-100/82">
          {(query.error as Error).message || "行情加载失败。"}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        {(market?.tickers ?? Array.from({ length: 3 })).map((ticker, index) =>
          ticker ? (
            <TickerCard key={ticker.symbol} ticker={ticker} />
          ) : (
            <div
              key={`market-skeleton-${index}`}
              className="min-h-[250px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.72)_0%,rgba(5,10,25,0.68)_100%)] p-5 opacity-70"
            />
          ),
        )}
      </div>
    </section>
  );
}
