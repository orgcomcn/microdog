import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminUsers } from "@/modules/admin/user-service";

import { AdminPageShell } from "../../_components/admin-page-shell";
import {
  freezeUserAction,
  unfreezeUserAction,
  updateUserRoleAction,
} from "../../actions";
import { AdminTopbar } from "../../_components/admin-topbar";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <AdminPageShell
      title="后台 / 用户管理"
      description="针对已经连接并登录过钱包的用户进行查看、冻结、解冻和角色调整。"
      badge="Admin / Users"
    >
      <AdminTopbar />

      <section className="mt-5 space-y-4">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xl font-semibold text-white">
                    {user.uid ?? "-"}
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/72">
                    {user.status}
                  </div>
                  <div className="rounded-full border border-cyan-300/16 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                    {user.role}
                  </div>
                </div>

                <div className="text-sm text-white/80">{user.walletAddress}</div>

                <div className="grid gap-2 text-sm text-white/58 sm:grid-cols-2 xl:grid-cols-3">
                  <div>注册时间：{formatShanghaiDateTime(user.createdAt)}</div>
                  <div>最近登录：{user.lastLoginAt ? formatShanghaiDateTime(user.lastLoginAt) : "-"}</div>
                  <div>当前积分：{user.pointsBalance}</div>
                  <div>邀请码：{user.inviteCode ?? "-"}</div>
                  <div>
                    推荐人：{user.invitedBy ? `${user.invitedBy.uid ?? "-"} / ${user.invitedBy.walletAddress}` : "-"}
                  </div>
                  <div>下级人数：{user.referralCount}</div>
                </div>

                {user.frozenReason ? (
                  <div className="rounded-2xl border border-rose-300/16 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-100/82">
                    冻结原因：{user.frozenReason}
                  </div>
                ) : null}
              </div>

              <div className="flex w-full max-w-[420px] flex-col gap-3">
                <form action={updateUserRoleAction} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <input type="hidden" name="userId" value={user.id} />
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="h-10 flex-1 rounded-xl border border-white/10 bg-[#0d1532]/88 px-3 text-sm text-white outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    type="submit"
                    className="h-10 rounded-xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
                  >
                    修改角色
                  </button>
                </form>

                {user.status === "FROZEN" ? (
                  <form action={unfreezeUserAction} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="h-10 w-full rounded-xl bg-emerald-400/16 px-4 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/22"
                    >
                      解冻用户
                    </button>
                  </form>
                ) : (
                  <form action={freezeUserAction} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <input type="hidden" name="userId" value={user.id} />
                    <input
                      name="reason"
                      type="text"
                      placeholder="冻结原因，例如：异常操作"
                      className="h-10 w-full rounded-xl border border-white/10 bg-[#0d1532]/88 px-3 text-sm text-white outline-none"
                    />
                    <button
                      type="submit"
                      className="h-10 w-full rounded-xl bg-rose-400/16 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/22"
                    >
                      冻结用户
                    </button>
                  </form>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </AdminPageShell>
  );
}
