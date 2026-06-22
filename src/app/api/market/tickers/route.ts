import { ok } from "@/lib/api";
import { getMockTickers } from "@/modules/market/service";

export async function GET() {
  return ok(await getMockTickers());
}
