import { use } from 'react'
import type { TransactionsOverview as TransactionsOverviewModel } from '../domain/transaction'
import { formatTransactionAmount } from '../lib/formatters'

interface TransactionsOverviewProps {
  promise: Promise<TransactionsOverviewModel>
}

function renderAmount(amount: TransactionsOverviewModel['largestCredit']) {
  if (!amount) {
    return 'Sin datos'
  }

  return formatTransactionAmount(amount.amount, amount.currency)
}

export function TransactionsOverview({ promise }: TransactionsOverviewProps) {
  const overview = use(promise)

  return (
    <section className="grid gap-4 lg:grid-cols-3" aria-label="Resumen operativo">
      <article className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-soft">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-500/70">
          Mayor abono
        </span>
        <strong className="mt-3 block text-3xl font-black tracking-[-0.05em] text-success-500">
          {renderAmount(overview.largestCredit)}
        </strong>
        <small className="mt-2 block text-sm text-ink-500">{overview.total} movimientos visibles</small>
      </article>

      <article className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-soft">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-500/70">
          Mayor cargo
        </span>
        <strong className="mt-3 block text-3xl font-black tracking-[-0.05em] text-danger-500">
          {renderAmount(overview.largestDebit)}
        </strong>
        <small className="mt-2 block text-sm text-ink-500">Analitica operativa segun filtros activos</small>
      </article>

      <article className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-soft">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-500/70">
          Cuentas activas
        </span>
        <strong className="mt-3 block text-3xl font-black tracking-[-0.05em] text-ink-950">
          {overview.activeAccounts}
        </strong>
        <small className="mt-2 block text-sm text-ink-500">{overview.completionRate}% de cumplimiento</small>
      </article>
    </section>
  )
}
