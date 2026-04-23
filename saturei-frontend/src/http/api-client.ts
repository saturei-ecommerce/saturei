import { getCookie } from 'cookies-next'
import type { CookiesFn } from 'cookies-next/server'
import ky from 'ky'
import { env } from '@/env'

export const api = ky.create({
  baseUrl: env.API_BASE_URL,
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        let cookieStore: CookiesFn | undefined

        if (typeof window === 'undefined') {
          const { cookies: serverCookie } = await import('next/headers')

          cookieStore = serverCookie
        }

        const token = await getCookie('token', { cookies: cookieStore })

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
