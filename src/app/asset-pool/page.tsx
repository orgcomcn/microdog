import { AssetPoolPanel } from "@/components/asset-pool/asset-pool-panel";
import { PageShell } from "@/components/layout/page-shell";
import { getHomeAssetPool } from "@/modules/admin/settings-service";

export default async function AssetPoolPage() {
  const assetPool = await getHomeAssetPool();

  return (
    <PageShell
      title="平台资产池"
      description="展示后台手动维护的平台资产池数据，包含 BTC、ETH、MicroDOGE 持仓规模、TVL 与最近更新时间。"
      badge="Platform / Asset Pool"
    >
      <AssetPoolPanel assetPool={assetPool} />
    </PageShell>
  );
}
