"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

export type WalletSessionUser = {
  id: string;
  uid: string | null;
  inviteCode: string | null;
  walletAddress: string;
  nickname: string | null;
  role: string;
  createdAt: string;
  invitedByUserId: string | null;
};

export type WalletSessionResponse = {
  authenticated: boolean;
  user: WalletSessionUser | null;
};

export type ReferralState = {
  referralCode: string | null;
  inviter: {
    uid: string | null;
    walletAddress: string;
  } | null;
};

function normalizeWalletError(error: unknown) {
  if (!(error instanceof Error)) {
    return "钱包签名流程失败，请重试。";
  }

  const message = error.message.toLowerCase();

  if (
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("rejected the request")
  ) {
    return "你取消了签名，可再次点击重试。";
  }

  return error.message;
}

async function readJsonResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const text = await response.text();

  if (!text.trim()) {
    throw new Error(`${fallbackMessage}（服务端返回空响应，HTTP ${response.status}）`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${fallbackMessage}（接口没有返回有效 JSON，HTTP ${response.status}）`);
  }
}

type UseWalletAuthOptions = {
  redirectTo?: string;
  initialStatus?: string;
  autoLoginOnConnect?: boolean;
};

export function useWalletAuth(options?: UseWalletAuthOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isNavigating, triggerNavigationTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const autoAttemptedAddressRef = useRef<string | null>(null);
  const [status, setStatus] = useState(
    options?.initialStatus ?? "连接钱包后可发起签名登录。",
  );
  const [session, setSession] = useState<WalletSessionResponse | null>(null);
  const [referralState, setReferralState] = useState<ReferralState>({
    referralCode: null,
    inviter: null,
  });

  const initialStatus = options?.initialStatus ?? "连接钱包后可发起签名登录。";
  const redirectTo = options?.redirectTo;

  const loadSession = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });

        const result = await readJsonResponse<{ data: WalletSessionResponse }>(
          response,
          "读取登录会话失败",
        );

        setSession(result.data);

        if (result.data.authenticated && result.data.user) {
          setStatus(`已登录 ${shortenAddress(result.data.user.walletAddress)}`);
        } else if (!silent) {
          setStatus(initialStatus);
        }

        return result.data;
      } catch (error) {
        setSession({
          authenticated: false,
          user: null,
        });

        if (!silent) {
          setStatus(normalizeWalletError(error));
        }

        return null;
      } finally {
        setHasLoadedSession(true);
      }
    },
    [initialStatus],
  );

  const loadReferralState = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/referral", {
        credentials: "include",
        cache: "no-store",
      });

      const result = await readJsonResponse<{ data: ReferralState }>(
        response,
        "读取邀请关系失败",
      );

      if (response.ok) {
        setReferralState(result.data);
      }
    } catch {
      setReferralState({
        referralCode: null,
        inviter: null,
      });
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSession({ silent: true });
      void loadReferralState();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadReferralState, loadSession]);

  useEffect(() => {
    const referralFromUrl = searchParams.get("ref");

    if (!referralFromUrl || session?.authenticated) {
      return;
    }

    let cancelled = false;

    async function captureReferralFromUrl() {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete("ref");
      const nextSearch = nextSearchParams.toString();
      const nextUrl = (nextSearch ? `${pathname}?${nextSearch}` : pathname) as Route;

      try {
        const response = await fetch("/api/auth/referral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ referralCode: referralFromUrl }),
        });

        const result = await readJsonResponse<{
          data?: ReferralState;
          message: string;
        }>(response, "邀请链接处理失败");

        if (cancelled) {
          return;
        }

        if (!response.ok || !result.data) {
          setStatus(result.message || "邀请链接无效，将按普通注册继续。");
          return;
        }

        setReferralState(result.data);
        setStatus(
          result.data.inviter
            ? `已记录邀请关系：${shortenAddress(result.data.inviter.walletAddress)}`
            : initialStatus,
        );

      } catch (error) {
        if (!cancelled) {
          setStatus(normalizeWalletError(error));
        }
      } finally {
        if (!cancelled) {
          router.replace(nextUrl);
        }
      }
    }

    void captureReferralFromUrl();

    return () => {
      cancelled = true;
    };
  }, [initialStatus, pathname, router, searchParams, session?.authenticated]);

  const triggerAutoLogin = useEffectEvent(() => {
    void handleLogin();
  });

  async function handleLogin() {
    if (!address) {
      setStatus("请先连接钱包。");
      return;
    }

    setIsSubmitting(true);

    try {
      setStatus("正在请求签名消息...");

      const messageResponse = await fetch("/api/auth/wallet/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address }),
      });

      const messageResult = await readJsonResponse<{
        success: boolean;
        message: string;
        data?: { message: string };
      }>(messageResponse, "签名消息生成失败");

      if (!messageResponse.ok || !messageResult.data) {
        setStatus(messageResult.message || "签名消息生成失败。");
        return;
      }

      setStatus("请在钱包中完成签名...");

      const signature = await signMessageAsync({
        message: messageResult.data.message,
      });

      setStatus("正在验证签名并创建会话...");

      const loginResponse = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address,
          message: messageResult.data.message,
          signature,
        }),
      });

      const loginResult = await readJsonResponse<{
        success: boolean;
        message: string;
      }>(loginResponse, "签名登录失败");

      if (!loginResponse.ok) {
        setStatus(loginResult.message || "登录失败。");
        return;
      }

      setStatus("登录成功，正在同步状态...");
      await loadReferralState();
      const currentSession = await loadSession();

      if (!currentSession?.authenticated) {
        setStatus("登录接口已成功，但会话读取失败，请刷新后重试。");
        return;
      }

      if (redirectTo) {
        triggerNavigationTransition(() => {
          router.push(redirectTo as Route);
          router.refresh();
        });
      } else {
        router.refresh();
      }
    } catch (error) {
      setStatus(normalizeWalletError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!options?.autoLoginOnConnect) {
      return;
    }

    if (searchParams.get("ref")) {
      return;
    }

    if (!isConnected || !address) {
      autoAttemptedAddressRef.current = null;
      return;
    }

    if (!hasLoadedSession) {
      return;
    }

    const normalizedAddress = address.toLowerCase();
    const authenticatedAddress = session?.user?.walletAddress?.toLowerCase();
    const isAuthenticatedWithCurrentAddress =
      Boolean(session?.authenticated) && authenticatedAddress === normalizedAddress;

    if (isAuthenticatedWithCurrentAddress || isSubmitting || isNavigating) {
      return;
    }

    if (autoAttemptedAddressRef.current === normalizedAddress) {
      return;
    }

    autoAttemptedAddressRef.current = normalizedAddress;

    const timer = window.setTimeout(() => {
      triggerAutoLogin();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [
    address,
    hasLoadedSession,
    isConnected,
    isNavigating,
    isSubmitting,
    options?.autoLoginOnConnect,
    searchParams,
    session?.authenticated,
    session?.user?.walletAddress,
  ]);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
        credentials: "include",
      });

      await loadSession();
      disconnect();
      setStatus("已退出登录。");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function clearReferral() {
    await fetch("/api/auth/referral", {
      method: "DELETE",
      credentials: "include",
    });

    setReferralState({
      referralCode: null,
      inviter: null,
    });

    if (!session?.authenticated) {
      setStatus(initialStatus);
    }
  }

  return {
    address,
    isConnected,
    session,
    referralState,
    status,
    isPending: isSubmitting || isNavigating || !hasLoadedSession,
    handleLogin,
    handleLogout,
    clearReferral,
    loadSession,
  };
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
