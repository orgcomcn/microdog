"use server";

import { revalidatePath } from "next/cache";

import { findSessionUser } from "@/lib/auth";
import { createPointsLock } from "@/modules/locks/service";

function readRequiredString(formData: FormData, key: string, label: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${label}不能为空。`);
  }

  return value;
}

export async function createPointsLockAction(formData: FormData) {
  const user = await findSessionUser();

  if (!user) {
    throw new Error("请先登录钱包。");
  }

  const durationDays = Number.parseInt(
    readRequiredString(formData, "durationDays", "锁仓周期"),
    10,
  ) as 30 | 90 | 180;
  const amount = Number.parseInt(
    readRequiredString(formData, "amount", "锁仓积分"),
    10,
  );

  await createPointsLock({
    userId: user.id,
    durationDays,
    amount,
  });

  revalidatePath("/locks");
  revalidatePath("/points");
  revalidatePath("/dashboard");
}
