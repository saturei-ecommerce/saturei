import { type NextRequest, NextResponse } from 'next/server'
import { getUrl } from '@/utils/get-url'

const publicRoutes = ['/', '/login', '/register', '/listing']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL(getUrl('/'), request.url))
  }

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL(getUrl('/login'), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
