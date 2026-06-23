import type { MarketOverview, MarketTicker } from "@/modules/market/types";

const COINGECKO_BASE_URL = process.env.COINGECKO_API_BASE_URL || "https://api.coingecko.com/api/v3";
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || "";
const MARKET_CACHE_SECONDS = 15;
const ENABLE_MARKET_MICRODOGE = false;
const MICRODOGE_COINGECKO_ID = process.env.MARKET_MICRODOGE_COINGECKO_ID || "";
const MICRODOGE_PLATFORM_ID = process.env.MARKET_MICRODOGE_PLATFORM_ID || "";
const MICRODOGE_CONTRACT_ADDRESS = process.env.MARKET_MICRODOGE_CONTRACT_ADDRESS || "";

const baseAssets = [
  { symbol: "BTC" as const, name: "Bitcoin", coinId: "bitcoin" },
  { symbol: "ETH" as const, name: "Ethereum", coinId: "ethereum" },
  { symbol: "USDT" as const, name: "Tether USDT", coinId: "tether" },
];

type CoinGeckoPricePoint = {
  usd?: number;
  usd_24h_change?: number;
  last_updated_at?: number;
};

type CoinGeckoSimplePriceResponse = Record<string, CoinGeckoPricePoint>;

function getCoinGeckoHeaders() {
  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (!COINGECKO_API_KEY) {
    return headers;
  }

  if (COINGECKO_BASE_URL.includes("pro-api.coingecko.com")) {
    headers["x-cg-pro-api-key"] = COINGECKO_API_KEY;
    return headers;
  }

  headers["x-cg-demo-api-key"] = COINGECKO_API_KEY;
  return headers;
}

function createUnavailableTicker(
  symbol: MarketTicker["symbol"],
  name: string,
  note: string,
): MarketTicker {
  return {
    symbol,
    name,
    priceUsd: null,
    change24h: null,
    lastUpdatedAt: null,
    source: "CoinGecko",
    status: "unavailable",
    note,
  };
}

function createLiveTicker(
  symbol: MarketTicker["symbol"],
  name: string,
  point: CoinGeckoPricePoint | undefined,
): MarketTicker {
  if (!point || typeof point.usd !== "number") {
    return createUnavailableTicker(symbol, name, "CoinGecko 当前没有返回该资产价格。");
  }

  return {
    symbol,
    name,
    priceUsd: point.usd,
    change24h: typeof point.usd_24h_change === "number" ? point.usd_24h_change : null,
    lastUpdatedAt: point.last_updated_at
      ? new Date(point.last_updated_at * 1000).toISOString()
      : null,
    source: "CoinGecko",
    status: "live",
    note: null,
  };
}

async function fetchCoinGeckoJson<T>(
  pathname: string,
  query: Record<string, string>,
) {
  const url = new URL(pathname, `${COINGECKO_BASE_URL.replace(/\/$/, "")}/`);

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    headers: getCoinGeckoHeaders(),
    next: { revalidate: MARKET_CACHE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with HTTP ${response.status}.`);
  }

  return (await response.json()) as T;
}

function pickUpdatedAt(tickers: MarketTicker[]) {
  const values = tickers
    .map((ticker) => ticker.lastUpdatedAt)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => right.localeCompare(left));

  return values[0] ?? new Date().toISOString();
}

async function loadBaseAssetTickers() {
  const ids = baseAssets.map((asset) => asset.coinId).join(",");
  const payload = await fetchCoinGeckoJson<CoinGeckoSimplePriceResponse>("simple/price", {
    ids,
    vs_currencies: "usd",
    include_24hr_change: "true",
    include_last_updated_at: "true",
  });

  return baseAssets.map((asset) =>
    createLiveTicker(asset.symbol, asset.name, payload[asset.coinId]),
  );
}

async function loadMicroDogeTicker() {
  if (MICRODOGE_COINGECKO_ID) {
    const payload = await fetchCoinGeckoJson<CoinGeckoSimplePriceResponse>("simple/price", {
      ids: MICRODOGE_COINGECKO_ID,
      vs_currencies: "usd",
      include_24hr_change: "true",
      include_last_updated_at: "true",
    });

    return createLiveTicker("MICRODOGE", "MicroDOGE", payload[MICRODOGE_COINGECKO_ID]);
  }

  if (MICRODOGE_PLATFORM_ID && MICRODOGE_CONTRACT_ADDRESS) {
    const payload = await fetchCoinGeckoJson<CoinGeckoSimplePriceResponse>(
      `simple/token_price/${MICRODOGE_PLATFORM_ID}`,
      {
        contract_addresses: MICRODOGE_CONTRACT_ADDRESS,
        vs_currencies: "usd",
        include_24hr_change: "true",
        include_last_updated_at: "true",
      },
    );

    return createLiveTicker(
      "MICRODOGE",
      "MicroDOGE",
      payload[MICRODOGE_CONTRACT_ADDRESS.toLowerCase()],
    );
  }

  return createUnavailableTicker(
    "MICRODOGE",
    "MicroDOGE",
    "尚未配置 MicroDOGE 的 CoinGecko coin id 或链上合约地址。",
  );
}

export async function getMarketOverview(): Promise<MarketOverview> {
  const tickers: MarketTicker[] = [];

  try {
    tickers.push(...(await loadBaseAssetTickers()));
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载主流币行情失败。";

    tickers.push(
      ...baseAssets.map((asset) =>
        createUnavailableTicker(asset.symbol, asset.name, message),
      ),
    );
  }

  if (ENABLE_MARKET_MICRODOGE) {
    try {
      tickers.push(await loadMicroDogeTicker());
    } catch (error) {
      const message = error instanceof Error ? error.message : "加载 MicroDOGE 行情失败。";
      tickers.push(createUnavailableTicker("MICRODOGE", "MicroDOGE", message));
    }
  }

  return {
    source: "CoinGecko",
    updatedAt: pickUpdatedAt(tickers),
    cacheSeconds: MARKET_CACHE_SECONDS,
    tickers,
  };
}
