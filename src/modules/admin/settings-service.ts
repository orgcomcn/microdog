import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function ensureSystemConfig() {
  let config = await prisma.systemConfig.findUnique({
    where: {
      id: "default",
    },
  });

  if (!config) {
    config = await prisma.systemConfig.create({
      data: {
        id: "default",
        registerRewardPoints: 100,
        inviteRewardPoints: 100,
        aiDailyQuestionLimit: 10,
      },
    });
  }

  return config;
}

export async function getAdminSystemConfig() {
  const config = await ensureSystemConfig();

  return {
    ...config,
    btcAmount: config.btcAmount.toString(),
    ethAmount: config.ethAmount.toString(),
    microdogAmount: config.microdogAmount.toString(),
    tvl: config.tvl.toString(),
    assetPoolUpdatedAt: config.assetPoolUpdatedAt.toISOString(),
    createdAt: config.createdAt.toISOString(),
    updatedAt: config.updatedAt.toISOString(),
  };
}

export async function updateAdminSystemConfig(input: {
  registerRewardPoints: number;
  inviteRewardPoints: number;
  aiDailyQuestionLimit: number;
}) {
  return prisma.systemConfig.upsert({
    where: {
      id: "default",
    },
    update: {
      registerRewardPoints: input.registerRewardPoints,
      inviteRewardPoints: input.inviteRewardPoints,
      aiDailyQuestionLimit: input.aiDailyQuestionLimit,
    },
    create: {
      id: "default",
      registerRewardPoints: input.registerRewardPoints,
      inviteRewardPoints: input.inviteRewardPoints,
      aiDailyQuestionLimit: input.aiDailyQuestionLimit,
    },
  });
}

export async function updateAdminAssetPoolConfig(input: {
  btcAmount: string;
  ethAmount: string;
  microdogAmount: string;
  tvl: string;
  assetPoolUpdatedAt: Date;
}) {
  return prisma.systemConfig.upsert({
    where: {
      id: "default",
    },
    update: {
      btcAmount: input.btcAmount,
      ethAmount: input.ethAmount,
      microdogAmount: input.microdogAmount,
      tvl: input.tvl,
      assetPoolUpdatedAt: input.assetPoolUpdatedAt,
    },
    create: {
      id: "default",
      registerRewardPoints: 100,
      inviteRewardPoints: 100,
      aiDailyQuestionLimit: 10,
      btcAmount: input.btcAmount,
      ethAmount: input.ethAmount,
      microdogAmount: input.microdogAmount,
      tvl: input.tvl,
      assetPoolUpdatedAt: input.assetPoolUpdatedAt,
    },
  });
}

export async function getHomeAssetPool() {
  noStore();

  const config = await ensureSystemConfig();

  return {
    btcAmount: config.btcAmount.toString(),
    ethAmount: config.ethAmount.toString(),
    microdogAmount: config.microdogAmount.toString(),
    tvl: config.tvl.toString(),
    updatedAt: config.assetPoolUpdatedAt.toISOString(),
  };
}
