import { startTransition, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type {
  PageSize,
  TransactionFilters,
  TransactionSortField,
} from '../domain/transaction'
import { getTransactionsForExport } from '../data/transactionsServer'
import { buildTransactionsCsv, downloadCsvFile } from '../lib/csv'
import { buildQueryParams, getDefaultQueryState, parseQueryState } from '../lib/queryParams'
import {
  getTransactionsFilterMetadataPromise,
  getTransactionsOverviewPromise,
  getTransactionsTablePromise,
} from '../lib/transactionsResources'
import { getActiveFilterCount, useTransactionsStore } from '../state/transactionsStore'

function getInitialState() {
  if (typeof window === 'undefined') {
    return getDefaultQueryState()
  }

  const pageSize = useTransactionsStore.getState().pageSize
  return parseQueryState(window.location.search, getDefaultQueryState(pageSize))
}

export function useTransactions() {
  const {
    page,
    pageSize,
    filters,
    searchInput,
    sort,
    areFiltersVisible,
    hydrateFromUrl,
    setPage,
    setPageSize,
    setFilter,
    setSearchInput,
    applySearch,
    clearFilters,
    toggleSort,
    toggleFiltersVisibility,
  } = useTransactionsStore(
    useShallow((state) => ({
      page: state.page,
      pageSize: state.pageSize,
      filters: state.filters,
      searchInput: state.searchInput,
      sort: state.sort,
      areFiltersVisible: state.areFiltersVisible,
      hydrateFromUrl: state.hydrateFromUrl,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      setFilter: state.setFilter,
      setSearchInput: state.setSearchInput,
      applySearch: state.applySearch,
      clearFilters: state.clearFilters,
      toggleSort: state.toggleSort,
      toggleFiltersVisibility: state.toggleFiltersVisibility,
    })),
  )
  const [isExporting, setIsExporting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    hydrateFromUrl(getInitialState())
  }, [hydrateFromUrl])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      applySearch()
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [applySearch, searchInput])

  useEffect(() => {
    const params = buildQueryParams({
      page,
      pageSize,
      filters,
      searchInput,
      sort,
    })
    const nextSearch = params.toString()
    const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname

    window.history.replaceState({}, '', nextUrl)
  }, [filters, page, pageSize, searchInput, sort])

  useEffect(() => {
    function handlePopState() {
      const currentPageSize = useTransactionsStore.getState().pageSize
      hydrateFromUrl(parseQueryState(window.location.search, getDefaultQueryState(currentPageSize)))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [hydrateFromUrl])

  function handleSetFilter<TKey extends keyof TransactionFilters>(key: TKey, value: TransactionFilters[TKey]) {
    startTransition(() => {
      setFilter(key, value)
    })
  }

  function handleSetSearchInput(value: string) {
    startTransition(() => {
      setSearchInput(value)
    })
  }

  function handleSetPage(page: number) {
    startTransition(() => {
      setPage(page)
    })
  }

  function handleSetPageSize(pageSize: PageSize) {
    startTransition(() => {
      setPageSize(pageSize)
    })
  }

  function handleClearFilters() {
    startTransition(() => {
      clearFilters()
    })
  }

  function handleToggleSort(field: TransactionSortField) {
    startTransition(() => {
      toggleSort(field)
    })
  }

  function retry() {
    setRefreshKey((currentValue) => currentValue + 1)
  }

  async function exportCsv() {
    setIsExporting(true)

    try {
      const transactions = getTransactionsForExport(filters, sort)
      const csvContent = buildTransactionsCsv(transactions)
      downloadCsvFile(csvContent)
    } finally {
      setIsExporting(false)
    }
  }

  const filtersPromise = useMemo(
    () => getTransactionsFilterMetadataPromise(refreshKey),
    [refreshKey],
  )
  const overviewPromise = useMemo(
    () => getTransactionsOverviewPromise(filters, refreshKey),
    [filters, refreshKey],
  )
  const tablePromise = useMemo(
    () =>
      getTransactionsTablePromise(
        {
          page,
          pageSize,
          filters,
          sort,
        },
        refreshKey,
      ),
    [filters, page, pageSize, refreshKey, sort],
  )
  const activeFilterCount = getActiveFilterCount(filters)
  const hasActiveFilters = activeFilterCount > 0

  return {
    page,
    pageSize,
    filters,
    searchInput,
    sort,
    areFiltersVisible,
    isExporting,
    hasActiveFilters,
    activeFilterCount,
    filtersPromise,
    overviewPromise,
    tablePromise,
    tableResetKey: `${page}:${pageSize}:${refreshKey}:${JSON.stringify(filters)}:${sort.field}:${sort.direction}`,
    retry,
    clearFilters: handleClearFilters,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setFilter: handleSetFilter,
    setSearchInput: handleSetSearchInput,
    toggleSort: handleToggleSort,
    toggleFiltersVisibility,
    exportCsv,
  }
}
