import { ok } from "@/lib/api";
import { getHealthStatus } from "@/server/health";

export async function GET() {
  return ok(await getHealthStatus());
}
