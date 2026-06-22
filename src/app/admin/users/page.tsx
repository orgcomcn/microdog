import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function AdminUsersPage() {
  return (
    <PageShell
      title="后台 / 用户管理"
      description="预留管理员查看用户、钱包地址、角色与状态的页面。"
      badge="Admin / Users"
    >
      <PlaceholderCard
        title="预期能力"
        description="当前无业务实现。"
        items={["用户列表", "钱包地址搜索", "角色管理", "状态封禁"]}
      />
    </PageShell>
  );
}
