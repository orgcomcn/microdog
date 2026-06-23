import { formatShanghaiDateTime } from "@/lib/datetime";
import { getUserStatusLabel } from "@/lib/labels";
import { getAdminUsers } from "@/modules/admin/user-service";

import { AdminPagination } from "../../_components/admin-pagination";
import { AdminPageShell } from "../../_components/admin-page-shell";
import {
  AdminStatusBadge,
  AdminTable,
  AdminTableCard,
  AdminTableToolbar,
  AdminTableWrap,
  AdminTd,
  AdminTh,
  AdminTr,
} from "../../_components/admin-table";
import {
  AdminField,
  AdminInput,
  AdminSelect,
} from "../../_components/admin-form";
import { readAdminFilterValue, readAdminListQuery } from "../../_components/admin-query";
import {
  freezeUserAction,
  unfreezeUserAction,
} from "../../actions";
import { AdminTopbar } from "../../_components/admin-topbar";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string; keyword?: string; status?: string }>;
}) {
  const params = await searchParams;
  const query = readAdminListQuery(params);
  const keyword = readAdminFilterValue(params?.keyword);
  const status = readAdminFilterValue(params?.status) || "ALL";
  const filteredUsers = await getAdminUsers({
    ...query,
    keyword,
    status: status as "ALL" | "ACTIVE" | "FROZEN",
  });

  return (
    <AdminPageShell
      title="后台 / 用户管理"
      description="针对已经连接并登录过钱包的用户进行查看、筛选、冻结和解冻。"
      badge="Admin / Users"
    >
      <AdminTopbar />

      <AdminTableCard>
        <AdminTableToolbar>
          <form className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_200px_120px] lg:items-end">
            <AdminField label="搜索用户">
              <AdminInput
                name="keyword"
                defaultValue={keyword}
                placeholder="UID、钱包地址、邀请码"
              />
            </AdminField>
            <AdminField label="状态筛选">
              <AdminSelect name="status" defaultValue={status}>
                <option value="ALL">全部状态</option>
                <option value="ACTIVE">正常</option>
                <option value="FROZEN">冻结</option>
              </AdminSelect>
            </AdminField>
            <button
              type="submit"
              className="h-11 w-full rounded-2xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
            >
              查询
            </button>
          </form>
        </AdminTableToolbar>

        <AdminTableWrap>
          <AdminTable>
            <thead>
              <tr>
                <AdminTh className="min-w-[260px]">用户</AdminTh>
                <AdminTh>状态</AdminTh>
                <AdminTh>积分</AdminTh>
                <AdminTh className="min-w-[260px]">推荐关系</AdminTh>
                <AdminTh className="min-w-[200px]">时间</AdminTh>
                <AdminTh className="min-w-[250px]">操作</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.items.map((user) => (
                <AdminTr key={user.id}>
                  <AdminTd>
                    <div className="font-semibold text-white">{user.uid ?? "-"}</div>
                    <div className="mt-1 break-all text-xs leading-5 text-white/52">
                      {user.walletAddress}
                    </div>
                    <div className="mt-1 text-xs text-white/40">邀请码：{user.inviteCode ?? "-"}</div>
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge tone={user.status === "ACTIVE" ? "success" : "danger"}>
                      {getUserStatusLabel(user.status)}
                    </AdminStatusBadge>
                    {user.frozenReason ? (
                      <div className="mt-2 text-xs text-rose-100/78">{user.frozenReason}</div>
                    ) : null}
                  </AdminTd>
                  <AdminTd>
                    <div className="font-semibold text-white">{user.pointsBalance}</div>
                    <div className="mt-1 text-xs text-white/45">
                      流水 {user.pointLogCount} / 锁仓 {user.lockCount}
                    </div>
                  </AdminTd>
                  <AdminTd>
                    <div>下级人数：{user.referralCount}</div>
                    <div className="mt-1 text-xs leading-5 text-white/45">
                      推荐人：
                      {user.invitedBy ? (
                        <>
                          {user.invitedBy.uid ?? "-"}
                          <div className="break-all">{user.invitedBy.walletAddress}</div>
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </AdminTd>
                  <AdminTd className="text-sm leading-6 text-white/68">
                    <div>注册：{formatShanghaiDateTime(user.createdAt)}</div>
                    <div className="mt-1 text-xs text-white/45">
                      最近登录：{user.lastLoginAt ? formatShanghaiDateTime(user.lastLoginAt) : "-"}
                    </div>
                  </AdminTd>
                  <AdminTd>
                    {user.status === "FROZEN" ? (
                      <form action={unfreezeUserAction} className="flex justify-start">
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          className="h-10 min-w-[92px] rounded-xl bg-emerald-400/16 px-4 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/22"
                        >
                          解冻用户
                        </button>
                      </form>
                    ) : (
                      <form action={freezeUserAction} className="grid gap-2">
                        <input type="hidden" name="userId" value={user.id} />
                        <AdminInput
                          name="reason"
                          type="text"
                          placeholder="冻结原因，例如：异常登录"
                          className="h-10"
                        />
                        <button
                          type="submit"
                          className="h-10 w-full rounded-xl bg-rose-400/16 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/22"
                        >
                          冻结用户
                        </button>
                      </form>
                    )}
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
        </AdminTableWrap>
      </AdminTableCard>

      <AdminPagination
        pathname="/admin/users"
        page={filteredUsers.page}
        pageSize={filteredUsers.pageSize}
        total={filteredUsers.total}
        totalPages={filteredUsers.totalPages}
        query={{ keyword, status }}
      />
    </AdminPageShell>
  );
}
