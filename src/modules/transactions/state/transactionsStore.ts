import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { PageSize, TransactionFilters, TransactionSort } from '../domain/transaction'
import { getDefaultQueryState, type TransactionsQueryState } from '../lib/queryParams'

interface TransactionsStoreState extends TransactionsQueryState {
  areFiltersVisible: boolean
  hydrateFromUrl: (state: TransactionsQueryState) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: PageSize) => void
  setSearchInput: (value: string) => void
  applySearch: () => void
  setFilter: <TKey extends keyof TransactionFilters>(
    key: TKey,
    value: TransactionFilters[TKey],
  ) => void
  clearFilters: () => void
  toggleSort: (field: TransactionSort['field']) => void
  toggleFiltersVisibility: () => void
}

function getStoreDefaults() {
  return {
    ...getDefaultQueryState(),
    areFiltersVisible: true,
  }
}

export function getActiveFilterCount(filters: TransactionFilters) {
  return Object.values(filters).filter((value) => value !== undefined && value !== '').length
}

export const useTransactionsStore = create<TransactionsStoreState>()(
  persist(
    (set) => ({
      ...getStoreDefaults(),
      hydrateFromUrl: (state) =>
        set((currentState) => ({
          ...currentState,
          ...state,
          areFiltersVisible: currentState.areFiltersVisible,
        })),
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ page: 1, pageSize }),
      setSearchInput: (searchInput) => set({ searchInput }),
      applySearch: () =>
        set((state) => {
          const search = state.searchInput.trim()
          const nextSearch = search || undefined

          if (state.filters.search === nextSearch) {
            return state
          }

          return {
            page: 1,
            filters: {
              ...state.filters,
              search: nextSearch,
            },
          }
        }),
      setFilter: (key, value) =>
        set((state) => ({
          page: 1,
          filters: {
            ...state.filters,
            [key]: value === '' ? undefined : value,
          },
        })),
      clearFilters: () =>
        set({
          page: 1,
          filters: {},
          searchInput: '',
        }),
      toggleSort: (field) =>
        set((state) => ({
          page: 1,
          sort:
            state.sort.field === field
              ? {
                  field,
                  direction: state.sort.direction === 'asc' ? 'desc' : 'asc',
                }
              : {
                  field,
                  direction: field === 'date' ? 'desc' : 'asc',
                },
        })),
      toggleFiltersVisibility: () =>
        set((state) => ({
          areFiltersVisible: !state.areFiltersVisible,
        })),
    }),
    {
      name: 'transactions-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        pageSize: state.pageSize,
        areFiltersVisible: state.areFiltersVisible,
      }),
    },
  ),
)

export function resetTransactionsStore() {
  useTransactionsStore.setState(getStoreDefaults())
}
