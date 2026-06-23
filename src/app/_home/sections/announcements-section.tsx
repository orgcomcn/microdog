import { getPublishedAnnouncementsForFront } from "@/modules/admin/announcement-service";

export async function AnnouncementsSection() {
  const announcements = await getPublishedAnnouncementsForFront();

  return (
    <section
      id="announcements"
      className="mt-5 rounded-[32px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(8,16,37,0.9)_0%,rgba(6,11,27,0.88)_100%)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-cyan-200/72 uppercase">
            公告栏
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
            平台动态与重要通知
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-white/62">
            这里后续会接入后台公告数据。当前先展示前端结构，便于后面直接联动后台发布、排序和展示状态。
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/58">
          Backend Ready Layout
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {announcements.map((item) => (
          <article
            key={item.id}
            className="group rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5 transition hover:border-cyan-300/18 hover:bg-[linear-gradient(180deg,rgba(17,24,39,0.92)_0%,rgba(10,16,31,0.92)_100%)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-cyan-100 uppercase">
                {item.tag}
              </span>
              <span className="text-xs text-white/40">{item.date}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
