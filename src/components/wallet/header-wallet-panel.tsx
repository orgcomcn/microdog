"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircle2, ChevronDown, LoaderCircle, LogOut, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletAuth } from "@/components/wallet/use-wallet-auth";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function HeaderWalletPanel() {
  const { address, session, status, isPending, handleLogin, handleLogout } = useWalletAuth({
    autoLoginOnConnect: true,
    initialStatus: "连接钱包后自动完成签名认证",
  });

  const isAuthenticated = Boolean(session?.authenticated && session.user);

  return (
    <ConnectButton.Custom>
      {({ mounted, account, chain, openAccountModal, openChainModal, openConnectModal }) => {
        const ready = mounted;
        const isWalletConnected = Boolean(account && chain);
        const walletLabel = session?.user?.walletAddress ?? address ?? account?.address ?? null;
        const isUnsupported = Boolean(chain?.unsupported);

        if (!ready) {
          return (
            <div
              aria-hidden="true"
              className="flex h-12 w-full max-w-[360px] rounded-full border border-white/10 bg-[#101632]/72 opacity-0"
            />
          );
        }

        if (isAuthenticated && session?.user) {
          return (
            <div className="flex w-full max-w-[430px] flex-col items-end gap-1.5">
              <div className="flex w-full items-center justify-between gap-2 rounded-full border border-emerald-300/14 bg-[#0c1530]/92 px-2 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_24px_rgba(47,211,160,0.08)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={openAccountModal}
                  className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-2 py-1.5 text-left transition hover:bg-white/[0.04]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/[0.12] text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.18)]">
                    <ShieldCheck className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.16em] text-emerald-200/72 uppercase">
                      <span>已认证</span>
                      <span className="h-1 w-1 rounded-full bg-emerald-300/80" />
                      <span>Wallet</span>
                    </div>
                    <div className="mt-0.5 truncate text-sm font-semibold text-white">
                      {shortenAddress(session.user.walletAddress)}
                    </div>
                  </div>

                  <ChevronDown className="size-4 shrink-0 text-white/36 transition group-hover:text-white/64" />
                </button>

                {chain ? (
                  <button
                    type="button"
                    onClick={openChainModal}
                    className="hidden shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-2 text-[0.78rem] text-white/72 transition hover:bg-white/[0.08] md:flex"
                  >
                    <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.65)]" />
                    <span>{chain.name ?? "Ethereum"}</span>
                  </button>
                ) : null}

                <Button
                  type="button"
                  variant="outline"
                  className="h-9 shrink-0 rounded-full border-white/8 bg-white/[0.04] px-3 text-white/84 hover:bg-white/[0.08]"
                  onClick={() => void handleLogout()}
                  disabled={isPending}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">退出</span>
                </Button>
              </div>

              <div className="flex items-center gap-1.5 pr-2 text-[0.72rem] text-emerald-100/62">
                <CheckCircle2 className="size-3.5" />
                <span className="truncate">{status}</span>
              </div>
            </div>
          );
        }

        if (isWalletConnected) {
          return (
            <div className="flex w-full max-w-[420px] flex-col items-end gap-1.5">
              <div className="flex w-full items-center justify-between gap-2 rounded-full border border-amber-300/14 bg-[#0c1530]/92 px-2 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_24px_rgba(251,191,36,0.08)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={openAccountModal}
                  className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-2 py-1.5 text-left transition hover:bg-white/[0.04]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/82">
                    <Wallet className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[0.6rem] font-semibold tracking-[0.16em] text-white/48 uppercase">
                      已连接钱包
                    </div>
                    <div className="mt-0.5 truncate text-sm font-semibold text-white">
                      {walletLabel ? shortenAddress(walletLabel) : account?.displayName}
                    </div>
                  </div>

                  <ChevronDown className="size-4 shrink-0 text-white/36 transition group-hover:text-white/64" />
                </button>

                {chain ? (
                  <button
                    type="button"
                    onClick={openChainModal}
                    className={`hidden shrink-0 items-center gap-2 rounded-full border px-2.5 py-2 text-[0.78rem] transition md:flex ${
                      isUnsupported
                        ? "border-rose-300/14 bg-rose-400/[0.08] text-rose-100/80 hover:bg-rose-400/[0.12]"
                        : "border-white/8 bg-white/[0.04] text-white/72 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isUnsupported
                          ? "bg-rose-300 shadow-[0_0_12px_rgba(253,164,175,0.65)]"
                          : "bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.65)]"
                      }`}
                    />
                    <span>{chain.name ?? "网络状态"}</span>
                  </button>
                ) : null}

                <Button
                  type="button"
                  className="h-9 shrink-0 rounded-full bg-[linear-gradient(90deg,#ffb857_0%,#ff7b72_100%)] px-3.5 text-white hover:opacity-95"
                  onClick={() => void handleLogin()}
                  disabled={isPending || isUnsupported}
                >
                  {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                  <span>{isPending ? "处理中" : isUnsupported ? "切换网络" : "签名"}</span>
                </Button>
              </div>

              <div className="pr-2 text-right text-[0.72rem] text-amber-100/62">
                {isUnsupported ? "当前网络不支持，请切换后继续认证。" : status}
              </div>
            </div>
          );
        }

        return (
          <div className="flex w-full max-w-[220px] flex-col items-end gap-1.5">
            <div className="flex w-full items-center justify-end rounded-full border border-white/10 bg-[#0c1530]/88 px-2 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_22px_rgba(40,255,170,0.05)] backdrop-blur-xl">
              <Button
                type="button"
                className="h-9 w-full rounded-full bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-white shadow-[0_10px_24px_rgba(74,217,255,0.12)] hover:opacity-95"
                onClick={openConnectModal}
              >
                <Wallet className="size-4" />
                连接钱包
              </Button>
            </div>

            <div className="pr-2 text-right text-[0.72rem] leading-5 text-white/42">
              {status}
            </div>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
