"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

export type WalletSessionUser = {
  id: string;
  walletAddress: string;
  nickname: string | null;
  role: string;
};

export type WalletSessionResponse = {
  authenticated: boolean;
  user: WalletSessionUser | null;
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
          setStatus(options?.initialStatus ?? "连接钱包后可发起签名登录。");
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
    [options?.initialStatus],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSession({ silent: true });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadSession]);

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
      const currentSession = await loadSession();

      if (!currentSession?.authenticated) {
        setStatus("登录接口已成功，但会话读取失败，请刷新后重试。");
        return;
      }

      if (options?.redirectTo) {
        triggerNavigationTransition(() => {
          router.push(options.redirectTo);
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

  const triggerAutoLogin = useEffectEvent(() => {
    void handleLogin();
  });

  useEffect(() => {
    if (!options?.autoLoginOnConnect) {
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
    session?.authenticated,
    session?.user?.walletAddress,
  ]);

  return {
    address,
    isConnected,
    session,
    status,
    isPending: isSubmitting || isNavigating,
    handleLogin,
    handleLogout,
    loadSession,
  };
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
