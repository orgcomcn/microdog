import { clearAdminSessionCookie, findAdminSession, persistAdminSession } from "@/lib/auth";
import { env } from "@/lib/env";

export async function loginAdmin(username: string, password: string) {
  const normalizedUsername = username.trim();

  if (
    normalizedUsername !== env.adminUsername ||
    password !== env.adminPassword
  ) {
    throw new Error("管理员账号或密码错误。");
  }

  return persistAdminSession(normalizedUsername);
}

export async function getAdminSessionOrThrow() {
  const session = await findAdminSession({ clearInvalidCookie: true });

  if (!session) {
    throw new Error("管理员未登录。");
  }

  return session;
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
}
