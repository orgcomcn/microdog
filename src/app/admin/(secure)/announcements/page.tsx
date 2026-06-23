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
  AdminTextarea,
} from "@/app/admin/_components/admin-form";
import { readAdminListQuery } from "@/app/admin/_components/admin-query";
import {
  createAnnouncementAction,
  deleteAnnouncementAction,
} from "@/app/admin/actions";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminAnnouncements } from "@/modules/admin/announcement-service";
import { AnnouncementEditDialog } from "./_components/announcement-edit-dialog";

export default async function AdminAnnouncementsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>;
}) {
  const query = readAdminListQuery(await searchParams);
  const announcements = await getAdminAnnouncements(query);

  return (
    <AdminPageShell
      title="后台 / 公告管理"
      description="管理员可以发布、修改、删除首页公告，控制是否上架和排序。"
      badge="Admin / Announcements"
    >
      <AdminTopbar />

      <AdminFormSection>
        <AdminSectionTitle>新增公告</AdminSectionTitle>
        <form action={createAnnouncementAction} className="mt-5 grid gap-4">
          <AdminField label="公告标题">
            <AdminInput name="title" type="text" placeholder="例如：系统升级通知" required />
          </AdminField>
          <AdminField label="标签" hint="前台展示用，留空也可以。">
            <AdminInput name="tag" type="text" placeholder="例如：平台公告" />
          </AdminField>
          <AdminField label="公告内容">
            <AdminTextarea name="content" rows={4} placeholder="填写完整公告内容" required />
          </AdminField>
          <div className="grid gap-4 lg:grid-cols-2">
            <AdminField label="排序">
              <AdminInput name="sortOrder" type="number" defaultValue={0} required />
            </AdminField>
            <AdminField label="状态">
              <AdminSelect name="status" defaultValue="PUBLISHED">
                <option value="DRAFT">草稿</option>
                <option value="PUBLISHED">已发布</option>
              </AdminSelect>
            </AdminField>
          </div>
          <button
            type="submit"
            className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
          >
            创建公告
          </button>
        </form>
      </AdminFormSection>

      <AdminTableCard>
        <AdminTableToolbar>
          <div>
            <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
              公告列表
            </div>
            <div className="mt-2 text-sm text-white/52">
              列表只展示摘要信息，编辑通过弹窗完成，避免公告内容长文本直接占满整页。
            </div>
          </div>
        </AdminTableToolbar>

        <AdminTableWrap>
          <AdminTable>
            <thead>
              <tr>
                <AdminTh className="min-w-[220px]">标题</AdminTh>
                <AdminTh>标签</AdminTh>
                <AdminTh>状态</AdminTh>
                <AdminTh>排序</AdminTh>
                <AdminTh className="min-w-[320px]">内容摘要</AdminTh>
                <AdminTh className="min-w-[180px]">发布时间</AdminTh>
                <AdminTh className="min-w-[180px]">更新时间</AdminTh>
                <AdminTh className="min-w-[180px]">操作</AdminTh>
              </tr>
            </thead>
            <tbody>
              {announcements.items.map((item) => (
                <AdminTr key={item.id}>
                  <AdminTd className="font-semibold text-white">{item.title}</AdminTd>
                  <AdminTd>{item.tag ?? "-"}</AdminTd>
                  <AdminTd>
                    <AdminStatusBadge tone={item.status === "PUBLISHED" ? "success" : "default"}>
                      {item.status}
                    </AdminStatusBadge>
                  </AdminTd>
                  <AdminTd>{item.sortOrder}</AdminTd>
                  <AdminTd className="max-w-[320px] text-sm leading-6 text-white/68">
                    {item.content}
                  </AdminTd>
                  <AdminTd>
                    {item.publishedAt ? formatShanghaiDateTime(item.publishedAt) : "-"}
                  </AdminTd>
                  <AdminTd>{formatShanghaiDateTime(item.updatedAt)}</AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-2">
                      <AnnouncementEditDialog item={item} />
                      <form action={deleteAnnouncementAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="h-10 rounded-xl bg-rose-400/16 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/22"
                        >
                          删除
                        </button>
                      </form>
                    </div>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
        </AdminTableWrap>
      </AdminTableCard>

      <AdminPagination
        pathname="/admin/announcements"
        page={announcements.page}
        pageSize={announcements.pageSize}
        total={announcements.total}
        totalPages={announcements.totalPages}
      />
    </AdminPageShell>
  );
}
