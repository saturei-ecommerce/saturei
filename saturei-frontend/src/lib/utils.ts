import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { env } from '@/env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves a listing image URL.
 * The backend stores relative paths like /uploads/listings/...
 * Next.js <Image> needs absolute URLs for external images.
 * Uses env.NEXT_PUBLIC_API_BASE_URL (same source as api-client) to avoid
 * the static inlining issue with process.env in client bundles.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
  return `${base}${path}`
}
