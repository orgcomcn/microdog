import { fail, ok } from "@/lib/api";
import { getAdminUsers } from "@/modules/admin/user-service";
import { requireAdminApiSession } from "../_utils";

export async function GET() {
  try {
    const auth = await requireAdminApiSession();

    if (!auth.ok) {
      return auth.response;
    }

    return ok(await getAdminUsers());
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取用户列表失败。";
    return fail(message, 500);
  }
}
