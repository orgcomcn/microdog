import { PointLogType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { buildPagination, toPaginationResult } from "@/modules/admin/pagination";

export async function getAdminPointLogs(input?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  type?: PointLogType | "ALL";
}) {
  const { page, pageSize, skip, take } = buildPagination(input?.page, input?.pageSize);
  const keyword = input?.keyword?.trim();
  const type = input?.type && input.type !== "ALL" ? input.type : undefined;
  const where = {
    ...(type && type !== "ALL" ? { type } : {}),
    ...(keyword
      ? {
          OR: [
            { reason: { contains: keyword, mode: "insensitive" as const } },
            { operatorLabel: { contains: keyword, mode: "insensitive" as const } },
            {
              user: {
                is: {
                  OR: [
                    { uid: { contains: keyword, mode: "insensitive" as const } },
                    { walletAddress: { contains: keyword, mode: "insensitive" as const } },
                  ],
                },
              },
            },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.pointLog.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
      include: {
        user: {
          select: {
            uid: true,
            walletAddress: true,
          },
        },
      },
    }),
    prisma.pointLog.count({ where }),
  ]);

  const items = rows.map((row) => ({
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

  return toPaginationResult(items, total, page, pageSize);
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
