'use client'

import type { ListingResponse } from '@/lib/api/listings'
import { ListingGallery } from '@/components/listing/ListingGallery'
import { ListingInfo } from '@/components/listing/ListingInfo'
import { SellerInfo } from '@/components/listing/SellerInfo'
import { useCartStore } from '@/stores/cart'
import { getImageUrl } from '@/lib/utils'

export function ListingPageClient({ listing }: { listing: ListingResponse }) {
  const addItem = useCartStore((s) => s.addItem)
  const quantityInCart = useCartStore(
    (s) => s.items.find((it) => it.id === listing.id)?.quantity ?? 0,
  )

  return (
    <div className="flex-1 bg-[var(--background)]">
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-7">
            <ListingGallery
              title={listing.title}
              imageUrls={listing.imageUrls ?? []}
            />
          </section>

          <aside className="lg:col-span-5 flex flex-col gap-6">
            <ListingInfo listing={listing} />

            <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  addItem(
                    {
                      id: listing.id,
                      title: listing.title,
                      price: listing.price,
                      image: getImageUrl(listing.imageUrls?.[0]),
                    },
                    1,
                  )
                }
                className="
                  h-12 rounded-xl font-semibold transition-colors
                  bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]
                "
              >
                {quantityInCart > 0
                  ? `Adicionar mais (no carrinho: ${quantityInCart})`
                  : 'Adicionar ao carrinho'}
              </button>

              <button
                type="button"
                onClick={() => {
                  window.alert('Placeholder: iniciar conversa com o vendedor.')
                }}
                className="
                  h-12 rounded-xl font-semibold
                  border-2 border-[var(--border)] bg-white
                  text-[var(--foreground)]
                  hover:border-[var(--primary)] hover:text-[var(--primary)]
                  transition-colors
                "
              >
                Contatar vendedor
              </button>
            </div>

            <SellerInfo
              name={listing.sellerName}
              rating={listing.sellerRating}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
