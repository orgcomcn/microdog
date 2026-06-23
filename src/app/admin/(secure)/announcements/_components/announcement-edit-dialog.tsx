"use client";

import { Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/app/admin/_components/admin-form";
import { updateAnnouncementAction } from "@/app/admin/actions";

type AnnouncementItem = {
  id: string;
  title: string;
  tag: string | null;
  content: string;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
};

export function AnnouncementEditDialog({ item }: { item: AnnouncementItem }) {
  return (
    <Dialog>
      <DialogTrigger className="h-10 rounded-xl bg-cyan-400/16 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/22">
        编辑
      </DialogTrigger>
      <DialogPopup>
        <DialogClose />
        <DialogTitle>编辑公告</DialogTitle>
        <DialogDescription>
          修改公告标题、标签、内容、排序和发布状态。
        </DialogDescription>

        <form action={updateAnnouncementAction} className="mt-6 grid gap-4">
          <input type="hidden" name="id" value={item.id} />

          <AdminField label="公告标题">
            <AdminInput name="title" type="text" defaultValue={item.title} required />
          </AdminField>

          <AdminField label="标签">
            <AdminInput name="tag" type="text" defaultValue={item.tag ?? ""} />
          </AdminField>

          <AdminField label="公告内容">
            <AdminTextarea name="content" rows={5} defaultValue={item.content} required />
          </AdminField>

          <div className="grid gap-4 lg:grid-cols-2">
            <AdminField label="排序">
              <AdminInput name="sortOrder" type="number" defaultValue={item.sortOrder} required />
            </AdminField>
            <AdminField label="状态">
              <AdminSelect name="status" defaultValue={item.status}>
                <option value="DRAFT">草稿</option>
                <option value="PUBLISHED">已发布</option>
              </AdminSelect>
            </AdminField>
          </div>

          <div className="flex justify-end gap-3">
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
