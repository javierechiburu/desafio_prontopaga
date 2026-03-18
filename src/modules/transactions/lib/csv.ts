import type { Transaction } from '../domain/transaction'
import { formatTransactionStatus, formatTransactionType } from './formatters'

const CSV_HEADERS = [
  'ID',
  'Fecha',
  'Descripcion',
  'Tipo',
  'Estado',
  'Monto',
  'Moneda',
  'Cuenta origen',
  'Cuenta destino',
] as const

function escapeCsvValue(value: string | number) {
  const sanitized = String(value).replaceAll('"', '""')
  return `"${sanitized}"`
}

export function buildTransactionsCsv(transactions: Transaction[]) {
  const rows = transactions.map((transaction) =>
    [
      transaction.id,
      transaction.date,
      transaction.description,
      formatTransactionType(transaction.type),
      formatTransactionStatus(transaction.status),
      transaction.amount,
      transaction.currency,
      transaction.accountOrigin,
      transaction.accountDestination,
    ]
      .map((value) => escapeCsvValue(value))
      .join(','),
  )

  return [CSV_HEADERS.join(','), ...rows].join('\n')
}

export function downloadCsvFile(content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const currentDate = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `movimientos-${currentDate}.csv`
  link.click()

  URL.revokeObjectURL(url)
}
