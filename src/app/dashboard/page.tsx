import { findSessionUser } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default async function DashboardPage() {
  const user = await findSessionUser();

  return (
    <PageShell
      title="用户中心"
      description="聚合用户钱包信息、积分、锁仓、权益与操作记录。当前只保留基础路由。"
      badge="User Center"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <PlaceholderCard
          title="当前登录态"
          description="这里先展示最小会话信息。"
          items={
            user
              ? [
                  `钱包地址：${user.walletAddress}`,
                  `角色：${user.role}`,
                  `用户 ID：${user.id}`,
                ]
              : ["当前没有有效登录会话。", "请先到 /login 完成钱包签名登录。"]
          }
        />
        <PlaceholderCard
          title="聚合内容"
          description="适合在登录体系稳定后统一建设。"
          items={[
            "钱包地址与基础资料",
            "积分余额与记录",
            "锁仓状态",
            "AI 使用记录与权限",
          ]}
        />
      </div>
    </PageShell>
  );
}
