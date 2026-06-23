import type { ReactNode } from "react";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { findAdminSession } from "@/lib/auth";

type SecureAdminLayoutProps = {
  children: ReactNode;
};

export default async function SecureAdminLayout({
  children,
}: SecureAdminLayoutProps) {
  const session = await findAdminSession();

  if (!session) {
    redirect("/admin/login" as Route);
  }

  return children;
}
