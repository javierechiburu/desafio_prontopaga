import { Suspense } from "react";
import { AppShell } from "../../shell/components/AppShell";
import { AsyncBoundary } from "../../shared/components/AsyncBoundary";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionsFilters } from "./TransactionsFilters";
import { TransactionsFiltersSkeleton } from "./TransactionsFiltersSkeleton";
import { TransactionsOverview } from "./TransactionsOverview";
import { TransactionsOverviewSkeleton } from "./TransactionsOverviewSkeleton";
import { TransactionsTableSection } from "./TransactionsTableSection";
import { TransactionsTableSkeleton } from "./TransactionsTableSkeleton";

function TableErrorState({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  return (
    <section
      className="rounded-4xl border border-rose-200 bg-white/90 p-6 shadow-soft"
      aria-live="assertive"
    >
      <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-rose-500">
        Solicitud fallida
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink-950">
        No pudimos cargar la tabla
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-700">{error.message}</p>
      <button
        className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-linear-to-r from-brand-600 to-brand-500 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-200"
        onClick={onRetry}
        type="button"
      >
        Reintentar consulta
      </button>
    </section>
  );
}

export function TransactionsPage() {
  const transactions = useTransactions();

  return (
    <AppShell
      searchValue={transactions.searchInput}
      onSearchChange={transactions.setSearchInput}
      actionLabel="Exportar CSV"
      onActionClick={transactions.exportCsv}
      actionLoading={transactions.isExporting}
    >
      <section className="space-y-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-500/70">
              Mesa operativa
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-ink-950 md:text-6xl">
              Historial de transacciones
            </h1>
          </div>

          <div className="flex flex-col items-start gap-3 xl:items-end">
            <span className="inline-flex min-h-10 items-center rounded-full bg-white/80 px-4 text-sm font-semibold text-brand-700 ring-1 ring-brand-100 shadow-soft">
              {transactions.hasActiveFilters
                ? `${transactions.activeFilterCount} filtros activos`
                : "Sin filtros activos"}
            </span>
            <button
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 px-5 text-sm font-semibold text-ink-700 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
              onClick={transactions.toggleFiltersVisibility}
              type="button"
            >
              {transactions.areFiltersVisible
                ? "Ocultar filtros"
                : "Mostrar filtros"}
            </button>
          </div>
        </header>

        <Suspense fallback={<TransactionsOverviewSkeleton />}>
          <TransactionsOverview promise={transactions.overviewPromise} />
        </Suspense>

        {transactions.areFiltersVisible ? (
          <Suspense fallback={<TransactionsFiltersSkeleton />}>
            <TransactionsFilters
              promise={transactions.filtersPromise}
              filters={transactions.filters}
              pageSize={transactions.pageSize}
              hasActiveFilters={transactions.hasActiveFilters}
              onFilterChange={transactions.setFilter}
              onPageSizeChange={transactions.setPageSize}
              onClearFilters={transactions.clearFilters}
            />
          </Suspense>
        ) : null}

        <AsyncBoundary
          resetKeys={[transactions.tableResetKey]}
          fallback={(error, reset) => (
            <TableErrorState
              error={error}
              onRetry={() => {
                reset();
                transactions.retry();
              }}
            />
          )}
        >
          <Suspense
            fallback={
              <TransactionsTableSkeleton
                rowCount={transactions.pageSize === 50 ? 7 : 5}
              />
            }
          >
            <TransactionsTableSection
              promise={transactions.tablePromise}
              requestedPage={transactions.page}
              pageSize={transactions.pageSize}
              sort={transactions.sort}
              onPageChange={transactions.setPage}
              onSort={transactions.toggleSort}
              onClearFilters={transactions.clearFilters}
            />
          </Suspense>
        </AsyncBoundary>
      </section>
    </AppShell>
  );
}
