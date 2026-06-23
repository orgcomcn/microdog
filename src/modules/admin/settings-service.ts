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
      },
    });
  }

  return config;
}

export async function getAdminSystemConfig() {
  const config = await ensureSystemConfig();

  return {
    ...config,
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
