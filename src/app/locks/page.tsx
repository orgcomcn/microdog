import { PageShell } from "@/components/layout/page-shell";
import { findSessionUser } from "@/lib/auth";
import { formatShanghaiDateTime } from "@/lib/datetime";
import {
  formatReleaseRatioPercent,
  getLockStatusLabel,
  getPointLogTypeLabel,
} from "@/lib/labels";
import { getUserLocksOverview } from "@/modules/locks/service";

import { createPointsLockAction } from "./actions";
import { LockSubmitButton } from "./_components/lock-submit-button";
import { LocksPagination } from "./_components/locks-pagination";

export default async function LocksPage({
  searchParams,
}: {
  searchParams?: Promise<{ positionPage?: string; logPage?: string }>;
}) {
  const params = await searchParams;
  const positionPage = Math.max(1, Number.parseInt(params?.positionPage ?? "1", 10) || 1);
  const logPage = Math.max(1, Number.parseInt(params?.logPage ?? "1", 10) || 1);
  const user = await findSessionUser();
  const overview = user
    ? await getUserLocksOverview(user.id, {
        positionPage,
        positionPageSize: 10,
        logPage,
        logPageSize: 10,
      })
    : null;

  return (
    <PageShell
      title="锁仓系统"
      description="积分唯一用途为锁仓，支持 30 / 90 / 180 天固定周期，到期自动解锁返还积分。"
      badge="Locks"
    >
      {!user || !overview ? (
        <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.88)_0%,rgba(5,10,25,0.84)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
          <div className="text-lg font-semibold text-white">请先连接钱包</div>
          <p className="mt-3 text-sm leading-7 text-white/62">
            登录后可查看积分余额、锁仓方案和锁仓记录。
          </p>
        </section>
      ) : (
        <div className="grid gap-5">
          <section className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
            <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.86)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                当前积分
              </div>
              <div className="mt-4 text-4xl font-semibold text-white">
                {overview.user.pointsBalance}
              </div>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.86)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                发起锁仓
              </div>

              <form action={createPointsLockAction} className="mt-5 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_160px] lg:items-end">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-white/78">锁仓周期</span>
                  <select
                    name="durationDays"
                    defaultValue="30"
                    className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-sm text-white outline-none"
                  >
                    {overview.plans.map((plan) => (
                      <option key={plan.id} value={plan.durationDays}>
                        {plan.durationLabel} / 到期返还 {formatReleaseRatioPercent(plan.releaseRatioPercent)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-white/78">锁仓积分</span>
                  <input
                    name="amount"
                    type="number"
                    min={1}
                    placeholder="输入要锁仓的积分数量"
                    className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-sm text-white outline-none"
                    required
                  />
                </label>

                <LockSubmitButton />
              </form>

              <div className="mt-4 rounded-[20px] border border-cyan-300/16 bg-cyan-300/8 px-4 py-4 text-sm text-cyan-100/88">
                锁仓返还说明：到期返还积分 = 锁仓积分 x 释放比例。
              </div>
            </article>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.86)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                锁仓记录
              </div>

              <div className="mt-5 space-y-3">
                {overview.positions.items.length === 0 ? (
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/58">
                    当前还没有锁仓记录。
                  </div>
                ) : (
                  overview.positions.items.map((position) => (
                    <div
                      key={position.id}
                      className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-white">
                          {position.durationLabel} / {position.amount} 积分
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/72">
                          {getLockStatusLabel(position.status)}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-white/58 sm:grid-cols-2">
                        <div>开始时间：{formatShanghaiDateTime(position.startAt)}</div>
                        <div>到期时间：{position.endAt ? formatShanghaiDateTime(position.endAt) : "-"}</div>
                        <div>释放比例：{formatReleaseRatioPercent(position.releaseRatioPercent)}</div>
                        <div>到期返还：{position.expectedReleasePoints} 积分</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {overview.positions.totalPages > 1 ? (
                <LocksPagination
                  page={overview.positions.page}
                  totalPages={overview.positions.totalPages}
                  query={{ positionPage: undefined, logPage }}
                />
              ) : null}
            </article>

            <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.86)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                最近积分流水
              </div>

              <div className="mt-5 space-y-3">
                {overview.logs.items.length === 0 ? (
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/58">
                    当前还没有积分流水。
                  </div>
                ) : (
                  overview.logs.items.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-white">{log.reason}</div>
                        <div className={log.change >= 0 ? "text-emerald-200" : "text-rose-200"}>
                          {log.change >= 0 ? `+${log.change}` : log.change}
                        </div>
                      </div>
                      <div className="mt-2 grid gap-2 text-sm text-white/58 sm:grid-cols-2">
                        <div>类型：{getPointLogTypeLabel(log.type)}</div>
                        <div>余额：{log.balanceAfter}</div>
                        <div className="sm:col-span-2">
                          时间：{formatShanghaiDateTime(log.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {overview.logs.totalPages > 1 ? (
                <LocksPagination
                  page={overview.logs.page}
                  totalPages={overview.logs.totalPages}
                  query={{ positionPage, logPage: undefined }}
                />
              ) : null}
            </article>
          </section>
        </div>
      )}
    </PageShell>
  );
}
