import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderCard } from "@/components/layout/placeholder-card";

export default function ChatPage() {
  return (
    <PageShell
      title="AI 聊天助手"
      description="面向用户的 AI 对话入口。当前阶段仅预留页面和 `/api/ai/chat` 接口。"
      badge="AI / Chat"
    >
      <PlaceholderCard
        title="后续接入"
        description="建议优先做简单单轮对话，再扩展上下文。"
        items={[
          "输入框与消息列表",
          "服务端聊天路由",
          "行情上下文拼装",
          "积分消耗或权限限制",
        ]}
      />
    </PageShell>
  );
}
