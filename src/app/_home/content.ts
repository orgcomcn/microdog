export const homeNavItems = [
  { label: "项目介绍", href: "#project" },
  { label: "公告栏", href: "#announcements" },
  { label: "MicroDOGE介绍", href: "#microdoge" },
  { label: "AI功能介绍", href: "#ai-features" },
  { label: "平台路线图", href: "#roadmap" },
] satisfies ReadonlyArray<{
  label: string;
  href: `#${string}`;
}>;

export const microDogeWays = [
  "注册奖励",
  "邀请奖励",
  "活动奖励",
  "社区贡献",
];

export const aiSupport = [
  "BTC 预测",
  "ETH 预测",
];

export const aiSignals = [
  "看涨",
  "看跌",
  "震荡",
];

export const aiOutputs = [
  "预测方向",
  "发布时间",
  "历史记录",
];

export const roadmapV1 = [
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

export const roadmapV2 = [
  "充值系统",
  "提币系统",
  "闪兑系统",
  "链上同步",
  "收益发放",
  "更多生态功能",
];

export const announcements = [
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

export const projectSignals = [
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
