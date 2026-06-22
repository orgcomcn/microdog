import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function AdminSettingsPage() {
  return (
    <PageShell
      title="后台 / 系统设置"
      description="用于放置系统级配置、AI 配额、第三方服务参数等。"
      badge="Admin / Settings"
    >
      <PlaceholderCard
        title="预期能力"
        description="当前无业务实现。"
        items={["系统参数", "AI 配置", "钱包配置", "权限配置"]}
      />
    </PageShell>
  );
}
