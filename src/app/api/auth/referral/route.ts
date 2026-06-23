import {
  clearReferralCookie,
  getReferralCookie,
  normalizeReferralCode,
  setReferralCookie,
} from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const referralCode = await getReferralCookie();

    if (!referralCode) {
      return ok({
        referralCode: null,
        inviter: null,
      });
    }

    const inviter = await prisma.user.findUnique({
      where: { inviteCode: referralCode },
      select: {
        uid: true,
        walletAddress: true,
      },
    });

    return ok({
      referralCode,
      inviter: inviter
        ? {
            uid: inviter.uid,
            walletAddress: inviter.walletAddress,
          }
        : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load referral state.";
    return fail(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      referralCode?: string;
    };

    if (!body.referralCode?.trim()) {
      return fail("Invitation code is required.");
    }

    const referralCode = normalizeReferralCode(body.referralCode);
    const inviter = await prisma.user.findUnique({
      where: { inviteCode: referralCode },
      select: {
        uid: true,
        walletAddress: true,
      },
    });

    if (!inviter) {
      return fail("Invitation code is invalid.", 404);
    }

    await setReferralCookie(referralCode);

    return ok({
      referralCode,
      inviter,
    }, "Referral captured.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to capture referral.";
    return fail(message, 500);
  }
}

export async function DELETE() {
  try {
    await clearReferralCookie();

    return ok({
      referralCode: null,
    }, "Referral cleared.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to clear referral.";
    return fail(message, 500);
  }
}
