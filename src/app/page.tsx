import { HomeHeader } from "@/app/_home/home-header";
import { HomeShell } from "@/app/_home/home-shell";
import { AiFeaturesSection } from "@/app/_home/sections/ai-features-section";
import { AnnouncementsSection } from "@/app/_home/sections/announcements-section";
import { AssetPoolSection } from "@/app/_home/sections/asset-pool-section";
import { HeroSection } from "@/app/_home/sections/hero-section";
import { MicroDogeSection } from "@/app/_home/sections/microdoge-section";
import { RoadmapSection } from "@/app/_home/sections/roadmap-section";

export default function HomePage() {
  return (
    <HomeShell>
      <HomeHeader />
      <HeroSection />
      <AssetPoolSection />
      <AnnouncementsSection />
      <MicroDogeSection />
      <AiFeaturesSection />
      <RoadmapSection />
    </HomeShell>
  );
}
