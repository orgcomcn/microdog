import { HomeShell } from "@/app/_home/home-shell";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { SiteHeader } from "@/components/layout/site-header";

type PageShellProps = {
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
};

export function PageShell({ title, description, badge, children }: PageShellProps) {
  return (
    <HomeShell>
      <SiteHeader />
      <AppPageHeader title={title} description={description} badge={badge} />
      {children ? <div className="mt-5">{children}</div> : null}
    </HomeShell>
  );
}
