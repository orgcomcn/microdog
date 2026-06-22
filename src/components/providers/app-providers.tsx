"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { useState } from "react";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";

const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || "MicroDOG V1",
  projectId,
  chains: [mainnet, sepolia],
  ssr: true,
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
