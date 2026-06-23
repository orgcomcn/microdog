import type { ReactNode } from "react";

import { HomeShell } from "@/app/_home/home-shell";
import { AdminHeader } from "./admin-header";

type AdminPageShellProps = {
  title: string;
  description: string;
  badge?: string;
  children?: ReactNode;
};

export function AdminPageShell({

  children,
}: AdminPageShellProps) {
  return (
    <HomeShell>
      <AdminHeader />
      {children ? <div className="mt-5">{children}</div> : null}
    </HomeShell>
  );
}
