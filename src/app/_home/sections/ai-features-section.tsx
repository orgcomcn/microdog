import { aiOutputs, aiSignals, aiSupport } from "../content";

export function AiFeaturesSection() {
  return (
    <section
      id="ai-features"
      className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
    >
      <div className="text-xs font-semibold tracking-[0.24em] text-cyan-200/72 uppercase">
        AI功能介绍
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
        数字资产市场预测服务
      </h2>
      <p className="mt-3 max-w-4xl text-base leading-8 text-white/62">
        MicroDOGE AI 提供数字资产市场预测服务。当前支持 BTC 预测和 ETH 预测，预测结果包括看涨、看跌、震荡。每次预测均展示预测方向、发布时间、历史记录，帮助用户快速了解市场趋势变化。
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/70 uppercase">
            当前支持
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {aiSupport.map((item) => (
              <span
                key={item}
                className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-50"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/70 uppercase">
            预测结果
          </div>
          <div className="mt-4 space-y-3">
            {aiSignals.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/84"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/70 uppercase">
            每次展示
          </div>
          <div className="mt-4 space-y-3">
            {aiOutputs.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/84"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
