import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "MicroDOG V1",
  description: "Wallet-based AI market analysis and platform benefits system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="antialiased">
      <body className="min-h-screen bg-[#040714] text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
