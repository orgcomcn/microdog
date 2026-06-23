export type AdminPaginationResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export const ADMIN_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const DEFAULT_ADMIN_PAGE_SIZE = 10;

export function normalizePage(value?: number) {
  if (!value || Number.isNaN(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

export function normalizePageSize(value?: number) {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_ADMIN_PAGE_SIZE;
  }

  if (ADMIN_PAGE_SIZE_OPTIONS.includes(value as (typeof ADMIN_PAGE_SIZE_OPTIONS)[number])) {
    return value;
  }

  return DEFAULT_ADMIN_PAGE_SIZE;
}

export function buildPagination(page?: number, pageSize?: number) {
  const normalizedPage = normalizePage(page);
  const normalizedPageSize = normalizePageSize(pageSize);

  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
    skip: (normalizedPage - 1) * normalizedPageSize,
    take: normalizedPageSize,
  };
}

export function toPaginationResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): AdminPaginationResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    total,
    page: Math.min(page, totalPages),
    pageSize,
    totalPages,
  };
}
