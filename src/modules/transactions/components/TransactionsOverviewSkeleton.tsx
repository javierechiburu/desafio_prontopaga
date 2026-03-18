export function TransactionsOverviewSkeleton() {
  return (
    <section className="grid gap-4 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <article key={index} className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-soft">
          <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-9 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-3 h-4 w-28 animate-pulse rounded-full bg-slate-200" />
        </article>
      ))}
    </section>
  )
}
