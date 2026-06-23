import {
  PredictionDirection,
  PredictionStatus,
  PredictionSymbol,
} from "@prisma/client";

import { parseShanghaiDateTimeLocal } from "@/lib/datetime";
import { prisma } from "@/lib/prisma";
import { buildPagination, toPaginationResult } from "@/modules/admin/pagination";

export async function getAdminPredictions(input?: { page?: number; pageSize?: number }) {
  const { page, pageSize, skip, take } = buildPagination(input?.page, input?.pageSize);
  const [rows, total] = await Promise.all([
    prisma.prediction.findMany({
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }],
      skip,
      take,
    }),
    prisma.prediction.count(),
  ]);

  const items = rows.map((row) => ({
    ...row,
    targetPrice: row.targetPrice.toString(),
    publishAt: row.publishAt.toISOString(),
    effectiveUntil: row.effectiveUntil.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    isVisibleOnFront:
      row.status === PredictionStatus.PUBLISHED &&
      row.publishAt.getTime() <= Date.now() &&
      row.effectiveUntil.getTime() >= Date.now(),
    frontVisibilityReason:
      row.status !== PredictionStatus.PUBLISHED
        ? "状态不是已发布"
        : row.publishAt.getTime() > Date.now()
          ? "发布时间还没到"
          : row.effectiveUntil.getTime() < Date.now()
            ? "已超过有效期"
            : "前台展示中",
  }));

  return toPaginationResult(items, total, page, pageSize);
}

export async function createAdminPrediction(input: {
  symbol: PredictionSymbol;
  direction: PredictionDirection;
  targetPrice: string;
  publishAt: string;
  effectiveUntil: string;
  summary?: string;
  status: PredictionStatus;
  operator: string;
}) {
  return prisma.prediction.create({
    data: {
      symbol: input.symbol,
      direction: input.direction,
      targetPrice: input.targetPrice,
      publishAt: parseShanghaiDateTimeLocal(input.publishAt),
      effectiveUntil: parseShanghaiDateTimeLocal(input.effectiveUntil),
      summary: input.summary?.trim() || null,
      status: input.status,
      createdBy: input.operator,
      updatedBy: input.operator,
    },
  });
}

export async function updateAdminPrediction(input: {
  id: string;
  symbol: PredictionSymbol;
  direction: PredictionDirection;
  targetPrice: string;
  publishAt: string;
  effectiveUntil: string;
  summary?: string;
  status: PredictionStatus;
  operator: string;
}) {
  return prisma.prediction.update({
    where: {
      id: input.id,
    },
    data: {
      symbol: input.symbol,
      direction: input.direction,
      targetPrice: input.targetPrice,
      publishAt: parseShanghaiDateTimeLocal(input.publishAt),
      effectiveUntil: parseShanghaiDateTimeLocal(input.effectiveUntil),
      summary: input.summary?.trim() || null,
      status: input.status,
      updatedBy: input.operator,
    },
  });
}

export async function deleteAdminPrediction(id: string) {
  await prisma.prediction.delete({
    where: {
      id,
    },
  });
}

export async function getPublishedPredictionsForFront() {
  const now = new Date();
  const rows = await prisma.prediction.findMany({
    where: {
      status: PredictionStatus.PUBLISHED,
      publishAt: {
        lte: now,
      },
      effectiveUntil: {
        gte: now,
      },
    },
    orderBy: [
      { publishAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return rows.map((row) => ({
    id: row.id,
    symbol: row.symbol,
    direction: row.direction,
    targetPrice: row.targetPrice.toString(),
    publishAt: row.publishAt.toISOString(),
    effectiveUntil: row.effectiveUntil.toISOString(),
    summary: row.summary,
  }));
}

export async function getPredictionFrontVisibilitySummary() {
  const now = new Date();
  const [publishedCount, visibleCount, pendingCount, expiredCount] = await Promise.all([
    prisma.prediction.count({
      where: {
        status: PredictionStatus.PUBLISHED,
      },
    }),
    prisma.prediction.count({
      where: {
        status: PredictionStatus.PUBLISHED,
        publishAt: { lte: now },
        effectiveUntil: { gte: now },
      },
    }),
    prisma.prediction.count({
      where: {
        status: PredictionStatus.PUBLISHED,
        publishAt: { gt: now },
      },
    }),
    prisma.prediction.count({
      where: {
        status: PredictionStatus.PUBLISHED,
        effectiveUntil: { lt: now },
      },
    }),
  ]);

  return {
    publishedCount,
    visibleCount,
    pendingCount,
    expiredCount,
  };
}
