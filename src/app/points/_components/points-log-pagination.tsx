import Link from "next/link";

export function PointsLogPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/58">
      <div>
        第 {page}/{totalPages} 页
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/points?page=${prevPage}`}
          aria-disabled={page <= 1}
          className={`rounded-full px-3 py-1 transition ${
            page <= 1
              ? "pointer-events-none border border-white/10 text-white/25"
              : "border border-white/10 text-white/62 hover:border-cyan-300/30 hover:text-white"
          }`}
        >
          上一页
        </Link>
        <Link
          href={`/points?page=${nextPage}`}
          aria-disabled={page >= totalPages}
          className={`rounded-full px-3 py-1 transition ${
            page >= totalPages
              ? "pointer-events-none border border-white/10 text-white/25"
              : "border border-white/10 text-white/62 hover:border-cyan-300/30 hover:text-white"
          }`}
        >
          下一页
        </Link>
      </div>
    </div>
  );
}
