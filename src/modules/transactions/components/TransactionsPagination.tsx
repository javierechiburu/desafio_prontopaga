import type { PageSize } from '../domain/transaction'

interface TransactionsPaginationProps {
  page: number
  totalPages: number
  pageSize: PageSize
  pageSizeOptions: readonly PageSize[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
}

function getVisiblePages(page: number, totalPages: number) {
  const firstPage = Math.max(1, page - 1)
  const lastPage = Math.min(totalPages, page + 1)
  const pages = []

  for (let currentPage = firstPage; currentPage <= lastPage; currentPage += 1) {
    pages.push(currentPage)
  }

  if (!pages.includes(1)) {
    pages.unshift(1)
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages)
  }

  return pages
}

export function TransactionsPagination({
  page,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: TransactionsPaginationProps) {
  const visiblePages = getVisiblePages(page, totalPages)

  return (
    <footer className="pagination-bar">
      <label className="pagination-page-size">
        <span>Registros por pagina</span>
        <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value) as PageSize)}>
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="pagination-controls" aria-label="Paginacion">
        <button className="ghost-button" onClick={() => onPageChange(page - 1)} disabled={page === 1} type="button">
          Anterior
        </button>
        {visiblePages.map((visiblePage) => (
          <button
            key={visiblePage}
            className={`page-chip${visiblePage === page ? ' page-chip--active' : ''}`}
            onClick={() => onPageChange(visiblePage)}
            aria-current={visiblePage === page ? 'page' : undefined}
            type="button"
          >
            {visiblePage}
          </button>
        ))}
        <button
          className="ghost-button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          type="button"
        >
          Siguiente
        </button>
      </div>
    </footer>
  )
}
