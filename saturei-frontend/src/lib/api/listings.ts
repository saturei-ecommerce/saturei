import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// ─── Types ────────────────────────────────────────────────────

export type ConservationState = 'NEW' | 'USED'
export type ListingStatus = 'ACTIVE' | 'PAUSED' | 'SOLD'

export interface ListingResponse {
  id: string
  sellerId: string
  sellerName: string
  sellerRating?: number
  title: string
  description: string | null
  price: number
  conservationState: ConservationState
  status: ListingStatus
  imageUrls: string[]
  category: string | null
  location: string | null
  createdAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number // current page index (0-based)
  first: boolean
  last: boolean
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

// ─── API Functions ────────────────────────────────────────────

/**
 * Search active listings with optional filters and pagination.
 */
export async function searchListings(
  params: SearchParams,
): Promise<PageResponse<ListingResponse>> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  )
  const { data } = await api.get<PageResponse<ListingResponse>>('/listings', {
    params: cleaned,
  })
  return data
}

/**
 * Fetch distinct categories of active listings (for filter dropdown).
 */
export async function fetchCategories(): Promise<string[]> {
  const { data } = await api.get<string[]>('/listings/categories')
  return data
}

/**
 * Fetch distinct locations of active listings (for filter dropdown).
 */
export async function fetchLocations(): Promise<string[]> {
  const { data } = await api.get<string[]>('/listings/locations')
  return data
}

/**
 * Fetch a single listing by ID.
 */
export async function fetchListingById(id: string): Promise<ListingResponse> {
  const { data } = await api.get<ListingResponse>(`/listings/${id}`)
  return data
}
