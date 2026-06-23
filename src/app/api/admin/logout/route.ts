import { ok } from "@/lib/api";
import { logoutAdmin } from "@/modules/admin/auth-service";

export async function POST() {
  await logoutAdmin();

  return ok({
    loggedOut: true,
  }, "管理员已退出。");
}
