const SKELETON_ROWS = 10

export function TransactionsTableSkeleton() {
  return (
    <div className="table-shell" aria-hidden="true">
      <table className="transactions-table transactions-table--skeleton">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripcion</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Monto</th>
            <th>Cuenta origen</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <tr key={index}>
              {Array.from({ length: 6 }, (_, cellIndex) => (
                <td key={cellIndex}>
                  <span className="skeleton-block" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
