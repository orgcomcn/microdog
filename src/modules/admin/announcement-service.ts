import { AnnouncementStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { buildPagination, toPaginationResult } from "@/modules/admin/pagination";

export async function getAdminAnnouncements(input?: {
  page?: number;
  pageSize?: number;
}) {
  const { page, pageSize, skip, take } = buildPagination(input?.page, input?.pageSize);
  const [rows, total] = await Promise.all([
    prisma.announcement.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take,
    }),
    prisma.announcement.count(),
  ]);

  const items = rows.map((row) => ({
    ...row,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  return toPaginationResult(items, total, page, pageSize);
}

export async function createAdminAnnouncement(input: {
  title: string;
  tag?: string;
  content: string;
  status: AnnouncementStatus;
  sortOrder?: number;
  operator: string;
}) {
  const publishedAt = input.status === AnnouncementStatus.PUBLISHED ? new Date() : null;

  return prisma.announcement.create({
    data: {
      title: input.title.trim(),
      tag: input.tag?.trim() || null,
      content: input.content.trim(),
      status: input.status,
      sortOrder: input.sortOrder ?? 0,
      publishedAt,
      createdBy: input.operator,
      updatedBy: input.operator,
    },
  });
}

export async function updateAdminAnnouncement(input: {
  id: string;
  title: string;
  tag?: string;
  content: string;
  status: AnnouncementStatus;
  sortOrder?: number;
  operator: string;
}) {
  const publishedAt = input.status === AnnouncementStatus.PUBLISHED ? new Date() : null;

  return prisma.announcement.update({
    where: {
      id: input.id,
    },
    data: {
      title: input.title.trim(),
      tag: input.tag?.trim() || null,
      content: input.content.trim(),
      status: input.status,
      sortOrder: input.sortOrder ?? 0,
      publishedAt,
      updatedBy: input.operator,
    },
  });
}

export async function deleteAdminAnnouncement(id: string) {
  await prisma.announcement.delete({
    where: {
      id,
    },
  });
}

export async function getPublishedAnnouncementsForFront() {
  const rows = await prisma.announcement.findMany({
    where: {
      status: AnnouncementStatus.PUBLISHED,
    },
    orderBy: [
      { sortOrder: "asc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: 10,
  });

  return rows.map((row) => ({
    id: row.id,
    tag: row.tag || "平台公告",
    title: row.title,
    date: (row.publishedAt ?? row.createdAt).toISOString().slice(0, 10),
    description: row.content,
  }));
}
