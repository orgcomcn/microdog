import { LockStatus, PredictionStatus, UserStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getAdminOverview() {
  const [
    users,
    activeUsers,
    frozenUsers,
    activeLocks,
    pointEvents,
    publishedPredictions,
    publishedAnnouncements,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { status: UserStatus.FROZEN } }),
    prisma.lockPosition.count({ where: { status: LockStatus.ACTIVE } }),
    prisma.pointLog.count(),
    prisma.prediction.count({ where: { status: PredictionStatus.PUBLISHED } }),
    prisma.announcement.count({ where: { status: "PUBLISHED" } }),
  ]);

  return {
    users,
    activeUsers,
    frozenUsers,
    activeLocks,
    pointEvents,
    publishedPredictions,
    publishedAnnouncements,
  };
}
