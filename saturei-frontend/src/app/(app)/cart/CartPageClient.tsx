'use client'

import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { formatBRL } from '@/lib/formatters/currency'
import { useCartStore } from '@/stores/cart'

export function CartPageClient() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const clear = useCartStore((s) => s.clear)
  const totalPrice = useCartStore((s) => s.totalPrice)

  useEffect(() => {
    setMounted(true)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: no problem
  const formattedTotal = useMemo(
    () => formatBRL(totalPrice()),
    [totalPrice, items],
  )

  if (!mounted) {
    return (
      <div className="flex-1 bg-[var(--background)]">
        <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-8">
            <div className="skeleton h-6 w-40 rounded-lg" />
            <div className="skeleton h-4 w-72 rounded-lg mt-3" />
            <div className="skeleton h-24 w-full rounded-2xl mt-8" />
            <div className="skeleton h-24 w-full rounded-2xl mt-4" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[var(--background)]">
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              Carrinho
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              {items.length === 1
                ? '1 item no seu carrinho'
                : `${items.length} itens no seu carrinho`}
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="
                h-10 px-4 rounded-xl text-sm font-semibold
                border-2 border-[var(--border)] bg-white
                text-[var(--foreground)]
                hover:border-[var(--primary)] hover:text-[var(--primary)]
                transition-colors
              "
            >
              Limpar
            </button>
          )}
        </header>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary-50)] mx-auto flex items-center justify-center border border-[var(--primary-100)]">
              <ShoppingCart size={22} className="text-[var(--primary)]" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[var(--foreground)]">
              Seu carrinho está vazio
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Adicione itens a partir da página de um anúncio.
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
          <div className="flex flex-col gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-4 sm:p-5 flex gap-4"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[var(--muted-bg)] border border-[var(--border)] shrink-0">
                  {it.image ? (
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-3xl opacity-25 select-none">
                        📦
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/listing/${it.id}`}
                        className="font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors line-clamp-2"
                      >
                        {it.title}
                      </Link>
                      <p className="mt-1 text-sm font-semibold text-[var(--primary)]">
                        {formatBRL(it.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      aria-label="Remover item"
                      className="
                        p-2 rounded-xl
                        text-[var(--muted)] hover:text-red-600
                        hover:bg-red-50
                        transition-colors
                      "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <QuantityControl
                      value={it.quantity}
                      onDec={() => setQuantity(it.id, it.quantity - 1)}
                      onInc={() => setQuantity(it.id, it.quantity + 1)}
                      onSet={(q) => setQuantity(it.id, q)}
                    />

                    <p className="text-sm font-bold text-[var(--foreground)]">
                      {formatBRL(it.price * it.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--muted)]">
                Total
              </span>
              <span className="text-xl font-extrabold text-[var(--foreground)]">
                {formattedTotal}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function QuantityControl({
  value,
  onDec,
  onInc,
  onSet,
}: {
  value: number
  onDec: () => void
  onInc: () => void
  onSet: (q: number) => void
}) {
  return (
    <div className="inline-flex items-center rounded-xl border border-[var(--border)] overflow-hidden bg-white">
      <button
        type="button"
        onClick={onDec}
        disabled={value <= 1}
        className="
          w-10 h-10 flex items-center justify-center
          text-[var(--foreground)]
          hover:bg-[var(--primary-50)] hover:text-[var(--primary)]
          disabled:text-[var(--border)] disabled:hover:bg-white
          transition-colors
        "
        aria-label="Diminuir quantidade"
      >
        <Minus size={16} />
      </button>

      <input
        value={String(value)}
        inputMode="numeric"
        className="
          w-12 h-10 text-center text-sm font-bold
          text-[var(--foreground)]
          outline-none border-x border-[var(--border)]
        "
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n)) onSet(n)
        }}
        onBlur={(e) => {
          const n = Math.max(1, Math.floor(Number(e.target.value)))
          onSet(n)
        }}
        aria-label="Quantidade"
      />

      <button
        type="button"
        onClick={onInc}
        className="
          w-10 h-10 flex items-center justify-center
          text-[var(--foreground)]
          hover:bg-[var(--primary-50)] hover:text-[var(--primary)]
          transition-colors
        "
        aria-label="Aumentar quantidade"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
