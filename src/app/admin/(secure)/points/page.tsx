import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminPagination } from "@/app/admin/_components/admin-pagination";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
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
import {
  AdminField,
  AdminFormSection,
  AdminInput,
  AdminSectionTitle,
  AdminSelect,
} from "@/app/admin/_components/admin-form";
import { readAdminFilterValue, readAdminListQuery } from "@/app/admin/_components/admin-query";
import { adjustPointsAction } from "@/app/admin/actions";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getPointLogTypeLabel } from "@/lib/labels";
import { getAdminPointLogs } from "@/modules/admin/points-service";
import { getAdminUsers } from "@/modules/admin/user-service";

export default async function AdminPointsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string; keyword?: string; type?: string }>;
}) {
  const params = await searchParams;
  const query = readAdminListQuery(params);
  const keyword = readAdminFilterValue(params?.keyword);
  const type = readAdminFilterValue(params?.type) || "ALL";
  const [logs, users] = await Promise.all([
    getAdminPointLogs({
      ...query,
      keyword,
      type: type as
        | "ALL"
        | "REGISTER_REWARD"
        | "INVITE_REWARD"
        | "ACTIVITY_REWARD"
        | "MANUAL_GRANT"
        | "MANUAL_DEDUCT"
        | "LOCK_REWARD"
        | "SYSTEM_ADJUST",
    }),
    getAdminUsers({ page: 1, pageSize: 50 }),
  ]);

  return (
    <AdminPageShell
      title="后台 / 积分管理"
      description="支持管理员手动发放、扣减积分，并查看完整积分流水。"
      badge="Admin / Points"
    >
      <AdminTopbar />

      <AdminFormSection>
        <AdminSectionTitle>手动调账</AdminSectionTitle>
        <form action={adjustPointsAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <AdminField label="选择用户">
            <AdminSelect name="userId" required>
              <option value="">选择用户</option>
              {users.items.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.uid ?? "-"} / {user.walletAddress}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField label="积分变动" hint="正数发放，负数扣减。">
            <AdminInput
              name="change"
              type="number"
              placeholder="例如：100 或 -50"
              required
            />
          </AdminField>

          <AdminField label="原因" className="lg:col-span-2">
            <AdminInput
              name="reason"
              type="text"
              placeholder="例如：运营补偿"
              required
            />
          </AdminField>

          <button
            type="submit"
            className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
          >
            提交调账
          </button>
        </form>
      </AdminFormSection>

      <AdminTableCard>
        <AdminTableToolbar>
          <form className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_200px_auto]">
            <AdminField label="搜索流水">
              <AdminInput
                name="keyword"
                defaultValue={keyword}
                placeholder="用户、钱包、操作人、原因"
              />
            </AdminField>
            <AdminField label="类型筛选">
              <AdminSelect name="type" defaultValue={type}>
                <option value="ALL">全部类型</option>
                <option value="MANUAL_GRANT">手动发放</option>
                <option value="MANUAL_DEDUCT">手动扣减</option>
                <option value="REGISTER_REWARD">注册奖励</option>
                <option value="INVITE_REWARD">邀请奖励</option>
                <option value="LOCK_REWARD">锁仓奖励</option>
                <option value="SYSTEM_ADJUST">系统调整</option>
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
                <AdminTh>类型</AdminTh>
                <AdminTh>变动</AdminTh>
                <AdminTh>余额</AdminTh>
                <AdminTh>原因</AdminTh>
                <AdminTh>操作人</AdminTh>
                <AdminTh>时间</AdminTh>
              </tr>
            </thead>
            <tbody>
              {logs.items.map((log) => (
                <AdminTr key={log.id}>
                  <AdminTd>
                    <div className="font-semibold text-white">{log.uid ?? "-"}</div>
                    <div className="mt-1 text-xs text-white/52">{log.walletAddress}</div>
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge tone="info">{getPointLogTypeLabel(log.type)}</AdminStatusBadge>
                  </AdminTd>
                  <AdminTd className={log.change >= 0 ? "text-emerald-200" : "text-rose-200"}>
                    <span className="font-semibold">{log.change >= 0 ? `+${log.change}` : log.change}</span>
                  </AdminTd>
                  <AdminTd>{log.balanceAfter}</AdminTd>
                  <AdminTd>{log.reason}</AdminTd>
                  <AdminTd>{log.operatorLabel ?? "-"}</AdminTd>
                  <AdminTd>{formatShanghaiDateTime(log.createdAt)}</AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
        </AdminTableWrap>
      </AdminTableCard>

      <AdminPagination
        pathname="/admin/points"
        page={logs.page}
        pageSize={logs.pageSize}
        total={logs.total}
        totalPages={logs.totalPages}
        query={{ keyword, type }}
      />
    </AdminPageShell>
  );
}
