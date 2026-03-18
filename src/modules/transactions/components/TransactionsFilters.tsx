import {
  CURRENCIES,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  type Currency,
  type PageSize,
  type TransactionFilters,
  type TransactionStatus,
  type TransactionType,
} from '../domain/transaction'

interface TransactionsFiltersProps {
  filters: TransactionFilters
  searchInput: string
  pageSize: PageSize
  hasActiveFilters: boolean
  isExporting: boolean
  onFilterChange: <TKey extends keyof TransactionFilters>(
    key: TKey,
    value: TransactionFilters[TKey],
  ) => void
  onSearchChange: (value: string) => void
  onPageSizeChange: (value: PageSize) => void
  onClearFilters: () => void
  onExport: () => void
}

function parseNumberInput(value: string) {
  if (value.trim() === '') {
    return undefined
  }

  return Number(value)
}

function parseSelectValue<TValue extends string>(value: string) {
  return (value || undefined) as TValue | undefined
}

export function TransactionsFilters({
  filters,
  searchInput,
  pageSize,
  hasActiveFilters,
  isExporting,
  onFilterChange,
  onSearchChange,
  onPageSizeChange,
  onClearFilters,
  onExport,
}: TransactionsFiltersProps) {
  return (
    <section className="filters-panel" aria-label="Filtros de movimientos">
      <div className="filters-grid">
        <label className="field">
          <span>Buscar descripcion</span>
          <input
            type="search"
            placeholder="Ej: transferencia cliente"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Desde</span>
          <input
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(event) => onFilterChange('dateFrom', event.target.value || undefined)}
          />
        </label>

        <label className="field">
          <span>Hasta</span>
          <input
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(event) => onFilterChange('dateTo', event.target.value || undefined)}
          />
        </label>

        <label className="field">
          <span>Tipo</span>
          <select
            value={filters.type ?? ''}
            onChange={(event) => onFilterChange('type', parseSelectValue<TransactionType>(event.target.value))}
          >
            <option value="">Todos</option>
            {TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === 'credit' ? 'Credito' : 'Debito'}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Estado</span>
          <select
            value={filters.status ?? ''}
            onChange={(event) =>
              onFilterChange('status', parseSelectValue<TransactionStatus>(event.target.value))
            }
          >
            <option value="">Todos</option>
            {TRANSACTION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === 'completed' ? 'Completado' : status === 'pending' ? 'Pendiente' : 'Fallido'}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Moneda</span>
          <select
            value={filters.currency ?? ''}
            onChange={(event) => onFilterChange('currency', parseSelectValue<Currency>(event.target.value))}
          >
            <option value="">Todas</option>
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Monto minimo</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="0"
            value={filters.amountMin ?? ''}
            onChange={(event) => onFilterChange('amountMin', parseNumberInput(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Monto maximo</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="Sin limite"
            value={filters.amountMax ?? ''}
            onChange={(event) => onFilterChange('amountMax', parseNumberInput(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Tamano de pagina</span>
          <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value) as PageSize)}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>

      <div className="filters-actions">
        <button className="primary-button" onClick={onExport} disabled={isExporting} type="button">
          {isExporting ? 'Exportando...' : 'Exportar CSV'}
        </button>
        <button
          className="ghost-button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters && searchInput === ''}
          type="button"
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  )
}
