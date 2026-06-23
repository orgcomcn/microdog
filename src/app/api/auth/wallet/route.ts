import {
  clearAuthNonceCookie,
  clearReferralCookie,
  getAuthNonceCookie,
  getReferralCookie,
} from "@/lib/auth";
import { ok, fail } from "@/lib/api";
import { createWalletSession } from "@/modules/auth/service";
import { verifyWalletSignature } from "@/modules/wallet/service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      address?: string;
      message?: string;
      signature?: string;
    };

    if (!body.address || !body.message || !body.signature) {
      return fail("Missing wallet signature payload.");
    }

    const nonce = await getAuthNonceCookie();

    if (!nonce) {
      return fail("Login nonce expired. Please request a new message.", 401);
    }

    const normalizedAddress = body.address.toLowerCase();
    const expectedNonceLine = `Nonce: ${nonce}`;
    const expectedAddressLine = `Address: ${normalizedAddress}`;

    if (
      !body.message.includes(expectedNonceLine) ||
      !body.message.includes(expectedAddressLine)
    ) {
      return fail("Message does not match the active login nonce.", 401);
    }

    const verified = await verifyWalletSignature({
      address: normalizedAddress,
      message: body.message,
      signature: body.signature,
    });

    if (!verified.verified) {
      return fail("Wallet signature verification failed.", 401);
    }

    const referralCode = await getReferralCookie();

    await clearAuthNonceCookie();
    await clearReferralCookie();

    return ok(await createWalletSession(normalizedAddress, referralCode), "Wallet login succeeded.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Wallet login failed.";
    return fail(message, 500);
  }
}
