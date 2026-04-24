import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves a listing image URL.
 * The backend stores relative paths like /uploads/listings/...
 * Next.js <Image> needs absolute URLs for external images.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
  return `${base}${path}`
}
