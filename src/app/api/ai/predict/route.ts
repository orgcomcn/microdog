import { ok, fail } from "@/lib/api";
import { getMockPrediction } from "@/modules/ai/service";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    symbol?: string;
  };

  if (!body.symbol) {
    return fail("Symbol is required.");
  }

  return ok(await getMockPrediction(body.symbol));
}
