import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
import {
  createPredictionAction,
  deletePredictionAction,
  updatePredictionAction,
} from "@/app/admin/actions";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminPredictions } from "@/modules/admin/prediction-service";

export default async function AdminPredictionsPage() {
  const predictions = await getAdminPredictions();

  return (
    <AdminPageShell
      title="后台 / 预测管理"
      description="管理员手动发布 BTC / ETH 预测，控制方向、目标价格、发布时间、有效时间和上下架状态。"
      badge="Admin / Predictions"
    >
      <AdminTopbar />

      <section className="mt-5 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
          新增预测
        </div>

        <form action={createPredictionAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <select
            name="symbol"
            defaultValue="BTC"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>

          <select
            name="direction"
            defaultValue="UP"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
          >
            <option value="UP">涨</option>
            <option value="DOWN">跌</option>
          </select>

          <input
            name="targetPrice"
            type="text"
            placeholder="目标价格，例如 115000"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
            required
          />

          <select
            name="status"
            defaultValue="PUBLISHED"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
          >
            <option value="DRAFT">草稿</option>
            <option value="PUBLISHED">已发布</option>
            <option value="UNPUBLISHED">已下架</option>
            <option value="EXPIRED">已过期</option>
          </select>

          <input
            name="publishAt"
            type="datetime-local"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
            required
          />

          <input
            name="effectiveUntil"
            type="datetime-local"
            className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
            required
          />

          <textarea
            name="summary"
            rows={4}
            placeholder="预测说明"
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 py-3 text-white outline-none"
          />

          <button
            type="submit"
            className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
          >
            发布预测
          </button>
        </form>
      </section>

      <section className="mt-5 space-y-4">
        {predictions.map((prediction) => (
          <article
            key={prediction.id}
            className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          >
            <form action={updatePredictionAction} className="grid gap-4 lg:grid-cols-2">
              <input type="hidden" name="id" value={prediction.id} />

              <select
                name="symbol"
                defaultValue={prediction.symbol}
                className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>

              <select
                name="direction"
                defaultValue={prediction.direction}
                className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              >
                <option value="UP">涨</option>
                <option value="DOWN">跌</option>
              </select>

              <input
                name="targetPrice"
                type="text"
                defaultValue={prediction.targetPrice}
                className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
                required
              />

              <select
                name="status"
                defaultValue={prediction.status}
                className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
              >
                <option value="DRAFT">草稿</option>
                <option value="PUBLISHED">已发布</option>
                <option value="UNPUBLISHED">已下架</option>
                <option value="EXPIRED">已过期</option>
              </select>

              <input
                name="publishAt"
                type="datetime-local"
                defaultValue={prediction.publishAt.slice(0, 16)}
                className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
                required
              />

              <input
                name="effectiveUntil"
                type="datetime-local"
                defaultValue={prediction.effectiveUntil.slice(0, 16)}
                className="h-11 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 text-white outline-none"
                required
              />

              <textarea
                name="summary"
                rows={3}
                defaultValue={prediction.summary ?? ""}
                className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0d1532]/88 px-4 py-3 text-white outline-none"
              />

              <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-3 text-sm text-white/52">
                <div>
                  发布时间：{formatShanghaiDateTime(prediction.publishAt)} / 更新时间：{formatShanghaiDateTime(prediction.updatedAt)}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="h-10 rounded-xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
                  >
                    保存
                  </button>
                </div>
              </div>
            </form>

            <form action={deletePredictionAction} className="mt-3">
              <input type="hidden" name="id" value={prediction.id} />
              <button
                type="submit"
                className="h-10 rounded-xl bg-rose-400/16 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/22"
              >
                删除预测
              </button>
            </form>
          </article>
        ))}
      </section>
    </AdminPageShell>
  );
}
