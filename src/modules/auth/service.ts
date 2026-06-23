import { PointLogType, UserStatus } from "@prisma/client";

import { persistUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureSystemConfig } from "@/modules/admin/settings-service";
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
  const systemConfig = await ensureSystemConfig();
  const existingUser = await prisma.user.findUnique({
    where: { walletAddress },
  });

  let user = existingUser;

  if (!user) {
    user = await prisma.$transaction(async (tx) => {
      const normalizedReferralCode = referralCode?.trim().toUpperCase() || null;
      let invitedByUserId: string | null = null;

      if (normalizedReferralCode) {
        const inviter = await tx.user.findUnique({
          where: { inviteCode: normalizedReferralCode },
          select: {
            id: true,
            walletAddress: true,
            pointsBalance: true,
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

      const registerRewardPoints = systemConfig.registerRewardPoints;
      const inviteRewardPoints = systemConfig.inviteRewardPoints;
      const invitedUserRewardPoints = invitedByUserId ? inviteRewardPoints : 0;
      const initialBalance = registerRewardPoints + invitedUserRewardPoints;

      const createdUser = await tx.user.create({
        data: {
          uid: await createNextUid(),
          inviteCode: await createUniqueInviteCode(),
          walletAddress,
          invitedByUserId,
          referralBoundAt: invitedByUserId ? new Date() : null,
          pointsBalance: initialBalance,
          lastLoginAt: new Date(),
        },
      });

      if (registerRewardPoints > 0) {
        await tx.pointLog.create({
          data: {
            userId: createdUser.id,
            change: registerRewardPoints,
            balanceAfter: registerRewardPoints,
            type: PointLogType.REGISTER_REWARD,
            reason: "注册奖励",
            operatorLabel: "system",
          },
        });
      }

      if (invitedUserRewardPoints > 0) {
        await tx.pointLog.create({
          data: {
            userId: createdUser.id,
            change: invitedUserRewardPoints,
            balanceAfter: initialBalance,
            type: PointLogType.INVITE_REWARD,
            reason: "被邀请注册奖励",
            operatorLabel: "system",
          },
        });
      }

      if (invitedByUserId && inviteRewardPoints > 0) {
        const inviter = await tx.user.findUniqueOrThrow({
          where: {
            id: invitedByUserId,
          },
        });

        const inviterBalance = inviter.pointsBalance + inviteRewardPoints;

        await tx.user.update({
          where: {
            id: invitedByUserId,
          },
          data: {
            pointsBalance: inviterBalance,
          },
        });

        await tx.pointLog.create({
          data: {
            userId: invitedByUserId,
            change: inviteRewardPoints,
            balanceAfter: inviterBalance,
            type: PointLogType.INVITE_REWARD,
            reason: `邀请奖励：${walletAddress}`,
            operatorLabel: "system",
          },
        });
      }

      return createdUser;
    });
  } else {
    if (user.status === UserStatus.FROZEN) {
      throw new Error(user.frozenReason || "当前账户已被冻结，请联系管理员。");
    }

    user = await ensureUserIdentityFields(user.id);
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  if (user.status === UserStatus.FROZEN) {
    throw new Error(user.frozenReason || "当前账户已被冻结，请联系管理员。");
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
