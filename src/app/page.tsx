import Image from "next/image";
import { HeaderWalletPanel } from "@/components/wallet/header-wallet-panel";

const navItems = [
  { label: "项目介绍", href: "#project" },
  { label: "公告栏", href: "#announcements" },
  { label: "MicroDOGE介绍", href: "#microdoge" },
  { label: "AI功能介绍", href: "#ai-features" },
  { label: "平台路线图", href: "#roadmap" },
];

const microDogeWays = [
  "注册奖励",
  "邀请奖励",
  "活动奖励",
  "社区贡献",
];

const aiSupport = [
  "BTC 预测",
  "ETH 预测",
];

const aiSignals = [
  "看涨",
  "看跌",
  "震荡",
];

const aiOutputs = [
  "预测方向",
  "发布时间",
  "历史记录",
];

const roadmapV1 = [
  "首页展示",
  "用户系统",
  "钱包登录",
  "行情中心",
  "BTC预测",
  "ETH预测",
  "积分系统",
  "锁仓系统",
  "后台管理系统",
];

const roadmapV2 = [
  "充值系统",
  "提币系统",
  "闪兑系统",
  "链上同步",
  "收益发放",
  "更多生态功能",
];

const announcements = [
  {
    tag: "平台公告",
    title: "首页公告栏已预留后台接入位",
    date: "2026-06-22",
    description: "当前前端已完成公告展示结构，后续可直接从后台管理系统下发公告内容。",
  },
  {
    tag: "功能进度",
    title: "BTC / ETH AI 预测能力将优先进入联调",
    date: "2026-06-22",
    description: "预测模块会先打通结果展示、发布时间和历史记录，再逐步接入更完整的数据能力。",
  },
  {
    tag: "生态计划",
    title: "MicroDOGE 积分体系将与平台权益联动",
    date: "2026-06-22",
    description: "后续积分会串联活动参与、权益兑换和生态激励，形成更完整的用户成长路径。",
  },
];

const projectSignals = [
  {
    label: "实时行情",
    value: "Market Stream",
  },
  {
    label: "AI预测",
    value: "Signal Engine",
  },
  {
    label: "生态积分",
    value: "MicroDOGE Points",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040714] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_22%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.14),transparent_16%),radial-gradient(circle_at_12%_76%,rgba(34,211,238,0.12),transparent_18%),linear-gradient(180deg,#0d1740_0%,#09112c_18%,#050816_52%,#03040b_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(148,163,184,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.45)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      <div className="absolute left-[-8rem] top-20 h-80 w-80 rounded-full bg-cyan-500/12 blur-3xl" />
      <div className="absolute right-[-7rem] top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-sky-400/8 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/10 bg-white/[0.045] px-4 py-4 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5 lg:px-6">
          <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/15 bg-white/6 shadow-[0_0_30px_rgba(107,114,255,0.3)]">
                <Image
                  src="/microdog-logo.png"
                  alt="MicroDOG mascot logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <div className="text-[0.95rem] font-semibold tracking-[0.28em] text-white/95 uppercase">
                  MicroDOG
                </div>
                <div className="text-[0.7rem] text-white/45">AI Digital Asset Platform</div>
              </div>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-white/72 lg:px-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 transition hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="lg:justify-self-end">
              <HeaderWalletPanel />
            </div>
          </div>
        </header>

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

        <section id="announcements" className="mt-5 rounded-[32px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(8,16,37,0.9)_0%,rgba(6,11,27,0.88)_100%)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
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
                key={item.title}
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

        <section id="microdoge" className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
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

        <section id="ai-features" className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
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

        <section id="roadmap" className="mt-5 mb-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
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
      </div>
    </main>
  );
}
