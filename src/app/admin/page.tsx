import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function AdminPage() {
  return (
    <PageShell
      title="后台管理系统"
      description="后台统一放在 `/admin` 下。当前版本只初始化路由，不包含鉴权与完整管理逻辑。"
      badge="Admin"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <PlaceholderCard
          title="后台模块"
          description="管理端建议先从只读概览开始。"
          items={["用户管理", "行情管理", "积分管理", "锁仓管理"]}
        />
        <PlaceholderCard
          title="开发建议"
          description="不要过早做复杂后台。"
          items={[
            "先补管理员权限验证",
            "再做筛选和列表",
            "最后做运营操作与审计日志",
          ]}
        />
      </div>
    </PageShell>
  );
}
