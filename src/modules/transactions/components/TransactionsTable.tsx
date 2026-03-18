import type { Transaction, TransactionSort } from "../domain/transaction";
import {
  formatTransactionAmount,
  formatTransactionDate,
  formatTransactionStatus,
  formatTransactionType,
} from "../lib/formatters";

interface TransactionsTableProps {
  transactions: Transaction[];
  sort: TransactionSort;
  onSort: (field: TransactionSort["field"]) => void;
}

function SortButton({
  field,
  label,
  sort,
  onSort,
}: {
  field: TransactionSort["field"];
  label: string;
  sort: TransactionSort;
  onSort: (field: TransactionSort["field"]) => void;
}) {
  const isActive = sort.field === field;
  const indicator = !isActive
    ? "--"
    : sort.direction === "asc"
      ? "ASC"
      : "DESC";

  return (
    <button
      className={`inline-flex items-center gap-2 transition ${
        isActive ? "text-brand-700" : "text-slate-500 hover:text-ink-950"
      }`}
      onClick={() => onSort(field)}
      type="button"
    >
      <span>{label}</span>
      <small className="text-[10px] font-extrabold tracking-[0.18em]">
        {indicator}
      </small>
    </button>
  );
}

function TransactionGlyph({ type }: { type: Transaction["type"] }) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-black ${
        type === "credit"
          ? "bg-emerald-50 text-success-500"
          : "bg-rose-50 text-danger-500"
      }`}
    >
      {type === "credit" ? "C" : "D"}
    </span>
  );
}

export function TransactionsTable({
  transactions,
  sort,
  onSort,
}: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-230 w-full border-separate border-spacing-0">
        <thead className="text-left">
          <tr>
            <th
              className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink-500"
              aria-sort={
                sort.field === "date"
                  ? sort.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <SortButton
                field="date"
                label="Fecha y hora"
                sort={sort}
                onSort={onSort}
              />
            </th>
            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink-500">
              Descripcion
            </th>
            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink-500">
              Tipo
            </th>
            <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink-500">
              Estado
            </th>
            <th
              className="px-6 py-4 text-right text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink-500"
              aria-sort={
                sort.field === "amount"
                  ? sort.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <SortButton
                field="amount"
                label="Monto"
                sort={sort}
                onSort={onSort}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className={`transition hover:bg-slate-50/80 ${
                transaction.status === "failed"
                  ? "bg-rose-50/55"
                  : "bg-transparent"
              }`}
            >
              <td className="border-t border-slate-100 px-6 py-5 align-top">
                <strong className="block text-sm font-bold text-ink-950">
                  {formatTransactionDate(transaction.date)}
                </strong>
                <small className="mt-1 block text-xs text-ink-500">
                  {transaction.accountOrigin}
                </small>
              </td>
              <td className="border-t border-slate-100 px-6 py-5 align-top">
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <TransactionGlyph type={transaction.type} />
                  <div>
                    <strong className="block text-sm font-bold text-ink-950">
                      {transaction.description}
                    </strong>
                    <span
                      className="mt-1 block text-xs text-ink-500"
                      title={transaction.accountDestination}
                    >
                      Destino: {transaction.accountDestination}
                    </span>
                  </div>
                </div>
              </td>
              <td className="border-t border-slate-100 px-6 py-5 align-top">
                <span
                  className={`inline-flex min-h-8 items-center rounded-full px-3 text-[11px] font-extrabold uppercase tracking-[0.14em] ${
                    transaction.type === "credit"
                      ? "bg-emerald-50 text-success-500"
                      : "bg-rose-50 text-danger-500"
                  }`}
                >
                  {formatTransactionType(transaction.type)}
                </span>
              </td>
              <td className="border-t border-slate-100 px-6 py-5 align-top">
                <span
                  className={`inline-flex min-h-8 items-center rounded-full px-3 text-[11px] font-bold ${
                    transaction.status === "completed"
                      ? "bg-emerald-50 text-success-500"
                      : transaction.status === "pending"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-rose-50 text-danger-500"
                  }`}
                >
                  {formatTransactionStatus(transaction.status)}
                </span>
              </td>
              <td
                className={`border-t border-slate-100 px-6 py-5 text-right align-top text-sm font-black tracking-[-0.02em] ${
                  transaction.type === "credit"
                    ? "text-success-500"
                    : "text-danger-500"
                }`}
              >
                {formatTransactionAmount(
                  transaction.amount,
                  transaction.currency,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
