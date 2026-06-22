import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";
import { WalletLoginPanel } from "@/components/wallet/wallet-login-panel";

export default function LoginPage() {
  return (
    <PageShell
      title="钱包签名登录"
      description="当前已打通最小钱包登录闭环：请求消息、钱包签名、服务端验签、用户落库与 cookie session。"
      badge="Auth / Wallet"
    >
      <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
        <WalletLoginPanel />
        <PlaceholderCard
          title="当前闭环"
          description="这版只做 V1 最小实现，便于继续接用户中心和权限体系。"
          items={[
            "服务端生成一次性登录消息",
            "前端调用钱包签名",
            "服务端用 viem 验签",
            "Prisma upsert 用户并创建 session",
          ]}
        />
      </div>
    </PageShell>
  );
}
