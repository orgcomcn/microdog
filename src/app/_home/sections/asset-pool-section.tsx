import { AssetPoolPanel } from "@/components/asset-pool/asset-pool-panel";
import { getHomeAssetPool } from "@/modules/admin/settings-service";

export async function AssetPoolSection() {
  const assetPool = await getHomeAssetPool();

  return (
    <div id="asset-pool" className="mt-5">
      <AssetPoolPanel assetPool={assetPool} />
    </div>
  );
}
