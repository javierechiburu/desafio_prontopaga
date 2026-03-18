interface TransactionsTableSkeletonProps {
  rowCount?: number;
}

export function TransactionsTableSkeleton({
  rowCount = 5,
}: TransactionsTableSkeletonProps) {
  return (
    <section
      className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-soft"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mt-6 space-y-4">
        {Array.from({ length: rowCount }, (_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-4">
            <div className="h-4 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 animate-pulse rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
