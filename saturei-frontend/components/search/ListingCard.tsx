"use client";

import type { ListingResponse } from "@/lib/api/listings";
import { MapPin, Tag, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Skeleton ─────────────────────────────────────────────────

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm">
      {/* Image */}
      <div className="skeleton h-52 w-full" />
      {/* Body */}
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
  );
}

// ─── Card ─────────────────────────────────────────────────────

interface ListingCardProps {
  listing: ListingResponse;
}

export function ListingCard({ listing }: ListingCardProps) {
  const {
    id,
    title,
    price,
    category,
    location,
    imageUrls,
    conservationState,
    sellerName,
    createdAt,
  } = listing;

  const hasImage = imageUrls && imageUrls.length > 0;
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  const timeAgo = formatTimeAgo(createdAt);

  return (
    <Link
      href={`/listings/${id}`}
      id={`listing-card-${id}`}
      className="
        group block bg-white rounded-2xl overflow-hidden
        border border-[var(--border)]
        shadow-sm card-hover
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]
      "
    >
      {/* Image section */}
      <div className="relative h-52 bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] overflow-hidden">
        {hasImage ? (
          <Image
            src={imageUrls[0]}
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
              ${conservationState === "NEW"
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-amber-100 text-amber-700 border border-amber-200"
              }
            `}
          >
            {conservationState === "NEW" ? "Novo" : "Usado"}
          </span>
        </div>

        {/* Image count badge */}
        {imageUrls && imageUrls.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] rounded-lg px-2 py-1 font-medium">
            +{imageUrls.length - 1} fotos
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-2">
        {/* Category */}
        {category && (
          <div className="flex items-center gap-1.5 text-[var(--primary)] text-xs font-semibold">
            <Tag size={12} strokeWidth={2.5} />
            <span>{category}</span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-[var(--foreground)] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-150">
          {title}
        </h2>

        {/* Price */}
        <div className="text-[var(--primary)] font-bold text-xl tracking-tight mt-0.5">
          {formattedPrice}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[var(--muted)] text-[11px]">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} strokeWidth={2} />
              {location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <User size={11} strokeWidth={2} />
            {sellerName}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={11} strokeWidth={2} />
            {timeAgo}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Helpers ──────────────────────────────────────────────────

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `${minutes}min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
