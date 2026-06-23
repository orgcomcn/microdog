import {
  PredictionDirection,
  PredictionStatus,
  PredictionSymbol,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getAdminPredictions() {
  const rows = await prisma.prediction.findMany({
    orderBy: [
      { publishAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return rows.map((row) => ({
    ...row,
    targetPrice: row.targetPrice.toString(),
    publishAt: row.publishAt.toISOString(),
    effectiveUntil: row.effectiveUntil.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
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
      publishAt: new Date(input.publishAt),
      effectiveUntil: new Date(input.effectiveUntil),
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
      publishAt: new Date(input.publishAt),
      effectiveUntil: new Date(input.effectiveUntil),
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
