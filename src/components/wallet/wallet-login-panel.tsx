"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { useWalletAuth } from "@/components/wallet/use-wallet-auth";

export function WalletLoginPanel() {
  const { address, isConnected, session, status, isPending, handleLogin, handleLogout } =
    useWalletAuth({
      redirectTo: "/dashboard",
      initialStatus: "连接钱包后会自动完成签名认证。",
      autoLoginOnConnect: true,
    });

  const isAuthenticated = Boolean(session?.authenticated && session.user);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-950">钱包认证</h2>
      <p className="mb-5 text-sm leading-6 text-slate-600">
        V1 使用钱包签名 + HttpOnly Cookie Session。首次连接后会自动发起认证，认证成功后刷新页面不会重复要求你重新签名。
      </p>

      <div className="mb-6">
        <ConnectButton />
      </div>

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
          {isAuthenticated ? "当前已认证" : "重新发起签名"}
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
            <div>钱包地址：{session.user.walletAddress}</div>
            <div>角色：{session.user.role}</div>
          </div>
        ) : (
          <div>当前未登录。</div>
        )}
      </div>
    </section>
  );
}
