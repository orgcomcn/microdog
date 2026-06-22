# MicroDOG 开发说明

这份文档不是产品介绍，而是给你自己开发时用的。

目标只有三个：

1. 让你知道这个项目每一层是干什么的。
2. 让你知道一个功能应该改哪些文件。
3. 让你知道现在项目哪些地方已经打通，哪些还只是骨架。

---

## 1. 先说结论：这个项目现在处于什么阶段

这是一个 **Next.js 16 + Prisma + PostgreSQL + 钱包登录** 的 V1 骨架项目。

它现在的状态可以简单理解成：

- 前端页面路由已经铺好了
- API 路由已经铺好了
- 业务模块目录已经拆好了
- 数据库模型已经有了第一版
- **钱包签名登录 + 用户落库 + cookie session** 这一条链路已经是真实可用的
- 行情、AI、积分、锁仓、后台管理目前大多还是 **mock / 占位**

所以现在不是“从零开始”，但也远远没到“可以直接上线”的程度。

最合适的开发方式不是乱改页面，而是按模块一个个补齐。

---

## 2. 项目整体结构

项目核心目录：

```text
src/
  app/           页面路由 + API 路由
  components/    通用 UI 和页面组件
  lib/           公共工具、鉴权、数据库、环境变量
  modules/       业务模块层
  server/        偏服务端的简单逻辑
  types/         公共类型
prisma/
  schema.prisma  数据模型
public/
  静态资源
```

你可以把它理解成这几层：

1. `app`
   负责接收请求和展示页面。
2. `components`
   负责 UI 复用。
3. `modules`
   负责业务逻辑。
4. `lib`
   负责跨模块公共能力，比如 Prisma、session、API 返回结构。
5. `prisma`
   负责数据库结构定义。

开发时尽量不要把所有逻辑都写进 `page.tsx` 或 `route.ts`，否则后面很快会乱。

---

## 3. `src/app` 是干什么的

`src/app` 下面有两类东西：

- 页面路由：`page.tsx`
- API 路由：`route.ts`

### 3.1 页面路由

主要页面：

- `src/app/page.tsx`
  首页。现在是你刚改过的官网风格 Hero 页面。
- `src/app/login/page.tsx`
  钱包登录页。
- `src/app/market/page.tsx`
  行情页，占位。
- `src/app/ai/predictions/page.tsx`
  AI 预测页，占位。
- `src/app/ai/chat/page.tsx`
  AI 聊天页，占位。
- `src/app/points/page.tsx`
  积分页，占位。
- `src/app/locks/page.tsx`
  锁仓页，占位。
- `src/app/dashboard/page.tsx`
  用户中心页。这里已经会读取服务端 session。
- `src/app/admin/*`
  后台管理相关页面，目前基本都是占位。

### 3.2 API 路由

主要 API：

- `src/app/api/health/route.ts`
  健康检查。
- `src/app/api/auth/wallet/message/route.ts`
  生成钱包签名消息和 nonce。
- `src/app/api/auth/wallet/route.ts`
  验证签名，创建登录 session。
- `src/app/api/auth/session/route.ts`
  获取当前登录态，或者退出登录。
- `src/app/api/market/tickers/route.ts`
  行情接口，目前返回 mock。
- `src/app/api/ai/predict/route.ts`
  AI 预测接口，目前返回 mock。
- `src/app/api/ai/chat/route.ts`
  AI 聊天接口，目前返回 mock。
- `src/app/api/points/route.ts`
  积分接口，目前返回 mock。
- `src/app/api/locks/route.ts`
  锁仓接口，目前返回 mock。
- `src/app/api/admin/overview/route.ts`
  后台概览接口，目前基本是静态数据。

### 3.3 你开发时怎么理解 `app`

`app` 层尽量只做两件事：

- 页面：拿数据然后渲染 UI
- API：接收参数，调用 `modules`，返回结果

不要把复杂业务长期堆在 `page.tsx` 或 `route.ts` 里。

---

## 4. `src/components` 是干什么的

### 4.1 布局组件

- `src/components/layout/page-shell.tsx`
  业务页统一壳子，包含标题、描述、导航入口。
- `src/components/layout/placeholder-card.tsx`
  当前占位页大量在用的卡片组件。

### 4.2 Provider

- `src/components/providers/app-providers.tsx`
  全局 provider。这里挂了：
  - `WagmiProvider`
  - `QueryClientProvider`
  - `RainbowKitProvider`

这说明前端的钱包能力和 React Query 基础已经接进来了。

### 4.3 钱包相关组件

- `src/components/wallet/wallet-login-panel.tsx`
  当前最重要的前端业务组件之一。

它已经实现了：

- 连接钱包
- 请求签名消息
- 调用钱包签名
- 提交服务端验签
- 获取当前 session
- 退出登录

如果你后面要优化登录体验，首先看这个文件。

### 4.4 UI 组件

- `src/components/ui/button.tsx`
  封装后的通用按钮。

---

## 5. `src/lib` 是干什么的

`lib` 是公共底层，不是业务层。

### 5.1 `src/lib/prisma.ts`

作用：

- 初始化 Prisma Client
- 连接 PostgreSQL
- 在开发环境复用单例，避免热更新时重复创建连接

你只要碰数据库查询，基本都会用到这里导出的 `prisma`。

### 5.2 `src/lib/auth.ts`

这是项目里目前最核心的底层之一。

它负责：

- 生成登录 nonce
- 生成 session token
- 设置 / 清理 nonce cookie
- 设置 / 清理 session cookie
- 构造钱包签名消息
- 根据 cookie 找当前登录用户
- 持久化 session 到数据库

简单说：

**钱包登录的服务端基础能力都在这里。**

### 5.3 `src/lib/api.ts`

统一 API 返回格式：

- `ok(data, message)`
- `fail(message, status)`

以后新写 API，最好继续沿用它，不要每个接口自己随便返回结构。

### 5.4 `src/lib/env.ts`

读取环境变量。

现在比较简单，后面可以升级成更严格的校验方式，比如 Zod 校验。

### 5.5 `src/lib/utils.ts`

通常放通用工具函数，目前主要给 UI 用。

---

## 6. `src/modules` 是干什么的

这个目录是“业务层”。

正确理解是：

- `app/api/.../route.ts` 不应该直接写满业务细节
- 页面也不应该直接堆业务逻辑
- 业务逻辑应该尽量收敛到 `modules`

当前模块：

### 6.1 `src/modules/auth/service.ts`

作用：

- 钱包登录后，按地址 `upsert` 用户
- 创建 session

这是登录闭环中的业务层。

### 6.2 `src/modules/wallet/service.ts`

作用：

- 使用 `viem` 校验钱包签名是否正确

### 6.3 `src/modules/market/service.ts`

作用：

- 现在只是返回 mock ticker 数据

后面真接行情源时，应该先改这里，不是先改 API 层。

### 6.4 `src/modules/ai/service.ts`

作用：

- 现在返回 mock 预测结果
- 现在返回 mock 聊天回复

后面接模型时，这里应该变成：

- prompt 拼装
- 模型调用
- 响应结构整理
- 配额/积分/日志处理

### 6.5 `src/modules/points/service.ts`

作用：

- 现在返回 mock 积分概览

后面会承接：

- 余额查询
- 流水查询
- 加减积分
- 积分规则

### 6.6 `src/modules/locks/service.ts`

作用：

- 现在返回 mock 锁仓数据

后面会承接：

- 锁仓创建
- 锁仓列表
- 状态变更

### 6.7 `src/modules/user/service.ts`

作用：

- 当前还是 mock 用户资料

后面适合承接：

- 用户资料聚合
- Dashboard 所需数据拼装

---

## 7. `prisma/schema.prisma` 是干什么的

这是数据库结构定义。

当前模型：

- `User`
  用户表，以钱包地址为核心身份。
- `AuthSession`
  登录会话表。
- `PointLog`
  积分流水表。
- `LockPosition`
  锁仓记录表。

这说明作者最开始的业务思路很明确：

- 用户身份 = 钱包地址
- 平台核心围绕：
  - 登录
  - 积分
  - 锁仓
  - AI/行情能力

### 当前数据库层的真实完成度

已经真实接上的：

- 用户
- 登录会话

还只是模型有了，但业务没真正实现的：

- 积分账本
- 锁仓流转

---

## 8. 现在唯一已经打通的完整链路

### 钱包登录链路

这条链是目前项目最值得你理解透的部分。

流程如下：

1. 前端组件 `wallet-login-panel.tsx` 请求：
   `POST /api/auth/wallet/message`
2. 服务端生成 nonce 和签名消息
3. 前端调用钱包签名
4. 前端把 `address + message + signature` 提交到：
   `POST /api/auth/wallet`
5. 服务端校验：
   - nonce 是否有效
   - message 是否匹配当前 nonce
   - 签名是否正确
6. 服务端创建或复用用户
7. 服务端创建数据库 session
8. 服务端写入 HttpOnly cookie
9. 前端跳转到 dashboard
10. dashboard 通过 `findSessionUser()` 读取当前登录用户

如果你要继续开发，这条链你最好先彻底理解，因为后面很多模块都要依赖“当前用户是谁”。

---

## 9. 当前哪些地方是占位，哪些地方不要误判

### 真实逻辑

- 钱包签名验证
- 用户 `upsert`
- session 落库
- cookie session
- dashboard 读取当前会话

### 占位逻辑

- 市场行情
- AI 预测
- AI 聊天
- 积分
- 锁仓
- 后台统计
- 后台权限

所以如果你打开很多页面感觉“都有了”，那只是路由有了，不代表业务有了。

---

## 10. 以后开发一个功能，应该从哪下手

推荐你按下面这条路径开发：

1. 先定数据库要不要变
2. 再改 `modules`
3. 再改 `api/route.ts`
4. 最后改页面和组件

不要倒过来。

### 一个实际例子：做“真实积分列表”

应该这样改：

1. 看 `schema.prisma` 的 `PointLog` 是否够用
2. 在 `src/modules/points/service.ts` 写真实查询逻辑
3. 在 `src/app/api/points/route.ts` 调用 points service
4. 在 `src/app/points/page.tsx` 或前端组件里展示真实数据

### 一个实际例子：做“AI 聊天”

应该这样改：

1. 明确 AI 调用是否需要记录日志、扣积分
2. 在 `src/modules/ai/service.ts` 接模型
3. 在 `src/app/api/ai/chat/route.ts` 做参数校验和调用
4. 在 `src/app/ai/chat/page.tsx` 做输入框、消息流、错误态

---

## 11. 最推荐的开发顺序

如果你现在自己都不知道从哪下手，我建议按这个顺序来，不要跳着做。

### 第一阶段：先把“身份”做好

目标：

- 确保钱包登录稳定
- dashboard 能拿到当前用户
- 增加基础的登录保护

建议做的事：

- 给需要登录的页面加访问保护
- 给后台页面加 admin 校验
- 增加 session 过期清理策略

### 第二阶段：先做一个最小可用业务模块

建议优先做 **积分系统**，因为它最简单。

原因：

- 已经有 `User.pointsBalance`
- 已经有 `PointLog`
- 不依赖外部行情源
- 不依赖模型 API

建议做的最小功能：

- 查积分余额
- 查积分流水
- 增加一条 mock 的“签到得分”或“登录得分”

### 第三阶段：做用户中心聚合

目标：

- dashboard 展示真实用户数据
- 先把“已登录用户能看到什么”做好

建议展示：

- 钱包地址
- 角色
- 积分余额
- 最近积分流水
- 锁仓数量

### 第四阶段：再做行情

原因：

- 行情要依赖外部数据源
- 会涉及缓存、刷新、错误处理

建议最小功能：

- 一个真实 ticker 列表
- 一个 symbol 详情接口

### 第五阶段：最后接 AI

原因：

- AI 是最不稳定、最容易发散的部分
- 最好建立在已有用户体系、积分体系、行情体系之上

---

## 12. 你现在最应该先改哪些文件

如果你准备开始继续开发，我建议先重点熟悉下面这些文件：

- `src/components/wallet/wallet-login-panel.tsx`
  前端登录交互入口
- `src/app/api/auth/wallet/message/route.ts`
  生成签名消息
- `src/app/api/auth/wallet/route.ts`
  验签和创建 session
- `src/lib/auth.ts`
  cookie/session 核心逻辑
- `src/modules/auth/service.ts`
  用户落库和 session 创建
- `prisma/schema.prisma`
  当前数据库结构
- `src/app/dashboard/page.tsx`
  当前用户中心入口

这几处理解了，项目就不再是黑盒。

---

## 13. 你开发时可以遵守的简单规则

为了避免后面越改越乱，建议你自己遵守这几条：

1. 页面只负责展示，不要堆太多业务。
2. API 只做入参处理和调度，不要堆核心逻辑。
3. 业务逻辑优先放 `modules`。
4. 数据库访问尽量集中，不要到处直接写 `prisma.xxx`。
5. 公共鉴权逻辑统一走 `lib/auth.ts`。
6. 新 API 保持统一返回格式。
7. 先补真实数据，再补复杂 UI，不要反过来。

---

## 14. 一句话告诉你现在怎么开发

如果你现在问“下一步我到底该干啥”，我建议是：

**先把积分模块做成第一个真实业务模块。**

原因很简单：

- 它比 AI 简单
- 它比行情稳定
- 它比锁仓更容易闭环
- 它能顺便帮你把 dashboard 做真

---

## 15. 我建议你接下来立刻做的任务

按优先级：

1. 给 dashboard 接真实积分余额
2. 给 `/api/points` 接真实数据库查询
3. 给 points 页面展示真实流水
4. 增加一个写积分流水的最小动作
5. 再考虑锁仓或行情

如果你愿意，我下一步可以直接继续帮你做：

- 方案 A：把“积分模块”从 mock 改成真实可用
- 方案 B：把“dashboard”改成真实用户中心
- 方案 C：把“后台 admin 权限”先补上

