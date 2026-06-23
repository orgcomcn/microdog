export type MarketTicker = {
  symbol: "BTC" | "ETH" | "USDT" | "MICRODOGE";
  name: string;
  priceUsd: number | null;
  change24h: number | null;
  lastUpdatedAt: string | null;
  source: "CoinGecko";
  status: "live" | "unavailable";
  note: string | null;
};

export type MarketOverview = {
  source: "CoinGecko";
  updatedAt: string;
  cacheSeconds: number;
  tickers: MarketTicker[];
};
