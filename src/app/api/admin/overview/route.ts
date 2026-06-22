import { ok } from "@/lib/api";

export async function GET() {
  return ok({
    users: 0,
    marketSources: 0,
    pendingLocks: 0,
    pointsEvents: 0,
  });
}
