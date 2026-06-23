import Link from "next/link";
import type { Route } from "next";

type AdminHeaderProps = {
  subtitle?: string;
};

export function AdminHeader({
  subtitle = "MicroDOG Admin Console",
}: AdminHeaderProps) {
  return (
    <header className="rounded-[28px] border border-white/10 bg-[#09112c]/78 px-4 py-4 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5 lg:px-7 2xl:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-[0.95rem] font-semibold tracking-[0.28em] text-white/95 uppercase">
            MicroDOG
          </div>
          <div className="text-[0.7rem] text-white/45">{subtitle}</div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-white/72">
          <Link
            href={"/" as Route}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 transition hover:bg-white/[0.08] hover:text-white"
          >
            返回前台
          </Link>
          <Link
            href={"/admin" as Route}
            className="rounded-full border border-cyan-300/16 bg-cyan-300/10 px-4 py-2 text-cyan-100 transition hover:bg-cyan-300/16"
          >
            管理后台
          </Link>
        </div>
      </div>
    </header>
  );
}
