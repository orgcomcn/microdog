import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
import {
  createAnnouncementAction,
  deleteAnnouncementAction,
  updateAnnouncementAction,
} from "@/app/admin/actions";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminAnnouncements } from "@/modules/admin/announcement-service";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAdminAnnouncements();

  return (
    <AdminPageShell
      title="后台 / 公告管理"
      description="管理员可以发布、修改、删除首页公告，控制是否上架和排序。"
      badge="Admin / Announcements"
    >
      <AdminTopbar />

      <section className="mt-5 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
          新增公告
        </div>

        <form action={createAnnouncementAction} className="mt-5 grid gap-4">
          <input
            name="title"
            type="text"
            placeholder="公告标题"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
            required
          />
          <input
            name="tag"
            type="text"
            placeholder="标签，例如 平台公告"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
          />
          <textarea
            name="content"
            rows={4}
            placeholder="公告内容"
            className="rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 py-3 text-white outline-none"
            required
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              required
            />
            <select
              name="status"
              defaultValue="PUBLISHED"
              className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
            >
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">已发布</option>
            </select>
          </div>
          <button
            type="submit"
            className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
          >
            创建公告
          </button>
        </form>
      </section>

      <section className="mt-5 space-y-4">
        {announcements.map((item) => (
          <article
            key={item.id}
            className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          >
            <form action={updateAnnouncementAction} className="grid gap-4">
              <input type="hidden" name="id" value={item.id} />
              <input
                name="title"
                type="text"
                defaultValue={item.title}
                className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
                required
              />
              <input
                name="tag"
                type="text"
                defaultValue={item.tag ?? ""}
                className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              />
              <textarea
                name="content"
                rows={4}
                defaultValue={item.content}
                className="rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 py-3 text-white outline-none"
                required
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={item.sortOrder}
                  className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
                  required
                />
                <select
                  name="status"
                  defaultValue={item.status}
                  className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
                >
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">已发布</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/52">
                <div>
                  发布时间：{item.publishedAt ? formatShanghaiDateTime(item.publishedAt) : "-"} / 更新时间：{formatShanghaiDateTime(item.updatedAt)}
                </div>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
                >
                  保存公告
                </button>
              </div>
            </form>

            <form action={deleteAnnouncementAction} className="mt-3">
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="h-10 rounded-xl bg-rose-400/16 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/22"
              >
                删除公告
              </button>
            </form>
          </article>
        ))}
      </section>
    </AdminPageShell>
  );
}
