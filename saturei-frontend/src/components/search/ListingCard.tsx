'use client'

import { Clock, MapPin, MessageCircle, Tag, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ListingResponse } from '@/http/search/search-listings'
import { getImageUrl } from '@/lib/utils'

// Skeleton

export function ListingCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 flex flex-col gap-3">
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-5 w-4/5 rounded-lg" />
        <div className="skeleton h-5 w-3/5 rounded-lg" />
        <div className="skeleton h-7 w-2/5 rounded-lg" />
        <div className="flex gap-2 mt-1">
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton h-4 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

//Cards

interface ListingCardProps {
  listing: ListingResponse
}

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter()
  const {
    id,
    sellerId,
    title,
    price,
    category,
    location,
    imageUrls,
    conservationState,
    sellerName,
    createdAt,
  } = listing

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const params = new URLSearchParams({
      listingId: id,
      sellerId: sellerId ?? '',
      sellerName: sellerName,
      listingTitle: title,
    })
    router.push(`/chat?${params.toString()}`)
  }

  const hasImage = imageUrls && imageUrls.length > 0
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)

  const timeAgo = formatTimeAgo(createdAt)

  return (
    <Link
      href={`/listing/${id}`}
      id={`listing-card-${id}`}
      className="
        group flex flex-col h-full bg-card rounded-2xl overflow-hidden
        border border-border
        shadow-sm card-hover
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      "
    >
      {/* Image section */}
      <div className="relative h-52 shrink-0 bg-muted overflow-hidden">
        {hasImage ? (
          <Image
            src={getImageUrl(imageUrls[0])}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-5xl opacity-25 select-none">📦</span>
          </div>
        )}

        {/* Conservation badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`
              inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase
              ${
                conservationState === 'NEW'
                  ? 'bg-secondary text-secondary-foreground border border-secondary'
                  : 'bg-accent text-accent-foreground border border-accent'
              }
            `}
          >
            {conservationState === 'NEW' ? 'Novo' : 'Usado'}
          </span>
        </div>

        {/* Image count badge */}
        {imageUrls && imageUrls.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-foreground/50 backdrop-blur-sm text-background text-[11px] rounded-lg px-2 py-1 font-medium">
            +{imageUrls.length - 1} fotos
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        {category && (
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
            <Tag size={12} strokeWidth={2.5} />
            <span>{category}</span>
          </div>
        )}

        <h2 className="text-foreground font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-150">
          {title}
        </h2>

        <div className="text-primary font-bold text-xl tracking-tight mt-0.5">
          {formattedPrice}
        </div>

        <div className="flex items-center gap-2 mt-auto pt-2 text-muted-foreground text-[11px] overflow-hidden">
          {location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin size={11} strokeWidth={2} className="shrink-0" />
              <span className="truncate">{location}</span>
            </span>
          )}
          <span className="flex items-center gap-1 truncate">
            <User size={11} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{sellerName}</span>
          </span>
          <span className="flex items-center gap-1 ml-auto shrink-0">
            <Clock size={11} strokeWidth={2} className="shrink-0" />
            {timeAgo}
          </span>
        </div>

        <button
          id={`chat-btn-${id}`}
          type="button"
          onClick={handleChatClick}
          className="
            mt-3 w-full flex items-center justify-center gap-2
            px-3 py-2 rounded-xl text-xs font-semibold
            border border-primary/30 text-primary bg-primary/5
            hover:bg-primary hover:text-primary-foreground hover:border-primary
            active:scale-95 transition-all duration-150
          "
        >
          <MessageCircle size={13} strokeWidth={2.5} />
          Contatar Vendedor
        </button>
      </div>
    </Link>
  )
}

// Helpers

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return 'agora mesmo'
  if (minutes < 60) return `${minutes}min atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days < 7) return `${days}d atrás`
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}
