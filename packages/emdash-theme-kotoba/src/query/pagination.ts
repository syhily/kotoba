export type PageSliceResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function readPage(url: URL, fallback = 1): number {
  const raw = url.searchParams.get("page");
  const page = raw ? Number.parseInt(raw, 10) : fallback;
  return Number.isFinite(page) && page > 0 ? page : fallback;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PageSliceResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}
