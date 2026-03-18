import type { PageSize } from "../domain/transaction";

interface TransactionsPaginationProps {
  page: number;
  totalPages: number;
  pageSize: PageSize;
  total: number;
  currentPageStart: number;
  currentPageEnd: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(page: number, totalPages: number) {
  const firstPage = Math.max(1, page - 1);
  const lastPage = Math.min(totalPages, page + 2);
  const pages: number[] = [];

  for (let currentPage = firstPage; currentPage <= lastPage; currentPage += 1) {
    pages.push(currentPage);
  }

  if (!pages.includes(1)) {
    pages.unshift(1);
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

export function TransactionsPagination({
  page,
  totalPages,
  pageSize,
  total,
  currentPageStart,
  currentPageEnd,
  onPageChange,
}: TransactionsPaginationProps) {
  const pages = getVisiblePages(page, totalPages);

  return (
    <footer className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="text-sm text-ink-500">
        <span>Mostrar por pagina</span>
        <strong className="ml-2 text-ink-950">{pageSize}</strong>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-ink-700 transition hover:border-brand-200 hover:text-brand-700 disabled:opacity-40"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          {"<"}
        </button>
        {pages.map((visiblePage) => (
          <button
            key={visiblePage}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
              visiblePage === page
                ? "bg-linear-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-200"
                : "border border-slate-200 bg-slate-50 text-ink-700 hover:border-brand-200 hover:text-brand-700"
            }`}
            onClick={() => onPageChange(visiblePage)}
            type="button"
          >
            {visiblePage}
          </button>
        ))}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-ink-700 transition hover:border-brand-200 hover:text-brand-700 disabled:opacity-40"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          {">"}
        </button>
      </div>

      <div className="text-sm text-ink-500">
        Mostrando {currentPageStart}-{currentPageEnd} de {total} resultados
      </div>
    </footer>
  );
}
