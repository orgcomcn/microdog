import type { ReactNode } from "react";

type HomeShellProps = {
  children: ReactNode;
};

export function HomeShell({ children }: HomeShellProps) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-10 pt-4 text-white sm:px-6 lg:px-10 2xl:px-12">
        {children}
    </main>
  );
}
