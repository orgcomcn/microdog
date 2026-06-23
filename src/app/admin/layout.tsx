import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { findSessionUser } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await findSessionUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return children;
}
