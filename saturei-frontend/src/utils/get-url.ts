import { env } from '@/env'

export function getUrl(path?: string) {
  const baseUrl = env.NEXT_PUBLIC_WEB_BASE_URL || ''
  const normalizedPath = path && !path.startsWith('/') ? `/${path}` : path || ''
  return `${baseUrl}${normalizedPath}`
}
