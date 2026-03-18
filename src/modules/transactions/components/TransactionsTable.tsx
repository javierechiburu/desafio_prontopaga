import type { Transaction, TransactionSort } from '../domain/transaction'
import {
  formatTransactionAmount,
  formatTransactionDate,
  formatTransactionStatus,
  formatTransactionType,
} from '../lib/formatters'

interface TransactionsTableProps {
  transactions: Transaction[]
  sort: TransactionSort
  onSort: (field: TransactionSort['field']) => void
}

function SortButton({
  label,
  field,
  activeSort,
  onSort,
}: {
  label: string
  field: TransactionSort['field']
  activeSort: TransactionSort
  onSort: (field: TransactionSort['field']) => void
}) {
  const isActive = activeSort.field === field
  const directionIndicator = !isActive ? '<>' : activeSort.direction === 'asc' ? '^' : 'v'

  return (
    <button
      className={`sort-button${isActive ? ' sort-button--active' : ''}`}
      onClick={() => onSort(field)}
      type="button"
    >
      <span>{label}</span>
      <span aria-hidden="true">{directionIndicator}</span>
    </button>
  )
}

export function TransactionsTable({ transactions, sort, onSort }: TransactionsTableProps) {
  return (
    <div className="table-shell">
      <table className="transactions-table">
        <thead>
          <tr>
            <th scope="col" aria-sort={sort.field === 'date' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
              <SortButton label="Fecha" field="date" activeSort={sort} onSort={onSort} />
            </th>
            <th scope="col">Descripcion</th>
            <th scope="col">Tipo</th>
            <th scope="col">Estado</th>
            <th scope="col" aria-sort={sort.field === 'amount' ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
              <SortButton label="Monto" field="amount" activeSort={sort} onSort={onSort} />
            </th>
            <th scope="col">Cuenta origen</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className={transaction.status === 'failed' ? 'transaction-row transaction-row--failed' : 'transaction-row'}
            >
              <td>{formatTransactionDate(transaction.date)}</td>
              <td>
                <div className="description-cell">
                  <strong>{transaction.description}</strong>
                  <span className="transaction-id">{transaction.id}</span>
                </div>
              </td>
              <td>{formatTransactionType(transaction.type)}</td>
              <td>
                <span className={`status-pill status-pill--${transaction.status}`}>
                  {formatTransactionStatus(transaction.status)}
                </span>
              </td>
              <td className={transaction.type === 'debit' ? 'amount amount--debit' : 'amount amount--credit'}>
                {formatTransactionAmount(transaction.amount, transaction.currency)}
              </td>
              <td>
                <span
                  className="account-tooltip"
                  data-tooltip={`Destino: ${transaction.accountDestination}`}
                  tabIndex={0}
                >
                  {transaction.accountOrigin}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
