import { formatShanghaiDateTime } from "@/lib/datetime";

type AssetPoolPanelProps = {
  assetPool: {
    btcAmount: string;
    ethAmount: string;
    microdogAmount: string;
    tvl: string;
    updatedAt: string;
  };
};

function formatAmount(value: string) {
  return formatDecimalString(value, 8);
}

function formatTvl(value: string) {
  return `$${formatDecimalString(value, 2)}`;
}

function formatDecimalString(value: string, maxFractionDigits: number) {
  const normalized = value.trim();

  if (!normalized) {
    return "0";
  }

  const negative = normalized.startsWith("-");
  const unsigned = negative ? normalized.slice(1) : normalized;
  const [rawInteger = "0", rawFraction = ""] = unsigned.split(".");
  const integer = rawInteger.replace(/^0+(?=\d)/, "") || "0";
  const groupedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fraction = rawFraction.slice(0, maxFractionDigits).replace(/0+$/, "");

  return `${negative ? "-" : ""}${groupedInteger}${fraction ? `.${fraction}` : ""}`;
}

export function AssetPoolPanel({ assetPool }: AssetPoolPanelProps) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-emerald-300/12 bg-[linear-gradient(180deg,rgba(7,26,26,0.92)_0%,rgba(4,13,19,0.95)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-emerald-200/72 uppercase">
            Platform Asset Pool
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
            平台资产池
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-white/62">
            该模块展示后台手动维护的平台资产池数据，包含 BTC、ETH、MicroDOGE 持仓与 TVL，便于前台统一呈现平台资产概况。
          </p>
        </div>

        <div className="rounded-[22px] border border-emerald-200/12 bg-white/[0.04] px-5 py-4 text-sm text-white/72">
          更新时间：{formatShanghaiDateTime(assetPool.updatedAt)}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-emerald-200/72 uppercase">
            BTC
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
            {formatAmount(assetPool.btcAmount)}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-emerald-200/72 uppercase">
            ETH
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
            {formatAmount(assetPool.ethAmount)}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-emerald-200/72 uppercase">
            MicroDOGE
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
            {formatAmount(assetPool.microdogAmount)}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(52,211,153,0.16)_0%,rgba(255,255,255,0.02)_100%)] p-5">
          <div className="text-[0.68rem] font-semibold tracking-[0.2em] text-emerald-200/72 uppercase">
            TVL
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
            {formatTvl(assetPool.tvl)}
          </div>
        </div>
      </div>
    </section>
  );
}
