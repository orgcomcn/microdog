"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { Prisma } from "@prisma/client";
import {
  AnnouncementStatus,
  PredictionDirection,
  PredictionStatus,
  PredictionSymbol,
  UserStatus,
} from "@prisma/client";

import { loginAdmin, logoutAdmin, getAdminSessionOrThrow } from "@/modules/admin/auth-service";
import {
  createAdminAnnouncement,
  deleteAdminAnnouncement,
  updateAdminAnnouncement,
} from "@/modules/admin/announcement-service";
import {
  createAdminPrediction,
  deleteAdminPrediction,
  updateAdminPrediction,
} from "@/modules/admin/prediction-service";
import { deleteLockPlanConfig, updateLockPlanConfig } from "@/modules/admin/lock-service";
import { applyAdminPointAdjustment } from "@/modules/admin/points-service";
import { updateAdminAssetPoolConfig, updateAdminSystemConfig } from "@/modules/admin/settings-service";
import {
  updateAdminUserRole,
  updateAdminUserStatus,
} from "@/modules/admin/user-service";
import { parseShanghaiDateTimeLocal } from "@/lib/datetime";

export type AdminLoginActionState = {
  error: string | null;
};

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readRequiredString(formData: FormData, key: string, label: string) {
  const value = readString(formData, key);

  if (!value) {
    throw new Error(`${label}不能为空。`);
  }

  return value;
}

function readInt(formData: FormData, key: string, label: string) {
  const raw = readRequiredString(formData, key, label);
  const value = Number.parseInt(raw, 10);

  if (!Number.isFinite(value)) {
    throw new Error(`${label}格式不正确。`);
  }

  return value;
}

function readDecimalString(formData: FormData, key: string, label: string) {
  const raw = readRequiredString(formData, key, label);

  try {
    return new Prisma.Decimal(raw).toString();
  } catch {
    throw new Error(`${label}格式不正确。`);
  }
}

function readEnumValue<T extends string>(
  formData: FormData,
  key: string,
  label: string,
  accepted: readonly T[],
) {
  const value = readRequiredString(formData, key, label) as T;

  if (!accepted.includes(value)) {
    throw new Error(`${label}不合法。`);
  }

  return value;
}

export async function adminLoginAction(
  _prevState: AdminLoginActionState,
  formData: FormData,
): Promise<AdminLoginActionState> {
  try {
    const username = readRequiredString(formData, "username", "账号");
    const password = readRequiredString(formData, "password", "密码");

    await loginAdmin(username, password);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "管理员登录失败。",
    };
  }

  redirect("/admin" as Route);
}

export async function adminLogoutAction() {
  await logoutAdmin();
  redirect("/admin/login" as Route);
}

export async function freezeUserAction(formData: FormData) {
  await getAdminSessionOrThrow();

  const userId = readRequiredString(formData, "userId", "用户 ID");
  const reason = readString(formData, "reason") || "管理员冻结";

  await updateAdminUserStatus({
    userId,
    status: UserStatus.FROZEN,
    reason,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function unfreezeUserAction(formData: FormData) {
  await getAdminSessionOrThrow();

  const userId = readRequiredString(formData, "userId", "用户 ID");

  await updateAdminUserStatus({
    userId,
    status: UserStatus.ACTIVE,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function updateUserRoleAction(formData: FormData) {
  await getAdminSessionOrThrow();

  const userId = readRequiredString(formData, "userId", "用户 ID");
  const role = readEnumValue(formData, "role", "角色", ["USER", "ADMIN"] as const);

  await updateAdminUserRole({
    userId,
    role,
  });

  revalidatePath("/admin/users");
}

export async function createPredictionAction(formData: FormData) {
  const admin = await getAdminSessionOrThrow();

  await createAdminPrediction({
    symbol: readEnumValue(formData, "symbol", "币种", ["BTC", "ETH"] as const) as PredictionSymbol,
    direction: readEnumValue(formData, "direction", "方向", ["UP", "DOWN"] as const) as PredictionDirection,
    targetPrice: readRequiredString(formData, "targetPrice", "目标价格"),
    publishAt: readRequiredString(formData, "publishAt", "发布时间"),
    effectiveUntil: readRequiredString(formData, "effectiveUntil", "有效时间"),
    summary: readString(formData, "summary"),
    status: readEnumValue(
      formData,
      "status",
      "状态",
      ["DRAFT", "PUBLISHED", "UNPUBLISHED", "EXPIRED"] as const,
    ) as PredictionStatus,
    operator: admin.username,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/predictions");
  revalidatePath("/ai/predictions");
}

export async function updatePredictionAction(formData: FormData) {
  const admin = await getAdminSessionOrThrow();

  await updateAdminPrediction({
    id: readRequiredString(formData, "id", "记录 ID"),
    symbol: readEnumValue(formData, "symbol", "币种", ["BTC", "ETH"] as const) as PredictionSymbol,
    direction: readEnumValue(formData, "direction", "方向", ["UP", "DOWN"] as const) as PredictionDirection,
    targetPrice: readRequiredString(formData, "targetPrice", "目标价格"),
    publishAt: readRequiredString(formData, "publishAt", "发布时间"),
    effectiveUntil: readRequiredString(formData, "effectiveUntil", "有效时间"),
    summary: readString(formData, "summary"),
    status: readEnumValue(
      formData,
      "status",
      "状态",
      ["DRAFT", "PUBLISHED", "UNPUBLISHED", "EXPIRED"] as const,
    ) as PredictionStatus,
    operator: admin.username,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/predictions");
  revalidatePath("/ai/predictions");
}

export async function deletePredictionAction(formData: FormData) {
  await getAdminSessionOrThrow();

  await deleteAdminPrediction(readRequiredString(formData, "id", "记录 ID"));

  revalidatePath("/admin");
  revalidatePath("/admin/predictions");
  revalidatePath("/ai/predictions");
}

export async function createAnnouncementAction(formData: FormData) {
  const admin = await getAdminSessionOrThrow();

  await createAdminAnnouncement({
    title: readRequiredString(formData, "title", "标题"),
    tag: readString(formData, "tag"),
    content: readRequiredString(formData, "content", "内容"),
    status: readEnumValue(
      formData,
      "status",
      "状态",
      ["DRAFT", "PUBLISHED"] as const,
    ) as AnnouncementStatus,
    sortOrder: readInt(formData, "sortOrder", "排序"),
    operator: admin.username,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/announcements");
}

export async function updateAnnouncementAction(formData: FormData) {
  const admin = await getAdminSessionOrThrow();

  await updateAdminAnnouncement({
    id: readRequiredString(formData, "id", "公告 ID"),
    title: readRequiredString(formData, "title", "标题"),
    tag: readString(formData, "tag"),
    content: readRequiredString(formData, "content", "内容"),
    status: readEnumValue(
      formData,
      "status",
      "状态",
      ["DRAFT", "PUBLISHED"] as const,
    ) as AnnouncementStatus,
    sortOrder: readInt(formData, "sortOrder", "排序"),
    operator: admin.username,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/announcements");
}

export async function deleteAnnouncementAction(formData: FormData) {
  await getAdminSessionOrThrow();

  await deleteAdminAnnouncement(readRequiredString(formData, "id", "公告 ID"));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/announcements");
}

export async function adjustPointsAction(formData: FormData) {
  const admin = await getAdminSessionOrThrow();

  await applyAdminPointAdjustment({
    userId: readRequiredString(formData, "userId", "用户 ID"),
    change: readInt(formData, "change", "积分变动"),
    reason: readRequiredString(formData, "reason", "原因"),
    operatorLabel: admin.username,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/points");
  revalidatePath("/dashboard");
}

export async function updateLockPlanAction(formData: FormData) {
  await getAdminSessionOrThrow();

  const id = readString(formData, "id");
  const releaseRatioPercent = readInt(formData, "releaseRatioBps", "释放比例");

  await updateLockPlanConfig({
    id: id || undefined,
    name: readRequiredString(formData, "name", "方案名称"),
    durationDays: readInt(formData, "durationDays", "锁仓天数"),
    releaseRatioBps: releaseRatioPercent * 100,
    isActive: String(formData.get("isActive") ?? "") === "on",
    sortOrder: readInt(formData, "sortOrder", "排序"),
  });

  revalidatePath("/admin/locks");
  revalidatePath("/admin/settings");
}

export async function deleteLockPlanAction(formData: FormData) {
  await getAdminSessionOrThrow();

  await deleteLockPlanConfig(readRequiredString(formData, "id", "方案 ID"));

  revalidatePath("/admin/locks");
  revalidatePath("/admin/settings");
}

export async function updateSystemConfigAction(formData: FormData) {
  await getAdminSessionOrThrow();

  await updateAdminSystemConfig({
    registerRewardPoints: readInt(formData, "registerRewardPoints", "注册送分"),
    inviteRewardPoints: readInt(formData, "inviteRewardPoints", "邀请奖励"),
    aiDailyQuestionLimit: readInt(formData, "aiDailyQuestionLimit", "AI 每日提问次数"),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}

export async function updateAssetPoolConfigAction(formData: FormData) {
  await getAdminSessionOrThrow();

  await updateAdminAssetPoolConfig({
    btcAmount: readDecimalString(formData, "btcAmount", "BTC 数量"),
    ethAmount: readDecimalString(formData, "ethAmount", "ETH 数量"),
    microdogAmount: readDecimalString(formData, "microdogAmount", "MicroDOGE 数量"),
    tvl: readDecimalString(formData, "tvl", "TVL"),
    assetPoolUpdatedAt: parseShanghaiDateTimeLocal(
      readRequiredString(formData, "assetPoolUpdatedAt", "更新时间"),
    ),
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
