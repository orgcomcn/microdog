import { fail, ok } from "@/lib/api";
import { getAdminSystemConfig } from "@/modules/admin/settings-service";
import { requireAdminApiSession } from "../_utils";

export async function GET() {
  try {
    const auth = await requireAdminApiSession();

    if (!auth.ok) {
      return auth.response;
    }

    return ok(await getAdminSystemConfig());
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取系统配置失败。";
    return fail(message, 500);
  }
}
