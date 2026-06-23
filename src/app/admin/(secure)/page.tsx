import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminOverview } from "@/modules/admin/overview-service";
import { getAdminPredictions } from "@/modules/admin/prediction-service";
import { getAdminUsers } from "@/modules/admin/user-service";

import { AdminPageShell } from "../_components/admin-page-shell";
import { AdminTopbar } from "../_components/admin-topbar";

export default async function AdminPage() {
  const [overview, users, predictions] = await Promise.all([
    getAdminOverview(),
    getAdminUsers(),
    getAdminPredictions(),
  ]);

  const latestUsers = users.slice(0, 5);
  const latestPredictions = predictions.slice(0, 5);

  return (
    <AdminPageShell
      title="后台管理系统"
      description="管理员可以在这里统一管理钱包用户、AI 预测、积分规则、锁仓方案、公告和系统参数。"
      badge="Admin"
    >
      <AdminTopbar />

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "总用户数", value: overview.users },
          { label: "正常用户", value: overview.activeUsers },
          { label: "冻结用户", value: overview.frozenUsers },
          { label: "进行中预测", value: overview.publishedPredictions },
          { label: "锁仓记录", value: overview.activeLocks },
          { label: "积分流水", value: overview.pointEvents },
          { label: "已发布公告", value: overview.publishedAnnouncements },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/72 uppercase">
              {item.label}
            </div>
            <div className="mt-3 text-3xl font-semibold text-white">{item.value}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            最新钱包用户
          </div>
          <div className="mt-5 space-y-3">
            {latestUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {user.uid ?? "-"} / {user.walletAddress}
                    </div>
                    <div className="mt-1 text-xs text-white/52">
                      注册时间：{formatShanghaiDateTime(user.createdAt)}
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/72">
                    {user.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            最新预测发布
          </div>
          <div className="mt-5 space-y-3">
            {latestPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {prediction.symbol} / {prediction.direction === "UP" ? "涨" : "跌"} / {prediction.targetPrice}
                    </div>
                    <div className="mt-1 text-xs text-white/52">
                      发布时间：{formatShanghaiDateTime(prediction.publishAt)}
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/72">
                    {prediction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminPageShell>
  );
}
