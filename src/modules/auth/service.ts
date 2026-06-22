import { prisma } from "@/lib/prisma";
import { persistUserSession } from "@/lib/auth";

export async function createWalletSession(address: string) {
  const walletAddress = address.toLowerCase();
  const user = await prisma.user.upsert({
    where: { walletAddress },
    update: {},
    create: { walletAddress },
  });

  const session = await persistUserSession(user.id, walletAddress);

  return {
    user: {
      id: user.id,
      walletAddress: user.walletAddress,
      role: user.role,
    },
    expiresAt: session.expiresAt,
  };
}
