import { SiteHeader } from "@/components/layout/site-header";

import { homeNavItems } from "./content";

export function HomeHeader() {
  return <SiteHeader navItems={homeNavItems} />;
}
