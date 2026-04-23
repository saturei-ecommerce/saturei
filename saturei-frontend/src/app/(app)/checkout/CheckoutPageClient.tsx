'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  CheckoutForm,
  type CheckoutValues,
} from '@/components/checkout/CheckoutForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { useCartStore } from '@/stores/cart'

export function CheckoutPageClient() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const [placeError, setPlaceError] = useState<string | null>(null)

  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)

  useEffect(() => setMounted(true), [])

  const isEmpty = useMemo(() => items.length === 0, [items.length])

  async function placeOrder(_values: CheckoutValues) {
    setPlaceError(null)

    if (items.length === 0) {
      setPlaceError('Seu carrinho está vazio.')
      return
    }

    setIsPlacing(true)
    try {
      await new Promise((r) => setTimeout(r, 900))
      clear()
      router.push('/checkout/success')
    } catch {
      setPlaceError('Não foi possível finalizar o pedido. Tente novamente.')
    } finally {
      setIsPlacing(false)
    }
  }

  if (!mounted) {
    return (
      <div className="flex-1 bg-[var(--background)]">
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6">
              <div className="skeleton h-6 w-44 rounded-lg" />
              <div className="skeleton h-4 w-72 rounded-lg mt-3" />
              <div className="skeleton h-12 w-full rounded-xl mt-8" />
              <div className="skeleton h-12 w-full rounded-xl mt-4" />
              <div className="skeleton h-12 w-full rounded-xl mt-4" />
            </div>
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6">
              <div className="skeleton h-6 w-40 rounded-lg" />
              <div className="skeleton h-24 w-full rounded-2xl mt-6" />
              <div className="skeleton h-24 w-full rounded-2xl mt-4" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[var(--background)]">
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              Checkout
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Informe seus dados e finalize o pedido.
            </p>
          </div>

          <Link
            href="/cart"
            className="
              inline-flex items-center gap-2
              h-10 px-4 rounded-xl text-sm font-semibold
              border-2 border-[var(--border)] bg-white
              text-[var(--foreground)]
              hover:border-[var(--primary)] hover:text-[var(--primary)]
              transition-colors
            "
          >
            <ShoppingBag size={16} />
            Ver carrinho
          </Link>
        </header>

        {placeError && (
          <div className="mb-6 bg-white rounded-2xl border border-red-200 shadow-sm p-4 text-sm text-red-700">
            {placeError}
          </div>
        )}

        {isEmpty ? (
          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-10 text-center">
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Seu carrinho está vazio
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Adicione itens antes de finalizar o pedido.
            </p>
            <Link
              href="/search"
              className="
                inline-flex items-center justify-center
                mt-6 h-11 px-5 rounded-xl font-semibold
                bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]
                transition-colors
              "
            >
              Ir para pesquisa
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <section className="lg:col-span-7">
              <CheckoutForm onPlaceOrder={placeOrder} isPlacing={isPlacing} />
            </section>
            <aside className="lg:col-span-5">
              <OrderSummary />
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
