import { findSessionUser } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { getUserLocksOverview } from "@/modules/locks/service";

export async function GET() {
  const user = await findSessionUser({ clearInvalidCookie: true });

  if (!user) {
    return fail("请先登录钱包。", 401);
  }

  return ok(await getUserLocksOverview(user.id));
}
