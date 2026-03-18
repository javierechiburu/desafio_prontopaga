import { use, useEffect } from "react";
import type {
  FetchResult,
  PageSize,
  TransactionSort,
} from "../domain/transaction";
import { TransactionsPagination } from "./TransactionsPagination";
import { TransactionsTable } from "./TransactionsTable";

interface TransactionsTableSectionProps {
  promise: Promise<FetchResult>;
  requestedPage: number;
  pageSize: PageSize;
  sort: TransactionSort;
  onPageChange: (page: number) => void;
  onSort: (field: TransactionSort["field"]) => void;
  onClearFilters: () => void;
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <section className="rounded-4xl border border-white/70 bg-white/90 p-8 shadow-soft">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 h-28 w-28 rounded-full bg-linear-to-br from-brand-50 via-white to-rose-50 shadow-inner" />
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-500/70">
          Sin resultados
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-ink-950">
          No se encontraron transacciones
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink-700">
          No hay registros que coincidan con los filtros actuales. Ajusta la
          busqueda o limpia los criterios.
        </p>
        <button
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-linear-to-r from-brand-600 to-brand-500 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-200"
          onClick={onClearFilters}
          type="button"
        >
          Limpiar filtros
        </button>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
          <strong className="block text-sm font-bold text-ink-950">
            Necesitas ayuda?
          </strong>
          <span className="mt-2 block text-sm text-ink-500">
            Si crees que esto es un error, contacta a tu gestor operativo.
          </span>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
          <strong className="block text-sm font-bold text-ink-950">
            Ver configuraciones
          </strong>
          <span className="mt-2 block text-sm text-ink-500">
            Revisa restricciones activas en la visibilidad de la cuenta.
          </span>
        </article>
      </div>
    </section>
  );
}

export function TransactionsTableSection({
  promise,
  requestedPage,
  pageSize,
  sort,
  onPageChange,
  onSort,
  onClearFilters,
}: TransactionsTableSectionProps) {
  const result = use(promise);

  useEffect(() => {
    if (result.page !== requestedPage) {
      onPageChange(result.page);
    }
  }, [onPageChange, requestedPage, result.page]);

  if (result.total === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  const currentPageStart = (result.page - 1) * pageSize + 1;
  const currentPageEnd = currentPageStart + result.data.length - 1;

  return (
    <section className="rounded-4xl border border-white/70 bg-white/90 shadow-soft">
      <div className="flex flex-col gap-3 px-6 pt-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-500/70">
            Tabla de transacciones
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink-950">
            Historial de transacciones
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-ink-700">
          Trazabilidad visual de movimientos filtrados con formato adaptado a
          cada moneda.
        </p>
      </div>

      <TransactionsTable
        transactions={result.data}
        sort={sort}
        onSort={onSort}
      />

      <TransactionsPagination
        page={result.page}
        totalPages={result.totalPages}
        pageSize={pageSize}
        total={result.total}
        currentPageStart={currentPageStart}
        currentPageEnd={currentPageEnd}
        onPageChange={onPageChange}
      />
    </section>
  );
}
