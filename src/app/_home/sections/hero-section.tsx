import Image from "next/image";

import { projectSignals } from "../content";

export function HeroSection() {
  return (
    <section
      id="project"
      className="mt-5 overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.95)_0%,rgba(5,10,25,0.94)_100%)] px-5 py-8 shadow-[0_32px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10 lg:py-12"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_430px] lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-cyan-300/24 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            AI x Market Intelligence
          </div>

          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              MicroDOGE
              <br />
              AI Platform
            </h1>
            <p className="max-w-3xl text-xl font-semibold tracking-[-0.04em] text-white/92 sm:text-2xl">
              面向数字资产领域的 AI 数据分析平台
            </p>
            <p className="max-w-3xl text-base leading-8 text-white/66 sm:text-lg">
              平台通过实时行情、AI预测、积分激励及社区生态，为用户提供更加直观、高效的数字资产信息服务。我们的目标不是成为交易所，而是成为用户获取市场信息、判断市场趋势和参与生态建设的重要入口。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {projectSignals.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <div className="text-[0.65rem] font-semibold tracking-[0.2em] text-cyan-200/72 uppercase">
                  {item.label}
                </div>
                <div className="mt-3 text-lg font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[430px]">
          <div className="absolute inset-8 rounded-full bg-cyan-400/14 blur-3xl" />
          <div className="relative overflow-hidden rounded-[34px] border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(16,27,62,0.98)_0%,rgba(9,15,34,0.98)_100%)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_32%)]" />
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.18em] text-cyan-100 uppercase">
                System View
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] font-semibold text-white/70 uppercase">
                Data Layer
              </div>
            </div>

            <div className="relative mt-5 overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.22),transparent_30%),linear-gradient(180deg,#84b6ff_0%,#8ea1ff_38%,#c8d4ff_100%)] px-4 pb-5 pt-4">
              <div className="absolute left-6 top-6 h-24 w-24 rounded-full border border-white/12 bg-white/8 blur-[1px]" />
              <div className="absolute bottom-8 right-8 h-16 w-16 rounded-full border border-white/15 bg-white/8" />
              <div className="relative z-10 mx-auto mt-2 aspect-square max-w-[300px] overflow-hidden rounded-full border border-white/18 bg-white/12 shadow-[0_0_70px_rgba(255,255,255,0.22)]">
                <Image
                  src="/microdog-logo.png"
                  alt="MicroDOG mascot holding a bitcoin"
                  fill
                  sizes="(max-width: 1024px) 80vw, 430px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                <div className="text-[0.62rem] font-semibold tracking-[0.18em] text-cyan-200/72 uppercase">
                  Core
                </div>
                <div className="mt-2 text-sm font-medium text-white/82">
                  行情数据、AI预测、积分生态三层联动
                </div>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
                <div className="text-[0.62rem] font-semibold tracking-[0.18em] text-cyan-200/72 uppercase">
                  Focus
                </div>
                <div className="mt-2 text-sm font-medium text-white/82">
                  不做交易撮合，专注信息判断和生态入口
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
