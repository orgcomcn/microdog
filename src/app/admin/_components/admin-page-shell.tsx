import type { ReactNode } from "react";

import { HomeShell } from "@/app/_home/home-shell";
import { AppPageHeader } from "@/components/layout/app-page-header";

import { AdminHeader } from "./admin-header";

type AdminPageShellProps = {
  title: string;
  description: string;
  badge?: string;
  children?: ReactNode;
};

export function AdminPageShell({
  title,
  description,
  badge,
  children,
}: AdminPageShellProps) {
  return (
    <HomeShell>
      <AdminHeader />
      <AppPageHeader title={title} description={description} badge={badge} />
      {children ? <div className="mt-5">{children}</div> : null}
    </HomeShell>
  );
}
