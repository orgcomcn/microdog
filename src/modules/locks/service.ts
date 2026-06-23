import { LockStatus, PointLogType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { ensureDefaultLockPlans } from "@/modules/admin/lock-service";
import { buildPagination, toPaginationResult } from "@/modules/admin/pagination";

async function releaseExpiredLocks() {
  const now = new Date();
  const expiredLocks = await prisma.lockPosition.findMany({
    where: {
      status: LockStatus.ACTIVE,
      endAt: {
        lte: now,
      },
    },
    orderBy: {
      endAt: "asc",
    },
  });

  for (const lock of expiredLocks) {
    await prisma.$transaction(async (tx) => {
      const current = await tx.lockPosition.findUnique({
        where: { id: lock.id },
      });

      if (!current || current.status !== LockStatus.ACTIVE) {
        return;
      }

      const user = await tx.user.findUniqueOrThrow({
        where: { id: current.userId },
      });

      const releasePoints = Number(current.amount);
      const nextBalance = user.pointsBalance + releasePoints;

      await tx.user.update({
        where: { id: user.id },
        data: {
          pointsBalance: nextBalance,
        },
      });

      await tx.lockPosition.update({
        where: { id: current.id },
        data: {
          status: LockStatus.RELEASED,
        },
      });

      await tx.pointLog.create({
        data: {
          userId: user.id,
          change: releasePoints,
          balanceAfter: nextBalance,
          type: PointLogType.LOCK_REWARD,
          reason: `锁仓到期解锁：${current.durationDays}天`,
          operatorLabel: "system",
        },
      });
    });
  }
}

export async function getUserLocksOverview(
  userId: string,
  input?: {
    positionPage?: number;
    positionPageSize?: number;
    logPage?: number;
    logPageSize?: number;
  },
) {
  await ensureDefaultLockPlans();
  await releaseExpiredLocks();
  const {
    page: logPage,
    pageSize: logPageSize,
    skip: logSkip,
    take: logTake,
  } = buildPagination(
    input?.logPage,
    input?.logPageSize,
  );
  const {
    page: positionPage,
    pageSize: positionPageSize,
    skip: positionSkip,
    take: positionTake,
  } = buildPagination(input?.positionPage, input?.positionPageSize);

  const [user, plans, positions, positionTotal, logs, logTotal] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        uid: true,
        walletAddress: true,
        pointsBalance: true,
      },
    }),
    prisma.lockPlanConfig.findMany({
      where: {
        isActive: true,
        durationDays: {
          in: [30, 90, 180],
        },
      },
      orderBy: {
        durationDays: "asc",
      },
    }),
    prisma.lockPosition.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      skip: positionSkip,
      take: positionTake,
    }),
    prisma.lockPosition.count({
      where: { userId },
    }),
    prisma.pointLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: logSkip,
      take: logTake,
    }),
    prisma.pointLog.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    user,
    plans: plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      durationDays: plan.durationDays,
      releaseRatioBps: plan.releaseRatioBps,
      sortOrder: plan.sortOrder,
    })),
    positions: toPaginationResult(
      positions.map((position) => ({
        id: position.id,
        amount: Number(position.amount),
        durationDays: position.durationDays,
        status: position.status,
        startAt: position.startAt.toISOString(),
        endAt: position.endAt?.toISOString() ?? null,
        createdAt: position.createdAt.toISOString(),
      })),
      positionTotal,
      positionPage,
      positionPageSize,
    ),
    logs: toPaginationResult(
      logs.map((log) => ({
        id: log.id,
        change: log.change,
        balanceAfter: log.balanceAfter,
        type: log.type,
        reason: log.reason,
        createdAt: log.createdAt.toISOString(),
      })),
      logTotal,
      logPage,
      logPageSize,
    ),
  };
}

export async function createPointsLock(input: {
  userId: string;
  durationDays: 30 | 90 | 180;
  amount: number;
}) {
  await ensureDefaultLockPlans();

  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error("锁仓积分必须是大于 0 的整数。");
  }

  const plan = await prisma.lockPlanConfig.findFirst({
    where: {
      isActive: true,
      durationDays: input.durationDays,
    },
  });

  if (!plan) {
    throw new Error("当前锁仓方案不可用。");
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("用户不存在。");
    }

    if (user.pointsBalance < input.amount) {
      throw new Error("积分余额不足。");
    }

    const nextBalance = user.pointsBalance - input.amount;
    const startAt = new Date();
    const endAt = new Date(startAt.getTime() + input.durationDays * 24 * 60 * 60 * 1000);

    await tx.user.update({
      where: { id: user.id },
      data: {
        pointsBalance: nextBalance,
      },
    });

    const position = await tx.lockPosition.create({
      data: {
        userId: user.id,
        assetSymbol: "POINTS",
        amount: input.amount,
        durationDays: input.durationDays,
        releaseRatioBps: plan.releaseRatioBps,
        status: LockStatus.ACTIVE,
        startAt,
        endAt,
      },
    });

    await tx.pointLog.create({
      data: {
        userId: user.id,
        change: -input.amount,
        balanceAfter: nextBalance,
        type: PointLogType.SYSTEM_ADJUST,
        reason: `积分锁仓：${input.durationDays}天`,
        operatorLabel: "system",
      },
    });

    return position;
  });
}
