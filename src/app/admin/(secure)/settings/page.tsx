import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
import { updateLockPlanAction, updateSystemConfigAction } from "@/app/admin/actions";
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
      description="统一管理注册送分、邀请奖励、锁仓周期与 AI 每日提问次数等运营参数。"
      badge="Admin / Settings"
    >
      <AdminTopbar />

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            核心系统配置
          </div>

          <form action={updateSystemConfigAction} className="mt-5 grid gap-4">
            <input
              name="registerRewardPoints"
              type="number"
              defaultValue={config.registerRewardPoints}
              placeholder="注册送分"
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              required
            />
            <input
              name="inviteRewardPoints"
              type="number"
              defaultValue={config.inviteRewardPoints}
              placeholder="邀请奖励"
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              required
            />
            <input
              name="aiDailyQuestionLimit"
              type="number"
              defaultValue={config.aiDailyQuestionLimit}
              placeholder="AI 每日提问次数"
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              required
            />
            <button
              type="submit"
              className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
            >
              保存系统配置
            </button>
          </form>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            快速新增锁仓方案
          </div>

          <form action={updateLockPlanAction} className="mt-5 grid gap-4">
            <input
              name="name"
              type="text"
              placeholder="方案名称，例如 365天锁仓"
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              required
            />
            <input
              name="durationDays"
              type="number"
              placeholder="锁仓天数"
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              required
            />
            <input
              name="releaseRatioBps"
              type="number"
              defaultValue={10000}
              placeholder="释放比例，10000 = 100%"
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              required
            />
            <input
              name="sortOrder"
              type="number"
              defaultValue={locks.plans.length * 10 + 10}
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              required
            />
            <label className="flex items-center gap-2 text-sm text-white/72">
              <input name="isActive" type="checkbox" defaultChecked />
              启用新方案
            </label>
            <button
              type="submit"
              className="h-11 rounded-2xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
            >
              新增锁仓方案
            </button>
          </form>
        </article>
      </section>
    </AdminPageShell>
  );
}
