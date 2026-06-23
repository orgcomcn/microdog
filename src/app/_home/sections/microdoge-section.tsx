import { microDogeWays } from "../content";

export function MicroDogeSection() {
  return (
    <section
      id="microdoge"
      className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
    >
      <div className="text-xs font-semibold tracking-[0.24em] text-cyan-200/72 uppercase">
        MicroDOGE介绍
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
        平台生态积分体系的重要组成部分
      </h2>
      <p className="mt-3 max-w-4xl text-base leading-8 text-white/62">
        MicroDOGE 是平台生态积分体系的重要组成部分。用户可以通过注册奖励、邀请奖励、活动奖励、社区贡献获得 MicroDOGE 积分。平台积分可用于参与活动、权益兑换及未来生态激励计划。
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {microDogeWays.map((item) => (
          <div
            key={item}
            className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/70 uppercase">
              获取方式
            </div>
            <div className="mt-3 text-lg font-semibold text-white">{item}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
