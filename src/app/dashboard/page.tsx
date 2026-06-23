import { HomeShell } from "@/app/_home/home-shell";
import { findSessionUser } from "@/lib/auth";
import { formatShanghaiDateTime } from "@/lib/datetime";

import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardInviteCard } from "./_components/dashboard-invite-card";

function formatReferral(user: Awaited<ReturnType<typeof findSessionUser>>) {
  if (!user?.invitedBy) {
    return "-";
  }

  return `${user.invitedBy.uid ?? "待补齐"} / ${user.invitedBy.walletAddress}`;
}

export default async function DashboardPage() {
  const user = await findSessionUser();

  return (
    <HomeShell>
      <DashboardHeader />

      <section className="mt-5 overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.95)_0%,rgba(5,10,25,0.94)_100%)] px-5 py-8 shadow-[0_32px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        {user ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-cyan-300/24 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                Personal Center
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-5xl">
                  你的 MicroDOG
                  <br />
                  账户身份
                </h1>
                <p className="max-w-3xl text-base leading-8 text-white/66 sm:text-lg">
                  这里聚合你的 UID、钱包身份、注册时间和推荐关系。邀请链接已经可以直接复制，后续可以继续接邀请统计和奖励逻辑。
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/72 uppercase">
                    UID
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">{user.uid ?? "-"}</div>
                </article>

                <article className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/72 uppercase">
                    注册时间
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">
                    {formatShanghaiDateTime(user.createdAt)}
                  </div>
                </article>

                <article className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:col-span-2">
                  <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/72 uppercase">
                    钱包地址
                  </div>
                  <div className="mt-3 break-all text-lg font-semibold text-white">
                    {user.walletAddress}
                  </div>
                </article>

                <article className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:col-span-2">
                  <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/72 uppercase">
                    推荐关系
                  </div>
                  <div className="mt-3 break-all text-lg font-semibold text-white">
                    {formatReferral(user)}
                  </div>
                </article>
              </div>
            </div>

            <DashboardInviteCard inviteCode={user.inviteCode} />
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
            <div className="text-xs font-semibold tracking-[0.24em] text-cyan-200/72 uppercase">
              Member Status
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              当前还没有有效登录会话
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-white/62">
              请先连接钱包。连接成功后会自动发起签名认证；如果你是通过邀请链接进入，这一步也会自动完成推荐关系绑定。
            </p>
          </div>
        )}
      </section>
    </HomeShell>
  );
}
