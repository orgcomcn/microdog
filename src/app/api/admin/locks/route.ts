import { fail, ok } from "@/lib/api";
import { getAdminLocks } from "@/modules/admin/lock-service";
import { requireAdminApiSession } from "../_utils";

export async function GET() {
  try {
    const auth = await requireAdminApiSession();

    if (!auth.ok) {
      return auth.response;
    }

    return ok(await getAdminLocks());
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取锁仓管理数据失败。";
    return fail(message, 500);
  }
}
