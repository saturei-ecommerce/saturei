'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

export function ListingGallery({
  title,
  imageUrls,
}: {
  title: string
  imageUrls: string[]
}) {
  const images = useMemo(
    () => (Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : []),
    [imageUrls],
  )
  const [active, setActive] = useState(0)

  const activeUrl = images[active]

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)]">
          {activeUrl ? (
            <Image
              src={activeUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-6xl opacity-25 select-none">📷</span>
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-3">
          {images.map((url, idx) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Ver imagem ${idx + 1}`}
              className={`
                relative aspect-square rounded-xl overflow-hidden border-2 transition-colors
                ${
                  idx === active
                    ? 'border-[var(--primary)]'
                    : 'border-[var(--border)] hover:border-[var(--primary-light)]'
                }
              `}
            >
              <Image
                src={url}
                alt={`${title} — miniatura ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
