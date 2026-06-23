import { PageShell } from "@/components/layout/page-shell";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getPublishedPredictionsForFront } from "@/modules/admin/prediction-service";

export default async function PredictionsPage() {
  const predictions = await getPublishedPredictionsForFront();

  return (
    <PageShell
      title="AI 预测"
      description="当前页面展示后台手动发布的 BTC / ETH 预测，包括涨跌方向、目标价格、发布时间和有效期。"
      badge="AI / Predictions"
    >
      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.88)_0%,rgba(5,10,25,0.84)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        {predictions.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-sm text-white/58">
            当前还没有已发布的 AI 预测。
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {predictions.map((item) => (
              <article
                key={item.id}
                className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-semibold text-white">{item.symbol}</div>
                  <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-cyan-100 uppercase">
                    {item.direction === "UP" ? "涨" : "跌"}
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-white/64">
                  <div>目标价格：{item.targetPrice}</div>
                  <div>发布时间：{formatShanghaiDateTime(item.publishAt)}</div>
                  <div>有效时间：{formatShanghaiDateTime(item.effectiveUntil)}</div>
                </div>

                <p className="mt-4 text-sm leading-7 text-white/74">
                  {item.summary || "暂无详细说明。"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
