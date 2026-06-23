import { PointLogType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getAdminPointLogs() {
  const rows = await prisma.pointLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          uid: true,
          walletAddress: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    uid: row.user.uid,
    walletAddress: row.user.walletAddress,
    change: row.change,
    balanceAfter: row.balanceAfter,
    type: row.type,
    reason: row.reason,
    operatorLabel: row.operatorLabel,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function applyAdminPointAdjustment(input: {
  userId: string;
  change: number;
  reason: string;
  operatorLabel: string;
}) {
  if (!input.change || Number.isNaN(input.change)) {
    throw new Error("积分变动值不能为空。");
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: input.userId,
      },
    });

    if (!user) {
      throw new Error("用户不存在。");
    }

    const nextBalance = user.pointsBalance + input.change;

    if (nextBalance < 0) {
      throw new Error("扣减后积分不能小于 0。");
    }

    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        pointsBalance: nextBalance,
      },
    });

    const type =
      input.change > 0 ? PointLogType.MANUAL_GRANT : PointLogType.MANUAL_DEDUCT;

    return tx.pointLog.create({
      data: {
        userId: user.id,
        change: input.change,
        balanceAfter: nextBalance,
        type,
        reason: input.reason.trim(),
        operatorLabel: input.operatorLabel,
      },
    });
  });
}
