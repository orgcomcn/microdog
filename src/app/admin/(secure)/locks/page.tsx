import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminPagination } from "@/app/admin/_components/admin-pagination";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
import {
  AdminCheckbox,
  AdminField,
  AdminInput,
  AdminSectionTitle,
  AdminSelect,
} from "@/app/admin/_components/admin-form";
import { readAdminFilterValue, readAdminListQuery } from "@/app/admin/_components/admin-query";
import {
  AdminStatusBadge,
  AdminTable,
  AdminTableCard,
  AdminTableToolbar,
  AdminTableWrap,
  AdminTd,
  AdminTh,
  AdminTr,
} from "@/app/admin/_components/admin-table";
import { updateLockPlanAction } from "@/app/admin/actions";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminLocks } from "@/modules/admin/lock-service";

export default async function AdminLocksPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string; keyword?: string; status?: string }>;
}) {
  const params = await searchParams;
  const query = readAdminListQuery(params);
  const keyword = readAdminFilterValue(params?.keyword);
  const status = readAdminFilterValue(params?.status) || "ALL";
  const { positions, plans } = await getAdminLocks({
    ...query,
    keyword,
    status: status as "ALL" | "ACTIVE" | "RELEASED",
  });

  return (
    <AdminPageShell
      title="后台 / 锁仓管理"
      description="查看锁仓记录，配置 30 / 90 / 180 天等锁仓方案和释放比例。"
      badge="Admin / Locks"
    >
      <AdminTopbar />

      <section className="mt-5 grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
        <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <AdminSectionTitle>锁仓方案配置</AdminSectionTitle>

          <div className="mt-5 space-y-4">
            {plans.map((plan) => (
              <form key={plan.id} action={updateLockPlanAction} className="space-y-3 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <input type="hidden" name="id" value={plan.id} />
                <AdminField label="方案名称">
                  <AdminInput name="name" type="text" defaultValue={plan.name} required />
                </AdminField>
                <AdminField label="锁仓天数">
                  <AdminInput name="durationDays" type="number" defaultValue={plan.durationDays} required />
                </AdminField>
                <AdminField label="释放比例">
                  <AdminInput name="releaseRatioBps" type="number" defaultValue={plan.releaseRatioBps} required />
                </AdminField>
                <AdminField label="排序">
                  <AdminInput name="sortOrder" type="number" defaultValue={plan.sortOrder} required />
                </AdminField>
                <AdminCheckbox name="isActive" defaultChecked={plan.isActive} label="启用方案" />
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

        <AdminTableCard className="mt-0">
          <AdminTableToolbar>
            <form className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_180px_auto]">
              <AdminField label="搜索锁仓">
                <AdminInput
                  name="keyword"
                  defaultValue={keyword}
                  placeholder="用户、钱包、资产符号"
                />
              </AdminField>
              <AdminField label="状态筛选">
                <AdminSelect name="status" defaultValue={status}>
                  <option value="ALL">全部状态</option>
                  <option value="ACTIVE">锁仓中</option>
                  <option value="RELEASED">已释放</option>
                </AdminSelect>
              </AdminField>
              <button
                type="submit"
                className="h-11 rounded-2xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
              >
                查询
              </button>
            </form>
          </AdminTableToolbar>

          <AdminTableWrap>
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>用户</AdminTh>
                  <AdminTh>状态</AdminTh>
                  <AdminTh>资产</AdminTh>
                  <AdminTh>数量</AdminTh>
                  <AdminTh>期限</AdminTh>
                  <AdminTh>释放比例</AdminTh>
                  <AdminTh>开始时间</AdminTh>
                  <AdminTh>结束时间</AdminTh>
                </tr>
              </thead>
              <tbody>
                {positions.items.length === 0 ? (
                  <tr>
                    <AdminTd colSpan={8} className="text-center text-white/52">
                      当前还没有锁仓记录。
                    </AdminTd>
                  </tr>
                ) : (
                  positions.items.map((position) => (
                    <AdminTr key={position.id}>
                      <AdminTd>
                        <div className="font-semibold text-white">{position.uid ?? "-"}</div>
                        <div className="mt-1 text-xs text-white/52">{position.walletAddress}</div>
                      </AdminTd>
                      <AdminTd>
                        <AdminStatusBadge tone={position.status === "ACTIVE" ? "success" : "default"}>
                          {position.status}
                        </AdminStatusBadge>
                      </AdminTd>
                      <AdminTd>{position.assetSymbol}</AdminTd>
                      <AdminTd>{position.amount}</AdminTd>
                      <AdminTd>{position.durationDays} 天</AdminTd>
                      <AdminTd>{position.releaseRatioBps / 100}%</AdminTd>
                      <AdminTd>{formatShanghaiDateTime(position.startAt)}</AdminTd>
                      <AdminTd>{position.endAt ? formatShanghaiDateTime(position.endAt) : "-"}</AdminTd>
                    </AdminTr>
                  ))
                )}
              </tbody>
            </AdminTable>
          </AdminTableWrap>
        </AdminTableCard>
      </section>

      <AdminPagination
        pathname="/admin/locks"
        page={positions.page}
        pageSize={positions.pageSize}
        total={positions.total}
        totalPages={positions.totalPages}
        query={{ keyword, status }}
      />
    </AdminPageShell>
  );
}
