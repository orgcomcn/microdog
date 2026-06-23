import { fail, ok } from "@/lib/api";
import { readAdminListQuery } from "@/app/admin/_components/admin-query";
import { getAdminPredictions } from "@/modules/admin/prediction-service";
import { requireAdminApiSession } from "../_utils";

export async function GET(request: Request) {
  try {
    const auth = await requireAdminApiSession();

    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    return ok(
      await getAdminPredictions(
        readAdminListQuery({
          page: searchParams.get("page") ?? undefined,
          pageSize: searchParams.get("pageSize") ?? undefined,
        }),
      ),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取预测列表失败。";
    return fail(message, 500);
  }
}
