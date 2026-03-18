import { use } from "react";
import {
  CURRENCIES,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  type Currency,
  type PageSize,
  type TransactionFilters,
  type TransactionsFilterMetadata,
  type TransactionStatus,
  type TransactionType,
} from "../domain/transaction";

interface TransactionsFiltersProps {
  promise: Promise<TransactionsFilterMetadata>;
  filters: TransactionFilters;
  pageSize: PageSize;
  hasActiveFilters: boolean;
  onFilterChange: <TKey extends keyof TransactionFilters>(
    key: TKey,
    value: TransactionFilters[TKey],
  ) => void;
  onPageSizeChange: (value: PageSize) => void;
  onClearFilters: () => void;
}

function parseNumberInput(value: string) {
  if (value.trim() === "") {
    return undefined;
  }

  return Number(value);
}

function parseSelectValue<TValue extends string>(value: string) {
  return (value || undefined) as TValue | undefined;
}

function formatDateInput(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
}

function getQuickRangeDates(
  rangeId: TransactionsFilterMetadata["quickRanges"][number]["id"],
) {
  const today = new Date();
  const to = formatDateInput(today);
  const from = new Date(today);

  switch (rangeId) {
    case "last30":
      from.setDate(from.getDate() - 30);
      break;
    case "quarter":
      from.setMonth(from.getMonth() - 3);
      break;
    case "year":
      from.setFullYear(from.getFullYear() - 1);
      break;
  }

  return {
    dateFrom: formatDateInput(from),
    dateTo: to,
  };
}

export function TransactionsFilters({
  promise,
  filters,
  pageSize,
  hasActiveFilters,
  onFilterChange,
  onPageSizeChange,
  onClearFilters,
}: TransactionsFiltersProps) {
  const metadata = use(promise);
  const fieldClass =
    "mt-2 h-12 w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 text-sm text-ink-950 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100";

  return (
    <section
      className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-soft"
      aria-label="Filtros de transacciones"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-500/70">
            Control de filtros
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink-950">
            Filtros de precision
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-ink-700">
          {metadata.helperText}
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {metadata.quickRanges.map((range) => (
          <button
            key={range.id}
            className="rounded-3xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white"
            onClick={() => {
              const preset = getQuickRangeDates(range.id);
              onFilterChange("dateFrom", preset.dateFrom);
              onFilterChange("dateTo", preset.dateTo);
            }}
            type="button"
          >
            <span className="block text-sm font-bold text-ink-950">
              {range.label}
            </span>
            <small className="mt-1 block text-xs text-ink-500">
              {range.description}
            </small>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Fecha desde
          </span>
          <input
            className={fieldClass}
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(event) =>
              onFilterChange("dateFrom", event.target.value || undefined)
            }
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Fecha hasta
          </span>
          <input
            className={fieldClass}
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(event) =>
              onFilterChange("dateTo", event.target.value || undefined)
            }
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Tipo
          </span>
          <select
            className={fieldClass}
            value={filters.type ?? ""}
            onChange={(event) =>
              onFilterChange(
                "type",
                parseSelectValue<TransactionType>(event.target.value),
              )
            }
          >
            <option value="">Todos los tipos</option>
            {TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === "credit" ? "Credito" : "Debito"}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Estado
          </span>
          <select
            className={fieldClass}
            value={filters.status ?? ""}
            onChange={(event) =>
              onFilterChange(
                "status",
                parseSelectValue<TransactionStatus>(event.target.value),
              )
            }
          >
            <option value="">Todos los estados</option>
            {TRANSACTION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === "completed"
                  ? "Completada"
                  : status === "pending"
                    ? "Pendiente"
                    : "Fallida"}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Moneda
          </span>
          <select
            className={fieldClass}
            value={filters.currency ?? ""}
            onChange={(event) =>
              onFilterChange(
                "currency",
                parseSelectValue<Currency>(event.target.value),
              )
            }
          >
            <option value="">Todas las monedas</option>
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Tamano de pagina
          </span>
          <select
            className={fieldClass}
            value={pageSize}
            onChange={(event) =>
              onPageSizeChange(Number(event.target.value) as PageSize)
            }
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Monto minimo
          </span>
          <input
            className={fieldClass}
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="0.00"
            value={filters.amountMin ?? ""}
            onChange={(event) =>
              onFilterChange("amountMin", parseNumberInput(event.target.value))
            }
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Monto maximo
          </span>
          <input
            className={fieldClass}
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="Sin tope"
            value={filters.amountMax ?? ""}
            onChange={(event) =>
              onFilterChange("amountMax", parseNumberInput(event.target.value))
            }
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200/80 pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ink-700">
          {hasActiveFilters
            ? "Los filtros estan modificando esta vista."
            : "No hay filtros activos aplicados."}
        </p>
        <button
          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-ink-700 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
          onClick={onClearFilters}
          type="button"
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
