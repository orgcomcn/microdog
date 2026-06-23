import { fail, ok } from "@/lib/api";
import { loginAdmin } from "@/modules/admin/auth-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!body.username || !body.password) {
      return fail("管理员账号和密码不能为空。");
    }

    const session = await loginAdmin(body.username, body.password);

    return ok(session, "管理员登录成功。");
  } catch (error) {
    const message = error instanceof Error ? error.message : "管理员登录失败。";
    return fail(message, 401);
  }
}
