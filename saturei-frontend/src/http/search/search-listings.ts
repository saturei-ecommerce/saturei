import { api } from '../api-client'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ListingResponse {
  id: string
  sellerId: string
  sellerName: string
  sellerRating?: number
  title: string
  description: string
  price: number
  conservationState: 'NEW' | 'USED'
  status: 'ACTIVE' | 'PAUSED' | 'SOLD'
  imageUrls: string[]
  category: string
  location: string
  createdAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  empty: boolean
}

export interface SearchParams {
  keyword?: string
  category?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
  sort?: string
}

// ─── Requests ───────────────────────────────────────────────────────────────

export async function searchListings(
  params: SearchParams,
): Promise<PageResponse<ListingResponse>> {
  const searchParams = new URLSearchParams()
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.category) searchParams.set('category', params.category)
  if (params.location) searchParams.set('location', params.location)
  if (params.minPrice != null)
    searchParams.set('minPrice', String(params.minPrice))
  if (params.maxPrice != null)
    searchParams.set('maxPrice', String(params.maxPrice))
  if (params.page != null) searchParams.set('page', String(params.page))
  if (params.size != null) searchParams.set('size', String(params.size))
  if (params.sort) searchParams.set('sort', params.sort)

  return api
    .get('listings', { searchParams })
    .json<PageResponse<ListingResponse>>()
}

export async function fetchListingById(id: string): Promise<ListingResponse> {
  return api.get(`listings/${id}`).json<ListingResponse>()
}

export async function fetchCategories(): Promise<string[]> {
  return api.get('listings/categories').json<string[]>()
}

export async function fetchLocations(): Promise<string[]> {
  return api.get('listings/locations').json<string[]>()
}
