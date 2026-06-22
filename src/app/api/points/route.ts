import { ok } from "@/lib/api";
import { getMockPointsOverview } from "@/modules/points/service";

export async function GET() {
  return ok(await getMockPointsOverview());
}
