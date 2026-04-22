'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { formatBRL } from '@/lib/formatters/currency'
import { useCartStore } from '@/stores/cart'

export function OrderSummary() {
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice)

  const total = useMemo(() => totalPrice(), [totalPrice, items])

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6">
      <h2 className="text-lg font-extrabold text-[var(--foreground)]">
        Resumo do pedido
      </h2>

      <div className="mt-5 flex flex-col gap-4">
        {items.map((it) => (
          <div key={it.id} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[var(--muted-bg)] border border-[var(--border)] shrink-0">
              {it.image ? (
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-2xl opacity-25 select-none">📦</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/listing/${it.id}`}
                className="text-sm font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors line-clamp-2"
              >
                {it.title}
              </Link>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="text-xs text-[var(--muted)] font-semibold">
                  {it.quantity}×
                </span>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {formatBRL(it.price * it.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--muted)]">Total</span>
        <span className="text-xl font-extrabold text-[var(--foreground)]">
          {formatBRL(total)}
        </span>
      </div>
    </div>
  )
}
