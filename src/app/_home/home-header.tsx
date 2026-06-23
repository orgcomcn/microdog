import Image from "next/image";

import { HeaderWalletPanel } from "@/components/wallet/header-wallet-panel";

import { homeNavItems } from "./content";

export function HomeHeader() {
  return (
    <header className="rounded-[28px] border border-white/10 bg-white/[0.045] px-4 py-4 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5 lg:px-6">
      <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/15 bg-white/6 shadow-[0_0_30px_rgba(107,114,255,0.3)]">
            <Image
              src="/microdog-logo.png"
              alt="MicroDOG mascot logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="text-[0.95rem] font-semibold tracking-[0.28em] text-white/95 uppercase">
              MicroDOG
            </div>
            <div className="text-[0.7rem] text-white/45">AI Digital Asset Platform</div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-white/72 lg:px-4">
          {homeNavItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3 py-1.5 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="lg:justify-self-end">
          <HeaderWalletPanel />
        </div>
      </div>
    </header>
  );
}
