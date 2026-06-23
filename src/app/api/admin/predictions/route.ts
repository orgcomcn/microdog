import { fail, ok } from "@/lib/api";
import { getAdminPredictions } from "@/modules/admin/prediction-service";
import { requireAdminApiSession } from "../_utils";

export async function GET() {
  try {
    const auth = await requireAdminApiSession();

    if (!auth.ok) {
      return auth.response;
    }

    return ok(await getAdminPredictions());
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取预测列表失败。";
    return fail(message, 500);
  }
}
