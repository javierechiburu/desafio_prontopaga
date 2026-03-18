import {
  type FetchParams,
  type FetchResult,
  type Transaction,
  type TransactionFilters,
  type TransactionsFilterMetadata,
  type TransactionsOverview,
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

function resolveAfterDelay<TValue>(callback: () => TValue, delay: number) {
  return new Promise<TValue>((resolve) => {
    window.setTimeout(() => {
      resolve(callback())
    }, delay)
  })
}

export function fetchTransactionsFilterMetadata() {
  return resolveAfterDelay<TransactionsFilterMetadata>(
    () => ({
      quickRanges: [
        {
          id: 'last30',
          label: 'Ultimos 30 dias',
          description: 'Monitorea actividad reciente',
        },
        {
          id: 'quarter',
          label: 'Este trimestre',
          description: 'Seguimiento operativo del trimestre',
        },
        {
          id: 'year',
          label: 'Ultimos 12 meses',
          description: 'Auditoria y trazabilidad anual',
        },
      ],
      helperText: 'Los filtros se sincronizan automaticamente con la URL y el tamano de pagina queda persistido.',
    }),
    260,
  )
}

export function fetchTransactionsOverview(filters: TransactionFilters) {
  return resolveAfterDelay<TransactionsOverview>(() => {
    const filtered = filterTransactions(mockTransactions, filters)
    const largestCredit = filtered
      .filter((transaction) => transaction.type === 'credit')
      .toSorted((left, right) => right.amount - left.amount)[0]
    const largestDebit = filtered
      .filter((transaction) => transaction.type === 'debit')
      .toSorted((left, right) => right.amount - left.amount)[0]
    const completedTransactions = filtered.filter((transaction) => transaction.status === 'completed').length
    const uniqueAccounts = new Set(filtered.map((transaction) => transaction.accountOrigin))

    return {
      largestCredit: largestCredit
        ? {
            amount: largestCredit.amount,
            currency: largestCredit.currency,
          }
        : null,
      largestDebit: largestDebit
        ? {
            amount: largestDebit.amount,
            currency: largestDebit.currency,
          }
        : null,
      activeAccounts: uniqueAccounts.size,
      completionRate: filtered.length === 0 ? 0 : Math.round((completedTransactions / filtered.length) * 100),
      total: filtered.length,
    }
  }, 340)
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
