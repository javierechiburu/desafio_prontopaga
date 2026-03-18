import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTransactions } from './useTransactions'

const { fetchTransactionsMock, getTransactionsForExportMock } = vi.hoisted(() => ({
  fetchTransactionsMock: vi.fn(),
  getTransactionsForExportMock: vi.fn(),
}))

vi.mock('../data/transactionsServer', () => ({
  fetchTransactions: fetchTransactionsMock,
  getTransactionsForExport: getTransactionsForExportMock,
}))

describe('useTransactions', () => {
  beforeEach(() => {
    fetchTransactionsMock.mockReset()
    getTransactionsForExportMock.mockReset()
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('hydrates filters from the url before fetching', async () => {
    fetchTransactionsMock.mockResolvedValue({
      data: [],
      total: 0,
      page: 2,
      pageSize: 25,
      totalPages: 1,
    })

    window.history.replaceState(
      {},
      '',
      '/?page=2&pageSize=25&type=credit&status=pending&currency=USD&search=nomina',
    )

    const { result } = renderHook(() => useTransactions())

    await waitFor(() => {
      expect(fetchTransactionsMock).toHaveBeenCalledTimes(1)
    })

    expect(fetchTransactionsMock).toHaveBeenCalledWith({
      page: 2,
      pageSize: 25,
      filters: {
        type: 'credit',
        status: 'pending',
        currency: 'USD',
        search: 'nomina',
      },
      sort: {
        field: 'date',
        direction: 'desc',
      },
    })

    expect(result.current.filters.search).toBe('nomina')
    expect(result.current.searchInput).toBe('nomina')
  })

  it('applies the search filter after the debounce interval', async () => {
    vi.useFakeTimers()

    fetchTransactionsMock.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    })

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await Promise.resolve()
    })

    expect(fetchTransactionsMock).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.setSearchInput('cliente')
    })

    expect(result.current.filters.search).toBeUndefined()

    act(() => {
      vi.advanceTimersByTime(299)
    })

    expect(fetchTransactionsMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(1)
      await Promise.resolve()
    })

    expect(fetchTransactionsMock).toHaveBeenCalledTimes(2)

    expect(fetchTransactionsMock).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 10,
      filters: {
        search: 'cliente',
      },
      sort: {
        field: 'date',
        direction: 'desc',
      },
    })

    expect(result.current.filters.search).toBe('cliente')
    expect(window.location.search).toContain('search=cliente')
  })
})
