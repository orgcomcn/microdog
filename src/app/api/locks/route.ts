import { ok } from "@/lib/api";
import { getMockLocks } from "@/modules/locks/service";

export async function GET() {
  return ok(await getMockLocks());
}
