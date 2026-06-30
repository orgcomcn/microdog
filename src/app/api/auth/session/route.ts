import { clearSessionCookie, findSessionUser } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function GET() {
  try {
    const user = await findSessionUser({ clearInvalidCookie: true });

    return ok({
      authenticated: Boolean(user),
      user: user
        ? {
            id: user.id,
            uid: user.uid,
            inviteCode: user.inviteCode,
            walletAddress: user.walletAddress,
            nickname: user.nickname,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            invitedByUserId: user.invitedByUserId,
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
