import {
  CURRENCIES,
  TRANSACTION_TYPES,
  type Currency,
  type Transaction,
  type TransactionStatus,
  type TransactionType,
} from '../domain/transaction'

const DESCRIPTION_PREFIXES = [
  'Pago proveedor',
  'Transferencia cliente',
  'Abono nomina',
  'Cobro suscripcion',
  'Reversion comercio',
  'Liquidacion tarjeta',
  'Retiro sucursal',
  'Inversion automatica',
  'Ajuste operacional',
  'Comision internacional',
] as const

const DESCRIPTION_SUFFIXES = [
  'Retail Andes',
  'Marketplace Sur',
  'Portal Empresas',
  'Mesa de Dinero',
  'Cuenta Premium',
  'Canal Web',
  'Cartera Digital',
  'Corredora Norte',
  'Operacion Express',
  'Servicio Custodia',
] as const

const ACCOUNT_PREFIXES = ['CL', 'US', 'EU', 'BK'] as const

function mulberry32(seed: number) {
  let state = seed

  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(20260318)

function pick<TValue>(values: readonly TValue[]) {
  return values[Math.floor(random() * values.length)]
}

function createAccount(index: number) {
  const prefix = ACCOUNT_PREFIXES[index % ACCOUNT_PREFIXES.length]
  const segments = Array.from({ length: 4 }, (_, segmentIndex) => {
    const base = 1000 + ((index + 1) * (segmentIndex + 7) * 37) % 9000
    return String(base).padStart(4, '0')
  })

  return `${prefix}${String((index % 89) + 10)} ${segments.join(' ')}`
}

function createAmount(currency: Currency, index: number) {
  switch (currency) {
    case 'USD':
      return Number((25 + random() * 6200 + index % 25).toFixed(2))
    case 'EUR':
      return Number((15 + random() * 5400 + index % 18).toFixed(2))
    case 'CLP':
      return Math.round(5000 + random() * 4_200_000 + (index % 12) * 1500)
    case 'BTC':
      return Number((0.00015 + random() * 1.35).toFixed(8))
  }
}

function createDescription(index: number, type: TransactionType, status: TransactionStatus) {
  const prefix = DESCRIPTION_PREFIXES[index % DESCRIPTION_PREFIXES.length]
  const suffix = DESCRIPTION_SUFFIXES[(index * 3) % DESCRIPTION_SUFFIXES.length]
  const typeLabel = type === 'credit' ? 'entrada' : 'salida'
  const statusLabel =
    status === 'completed' ? 'confirmada' : status === 'pending' ? 'en revision' : 'rechazada'

  return `${prefix} ${suffix} ${typeLabel} ${statusLabel}`
}

function createDate(index: number) {
  const now = new Date('2026-03-18T15:00:00.000Z').getTime()
  const offsetDays = index % 220
  const offsetHours = Math.floor(random() * 24)
  const offsetMinutes = Math.floor(random() * 60)
  const date = new Date(
    now - offsetDays * 24 * 60 * 60 * 1000 - offsetHours * 60 * 60 * 1000 - offsetMinutes * 60 * 1000,
  )

  return date.toISOString()
}

function createTransaction(index: number): Transaction {
  const type = pick(TRANSACTION_TYPES)
  const statusRoll = random()
  const status: TransactionStatus =
    statusRoll < 0.72 ? 'completed' : statusRoll < 0.9 ? 'pending' : 'failed'
  const currency = CURRENCIES[index % CURRENCIES.length]

  return {
    id: `txn-${String(index + 1).padStart(4, '0')}`,
    date: createDate(index),
    description: createDescription(index, type, status),
    type,
    status,
    amount: createAmount(currency, index),
    currency,
    accountOrigin: createAccount(index + 11),
    accountDestination: createAccount(index + 401),
  }
}

export const mockTransactions = Array.from({ length: 260 }, (_, index) => createTransaction(index))
