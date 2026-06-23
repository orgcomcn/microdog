import { prisma } from "@/lib/prisma";
import { buildPagination, toPaginationResult } from "@/modules/admin/pagination";

export async function ensureDefaultLockPlans() {
  const count = await prisma.lockPlanConfig.count();

  if (count > 0) {
    return;
  }

  await prisma.lockPlanConfig.createMany({
    data: [
      {
        name: "30天锁仓",
        durationDays: 30,
        releaseRatioBps: 10000,
        isActive: true,
        sortOrder: 10,
      },
      {
        name: "90天锁仓",
        durationDays: 90,
        releaseRatioBps: 10000,
        isActive: true,
        sortOrder: 20,
      },
      {
        name: "180天锁仓",
        durationDays: 180,
        releaseRatioBps: 10000,
        isActive: true,
        sortOrder: 30,
      },
    ],
  });
}

export async function getAdminLocks(input?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: "ALL" | "ACTIVE" | "RELEASED";
}) {
  await ensureDefaultLockPlans();
  const { page, pageSize, skip, take } = buildPagination(input?.page, input?.pageSize);
  const keyword = input?.keyword?.trim();
  const status = input?.status && input.status !== "ALL" ? input.status : undefined;
  const where = {
    ...(status ? { status } : {}),
    ...(keyword
      ? {
          OR: [
            { assetSymbol: { contains: keyword, mode: "insensitive" as const } },
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

  const [positions, positionTotal, plans] = await Promise.all([
    prisma.lockPosition.findMany({
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
    prisma.lockPosition.count({ where }),
    prisma.lockPlanConfig.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { durationDays: "asc" },
      ],
    }),
  ]);

  return {
    positions: toPaginationResult(
      positions.map((row) => ({
        id: row.id,
        userId: row.userId,
        uid: row.user.uid,
        walletAddress: row.user.walletAddress,
        assetSymbol: row.assetSymbol,
        amount: row.amount.toString(),
        durationDays: row.durationDays,
        releaseRatioBps: row.releaseRatioBps,
        status: row.status,
        startAt: row.startAt.toISOString(),
        endAt: row.endAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
      positionTotal,
      page,
      pageSize,
    ),
    plans: plans.map((plan) => ({
      ...plan,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    })),
  };
}

export async function updateLockPlanConfig(input: {
  id?: string;
  name: string;
  durationDays: number;
  releaseRatioBps: number;
  isActive: boolean;
  sortOrder: number;
}) {
  if (input.id) {
    return prisma.lockPlanConfig.update({
      where: { id: input.id },
      data: {
        name: input.name.trim(),
        durationDays: input.durationDays,
        releaseRatioBps: input.releaseRatioBps,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  }

  return prisma.lockPlanConfig.create({
    data: {
      name: input.name.trim(),
      durationDays: input.durationDays,
      releaseRatioBps: input.releaseRatioBps,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
  });
}
