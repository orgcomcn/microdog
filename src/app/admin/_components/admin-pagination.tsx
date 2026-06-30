import Link from "next/link";
import type { Route } from "next";

type AdminPaginationProps = {
  pathname: Route;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  query?: Record<string, string | number | undefined>;
};

function buildHref(
  pathname: Route,
  page: number,
  pageSize: number,
  query?: Record<string, string | number | undefined>,
) {
  const searchParams = new URLSearchParams();

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === "") {
        continue;
      }

      searchParams.set(key, String(value));
    }
  }

  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));

  return `${pathname}?${searchParams.toString()}` as Route;
}

export function AdminPagination({
  pathname,
  page,
  pageSize,
  total,
  totalPages,
  query,
}: AdminPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="mt-5 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/68 lg:flex-row lg:items-center lg:justify-between">
      <div>
        共 {total} 条，当前显示 {start}-{end} 条，第 {page}/{totalPages} 页
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {[10, 20, 50].map((size) => (
            <Link
              key={size}
              href={buildHref(pathname, 1, size, query)}
              className={`rounded-full px-3 py-1 transition ${
                size === pageSize
                  ? "bg-cyan-300/18 text-cyan-100"
                  : "border border-white/10 text-white/58 hover:border-cyan-300/35 hover:text-white"
              }`}
            >
              {size}/页
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={buildHref(pathname, Math.max(1, page - 1), pageSize, query)}
            aria-disabled={page <= 1}
            className={`rounded-xl px-4 py-2 transition ${
              page <= 1
                ? "pointer-events-none border border-white/10 text-white/28"
                : "bg-white/[0.05] text-white/78 hover:bg-white/[0.08]"
            }`}
          >
            上一页
          </Link>
          <Link
            href={buildHref(pathname, Math.min(totalPages, page + 1), pageSize, query)}
            aria-disabled={page >= totalPages}
            className={`rounded-xl px-4 py-2 transition ${
              page >= totalPages
                ? "pointer-events-none border border-white/10 text-white/28"
                : "bg-cyan-400/16 text-cyan-100 hover:bg-cyan-400/22"
            }`}
          >
            下一页
          </Link>
        </div>
      </div>
    </div>
  );
}
