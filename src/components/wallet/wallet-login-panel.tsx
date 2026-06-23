"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Copy, Link2, UserRoundPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { buildInviteLink } from "@/lib/invite";
import { useWalletAuth } from "@/components/wallet/use-wallet-auth";

export function WalletLoginPanel() {
  const {
    address,
    isConnected,
    session,
    referralState,
    status,
    isPending,
    handleLogin,
    handleLogout,
    clearReferral,
  } = useWalletAuth({
    redirectTo: "/dashboard",
    initialStatus: "连接钱包后会自动发起签名认证。",
    autoLoginOnConnect: true,
  });
  const [copyStatus, setCopyStatus] = useState("");

  const isAuthenticated = Boolean(session?.authenticated && session.user);
  const inviteLink = buildInviteLink(session?.user?.inviteCode);

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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-950">钱包认证</h2>
      <p className="mb-5 text-sm leading-6 text-slate-600">
        V1 使用钱包签名 + HttpOnly Cookie Session。连接钱包后会自动发起签名；通过邀请链接进入站点时，会在首次签名注册时自动绑定推荐关系。
      </p>

      <div className="mb-6">
        <ConnectButton />
      </div>

      {referralState.referralCode && !isAuthenticated ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <UserRoundPlus className="size-4" />
            已记录邀请关系
          </div>
          {referralState.inviter ? (
            <div className="space-y-1">
              <div>邀请码：{referralState.referralCode}</div>
              <div>邀请人 UID：{referralState.inviter.uid ?? "待补齐"}</div>
              <div>邀请人钱包：{referralState.inviter.walletAddress}</div>
            </div>
          ) : (
            <div>当前邀请码已记录，注册时会再次校验。</div>
          )}
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => void clearReferral()}
            disabled={isPending}
          >
            清除邀请关系
          </Button>
        </div>
      ) : null}

      <div className="mb-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        <div className="mb-2 font-medium text-slate-900">当前状态</div>
        <div className="break-all">{status}</div>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={() => void handleLogin()}
          disabled={!isConnected || !address || isPending || isAuthenticated}
        >
          {isAuthenticated ? "当前已认证" : "手动重试签名"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void handleLogout()}
          disabled={isPending || !session?.authenticated}
        >
          退出登录
        </Button>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
        <div className="mb-2 font-medium text-slate-900">服务端会话</div>
        {session?.authenticated && session.user ? (
          <div className="space-y-1">
            <div>UID：{session.user.uid ?? "待补齐"}</div>
            <div>钱包地址：{session.user.walletAddress}</div>
            <div>角色：{session.user.role}</div>
            <div>注册时间：{formatShanghaiDateTime(session.user.createdAt)}</div>
            <div>邀请码：{session.user.inviteCode ?? "待补齐"}</div>
          </div>
        ) : (
          <div>当前未登录。</div>
        )}
      </div>

      {session?.authenticated && session.user ? (
        <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
          <div className="mb-2 font-medium text-slate-900">邀请链接</div>
          <div className="break-all rounded-2xl bg-slate-50 px-4 py-3">{inviteLink || "生成中..."}</div>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => void copyInviteLink()}
            disabled={!inviteLink}
          >
            <Copy className="size-4" />
            复制邀请链接
          </Button>
          {copyStatus ? <div className="mt-2 text-xs text-slate-500">{copyStatus}</div> : null}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-600">
          <div className="mb-2 flex items-center gap-2 font-medium text-slate-900">
            <Link2 className="size-4" />
            邀请机制
          </div>
          <div>用户通过 `?ref=邀请码` 进入站点并首次完成签名时，会自动绑定邀请关系。</div>
        </div>
      )}
    </section>
  );
}
