export default function ListingLoading() {
  return (
    <div className="flex-1 bg-[var(--background)]">
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
              <div className="aspect-[4/3] skeleton" />
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-3 mt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square skeleton rounded-xl" />
              ))}
            </div>
          </section>

          <aside className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col gap-3">
              <div className="skeleton h-7 w-4/5 rounded-lg" />
              <div className="skeleton h-5 w-2/5 rounded-lg" />
              <div className="skeleton h-10 w-1/2 rounded-lg mt-2" />
              <div className="skeleton h-4 w-full rounded-lg mt-4" />
              <div className="skeleton h-4 w-11/12 rounded-lg" />
              <div className="skeleton h-4 w-10/12 rounded-lg" />
            </div>

            <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-5 flex flex-col gap-3">
              <div className="skeleton h-12 w-full rounded-xl" />
              <div className="skeleton h-12 w-full rounded-xl" />
            </div>

            <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-24 rounded-lg" />
                  <div className="skeleton h-5 w-40 rounded-lg mt-2" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
