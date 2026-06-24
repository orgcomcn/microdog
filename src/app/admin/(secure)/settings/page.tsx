import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminDateTimeField } from "@/app/admin/_components/admin-date-time-field";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
import {
  AdminCheckbox,
  AdminField,
  AdminFormSection,
  AdminInput,
  AdminSectionTitle,
} from "@/app/admin/_components/admin-form";
import {
  deleteLockPlanAction,
  updateAssetPoolConfigAction,
  updateLockPlanAction,
  updateSystemConfigAction,
} from "@/app/admin/actions";
import { toShanghaiDateTimeLocalValue } from "@/lib/datetime";
import { getAdminLocks } from "@/modules/admin/lock-service";
import { getAdminSystemConfig } from "@/modules/admin/settings-service";

export default async function AdminSettingsPage() {
  const [config, locks] = await Promise.all([
    getAdminSystemConfig(),
    getAdminLocks(),
  ]);

  return (
    <AdminPageShell
      title="后台 / 系统设置"
      description="统一管理注册送分、邀请奖励、平台资产池展示、锁仓周期与 AI 每日提问次数等运营参数。"
      badge="Admin / Settings"
    >
      <AdminTopbar />

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <AdminFormSection className="mt-0">
          <AdminSectionTitle>核心系统配置</AdminSectionTitle>
          <form action={updateSystemConfigAction} className="mt-5 grid gap-4">
            <AdminField label="注册送分">
              <AdminInput name="registerRewardPoints" type="number" defaultValue={config.registerRewardPoints} required />
            </AdminField>
            <AdminField label="邀请奖励">
              <AdminInput name="inviteRewardPoints" type="number" defaultValue={config.inviteRewardPoints} required />
            </AdminField>
            <AdminField label="AI 每日提问次数">
              <AdminInput name="aiDailyQuestionLimit" type="number" defaultValue={config.aiDailyQuestionLimit} required />
            </AdminField>
            <button
              type="submit"
              className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
            >
              保存系统配置
            </button>
          </form>
        </AdminFormSection>

        <AdminFormSection className="mt-0">
          <AdminSectionTitle>平台资产池展示</AdminSectionTitle>
          <form action={updateAssetPoolConfigAction} className="mt-5 grid gap-4">
            <AdminField label="BTC 数量" hint="支持小数，前台按千分位展示。">
              <AdminInput name="btcAmount" type="text" defaultValue={config.btcAmount} required />
            </AdminField>
            <AdminField label="ETH 数量" hint="支持小数，前台按千分位展示。">
              <AdminInput name="ethAmount" type="text" defaultValue={config.ethAmount} required />
            </AdminField>
            <AdminField label="MicroDOGE 数量" hint="支持大额整数或小数。">
              <AdminInput name="microdogAmount" type="text" defaultValue={config.microdogAmount} required />
            </AdminField>
            <AdminField label="TVL" hint="仅填写数字，前台自动补 `$` 和千分位。">
              <AdminInput name="tvl" type="text" defaultValue={config.tvl} required />
            </AdminField>
            <AdminField label="更新时间">
              <AdminDateTimeField
                name="assetPoolUpdatedAt"
                defaultValue={toShanghaiDateTimeLocalValue(config.assetPoolUpdatedAt)}
                required
              />
            </AdminField>
            <button
              type="submit"
              className="h-11 rounded-2xl bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
            >
              保存资产池配置
            </button>
          </form>
        </AdminFormSection>

        <AdminFormSection className="mt-0 xl:col-span-2">
          <AdminSectionTitle>快速新增锁仓方案</AdminSectionTitle>
          <form action={updateLockPlanAction} className="mt-5 grid gap-4">
            <AdminField label="方案名称">
              <AdminInput name="name" type="text" placeholder="例如：365天锁仓" required />
            </AdminField>
            <AdminField label="锁仓天数">
              <AdminInput name="durationDays" type="number" required />
            </AdminField>
            <AdminField label="释放比例（%）">
              <AdminInput name="releaseRatioBps" type="number" defaultValue={100} required />
            </AdminField>
            <AdminField label="排序">
              <AdminInput name="sortOrder" type="number" defaultValue={locks.plans.length * 10 + 10} required />
            </AdminField>
            <AdminCheckbox name="isActive" defaultChecked label="启用新方案" />
            <button
              type="submit"
              className="h-11 rounded-2xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
            >
              新增锁仓方案
            </button>
          </form>
          <div className="mt-6 space-y-3">
            {locks.plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">{plan.name}</div>
                  <div className="mt-1 text-xs text-white/58">
                    {plan.durationDays === 0 ? "1分钟测试" : `${plan.durationDays} 天`} / {plan.releaseRatioPercent}% / 排序 {plan.sortOrder}
                  </div>
                </div>
                <form action={deleteLockPlanAction}>
                  <input type="hidden" name="id" value={plan.id} />
                  <button
                    type="submit"
                    className="h-10 rounded-xl border border-rose-400/24 bg-rose-400/10 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/18"
                  >
                    删除
                  </button>
                </form>
              </div>
            ))}
          </div>
        </AdminFormSection>
      </section>
    </AdminPageShell>
  );
}
