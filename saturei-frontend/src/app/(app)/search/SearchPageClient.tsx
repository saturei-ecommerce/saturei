'use client'

import { Search } from 'lucide-react'
import { Suspense } from 'react'
import { FilterPanel } from '@/components/search/FilterPanel'
import { ListingGrid } from '@/components/search/ListingGrid'
import { Pagination } from '@/components/search/Pagination'
import { SearchBar } from '@/components/search/SearchBar'
import { useListingSearch } from '@/hooks/useListingSearch'

// ─── SearchPageClient needs Suspense boundary because of useSearchParams ──

export function SearchPageClientWrapper() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageClient />
    </Suspense>
  )
}

function SearchPageClient() {
  const {
    filters,
    hasActiveFilters,
    setKeyword,
    setCategory,
    setLocation,
    setMinPrice,
    setMaxPrice,
    setPage,
    clearFilters,
    listings,
    isLoading,
    isFetching,
    isError,
    categories,
    locations,
  } = useListingSearch()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── Header / Hero ─────────────────────────────── */}
      <header className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-accent text-primary-foreground">
        {/* Decorative orbs */}
        <div
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #fb8917 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Encontre o que você procura
          </h1>
          <p className="text-primary-foreground/70 text-base mb-8">
            Explore milhares de anúncios de todos os tipos!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar
              value={filters.keyword ?? ''}
              onChange={setKeyword}
              placeholder="Buscar por produto, categoria…"
            />
          </div>

          {/* Mobile filter trigger — appears below search bar on small screens */}
          <div className="flex items-center gap-3 mt-4 lg:hidden">
            <FilterPanel
              category={filters.category}
              location={filters.location}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              categories={categories}
              locations={locations}
              onCategoryChange={setCategory}
              onLocationChange={setLocation}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
            {hasActiveFilters && (
              // biome-ignore lint/a11y/useButtonType: This is a button semantically, but we intentionally don't want to use a <button> element here because of styling constraints
              <button
                onClick={clearFilters}
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Wave divider */}
        {/** biome-ignore lint/a11y/noSvgWithoutTitle: This is a button semantically, but we intentionally don't want to use a <button> element here because of styling constraints */}
        <svg
          className="relative block w-full"
          viewBox="0 0 1440 32"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: 32, marginBottom: -1 }}
        >
          <path
            d="M0,16 C360,32 1080,0 1440,16 L1440,32 L0,32 Z"
            fill="var(--card)"
          />
        </svg>
      </header>

      {/* ── Main Content ──────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterPanel
              category={filters.category}
              location={filters.location}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              categories={categories}
              locations={locations}
              onCategoryChange={setCategory}
              onLocationChange={setLocation}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {/* Active filter chips */}
            {hasActiveFilters && (
              <ActiveFilterChips
                filters={filters}
                onRemoveKeyword={() => setKeyword('')}
                onRemoveCategory={() => setCategory('')}
                onRemoveLocation={() => setLocation('')}
                onRemoveMinPrice={() => setMinPrice(undefined)}
                onRemoveMaxPrice={() => setMaxPrice(undefined)}
              />
            )}

            {/* Grid */}
            <ListingGrid
              data={listings}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Pagination */}
            {listings && !listings.empty && (
              <Pagination
                currentPage={listings.number}
                totalPages={listings.totalPages}
                totalElements={listings.totalElements}
                pageSize={listings.size}
                onPageChange={(page) => {
                  setPage(page)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-primary" />
            <span className="font-semibold text-primary">Saturei</span>
            <span>— Marketplace</span>
          </div>
          <span>
            © {new Date().getFullYear()} Saturei. Todos os direitos reservados.
          </span>
        </div>
      </footer>
    </div>
  )
}

// ─── Active filter chips ──────────────────────────────────────

interface ActiveChipsProps {
  filters: ReturnType<typeof useListingSearch>['filters']
  onRemoveKeyword: () => void
  onRemoveCategory: () => void
  onRemoveLocation: () => void
  onRemoveMinPrice: () => void
  onRemoveMaxPrice: () => void
}

function ActiveFilterChips({
  filters,
  onRemoveKeyword,
  onRemoveCategory,
  onRemoveLocation,
  onRemoveMinPrice,
  onRemoveMaxPrice,
}: ActiveChipsProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(n)

  const chips: { label: string; onRemove: () => void }[] = []
  if (filters.keyword)
    chips.push({ label: `"${filters.keyword}"`, onRemove: onRemoveKeyword })
  if (filters.category)
    chips.push({ label: filters.category, onRemove: onRemoveCategory })
  if (filters.location)
    chips.push({ label: filters.location, onRemove: onRemoveLocation })
  if (filters.minPrice != null)
    chips.push({
      label: `Mín: ${fmt(filters.minPrice)}`,
      onRemove: onRemoveMinPrice,
    })
  if (filters.maxPrice != null)
    chips.push({
      label: `Máx: ${fmt(filters.maxPrice)}`,
      onRemove: onRemoveMaxPrice,
    })

  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      {chips.map((c) => (
        // biome-ignore lint/a11y/useButtonType: This is a button semantically, but we intentionally don't want to use a <button> element here because of styling constraints
        <button
          key={c.label}
          onClick={c.onRemove}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
            bg-secondary text-foreground border border-secondary
            hover:bg-primary hover:text-primary-foreground hover:border-primary
            transition-all duration-150
          "
        >
          {c.label}
          <span className="text-current opacity-60 text-base leading-none mt-px">
            ×
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── Loading skeleton for suspense fallback ───────────────────

function SearchPageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-64 skeleton" />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 h-125 skeleton rounded-2xl" />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: This is a static list of skeletons, not dynamic data
              <div key={i} className="h-72 skeleton rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
