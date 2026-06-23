import { PageShell } from "@/components/layout/page-shell";
import { findSessionUser } from "@/lib/auth";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getPointLogTypeLabel } from "@/lib/labels";
import { getUserLocksOverview } from "@/modules/locks/service";
import { PointsLogPagination } from "./_components/points-log-pagination";

export default async function PointsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params?.page ?? "1", 10) || 1);
  const user = await findSessionUser();
  const overview = user ? await getUserLocksOverview(user.id, { logPage: page, logPageSize: 10 }) : null;

  return (
    <PageShell
      title="积分系统"
      description="注册奖励 100 积分；邀请成功后，邀请人和被邀请人各得 100 积分。"
      badge="Points"
    >
      {!user || !overview ? (
        <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.88)_0%,rgba(5,10,25,0.84)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
          <div className="text-lg font-semibold text-white">请先连接钱包</div>
          <p className="mt-3 text-sm leading-7 text-white/62">
            登录后可查看积分余额、奖励规则和积分流水。
          </p>
        </section>
      ) : (
        <div className="grid gap-5">
          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.86)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                当前积分
              </div>
              <div className="mt-4 text-4xl font-semibold text-white">{overview.user.pointsBalance}</div>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.86)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                获得规则
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/68">
                <div>注册 = 100 积分</div>
                <div>邀请成功：邀请人 +100</div>
                <div>邀请成功：被邀请人 +100</div>
              </div>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.86)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                唯一用途
              </div>
              <div className="mt-4 text-lg font-semibold text-white">锁仓</div>
              <div className="mt-2 text-sm text-white/58">支持 30 / 90 / 180 天，到期自动解锁。</div>
            </article>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.9)_0%,rgba(5,10,25,0.86)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
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
                    <div className="mt-2 grid gap-2 text-sm text-white/58 sm:grid-cols-3">
                      <div>类型：{getPointLogTypeLabel(log.type)}</div>
                      <div>余额：{log.balanceAfter}</div>
                      <div>时间：{formatShanghaiDateTime(log.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {overview.logs.totalPages > 1 ? (
              <PointsLogPagination
                page={overview.logs.page}
                totalPages={overview.logs.totalPages}
              />
            ) : null}
          </section>
        </div>
      )}
    </PageShell>
  );
}
