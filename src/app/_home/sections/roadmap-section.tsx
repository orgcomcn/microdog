import { roadmapV1, roadmapV2 } from "../content";

export function RoadmapSection() {
  return (
    <section
      id="roadmap"
      className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
    >
      <div className="text-xs font-semibold tracking-[0.24em] text-cyan-200/72 uppercase">
        平台路线图
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
        从 MVP 到生态闭环
      </h2>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <article className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-xs font-semibold tracking-[0.18em] text-cyan-200/72 uppercase">
            V1（MVP）
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {roadmapV1.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/84"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-white/62">
            目标：验证产品、验证用户、验证市场。
          </p>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-xs font-semibold tracking-[0.18em] text-cyan-200/72 uppercase">
            V2
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {roadmapV2.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/84"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-white/62">
            目标：完善平台生态闭环。
          </p>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-xs font-semibold tracking-[0.18em] text-cyan-200/72 uppercase">
            长期规划
          </div>
          <p className="mt-4 text-sm leading-8 text-white/62">
            持续优化 AI 预测能力，扩展更多数字资产数据服务，并逐步建设完整的 MicroDOGE 生态体系。
          </p>
        </article>
      </div>
    </section>
  );
}
