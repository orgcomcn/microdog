import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
import { updateLockPlanAction } from "@/app/admin/actions";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminLocks } from "@/modules/admin/lock-service";

export default async function AdminLocksPage() {
  const { positions, plans } = await getAdminLocks();

  return (
    <AdminPageShell
      title="后台 / 锁仓管理"
      description="查看锁仓记录，配置 30 / 90 / 180 天等锁仓方案和释放比例。"
      badge="Admin / Locks"
    >
      <AdminTopbar />

      <section className="mt-5 grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
        <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            锁仓方案配置
          </div>

          <div className="mt-5 space-y-4">
            {plans.map((plan) => (
              <form key={plan.id} action={updateLockPlanAction} className="space-y-3 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <input type="hidden" name="id" value={plan.id} />
                <input
                  name="name"
                  type="text"
                  defaultValue={plan.name}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#0d1532]/88 px-3 text-sm text-white outline-none"
                  required
                />
                <input
                  name="durationDays"
                  type="number"
                  defaultValue={plan.durationDays}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#0d1532]/88 px-3 text-sm text-white outline-none"
                  required
                />
                <input
                  name="releaseRatioBps"
                  type="number"
                  defaultValue={plan.releaseRatioBps}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#0d1532]/88 px-3 text-sm text-white outline-none"
                  required
                />
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={plan.sortOrder}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#0d1532]/88 px-3 text-sm text-white outline-none"
                  required
                />
                <label className="flex items-center gap-2 text-sm text-white/72">
                  <input name="isActive" type="checkbox" defaultChecked={plan.isActive} />
                  启用方案
                </label>
                <button
                  type="submit"
                  className="h-10 w-full rounded-xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
                >
                  保存方案
                </button>
              </form>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            锁仓记录
          </div>

          <div className="mt-5 space-y-4">
            {positions.length === 0 ? (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-sm text-white/58">
                当前还没有锁仓记录。
              </div>
            ) : (
              positions.map((position) => (
                <div
                  key={position.id}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">
                      {position.uid ?? "-"} / {position.walletAddress}
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/72">
                      {position.status}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-white/62 sm:grid-cols-2 xl:grid-cols-3">
                    <div>资产：{position.assetSymbol}</div>
                    <div>数量：{position.amount}</div>
                    <div>期限：{position.durationDays} 天</div>
                    <div>释放比例：{position.releaseRatioBps / 100}%</div>
                    <div>开始时间：{formatShanghaiDateTime(position.startAt)}</div>
                    <div>解锁时间：{position.endAt ? formatShanghaiDateTime(position.endAt) : "-"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </AdminPageShell>
  );
}
