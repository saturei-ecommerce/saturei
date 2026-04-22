'use client'

export default function ListingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex-1 bg-[var(--background)]">
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-8">
          <h1 className="text-xl font-extrabold text-[var(--foreground)]">
            Não foi possível carregar o anúncio
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] leading-7">
            Tente novamente em alguns instantes. Se o problema persistir, volte
            mais tarde.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="
                h-12 px-5 rounded-xl font-semibold
                bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]
                transition-colors
              "
            >
              Tentar novamente
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                h-12 px-5 rounded-xl font-semibold
                border-2 border-[var(--border)] bg-white
                text-[var(--foreground)]
                hover:border-[var(--primary)] hover:text-[var(--primary)]
                transition-colors
              "
            >
              Voltar
            </button>
          </div>

          <details className="mt-6 text-xs text-[var(--muted)]">
            <summary className="cursor-pointer select-none">
              Detalhes técnicos
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </details>
        </div>
      </main>
    </div>
  )
}
