import { startTransition, useEffect, useReducer, useRef, useState } from 'react'
import type {
  FetchResult,
  PageSize,
  TransactionFilters,
  TransactionSortField,
} from '../domain/transaction'
import { fetchTransactions, getTransactionsForExport } from '../data/transactionsServer'
import { buildTransactionsCsv, downloadCsvFile } from '../lib/csv'
import { buildQueryParams, getDefaultQueryState, parseQueryState } from '../lib/queryParams'
import { getActiveFilterCount, transactionsReducer } from '../state/transactionsReducer'

const INITIAL_RESULT: FetchResult = {
  data: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
}

function getInitialState() {
  if (typeof window === 'undefined') {
    return getDefaultQueryState()
  }

  return parseQueryState(window.location.search)
}

export function useTransactions() {
  const [state, dispatch] = useReducer(transactionsReducer, undefined, getInitialState)
  const [result, setResult] = useState<FetchResult>(INITIAL_RESULT)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'apply-search' })
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [state.searchInput])

  useEffect(() => {
    const params = buildQueryParams(state)
    const nextSearch = params.toString()
    const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname

    window.history.replaceState({}, '', nextUrl)
    window.localStorage.setItem('transactions-page-size', String(state.pageSize))
  }, [state])

  useEffect(() => {
    function handlePopState() {
      dispatch({
        type: 'hydrate',
        payload: parseQueryState(window.location.search),
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const currentRequestId = requestIdRef.current + 1
    requestIdRef.current = currentRequestId
    setIsLoading(true)
    setError(null)

    fetchTransactions({
      page: state.page,
      pageSize: state.pageSize,
      filters: state.filters,
      sort: state.sort,
    })
      .then((nextResult) => {
        if (requestIdRef.current !== currentRequestId) {
          return
        }

        setResult(nextResult)

        if (nextResult.page !== state.page) {
          startTransition(() => {
            dispatch({ type: 'set-page', payload: nextResult.page })
          })
        }
      })
      .catch((caughtError: unknown) => {
        if (requestIdRef.current !== currentRequestId) {
          return
        }

        setError(caughtError instanceof Error ? caughtError.message : 'Ocurrio un error inesperado.')
      })
      .finally(() => {
        if (requestIdRef.current === currentRequestId) {
          setIsLoading(false)
        }
      })
  }, [retryCount, state.filters, state.page, state.pageSize, state.sort])

  function setFilter<TKey extends keyof TransactionFilters>(key: TKey, value: TransactionFilters[TKey]) {
    startTransition(() => {
      dispatch({
        type: 'set-filter',
        payload: {
          key,
          value,
        },
      })
    })
  }

  function setSearchInput(value: string) {
    startTransition(() => {
      dispatch({ type: 'set-search-input', payload: value })
    })
  }

  function setPage(page: number) {
    startTransition(() => {
      dispatch({ type: 'set-page', payload: page })
    })
  }

  function setPageSize(pageSize: PageSize) {
    startTransition(() => {
      dispatch({ type: 'set-page-size', payload: pageSize })
    })
  }

  function clearFilters() {
    startTransition(() => {
      dispatch({ type: 'clear-filters' })
    })
  }

  function toggleSort(field: TransactionSortField) {
    startTransition(() => {
      dispatch({ type: 'toggle-sort', payload: field })
    })
  }

  function retry() {
    setRetryCount((currentCount) => currentCount + 1)
  }

  async function exportCsv() {
    setIsExporting(true)

    try {
      const transactions = getTransactionsForExport(state.filters, state.sort)
      const csvContent = buildTransactionsCsv(transactions)
      downloadCsvFile(csvContent)
    } finally {
      setIsExporting(false)
    }
  }

  const activeFilterCount = getActiveFilterCount(state.filters)
  const hasActiveFilters = activeFilterCount > 0
  const currentPageStart = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1
  const currentPageEnd = result.total === 0 ? 0 : currentPageStart + result.data.length - 1

  return {
    data: result.data,
    total: result.total,
    totalPages: result.totalPages,
    page: result.page,
    pageSize: state.pageSize,
    filters: state.filters,
    searchInput: state.searchInput,
    sort: state.sort,
    isLoading,
    isExporting,
    error,
    hasActiveFilters,
    activeFilterCount,
    currentPageStart,
    currentPageEnd,
    retry,
    clearFilters,
    setPage,
    setPageSize,
    setFilter,
    setSearchInput,
    toggleSort,
    exportCsv,
  }
}
