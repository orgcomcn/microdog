"use client";

import { Copy, Link2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { buildInviteLink } from "@/lib/invite";

type DashboardInviteCardProps = {
  inviteCode: string | null;
};

export function DashboardInviteCard({ inviteCode }: DashboardInviteCardProps) {
  const [copyStatus, setCopyStatus] = useState("");
  const inviteLink = buildInviteLink(inviteCode);

  async function copyInviteLink() {
    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyStatus("邀请链接已复制。");
      window.setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("复制失败，请手动复制。");
    }
  }

  return (
    <article className="rounded-[28px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(8,16,37,0.9)_0%,rgba(6,11,27,0.88)_100%)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-cyan-200/72 uppercase">
        <Link2 className="size-4" />
        邀请入口
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
        我的邀请链接
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/62">
        当前 base URL 先固定为 `http://localhost:3000`。后续上线时只需要替换这一处生成逻辑。
      </p>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
        <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/70 uppercase">
          Invite URL
        </div>
        <div className="mt-3 break-all text-sm leading-7 text-white/84">
          {inviteLink || "-"}
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
        <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-cyan-200/70 uppercase">
          邀请码
        </div>
        <div className="mt-3 text-lg font-semibold text-white">{inviteCode ?? "-"}</div>
      </div>

      <Button
        type="button"
        className="mt-5 h-11 rounded-full bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-5 text-white hover:opacity-95"
        onClick={() => void copyInviteLink()}
        disabled={!inviteLink}
      >
        <Copy className="size-4" />
        复制邀请链接
      </Button>

      {copyStatus ? <div className="mt-3 text-sm text-cyan-100/72">{copyStatus}</div> : null}
    </article>
  );
}
