import {
  DEFAULT_ADMIN_PAGE_SIZE,
  normalizePage,
  normalizePageSize,
} from "@/modules/admin/pagination";

export function readAdminListQuery(searchParams?: {
  page?: string;
  pageSize?: string;
}) {
  const page = normalizePage(Number(searchParams?.page ?? 1));
  const pageSize = normalizePageSize(
    Number(searchParams?.pageSize ?? DEFAULT_ADMIN_PAGE_SIZE),
  );

  return { page, pageSize };
}

export function readAdminFilterValue(value?: string) {
  return String(value ?? "").trim();
}
