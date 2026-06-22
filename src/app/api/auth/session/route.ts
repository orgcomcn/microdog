import { clearSessionCookie, findSessionUser } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function GET() {
  try {
    const user = await findSessionUser();

    return ok({
      authenticated: Boolean(user),
      user: user
        ? {
            id: user.id,
            walletAddress: user.walletAddress,
            nickname: user.nickname,
            role: user.role,
          }
        : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load auth session.";
    return fail(message, 500);
  }
}

export async function DELETE() {
  try {
    await clearSessionCookie();

    return ok({
      authenticated: false,
    }, "Logged out.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to clear auth session.";
    return fail(message, 500);
  }
}
