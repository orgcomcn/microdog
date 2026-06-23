import { fail, ok } from "@/lib/api";
import { getAdminPointLogs } from "@/modules/admin/points-service";
import { requireAdminApiSession } from "../_utils";

export async function GET() {
  try {
    const auth = await requireAdminApiSession();

    if (!auth.ok) {
      return auth.response;
    }

    return ok(await getAdminPointLogs());
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取积分流水失败。";
    return fail(message, 500);
  }
}
