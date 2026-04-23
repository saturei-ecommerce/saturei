'use client'

import { FlaskConical, PackageSearch } from 'lucide-react'
import type { ListingResponse, PageResponse } from '@/lib/api/listings'
import { ListingCard, ListingCardSkeleton } from './ListingCard'

// ─── Mock data for demo / testing ─────────────────────────────

const MOCK_LISTINGS: ListingResponse[] = [
  {
    id: 'mock-1',
    sellerId: 'seller-mock-1',
    sellerName: 'Carlos Mendes',
    title: 'MacBook Pro M3 14" — Como novo',
    description:
      'Comprado há 6 meses, pouco uso. Acompanha carregador original e caixa.',
    price: 12500,
    conservationState: 'USED',
    status: 'ACTIVE',
    imageUrls: [],
    category: 'Informática',
    location: 'São Paulo, SP',
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: 'mock-2',
    sellerId: 'seller-mock-2',
    sellerName: 'Ana Paula',
    title: 'Mesa de Escritório Industrial Pé de Ferro',
    description: 'Mesa robusta 1,60m, tampo amadeirado. Retirada no local.',
    price: 450,
    conservationState: 'USED',
    status: 'ACTIVE',
    imageUrls: [],
    category: 'Móveis',
    location: 'Campinas, SP',
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  },
  {
    id: 'mock-3',
    sellerId: 'seller-mock-3',
    sellerName: 'Rafael Lima',
    title: 'iPhone 15 Pro 256GB Titâneo Natural',
    description: 'Lacrado na caixa, nota fiscal. Garantia Apple até dez/2025.',
    price: 6800,
    conservationState: 'NEW',
    status: 'ACTIVE',
    imageUrls: [],
    category: 'Celulares',
    location: 'Rio de Janeiro, RJ',
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
]

// ─── Client-side filter for mocks ─────────────────────────────

interface MockFilters {
  keyword?: string
  category?: string
  location?: string
  minPrice?: number
  maxPrice?: number
}

function filterMocks(filters: MockFilters): ListingResponse[] {
  const kw = filters.keyword?.toLowerCase().trim()
  return MOCK_LISTINGS.filter((l) => {
    if (kw) {
      const haystack = [
        l.title,
        l.description,
        l.category,
        l.location,
        l.sellerName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(kw)) return false
    }
    if (
      filters.category &&
      l.category?.toLowerCase() !== filters.category.toLowerCase()
    )
      return false
    if (
      filters.location &&
      !l.location?.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false
    if (filters.minPrice != null && l.price < filters.minPrice) return false
    if (filters.maxPrice != null && l.price > filters.maxPrice) return false
    return true
  })
}

// ─── Component ────────────────────────────────────────────────

const SKELETON_COUNT = 12

interface ListingGridProps {
  data: PageResponse<ListingResponse> | undefined
  isLoading: boolean
  isFetching: boolean
  hasActiveFilters: boolean
  filters?: MockFilters
}

export function ListingGrid({
  data,
  isLoading,
  isFetching,
  hasActiveFilters,
  filters,
}: ListingGridProps) {
  // Full skeleton on first load
  if (isLoading) {
    return (
      <Grid>
        <SkeletonCards />
      </Grid>
    )
  }

  // Backend offline (no data) → filter mocks client-side
  if (!data || data.empty) {
    const filtered = filters ? filterMocks(filters) : MOCK_LISTINGS

    if (filtered.length === 0) {
      return (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4 shadow-sm">
              <PackageSearch size={28} className="text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1.5">
              Nenhum anúncio encontrado
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Tente ajustar ou remover os filtros para ver mais resultados
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{' '}
            {filtered.length === 1
              ? 'anúncio encontrado'
              : 'anúncios encontrados'}
          </p>
        </div>
        <Grid>
          {filtered.map((listing, idx) => (
            <div
              key={listing.id}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </Grid>
      </div>
    )
  }

  // Real API data
  return (
    <div className="flex flex-col gap-4">
      {/* Result count + fetch indicator */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {data.totalElements.toLocaleString('pt-BR')}
          </span>{' '}
          {data.totalElements === 1
            ? 'anúncio encontrado'
            : 'anúncios encontrados'}
        </p>
        {isFetching && !isLoading && (
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Atualizando…
          </div>
        )}
      </div>

      {/* Grid */}
      <Grid>
        {data.content.map((listing, idx) => (
          <div
            key={listing.id}
            className="animate-fade-in"
            style={{ animationDelay: `${Math.min(idx * 40, 300)}ms` }}
          >
            <ListingCard listing={listing} />
          </div>
        ))}
      </Grid>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {children}
    </div>
  )
}

function SkeletonCards() {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: This is a static list of skeletons, not dynamic data
        <ListingCardSkeleton key={i} />
      ))}
    </>
  )
}
