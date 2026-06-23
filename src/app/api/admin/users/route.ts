import { fail, ok } from "@/lib/api";
import { readAdminListQuery } from "@/app/admin/_components/admin-query";
import { getAdminUsers } from "@/modules/admin/user-service";
import { requireAdminApiSession } from "../_utils";

export async function GET(request: Request) {
  try {
    const auth = await requireAdminApiSession();

    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    return ok(
      await getAdminUsers(
        readAdminListQuery({
          page: searchParams.get("page") ?? undefined,
          pageSize: searchParams.get("pageSize") ?? undefined,
        }),
      ),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取用户列表失败。";
    return fail(message, 500);
  }
}
