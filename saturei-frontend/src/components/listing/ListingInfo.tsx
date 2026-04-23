'use client'

import type { ListingResponse } from '@/lib/api/listings'
import { MapPin, ShieldCheck, Tag } from 'lucide-react'

export function ListingInfo({ listing }: { listing: ListingResponse }) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(listing.price)

  const conditionLabel = listing.conservationState === 'NEW' ? 'Novo' : 'Usado'

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          {listing.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className={`
              inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${
                listing.conservationState === 'NEW'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }
            `}
          >
            <ShieldCheck size={14} className="mr-1" />
            {conditionLabel}
          </span>

          {listing.category && (
            <span className="inline-flex items-center gap-1 text-[var(--primary)] font-semibold text-xs">
              <Tag size={13} />
              {listing.category}
            </span>
          )}

          {listing.location && (
            <span className="inline-flex items-center gap-1 text-[var(--muted)] font-medium text-xs">
              <MapPin size={13} />
              {listing.location}
            </span>
          )}
        </div>
      </div>

      <div className="text-[var(--primary)] font-extrabold text-3xl tracking-tight">
        {formattedPrice}
      </div>

      {listing.description && (
        <div className="pt-2">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-2">
            Descrição
          </h2>
          <p className="text-sm leading-7 text-[var(--muted)] whitespace-pre-wrap">
            {listing.description}
          </p>
        </div>
      )}
    </div>
  )
}
