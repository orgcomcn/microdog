import { UserStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getAdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      invitedBy: {
        select: {
          uid: true,
          walletAddress: true,
        },
      },
      _count: {
        select: {
          referrals: true,
          pointsLedger: true,
          lockPositions: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    uid: user.uid,
    walletAddress: user.walletAddress,
    role: user.role,
    status: user.status,
    pointsBalance: user.pointsBalance,
    inviteCode: user.inviteCode,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    frozenAt: user.frozenAt?.toISOString() ?? null,
    frozenReason: user.frozenReason ?? null,
    invitedBy: user.invitedBy
      ? {
          uid: user.invitedBy.uid,
          walletAddress: user.invitedBy.walletAddress,
        }
      : null,
    referralCount: user._count.referrals,
    pointLogCount: user._count.pointsLedger,
    lockCount: user._count.lockPositions,
  }));
}

export async function updateAdminUserStatus(input: {
  userId: string;
  status: UserStatus;
  reason?: string | null;
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: input.userId,
    },
  });

  if (!user) {
    throw new Error("用户不存在。");
  }

  return prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: input.status,
        frozenAt: input.status === UserStatus.FROZEN ? new Date() : null,
        frozenReason: input.status === UserStatus.FROZEN ? input.reason?.trim() || "管理员冻结" : null,
      },
    });

    if (input.status === UserStatus.FROZEN) {
      await tx.authSession.deleteMany({
        where: {
          userId: user.id,
        },
      });
    }

    return updatedUser;
  });
}

export async function updateAdminUserRole(input: {
  userId: string;
  role: "USER" | "ADMIN";
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: input.userId,
    },
  });

  if (!user) {
    throw new Error("用户不存在。");
  }

  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      role: input.role,
    },
  });
}
