export async function getMockTickers() {
  return [
    { symbol: "BTC", price: 102345.12, change24h: 2.45 },
    { symbol: "ETH", price: 5621.8, change24h: -0.84 },
    { symbol: "SOL", price: 231.44, change24h: 4.12 },
  ];
}
