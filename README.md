# MicroDOG V1

一个使用钱包登录的 AI 行情分析与平台权益系统初始化项目。当前仓库重点是跑通前台页面、钱包登录骨架、基础 API 和 Prisma 数据层，便于继续迭代市场、积分、锁仓和后台模块。

## 技术栈

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL
- RainbowKit + wagmi + viem
- Docker / Docker Compose

## 环境变量

先复制模板：

```bash
cp .env.example .env
```

需要的变量如下：

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DATABASE_URL` | 是 | PostgreSQL 连接串，Next.js API 和 Prisma 都依赖它。 |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | 建议 | WalletConnect 项目 ID；不填会退回 demo 值，只适合本地调试。 |
| `NEXT_PUBLIC_APP_NAME` | 否 | 钱包连接弹窗里显示的应用名。 |
| `ADMIN_USERNAME` | 建议 | 后台管理员账号，默认值是 `admin`。 |
| `ADMIN_PASSWORD` | 建议 | 后台管理员密码，默认值是 `admin123`。 |
| `COINGECKO_API_KEY` | 建议 | CoinGecko Demo / Pro API Key。行情页默认走服务端请求，建议至少配置 Demo key。 |
| `COINGECKO_API_BASE_URL` | 否 | CoinGecko API 基础地址，默认 `https://api.coingecko.com/api/v3`。只有切 Pro 地址时才需要改。 |
| `MARKET_MICRODOGE_COINGECKO_ID` | 二选一 | 如果 MicroDOGE 已被 CoinGecko 收录，填它的 `coin id`。 |
| `MARKET_MICRODOGE_PLATFORM_ID` | 二选一 | 如果没有 `coin id`，填链平台 id，例如 `ethereum`、`bsc`、`base`。 |
| `MARKET_MICRODOGE_CONTRACT_ADDRESS` | 二选一 | 和 `MARKET_MICRODOGE_PLATFORM_ID` 配套使用，填 MicroDOGE 合约地址。 |

示例内容已经放在 [`.env.example`](./.env.example)。当前工作区里的 `.env` 也已经补好，默认连接本机 `5432` 的 `microdog_v1` 数据库。

注意：

- `DATABASE_URL` 缺失时，服务端 Prisma 初始化会直接失败，相关初始化逻辑在 `src/lib/prisma.ts`。
- 生产环境里 `NEXT_PUBLIC_*` 属于前端构建时变量。改完后必须重新执行 `next build` 或重新构建 Docker 镜像，单独重启进程不会让前端拿到新值。
- `COINGECKO_API_KEY` 不属于前端变量，应该只放服务端环境里。当前行情接口实现位于 `src/app/api/market/tickers/route.ts`，由服务端代请求 CoinGecko。
- `MARKET_MICRODOGE_COINGECKO_ID` 和 `MARKET_MICRODOGE_PLATFORM_ID + MARKET_MICRODOGE_CONTRACT_ADDRESS` 二选一即可；推荐优先填 CoinGecko `coin id`。

## 本地启动

### 方式一：Docker Compose 一键启动

这是当前仓库最省事的本地开发方式。

1. 启动 Docker Desktop 或本机 Docker 服务。
2. 确认 `.env` 已存在，按需修改连接串和 WalletConnect 配置。
3. 在项目根目录执行：

```bash
npm run dev:stack
```

这条命令会完成这些事情：

- 启动 PostgreSQL 容器
- 构建开发镜像
- 执行 `prisma generate`
- 执行 `prisma db push`
- 启动 Next.js 开发服务

启动后访问：

```text
http://localhost:3000
```

可用这个接口检查服务是否正常：

```bash
curl http://localhost:3000/api/health
```

停止整套服务：

```bash
npm run dev:stack:down
```

### 方式二：本机手动启动

适合你想把前端跑在本机、数据库单独控制的情况。

1. 安装依赖：

```bash
npm install
```

2. 启动 PostgreSQL。

如果本机没有现成数据库，直接起仓库自带的容器：

```bash
docker compose up -d db
```

3. 生成 Prisma Client：

```bash
npx prisma generate
```

4. 首次初始化数据库表：

```bash
npx prisma migrate dev --name init
```

如果你只是想快速把当前 schema 推到本地库，也可以用：

```bash
npx prisma db push
```

如果你已经启动过旧版本数据库，这次后台功能新增了管理员会话、公告、预测、系统配置等表，建议直接再执行一次：

```bash
npx prisma db push
```

5. 启动 Next.js 开发环境：

```bash
npm run dev
```

6. 打开：

```text
http://localhost:3000
```

### 后台登录入口

后台地址：

```text
http://localhost:3000/admin/login
```

默认管理员账号密码：

```text
admin
admin123
```

说明：

- 后台登录和前台钱包登录是两套独立会话。
- `/admin` 不在前台导航里直接暴露，需要手动访问后台地址。
- 当前后台已支持：
  - 用户管理：查看、冻结、解冻、角色调整
  - 预测管理：BTC / ETH 手动发布、修改、上下架、删除
  - 公告管理：发布、修改、删除、排序
  - 积分管理：手动加减分、查看流水
  - 锁仓管理：查看记录、配置锁仓周期与释放比例
  - 系统配置：注册送分、邀请奖励、AI 每日提问次数
- 钱包用户被冻结后，将不能继续使用原有钱包会话登录。

## 服务器部署

### 推荐方式：Docker 镜像部署

适合 Linux 服务器、云主机或宝塔/Nginx 反代场景。当前仓库已经有生产 [`Dockerfile`](./Dockerfile)。

#### 1. 准备服务器环境

- 安装 Docker
- 准备一个 PostgreSQL 实例
- 确保服务器能访问 PostgreSQL
- 如果要对外提供 HTTPS，准备 Nginx 或 Caddy 反代到应用的 `3000` 端口

#### 2. 准备生产环境变量

在服务器项目目录里复制模板：

```bash
cp .env.example .env.production
```

至少改这几个值：

```env
DATABASE_URL="postgresql://user:password@db-host:5432/microdog_v1?schema=public"
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-project-id"
NEXT_PUBLIC_APP_NAME="MicroDOG V1"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
COINGECKO_API_KEY="your-coingecko-demo-or-pro-key"
COINGECKO_API_BASE_URL="https://api.coingecko.com/api/v3"
MARKET_MICRODOGE_COINGECKO_ID=""
MARKET_MICRODOGE_PLATFORM_ID=""
MARKET_MICRODOGE_CONTRACT_ADDRESS=""
```

注意：

- 如果数据库不在应用容器内部，`DATABASE_URL` 里的主机名必须写真实可达地址，不能机械地保留 `localhost`。
- `NEXT_PUBLIC_*` 会写进前端 bundle，所以它们不仅要在运行时可用，也要在构建镜像时传进去。

#### 3. 导出环境变量并构建镜像

在 `bash` / `zsh` 里执行：

```bash
set -a
source .env.production
set +a
docker build \
  -t microdog-v1 \
  --build-arg DATABASE_URL \
  --build-arg NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID \
  --build-arg NEXT_PUBLIC_APP_NAME \
  .
```

说明：

- `COINGECKO_API_KEY`、`MARKET_MICRODOGE_*` 这些运行时环境变量不需要作为 `build-arg` 传入，因为它们只在服务端 API 路由里使用。
- 如果你未来切到 CoinGecko Pro，可以把 `COINGECKO_API_BASE_URL` 改成对应的 Pro 域名。

#### 4. 初始化数据库

当前仓库还没有提交正式的 `prisma/migrations` 目录，因此首发部署建议先用 `db push` 初始化表结构：

```bash
docker run --rm --env-file .env.production microdog-v1 npx prisma db push
```

如果服务器之前已经跑过旧版结构，这一步同样要重新执行一次，把新增的后台表同步进去。

后续如果你开始维护 `prisma/migrations`，把这一步切换成：

```bash
docker run --rm --env-file .env.production microdog-v1 npx prisma migrate deploy
```

#### 5. 启动应用容器

```bash
docker run -d \
  --name microdog-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.production \
  microdog-v1
```

#### 6. 验证服务

```bash
curl http://127.0.0.1:3000/api/health
```

如果你前面接了 Nginx / Caddy，再把域名反代到 `127.0.0.1:3000` 即可。

#### 7. 发布更新

代码更新后的最小发布流程：

```bash
git pull
set -a
source .env.production
set +a
docker build \
  -t microdog-v1 \
  --build-arg DATABASE_URL \
  --build-arg NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID \
  --build-arg NEXT_PUBLIC_APP_NAME \
  .
docker run --rm --env-file .env.production microdog-v1 npx prisma db push
docker rm -f microdog-app
docker run -d \
  --name microdog-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.production \
  microdog-v1
```

如果将来接入正式 migration，把更新流程里的 `db push` 换成 `migrate deploy`。

### 备选方式：Node 原生部署

如果你不想用 Docker，也可以直接在服务器装 Node.js 22 和 PostgreSQL。

```bash
cp .env.example .env.production
npm ci
set -a
source .env.production
set +a
npx prisma generate
npx prisma db push
npm run build
PORT=3000 npm run start
```

这种方式建议再配 `pm2` 或 `systemd` 守护进程，并用 Nginx/Caddy 做反向代理。

## 常用命令

```bash
# 本地一键开发
npm run dev:stack

# 关闭本地整套容器
npm run dev:stack:down

# 本机启动前端
npm run dev

# 生成 Prisma Client
npx prisma generate

# 推送 schema 到数据库
npx prisma db push
```
