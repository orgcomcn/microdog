import { AdminPageShell } from "@/app/admin/_components/admin-page-shell";
import { AdminDateTimeField } from "@/app/admin/_components/admin-date-time-field";
import { AdminPagination } from "@/app/admin/_components/admin-pagination";
import { AdminTopbar } from "@/app/admin/_components/admin-topbar";
import {
  AdminStatusBadge,
  AdminTable,
  AdminTableCard,
  AdminTableToolbar,
  AdminTableWrap,
  AdminTd,
  AdminTh,
  AdminTr,
} from "@/app/admin/_components/admin-table";
import {
  AdminField,
  AdminFormSection,
  AdminInput,
  AdminSectionTitle,
  AdminSelect,
  AdminTextarea,
} from "@/app/admin/_components/admin-form";
import { readAdminListQuery } from "@/app/admin/_components/admin-query";
import {
  createPredictionAction,
  deletePredictionAction,
} from "@/app/admin/actions";
import { formatShanghaiDateTime } from "@/lib/datetime";
import { getAdminPredictions } from "@/modules/admin/prediction-service";
import { PredictionEditDialog } from "./_components/prediction-edit-dialog";

export default async function AdminPredictionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>;
}) {
  const query = readAdminListQuery(await searchParams);
  const predictions = await getAdminPredictions(query);

  return (
    <AdminPageShell
      title="后台 / 预测管理"
    >
      <AdminTopbar />

      <AdminFormSection>
        <AdminSectionTitle>新增预测</AdminSectionTitle>
        <form action={createPredictionAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <AdminField label="币种">
            <AdminSelect name="symbol" defaultValue="BTC">
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="方向">
            <AdminSelect name="direction" defaultValue="UP">
              <option value="UP">涨</option>
              <option value="DOWN">跌</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="目标价格">
            <AdminInput name="targetPrice" type="text" placeholder="例如 115000" required />
          </AdminField>
          <AdminField label="状态">
            <AdminSelect name="status" defaultValue="PUBLISHED">
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">已发布</option>
              <option value="UNPUBLISHED">已下架</option>
              <option value="EXPIRED">已过期</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="发布时间">
            <AdminDateTimeField name="publishAt" required />
          </AdminField>
          <AdminField label="有效时间">
            <AdminDateTimeField name="effectiveUntil" required />
          </AdminField>
          <AdminField label="预测说明" className="lg:col-span-2">
            <AdminTextarea name="summary" rows={4} placeholder="补充预测背景、策略依据或风险说明" />
          </AdminField>
          <button
            type="submit"
            className="h-11 rounded-2xl bg-[linear-gradient(90deg,#6f61ff_0%,#4ad9ff_100%)] px-4 text-sm font-medium text-white transition hover:opacity-95"
          >
            发布预测
          </button>
        </form>
      </AdminFormSection>

      <AdminTableCard>
        <AdminTableToolbar>
          <div>
            <div className="text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
              预测列表
            </div>
            <div className="mt-2 text-sm text-white/52">
              列表只展示摘要信息，编辑通过弹窗完成，避免占用整页空间。前台仅显示状态为 `PUBLISHED` 且当前时间落在发布时间区间内的数据。
            </div>
          </div>
        </AdminTableToolbar>

        <AdminTableWrap>
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>币种</AdminTh>
                <AdminTh>方向</AdminTh>
                <AdminTh>目标价</AdminTh>
                <AdminTh>状态</AdminTh>
                <AdminTh>前台可见</AdminTh>
                <AdminTh className="min-w-[180px]">发布时间</AdminTh>
                <AdminTh className="min-w-[180px]">有效时间</AdminTh>
                <AdminTh>说明</AdminTh>
                <AdminTh className="min-w-[180px]">操作</AdminTh>
              </tr>
            </thead>
            <tbody>
              {predictions.items.map((prediction) => (
                <AdminTr key={prediction.id}>
                  <AdminTd className="font-semibold text-white">{prediction.symbol}</AdminTd>
                  <AdminTd>
                    <AdminStatusBadge tone={prediction.direction === "UP" ? "success" : "danger"}>
                      {prediction.direction === "UP" ? "涨" : "跌"}
                    </AdminStatusBadge>
                  </AdminTd>
                  <AdminTd>{prediction.targetPrice}</AdminTd>
                  <AdminTd>
                    <AdminStatusBadge tone="info">{prediction.status}</AdminStatusBadge>
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge tone={prediction.isVisibleOnFront ? "success" : "default"}>
                      {prediction.isVisibleOnFront ? "展示中" : "未展示"}
                    </AdminStatusBadge>
                    {!prediction.isVisibleOnFront ? (
                      <div className="mt-2 text-xs leading-5 text-white/45">
                        {prediction.frontVisibilityReason}
                      </div>
                    ) : null}
                  </AdminTd>
                  <AdminTd>{formatShanghaiDateTime(prediction.publishAt)}</AdminTd>
                  <AdminTd>{formatShanghaiDateTime(prediction.effectiveUntil)}</AdminTd>
                  <AdminTd className="max-w-[280px] text-sm leading-6 text-white/68">
                    {prediction.summary || "暂无说明"}
                  </AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-2">
                      <PredictionEditDialog prediction={prediction} />
                      <form action={deletePredictionAction}>
                        <input type="hidden" name="id" value={prediction.id} />
                        <button
                          type="submit"
                          className="h-10 rounded-xl bg-rose-400/16 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/22"
                        >
                          删除
                        </button>
                      </form>
                    </div>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
        </AdminTableWrap>
      </AdminTableCard>

      <AdminPagination
        pathname="/admin/predictions"
        page={predictions.page}
        pageSize={predictions.pageSize}
        total={predictions.total}
        totalPages={predictions.totalPages}
      />
    </AdminPageShell>
  );
}
