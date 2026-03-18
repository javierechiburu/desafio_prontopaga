import type {
  FetchParams,
  FetchResult,
  TransactionFilters,
  TransactionsFilterMetadata,
  TransactionsOverview,
} from '../domain/transaction'
import {
  fetchTransactions,
  fetchTransactionsFilterMetadata,
  fetchTransactionsOverview,
} from '../data/transactionsServer'

const filtersCache = new Map<string, Promise<TransactionsFilterMetadata>>()
const overviewCache = new Map<string, Promise<TransactionsOverview>>()
const tableCache = new Map<string, Promise<FetchResult>>()

function getOrCreatePromise<TValue>(
  cache: Map<string, Promise<TValue>>,
  key: string,
  factory: () => Promise<TValue>,
) {
  const cachedValue = cache.get(key)

  if (cachedValue) {
    return cachedValue
  }

  const nextValue = factory()
  cache.set(key, nextValue)
  return nextValue
}

export function getTransactionsFilterMetadataPromise(refreshKey = 0) {
  return getOrCreatePromise(filtersCache, `filters:${refreshKey}`, () => fetchTransactionsFilterMetadata())
}

export function getTransactionsOverviewPromise(filters: TransactionFilters, refreshKey = 0) {
  return getOrCreatePromise(
    overviewCache,
    `overview:${refreshKey}:${JSON.stringify(filters)}`,
    () => fetchTransactionsOverview(filters),
  )
}

export function getTransactionsTablePromise(params: FetchParams, refreshKey = 0) {
  return getOrCreatePromise(
    tableCache,
    `table:${refreshKey}:${JSON.stringify(params)}`,
    () => fetchTransactions(params),
  )
}
