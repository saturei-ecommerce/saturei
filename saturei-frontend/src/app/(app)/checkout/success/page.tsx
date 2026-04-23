import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pedido confirmado',
  description: 'Seu pedido foi realizado com sucesso.',
}

export default function CheckoutSuccessPage() {
  return (
    <div className="flex-1 bg-[var(--background)]">
      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 mx-auto flex items-center justify-center border border-emerald-100">
            <CheckCircle2 size={28} className="text-emerald-600" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-[var(--foreground)]">
            Pedido confirmado
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] leading-7">
            Seu pedido foi finalizado com sucesso. Em breve você receberá as
            próximas atualizações.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/search"
              className="
                inline-flex items-center justify-center
                h-12 px-6 rounded-xl font-semibold
                bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]
                transition-colors
              "
            >
              Continuar comprando
            </Link>
            <Link
              href="/cart"
              className="
                inline-flex items-center justify-center
                h-12 px-6 rounded-xl font-semibold
                border-2 border-[var(--border)] bg-white
                text-[var(--foreground)]
                hover:border-[var(--primary)] hover:text-[var(--primary)]
                transition-colors
              "
            >
              Voltar ao carrinho
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
