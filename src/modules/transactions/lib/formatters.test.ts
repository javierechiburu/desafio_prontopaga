import { describe, expect, it } from 'vitest'
import { formatTransactionAmount } from './formatters'

describe('formatTransactionAmount', () => {
  it('formats fiat currencies using the expected presentation', () => {
    expect(formatTransactionAmount(1234.56, 'USD')).toBe('$1,234.56')
    expect(formatTransactionAmount(1234.56, 'EUR')).toBe('€1,234.56')
    expect(formatTransactionAmount(1234, 'CLP')).toBe('$1.234')
  })

  it('formats btc with eight decimals', () => {
    expect(formatTransactionAmount(0.00123456, 'BTC')).toBe('₿0.00123456')
  })
})
