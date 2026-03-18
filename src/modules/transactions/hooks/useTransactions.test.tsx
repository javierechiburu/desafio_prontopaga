import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetTransactionsStore } from '../state/transactionsStore'
import { useTransactions } from './useTransactions'

describe('useTransactions', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
    resetTransactionsStore()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('hydrates the store from url params', async () => {
    window.history.replaceState(
      {},
      '',
      '/?page=2&pageSize=25&type=credit&status=pending&currency=USD&search=nomina',
    )

    const { result } = renderHook(() => useTransactions())

    await waitFor(() => {
      expect(result.current.page).toBe(2)
    })

    expect(result.current.pageSize).toBe(25)
    expect(result.current.filters).toEqual({
      type: 'credit',
      status: 'pending',
      currency: 'USD',
      search: 'nomina',
    })
    expect(result.current.searchInput).toBe('nomina')
  })

  it('applies the search filter after the debounce interval and syncs it to the url', async () => {
    vi.useFakeTimers()

    const { result } = renderHook(() => useTransactions())

    act(() => {
      result.current.setSearchInput('cliente')
    })

    expect(result.current.filters.search).toBeUndefined()

    act(() => {
      vi.advanceTimersByTime(299)
    })

    expect(result.current.filters.search).toBeUndefined()

    await act(async () => {
      vi.advanceTimersByTime(1)
      await Promise.resolve()
    })

    expect(result.current.filters.search).toBe('cliente')
    expect(window.location.search).toContain('search=cliente')
  })
})
