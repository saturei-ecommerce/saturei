'use client'

import { Star, User } from 'lucide-react'

export function SellerInfo({
  name,
  rating,
}: {
  name: string
  rating?: number
}) {
  const safeRating =
    typeof rating === 'number' && Number.isFinite(rating) ? rating : undefined

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center border border-[var(--primary-100)]">
          <User size={18} className="text-[var(--primary)]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--muted)]">
            Vendedor(a)
          </p>
          <p className="text-base font-bold text-[var(--foreground)] truncate">
            {name}
          </p>

          {safeRating != null && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
              <Star size={14} className="text-[var(--secondary)]" />
              <span>{safeRating.toFixed(1)}</span>
              <span className="text-[var(--muted)] font-medium">/ 5</span>
            </div>
          )}

          {safeRating == null && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Avaliação indisponível
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
