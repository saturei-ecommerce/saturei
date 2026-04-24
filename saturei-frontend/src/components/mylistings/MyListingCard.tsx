'use client'

import Image from 'next/image'
import { Pause, Play, Tag, Trash2 } from 'lucide-react'
import type { Listing, ListingStatus } from '@/http/mylistings/my-listings'
import { getImageUrl } from '@/lib/utils'
import { formatBRL } from '@/lib/formatters/currency'

interface MyListingCardProps {
  listing: Listing
  onDelete: (id: string) => Promise<void>
  onToggleStatus: (id: string, currentStatus: ListingStatus) => Promise<void>
}

const STATUS_LABEL: Record<ListingStatus, string> = {
  ACTIVE: 'ativo',
  PAUSED: 'pausado',
  SOLD: 'vendido',
}

const STATUS_CLASS: Record<ListingStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  SOLD: 'bg-gray-100 text-gray-500',
}

export function MyListingCard({
  listing,
  onDelete,
  onToggleStatus,
}: MyListingCardProps) {
  const { id, title, price, status, imageUrls, category } = listing
  const thumb = imageUrls?.[0]
  const isSold = status === 'SOLD'

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-border shadow-sm p-3">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-muted">
        {thumb ? (
          <Image
            src={getImageUrl(thumb)}
            alt={title}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-2xl opacity-25">
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-sm font-bold text-primary">
            {formatBRL(price)}
          </span>
          {category && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Tag size={11} />
              {category}
            </span>
          )}
        </div>
        <span
          className={`mt-1 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CLASS[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      {/* Actions */}
      {!isSold && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToggleStatus(id, status)}
            aria-label={status === 'ACTIVE' ? 'Pausar anúncio' : 'Ativar anúncio'}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            {status === 'ACTIVE' ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            onClick={() => onDelete(id)}
            aria-label="Excluir anúncio"
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
