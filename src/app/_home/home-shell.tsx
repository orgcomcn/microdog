import type { ReactNode } from "react";

type HomeShellProps = {
  children: ReactNode;
};

export function HomeShell({ children }: HomeShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040714] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_22%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.14),transparent_16%),radial-gradient(circle_at_12%_76%,rgba(34,211,238,0.12),transparent_18%),linear-gradient(180deg,#0d1740_0%,#09112c_18%,#050816_52%,#03040b_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(148,163,184,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.45)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      <div className="absolute left-[-8rem] top-20 h-80 w-80 rounded-full bg-cyan-500/12 blur-3xl" />
      <div className="absolute right-[-7rem] top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-sky-400/8 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
