import { PAGE_SIZE_OPTIONS } from '../domain/transaction'
import { useTransactions } from '../hooks/useTransactions'
import { TransactionsFilters } from './TransactionsFilters'
import { TransactionsPagination } from './TransactionsPagination'
import { TransactionsTable } from './TransactionsTable'
import { TransactionsTableSkeleton } from './TransactionsTableSkeleton'

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="feedback-card feedback-card--error" aria-live="assertive">
      <h2>No pudimos cargar los movimientos</h2>
      <p>{message}</p>
      <button className="ghost-button" onClick={onRetry}>
        Reintentar
      </button>
    </section>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <section className="feedback-card" aria-live="polite">
      <h2>Sin resultados para estos filtros</h2>
      <p>Prueba ampliando el rango de fechas, cambiando el monto o limpiando la busqueda.</p>
      <button className="ghost-button" onClick={onClear}>
        Limpiar filtros
      </button>
    </section>
  )
}

export function TransactionsPage() {
  const transactions = useTransactions()

  return (
    <main className="banking-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Banco Digital / Operaciones internas</p>
          <h1>Historial de movimientos bancarios</h1>
          <p className="hero-copy">
            Revisa transacciones de clientes con filtros persistentes, paginacion server-side simulada y exportacion CSV.
          </p>
        </div>
        <dl className="hero-stats" aria-label="Resumen de movimientos">
          <div>
            <dt>Resultados</dt>
            <dd>{transactions.total}</dd>
          </div>
          <div>
            <dt>Filtros activos</dt>
            <dd>{transactions.activeFilterCount}</dd>
          </div>
          <div>
            <dt>Pagina actual</dt>
            <dd>
              {transactions.page} / {transactions.totalPages}
            </dd>
          </div>
        </dl>
      </section>

      <TransactionsFilters
        filters={transactions.filters}
        searchInput={transactions.searchInput}
        pageSize={transactions.pageSize}
        hasActiveFilters={transactions.hasActiveFilters}
        isExporting={transactions.isExporting}
        onFilterChange={transactions.setFilter}
        onSearchChange={transactions.setSearchInput}
        onPageSizeChange={transactions.setPageSize}
        onClearFilters={transactions.clearFilters}
        onExport={transactions.exportCsv}
      />

      <section className="data-panel">
        <header className="panel-toolbar">
          <div>
            <h2>Movimientos encontrados</h2>
            <p>
              Mostrando {transactions.currentPageStart}-{transactions.currentPageEnd} de {transactions.total} registros.
            </p>
          </div>
          <div className="toolbar-hint">
            <span>Ordena por fecha o monto.</span>
            <span>Hover en cuenta origen para ver destino.</span>
          </div>
        </header>

        {transactions.error ? <ErrorState message={transactions.error} onRetry={transactions.retry} /> : null}

        {!transactions.error && transactions.isLoading ? <TransactionsTableSkeleton /> : null}

        {!transactions.error && !transactions.isLoading && transactions.total === 0 ? (
          <EmptyState onClear={transactions.clearFilters} />
        ) : null}

        {!transactions.error && !transactions.isLoading && transactions.total > 0 ? (
          <>
            <TransactionsTable
              transactions={transactions.data}
              sort={transactions.sort}
              onSort={transactions.toggleSort}
            />
            <TransactionsPagination
              page={transactions.page}
              totalPages={transactions.totalPages}
              pageSize={transactions.pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageChange={transactions.setPage}
              onPageSizeChange={transactions.setPageSize}
            />
          </>
        ) : null}
      </section>
    </main>
  )
}
