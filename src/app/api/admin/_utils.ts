import { fail } from "@/lib/api";
import { findAdminSession } from "@/lib/auth";

export async function requireAdminApiSession() {
  const session = await findAdminSession({ clearInvalidCookie: true });

  if (!session) {
    return {
      ok: false as const,
      response: fail("管理员未登录。", 401),
    };
  }

  return {
    ok: true as const,
    session,
  };
}
