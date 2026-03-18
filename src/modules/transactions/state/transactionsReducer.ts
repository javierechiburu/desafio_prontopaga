import type { PageSize, TransactionFilters, TransactionSort } from '../domain/transaction'
import type { TransactionsQueryState } from '../lib/queryParams'

export type TransactionsState = TransactionsQueryState

type ReducerAction =
  | { type: 'hydrate'; payload: TransactionsState }
  | { type: 'set-page'; payload: number }
  | { type: 'set-page-size'; payload: PageSize }
  | { type: 'set-search-input'; payload: string }
  | { type: 'apply-search' }
  | {
      type: 'set-filter'
      payload: {
        key: keyof TransactionFilters
        value: string | number | undefined
      }
    }
  | { type: 'clear-filters' }
  | { type: 'toggle-sort'; payload: TransactionSort['field'] }

export function getActiveFilterCount(filters: TransactionFilters) {
  return Object.values(filters).filter((value) => value !== undefined && value !== '').length
}

export function transactionsReducer(state: TransactionsState, action: ReducerAction): TransactionsState {
  switch (action.type) {
    case 'hydrate':
      return action.payload
    case 'set-page':
      return {
        ...state,
        page: action.payload,
      }
    case 'set-page-size':
      return {
        ...state,
        page: 1,
        pageSize: action.payload,
      }
    case 'set-search-input':
      return {
        ...state,
        searchInput: action.payload,
      }
    case 'apply-search': {
      const search = state.searchInput.trim()
      const nextSearch = search || undefined

      if (state.filters.search === nextSearch) {
        return state
      }

      return {
        ...state,
        page: 1,
        filters: {
          ...state.filters,
          search: nextSearch,
        },
      }
    }
    case 'set-filter':
      return {
        ...state,
        page: 1,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value === '' ? undefined : action.payload.value,
        },
      }
    case 'clear-filters':
      return {
        ...state,
        page: 1,
        searchInput: '',
        filters: {},
      }
    case 'toggle-sort': {
      const nextSort: TransactionSort =
        state.sort.field === action.payload
          ? {
              field: action.payload,
              direction: state.sort.direction === 'asc' ? 'desc' : 'asc',
            }
          : {
              field: action.payload,
              direction: action.payload === 'date' ? 'desc' : 'asc',
            }

      return {
        ...state,
        page: 1,
        sort: nextSort,
      }
    }
  }
}
