import {
  CURRENCIES,
  PAGE_SIZE_OPTIONS,
  SORT_DIRECTIONS,
  SORT_FIELDS,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  type PageSize,
  type SortDirection,
  type Currency,
  type TransactionFilters,
  type TransactionSort,
  type TransactionSortField,
  type TransactionStatus,
  type TransactionType,
} from '../domain/transaction'

export interface TransactionsQueryState {
  page: number
  pageSize: PageSize
  filters: TransactionFilters
  searchInput: string
  sort: TransactionSort
}

const DEFAULT_PAGE_SIZE: PageSize = 10
const DEFAULT_SORT: TransactionSort = { field: 'date', direction: 'desc' }

function isPageSize(value: number): value is PageSize {
  return PAGE_SIZE_OPTIONS.includes(value as PageSize)
}

function isType(value: string): value is TransactionType {
  return TRANSACTION_TYPES.includes(value as TransactionType)
}

function isStatus(value: string): value is TransactionStatus {
  return TRANSACTION_STATUSES.includes(value as TransactionStatus)
}

function isCurrency(value: string): value is Currency {
  return CURRENCIES.includes(value as Currency)
}

function isSortField(value: string): value is TransactionSortField {
  return SORT_FIELDS.includes(value as TransactionSortField)
}

function isSortDirection(value: string): value is SortDirection {
  return SORT_DIRECTIONS.includes(value as SortDirection)
}

function parseNumber(value: string | null) {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function getDefaultQueryState(pageSize: PageSize = DEFAULT_PAGE_SIZE): TransactionsQueryState {
  return {
    page: 1,
    pageSize,
    filters: {},
    searchInput: '',
    sort: DEFAULT_SORT,
  }
}

export function parseQueryState(
  search: string,
  defaults: TransactionsQueryState = getDefaultQueryState(),
): TransactionsQueryState {
  const params = new URLSearchParams(search)
  const page = Number(params.get('page'))
  const pageSize = Number(params.get('pageSize'))
  const type = params.get('type')
  const status = params.get('status')
  const currency = params.get('currency')
  const sortField = params.get('sortBy')
  const sortDirection = params.get('sortDirection')
  const searchValue = params.get('search')?.trim() ?? ''

  return {
    page: Number.isInteger(page) && page > 0 ? page : defaults.page,
    pageSize: isPageSize(pageSize) ? pageSize : defaults.pageSize,
    filters: {
      dateFrom: params.get('dateFrom') ?? undefined,
      dateTo: params.get('dateTo') ?? undefined,
      type: type && isType(type) ? type : undefined,
      status: status && isStatus(status) ? status : undefined,
      currency: currency && isCurrency(currency) ? currency : undefined,
      amountMin: parseNumber(params.get('amountMin')),
      amountMax: parseNumber(params.get('amountMax')),
      search: searchValue || undefined,
    },
    searchInput: searchValue,
    sort: {
      field: sortField && isSortField(sortField) ? sortField : defaults.sort.field,
      direction:
        sortDirection && isSortDirection(sortDirection) ? sortDirection : defaults.sort.direction,
    },
  }
}

export function buildQueryParams({ page, pageSize, filters, sort }: TransactionsQueryState) {
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('pageSize', String(pageSize))
  params.set('sortBy', sort.field)
  params.set('sortDirection', sort.direction)

  if (filters.dateFrom) {
    params.set('dateFrom', filters.dateFrom)
  }

  if (filters.dateTo) {
    params.set('dateTo', filters.dateTo)
  }

  if (filters.type) {
    params.set('type', filters.type)
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.currency) {
    params.set('currency', filters.currency)
  }

  if (typeof filters.amountMin === 'number') {
    params.set('amountMin', String(filters.amountMin))
  }

  if (typeof filters.amountMax === 'number') {
    params.set('amountMax', String(filters.amountMax))
  }

  if (filters.search) {
    params.set('search', filters.search)
  }

  return params
}
