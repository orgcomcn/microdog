import { prisma } from "@/lib/prisma";
import { persistUserSession } from "@/lib/auth";
import { createNextUid, createUniqueInviteCode } from "@/modules/auth/referral";

async function ensureUserIdentityFields(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const updates: {
    uid?: string;
    inviteCode?: string;
  } = {};

  if (!user.uid) {
    updates.uid = await createNextUid();
  }

  if (!user.inviteCode) {
    updates.inviteCode = await createUniqueInviteCode();
  }

  if (Object.keys(updates).length === 0) {
    return user;
  }

  return prisma.user.update({
    where: { id: user.id },
    data: updates,
  });
}

export async function createWalletSession(address: string, referralCode?: string | null) {
  const walletAddress = address.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { walletAddress },
  });

  let user = existingUser;

  if (!user) {
    const normalizedReferralCode = referralCode?.trim().toUpperCase() || null;
    let invitedByUserId: string | null = null;

    if (normalizedReferralCode) {
      const inviter = await prisma.user.findUnique({
        where: { inviteCode: normalizedReferralCode },
        select: {
          id: true,
          walletAddress: true,
        },
      });

      if (!inviter) {
        throw new Error("邀请链接无效或已过期，请重新确认。");
      }

      if (inviter.walletAddress === walletAddress) {
        throw new Error("不能使用自己的邀请链接注册。");
      }

      invitedByUserId = inviter.id;
    }

    user = await prisma.user.create({
      data: {
        uid: await createNextUid(),
        inviteCode: await createUniqueInviteCode(),
        walletAddress,
        invitedByUserId,
        referralBoundAt: invitedByUserId ? new Date() : null,
      },
    });
  } else {
    user = await ensureUserIdentityFields(user.id);
  }

  const session = await persistUserSession(user.id, walletAddress);

  return {
    user: {
      id: user.id,
      uid: user.uid,
      inviteCode: user.inviteCode,
      walletAddress: user.walletAddress,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      invitedByUserId: user.invitedByUserId,
    },
    expiresAt: session.expiresAt,
  };
}
