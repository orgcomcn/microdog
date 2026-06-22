# MicroDOG V1

一个使用钱包登录的 AI 行情分析与平台权益系统初始化项目。当前阶段只完成 V1 骨架，用于快速启动后续开发。

## 技术栈

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Prisma
- PostgreSQL
- Docker
- RainbowKit + wagmi + viem

## 已完成内容

- 初始化 Next.js 项目
- 配置 TypeScript、Tailwind CSS、shadcn/ui
- 安装 Prisma、PostgreSQL 驱动、RainbowKit、wagmi、viem
- 初始化 Prisma 配置与 PostgreSQL 连接变量
- 预创建前台页面路由与后台页面路由
- 预创建 API Route Handlers
- 预创建业务模块目录与基础占位服务
- 添加 Docker Compose 与 Dockerfile

## 目录结构

```text
.
├── prisma
│   ├── schema.prisma
│   └── migrations/
├── src
│   ├── app
│   │   ├── admin
│   │   ├── ai
│   │   ├── api
│   │   ├── dashboard
│   │   ├── locks
│   │   ├── login
│   │   ├── market
│   │   └── points
│   ├── components
│   │   ├── layout
│   │   ├── providers
│   │   └── ui
│   ├── lib
│   ├── modules
│   │   ├── ai
│   │   ├── auth
│   │   ├── locks
│   │   ├── market
│   │   ├── points
│   │   ├── user
│   │   └── wallet
│   ├── server
│   └── types
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 页面路由

前台：

- `/`
- `/login`
- `/market`
- `/ai/predictions`
- `/ai/chat`
- `/points`
- `/locks`
- `/dashboard`

后台：

- `/admin`
- `/admin/users`
- `/admin/market`
- `/admin/points`
- `/admin/locks`
- `/admin/settings`

## API 路由

- `GET /api/health`
- `POST /api/auth/wallet`
- `GET /api/market/tickers`
- `POST /api/ai/predict`
- `POST /api/ai/chat`
- `GET /api/points`
- `GET /api/locks`
- `GET /api/admin/overview`

当前只提供响应结构，不实现复杂业务逻辑。

## 环境变量

复制 `.env` 并按需调整：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/microdog_v1?schema=public"
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="replace-with-project-id"
NEXT_PUBLIC_APP_NAME="MicroDOG V1"
```

## 本地开发

### 一键启动推荐

如果你已经启动 Docker Desktop，直接执行：

```bash
npm run dev:stack
```

这条命令会一起做：

- 启动 PostgreSQL
- 构建前端开发镜像
- 启动 Next.js 开发服务
- 生成 Prisma Client
- 根据 `schema.prisma` 自动建表

启动后访问：

```text
http://localhost:3000
```

停止整套服务：

```bash
npm run dev:stack:down
```

### 手动启动

1. 安装依赖

```bash
npm install
```

2. 启动 PostgreSQL

```bash
docker compose up -d db
```

3. 生成 Prisma Client

```bash
npx prisma generate
```

4. 执行迁移

```bash
npx prisma migrate dev --name init
```

5. 启动开发环境

```bash
npm run dev
```
