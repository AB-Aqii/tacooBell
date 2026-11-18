export type PageItem = number | "ellipsis-start" | "ellipsis-end";

export function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const items: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) items.push("ellipsis-start");
  for (let current = start; current <= end; current++) items.push(current);
  if (end < pageCount - 1) items.push("ellipsis-end");
  items.push(pageCount);
  return items;
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const startIndex = (current - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    page: current,
    pageCount,
    total: items.length,
    from: items.length === 0 ? 0 : startIndex + 1,
    to: Math.min(startIndex + pageSize, items.length),
  };
}
