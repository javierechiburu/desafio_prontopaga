export const CURRENCIES = ['USD', 'EUR', 'CLP', 'BTC'] as const
export const TRANSACTION_TYPES = ['credit', 'debit'] as const
export const TRANSACTION_STATUSES = ['completed', 'pending', 'failed'] as const
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
export const SORT_FIELDS = ['date', 'amount'] as const
export const SORT_DIRECTIONS = ['asc', 'desc'] as const

export type Currency = (typeof CURRENCIES)[number]
export type TransactionType = (typeof TRANSACTION_TYPES)[number]
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number]
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]
export type TransactionSortField = (typeof SORT_FIELDS)[number]
export type SortDirection = (typeof SORT_DIRECTIONS)[number]

export interface Transaction {
  id: string
  date: string
  description: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: Currency
  accountOrigin: string
  accountDestination: string
}

export interface TransactionFilters {
  dateFrom?: string
  dateTo?: string
  type?: TransactionType
  status?: TransactionStatus
  currency?: Currency
  amountMin?: number
  amountMax?: number
  search?: string
}

export interface TransactionSort {
  field: TransactionSortField
  direction: SortDirection
}

export interface FetchParams {
  page: number
  pageSize: number
  filters: TransactionFilters
  sort: TransactionSort
}

export interface FetchResult {
  data: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
