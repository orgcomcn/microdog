import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
import { adjustPointsAction } from "@/app/admin/actions";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminPointLogs } from "@/modules/admin/points-service";
import { getAdminUsers } from "@/modules/admin/user-service";

export default async function AdminPointsPage() {
  const [logs, users] = await Promise.all([
    getAdminPointLogs(),
    getAdminUsers(),
  ]);

  return (
    <AdminPageShell
      title="后台 / 积分管理"
      description="支持管理员手动发放、扣减积分，并查看完整积分流水。"
      badge="Admin / Points"
    >
      <AdminTopbar />

      <section className="mt-5 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
          手动调账
        </div>

        <form action={adjustPointsAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <select
            name="userId"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
            required
          >
            <option value="">选择用户</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.uid ?? "-"} / {user.walletAddress}
              </option>
            ))}
          </select>

          <input
            name="change"
            type="number"
            placeholder="积分变动，正数发放，负数扣减"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
            required
          />

          <input
            name="reason"
            type="text"
            placeholder="原因，例如：运营补偿"
            className="lg:col-span-2 h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
            required
          />

          <button
            type="submit"
            className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
          >
            提交调账
          </button>
        </form>
      </section>

      <section className="mt-5 space-y-4">
        {logs.map((log) => (
          <article
            key={log.id}
            className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-semibold text-white">
                  {log.uid ?? "-"} / {log.walletAddress}
                </div>
                <div className="mt-1 text-xs text-white/52">
                  {formatShanghaiDateTime(log.createdAt)} / {log.type}
                </div>
              </div>
              <div className={`text-lg font-semibold ${log.change >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                {log.change >= 0 ? `+${log.change}` : log.change}
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-white/62 sm:grid-cols-3">
              <div>变动后余额：{log.balanceAfter}</div>
              <div>操作人：{log.operatorLabel ?? "-"}</div>
              <div>原因：{log.reason}</div>
            </div>
          </article>
        ))}
      </section>
    </AdminPageShell>
  );
}
