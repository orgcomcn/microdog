"use client";

import { Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminDateTimeField } from "@/app/admin/_components/admin-date-time-field";
import {
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/app/admin/_components/admin-form";
import { updatePredictionAction } from "@/app/admin/actions";
import { toShanghaiDateTimeLocalValue } from "@/lib/datetime";

type PredictionItem = {
  id: string;
  symbol: "BTC" | "ETH";
  direction: "UP" | "DOWN";
  targetPrice: string;
  status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "EXPIRED";
  publishAt: string;
  effectiveUntil: string;
  summary: string | null;
  updatedAt: string;
};

export function PredictionEditDialog({ prediction }: { prediction: PredictionItem }) {
  return (
    <Dialog>
      <DialogTrigger className="h-10 rounded-xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22">
        编辑
      </DialogTrigger>
      <DialogPopup>
        <DialogClose />
        <DialogTitle>编辑预测</DialogTitle>
        <DialogDescription>
          修改预测内容、发布时间和前台展示状态。
        </DialogDescription>

        <form action={updatePredictionAction} className="mt-6 grid gap-4 lg:grid-cols-2">
          <input type="hidden" name="id" value={prediction.id} />

          <AdminField label="币种">
            <AdminSelect name="symbol" defaultValue={prediction.symbol}>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </AdminSelect>
          </AdminField>

          <AdminField label="方向">
            <AdminSelect name="direction" defaultValue={prediction.direction}>
              <option value="UP">涨</option>
              <option value="DOWN">跌</option>
            </AdminSelect>
          </AdminField>

          <AdminField label="目标价格">
            <AdminInput name="targetPrice" type="text" defaultValue={prediction.targetPrice} required />
          </AdminField>

          <AdminField label="状态">
            <AdminSelect name="status" defaultValue={prediction.status}>
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">已发布</option>
              <option value="UNPUBLISHED">已下架</option>
              <option value="EXPIRED">已过期</option>
            </AdminSelect>
          </AdminField>

          <AdminField label="发布时间">
            <AdminDateTimeField
              name="publishAt"
              defaultValue={toShanghaiDateTimeLocalValue(prediction.publishAt)}
              required
            />
          </AdminField>

          <AdminField label="有效时间">
            <AdminDateTimeField
              name="effectiveUntil"
              defaultValue={toShanghaiDateTimeLocalValue(prediction.effectiveUntil)}
              required
            />
          </AdminField>

          <AdminField label="预测说明" className="lg:col-span-2">
            <AdminTextarea
              name="summary"
              rows={4}
              defaultValue={prediction.summary ?? ""}
            />
          </AdminField>

          <div className="lg:col-span-2 flex justify-end gap-3">
            <DialogClose className="static size-auto h-11 rounded-2xl px-4">取消</DialogClose>
            <button
              type="submit"
              className="h-11 rounded-2xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22"
            >
              保存修改
            </button>
          </div>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
