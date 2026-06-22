import { buildWalletLoginMessage, createAuthNonce, setAuthNonceCookie } from "@/lib/auth";
import { ok, fail } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      address?: string;
    };

    if (!body.address) {
      return fail("Wallet address is required.");
    }

    const nonce = createAuthNonce();
    const message = buildWalletLoginMessage(body.address, nonce);

    await setAuthNonceCookie(nonce);

    return ok({
      address: body.address.toLowerCase(),
      message,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate wallet login message.";
    return fail(message, 500);
  }
}
