import { fail, ok } from "@/lib/api";
import { getMarketOverview } from "@/modules/market/service";

export async function GET() {
  try {
    return ok(await getMarketOverview());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load market data.";
    return fail(message, 502);
  }
}
