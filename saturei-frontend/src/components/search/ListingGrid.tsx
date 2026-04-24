'use client'

import { AlertCircle, PackageSearch } from 'lucide-react'
import type { ListingResponse, PageResponse } from '@/http/search/search-listings'
import { ListingCard, ListingCardSkeleton } from './ListingCard'

// ─── Component ────────────────────────────────────────────────

const SKELETON_COUNT = 12

interface ListingGridProps {
  data: PageResponse<ListingResponse> | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  hasActiveFilters: boolean
}

export function ListingGrid({
  data,
  isLoading,
  isFetching,
  isError,
  hasActiveFilters,
}: ListingGridProps) {
  // Full skeleton on first load
  if (isLoading) {
    return (
      <Grid>
        <SkeletonCards />
      </Grid>
    )
  }

  // API error
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4 shadow-sm">
          <AlertCircle size={28} className="text-destructive" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1.5">
          Erro ao carregar anúncios
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          Não foi possível conectar ao servidor. Tente novamente em alguns instantes.
        </p>
      </div>
    )
  }

  // Empty results
  if (!data || data.empty) {
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
            {hasActiveFilters
              ? 'Tente ajustar ou remover os filtros para ver mais resultados'
              : 'Ainda não há anúncios cadastrados.'}
          </p>
        </div>
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
