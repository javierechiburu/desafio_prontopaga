import type { Currency, TransactionStatus, TransactionType } from '../domain/transaction'

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const eurFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const btcFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 8,
  maximumFractionDigits: 8,
})

const dateFormatter = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatTransactionAmount(amount: number, currency: Currency) {
  switch (currency) {
    case 'USD':
      return usdFormatter.format(amount)
    case 'EUR':
      return eurFormatter.format(amount)
    case 'CLP':
      return clpFormatter.format(amount)
    case 'BTC':
      return `₿${btcFormatter.format(amount)}`
  }
}

export function formatTransactionDate(date: string) {
  return dateFormatter.format(new Date(date))
}

export function formatTransactionType(type: TransactionType) {
  return type === 'credit' ? 'Credito' : 'Debito'
}

export function formatTransactionStatus(status: TransactionStatus) {
  switch (status) {
    case 'completed':
      return 'Completado'
    case 'pending':
      return 'Pendiente'
    case 'failed':
      return 'Fallido'
  }
}
