export function TransactionsFiltersSkeleton() {
  return (
    <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-soft" aria-hidden="true">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-60 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-2 h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  )
}
