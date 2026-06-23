import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";

const UID_PREFIX = "MD";
const UID_DIGITS = 8;
const INVITE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INVITE_CODE_LENGTH = 8;

function randomInviteCode() {
  const bytes = randomBytes(INVITE_CODE_LENGTH);

  return Array.from(bytes, (byte) => INVITE_CODE_ALPHABET[byte % INVITE_CODE_ALPHABET.length]).join("");
}

export async function createUniqueInviteCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const inviteCode = randomInviteCode();
    const existingUser = await prisma.user.findUnique({
      where: { inviteCode },
      select: { id: true },
    });

    if (!existingUser) {
      return inviteCode;
    }
  }

  throw new Error("Failed to generate a unique invite code.");
}

export async function createNextUid() {
  const users = await prisma.user.findMany({
    where: {
      uid: {
        not: null,
      },
    },
    select: {
      uid: true,
    },
  });

  const latestNumber = users.reduce((maxValue, user) => {
    if (!user.uid?.startsWith(UID_PREFIX)) {
      return maxValue;
    }

    const numericValue = Number.parseInt(user.uid.slice(UID_PREFIX.length), 10);
    return Number.isFinite(numericValue) ? Math.max(maxValue, numericValue) : maxValue;
  }, 0);

  return `${UID_PREFIX}${String(latestNumber + 1).padStart(UID_DIGITS, "0")}`;
}
