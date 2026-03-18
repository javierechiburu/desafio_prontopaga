import {
  type FetchParams,
  type FetchResult,
  type Transaction,
  type TransactionFilters,
  type TransactionSort,
} from '../domain/transaction'
import { mockTransactions } from './mockTransactions'

function normalizeDate(date: string) {
  return new Date(date).getTime()
}

function includesSearch(transaction: Transaction, search?: string) {
  if (!search) {
    return true
  }

  return transaction.description.toLowerCase().includes(search.trim().toLowerCase())
}

export function filterTransactions(transactions: Transaction[], filters: TransactionFilters) {
  return transactions.filter((transaction) => {
    if (filters.dateFrom && normalizeDate(transaction.date) < normalizeDate(`${filters.dateFrom}T00:00:00.000Z`)) {
      return false
    }

    if (filters.dateTo && normalizeDate(transaction.date) > normalizeDate(`${filters.dateTo}T23:59:59.999Z`)) {
      return false
    }

    if (filters.type && transaction.type !== filters.type) {
      return false
    }

    if (filters.status && transaction.status !== filters.status) {
      return false
    }

    if (filters.currency && transaction.currency !== filters.currency) {
      return false
    }

    if (typeof filters.amountMin === 'number' && transaction.amount < filters.amountMin) {
      return false
    }

    if (typeof filters.amountMax === 'number' && transaction.amount > filters.amountMax) {
      return false
    }

    return includesSearch(transaction, filters.search)
  })
}

export function sortTransactions(transactions: Transaction[], sort: TransactionSort) {
  const direction = sort.direction === 'asc' ? 1 : -1

  return [...transactions].sort((left, right) => {
    if (sort.field === 'amount') {
      return (left.amount - right.amount) * direction
    }

    return (normalizeDate(left.date) - normalizeDate(right.date)) * direction
  })
}

export function getTransactionsForExport(filters: TransactionFilters, sort: TransactionSort) {
  const filtered = filterTransactions(mockTransactions, filters)
  return sortTransactions(filtered, sort)
}

export function fetchTransactions({ page, pageSize, filters, sort }: FetchParams) {
  return new Promise<FetchResult>((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error('No pudimos obtener los movimientos. Intenta nuevamente.'))
        return
      }

      const filtered = filterTransactions(mockTransactions, filters)
      const sorted = sortTransactions(filtered, sort)
      const total = sorted.length
      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      const safePage = Math.min(page, totalPages)
      const start = (safePage - 1) * pageSize
      const data = sorted.slice(start, start + pageSize)

      resolve({
        data,
        total,
        page: safePage,
        pageSize,
        totalPages,
      })
    }, 600)
  })
}
